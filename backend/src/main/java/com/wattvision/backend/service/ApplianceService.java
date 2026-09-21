package com.wattvision.backend.service;

import com.wattvision.backend.dto.ApplianceBreakdownResponse;
import com.wattvision.backend.dto.ApplianceRequest;
import com.wattvision.backend.dto.ApplianceResponse;
import com.wattvision.backend.entity.ApplianceProfile;
import com.wattvision.backend.entity.User;
import com.wattvision.backend.exception.ApiException;
import com.wattvision.backend.repository.ApplianceProfileRepository;
import com.wattvision.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplianceService {

    private final ApplianceProfileRepository applianceRepository;
    private final UserRepository userRepository;

    public ApplianceService(ApplianceProfileRepository applianceRepository, UserRepository userRepository) {
        this.applianceRepository = applianceRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ApplianceResponse> getAppliances(String email) {
        User user = getUser(email);
        return applianceRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(a -> ApplianceResponse.from(a, user.getElectricityTariff()))
                .toList();
    }

    @Transactional
    public ApplianceResponse createAppliance(String email, ApplianceRequest req) {
        User user = getUser(email);
        ApplianceProfile a = new ApplianceProfile();
        a.setUser(user);
        a.setName(req.name().trim());
        a.setCategory(req.category());
        a.setRatedPowerWatts(req.ratedPowerWatts());
        a.setDailyUsageHours(req.dailyUsageHours());
        a.setStandbyPowerWatts(req.standbyPowerWatts() != null ? req.standbyPowerWatts() : 0.0);
        a.setLocation(req.location());

        ApplianceProfile saved = applianceRepository.save(a);
        return ApplianceResponse.from(saved, user.getElectricityTariff());
    }

    @Transactional
    public ApplianceResponse updateAppliance(String email, Long id, ApplianceRequest req) {
        User user = getUser(email);
        ApplianceProfile a = applianceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Appliance profile not found"));

        a.setName(req.name().trim());
        a.setCategory(req.category());
        a.setRatedPowerWatts(req.ratedPowerWatts());
        a.setDailyUsageHours(req.dailyUsageHours());
        a.setStandbyPowerWatts(req.standbyPowerWatts() != null ? req.standbyPowerWatts() : 0.0);
        a.setLocation(req.location());

        ApplianceProfile saved = applianceRepository.save(a);
        return ApplianceResponse.from(saved, user.getElectricityTariff());
    }

    @Transactional
    public void deleteAppliance(String email, Long id) {
        User user = getUser(email);
        ApplianceProfile a = applianceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Appliance profile not found"));
        applianceRepository.delete(a);
    }

    @Transactional(readOnly = true)
    public List<ApplianceBreakdownResponse> getBreakdown(String email) {
        User user = getUser(email);
        List<ApplianceProfile> list = applianceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (list.isEmpty()) {
            return List.of();
        }

        double tariff = user.getElectricityTariff() != null ? user.getElectricityTariff() : 7.50;
        double totalMonthlyKWh = 0.0;
        List<Double> kwhs = new ArrayList<>();

        for (ApplianceProfile a : list) {
            double monthlyKWh = ((a.getRatedPowerWatts() * a.getDailyUsageHours()) + (a.getStandbyPowerWatts() != null ? a.getStandbyPowerWatts() * Math.max(0, 24 - a.getDailyUsageHours()) : 0.0)) * 30.0 / 1000.0;
            kwhs.add(monthlyKWh);
            totalMonthlyKWh += monthlyKWh;
        }

        List<ApplianceBreakdownResponse> out = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            ApplianceProfile a = list.get(i);
            double kwh = kwhs.get(i);
            double cost = kwh * tariff;
            double pct = totalMonthlyKWh > 0 ? (kwh / totalMonthlyKWh) * 100.0 : 0.0;
            out.add(new ApplianceBreakdownResponse(
                    a.getId(),
                    a.getName(),
                    a.getCategory(),
                    Math.round(kwh * 100.0) / 100.0,
                    Math.round(cost * 100.0) / 100.0,
                    Math.round(pct * 10.0) / 10.0
            ));
        }
        return out;
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
