package com.wattvision.backend.service;

import com.wattvision.backend.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MlInferenceClient {

    private static final Logger log = LoggerFactory.getLogger(MlInferenceClient.class);

    private final RestClient restClient;
    private final String apiKey;

    public MlInferenceClient(
            @Value("${app.ml.url:http://localhost:8000}") String mlUrl,
            @Value("${app.ml.api-key:}") String apiKey,
            @Value("${app.ml.connect-timeout-ms:3000}") int connectTimeout,
            @Value("${app.ml.read-timeout-ms:10000}") int readTimeout) {
        
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofMillis(connectTimeout));
        requestFactory.setReadTimeout(Duration.ofMillis(readTimeout));

        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.restClient = RestClient.builder()
                .baseUrl(mlUrl)
                .requestFactory(requestFactory)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public Optional<MlPredictResponse> predict(List<MlReadingDto> readings) {
        if (readings == null || readings.isEmpty()) {
            return Optional.empty();
        }
        try {
            MlPredictRequest request = new MlPredictRequest(readings);
            var reqSpec = restClient.post()
                    .uri("/predict")
                    .body(request);
            if (!apiKey.isEmpty()) {
                reqSpec.header("X-API-Key", apiKey);
            }
            MlPredictResponse response = reqSpec.retrieve().body(MlPredictResponse.class);
            return Optional.ofNullable(response);
        } catch (Exception ex) {
            log.warn("ML service inference request failed: {}. Falling back to graceful degradation.", ex.getMessage());
            return Optional.empty();
        }
    }

    public Optional<Map<String, Object>> getModelInfo() {
        try {
            var reqSpec = restClient.get().uri("/model/info");
            if (!apiKey.isEmpty()) {
                reqSpec.header("X-API-Key", apiKey);
            }
            Map<String, Object> info = reqSpec.retrieve().body(new ParameterizedTypeReference<>() {});
            return Optional.ofNullable(info);
        } catch (Exception ex) {
            log.warn("ML service info request failed: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    public Optional<MlTrainResponse> trainModel(MlTrainRequest trainRequest) {
        try {
            var reqSpec = restClient.post()
                    .uri("/train")
                    .body(trainRequest != null ? trainRequest : new MlTrainRequest(40, 45, 0.03, 200, 42));
            if (!apiKey.isEmpty()) {
                reqSpec.header("X-API-Key", apiKey);
            }
            MlTrainResponse response = reqSpec.retrieve().body(MlTrainResponse.class);
            return Optional.ofNullable(response);
        } catch (Exception ex) {
            log.warn("ML service training trigger failed: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    public boolean isHealthy() {
        try {
            Map<String, Object> health = restClient.get()
                    .uri("/health")
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
            return health != null && "UP".equalsIgnoreCase(String.valueOf(health.get("status")));
        } catch (Exception ex) {
            return false;
        }
    }
}
