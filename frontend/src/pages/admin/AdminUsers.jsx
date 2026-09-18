import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Trash2,
  Eye,
  Shield,
  UserCheck
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { formatKWh } from '../../utils/formatters';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // suspend, activate, delete
  const [loading, setLoading] = useState(true);

  const { toastSuccess, toastWarning } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const triggerAction = (user, actionType) => {
    setSelectedUser(user);
    setPendingAction(actionType);
    setConfirmModalOpen(true);
  };

  const handleExecuteAction = async () => {
    if (!selectedUser || !pendingAction) return;

    if (pendingAction === 'suspend') {
      await adminService.updateUserStatus(selectedUser.id, 'Suspended');
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'Suspended' } : u));
      toastWarning(`User ${selectedUser.name} suspended.`);
    } else if (pendingAction === 'activate') {
      await adminService.updateUserStatus(selectedUser.id, 'Active');
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'Active' } : u));
      toastSuccess(`User ${selectedUser.name} activated.`);
    } else if (pendingAction === 'delete') {
      await adminService.deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toastSuccess(`User record deleted.`);
    }

    setConfirmModalOpen(false);
  };

  const columns = [
    {
      header: "User",
      key: "name",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <span className="font-bold text-white block">{row.name}</span>
            <span className="text-[10px] text-slate-400">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "User ID",
      key: "id",
      render: (val) => <span className="font-mono text-slate-400 text-[11px]">{val}</span>
    },
    {
      header: "Registered",
      key: "accountCreated",
      sortable: true,
      render: (val) => <span className="text-slate-400">{val}</span>
    },
    {
      header: "Consumption",
      key: "totalConsumptionAnalyzed",
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-400">{formatKWh(val)}</span>
    },
    {
      header: "Anomalies",
      key: "wastageEventsCount",
      sortable: true,
      render: (val) => <span className="text-rose-400 font-bold">{val} events</span>
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          val === 'Active'
            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            : 'bg-rose-950 text-rose-300 border border-rose-800'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "Actions",
      key: "id",
      align: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === 'Active' ? (
            <button
              onClick={() => triggerAction(row, 'suspend')}
              className="p-1 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800"
              title="Suspend User"
            >
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => triggerAction(row, 'activate')}
              className="p-1 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
              title="Activate User"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => triggerAction(row, 'delete')}
            className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        category="USER MANAGEMENT & GOVERNANCE"
        title="Registered Users"
        subtitle="Supervise active subscriber accounts, monitor individual consumption histories, and manage access statuses."
      />

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchKey="name"
        searchPlaceholder="Search by user name or email..."
      />

      {/* Confirmation Modal */}
      {selectedUser && (
        <Modal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title={`Confirm Action: ${pendingAction?.toUpperCase()}`}
          subtitle={`Target User: ${selectedUser.name} (${selectedUser.email})`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Are you sure you want to <strong>{pendingAction}</strong> account <strong>{selectedUser.name}</strong>? This action will update their authentication authorization in the Spring Security context.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={pendingAction === 'delete' || pendingAction === 'suspend' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleExecuteAction}
              >
                Confirm {pendingAction}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsers;
