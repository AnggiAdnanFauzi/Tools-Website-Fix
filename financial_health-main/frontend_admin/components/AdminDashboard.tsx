import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Activity, ShieldCheck, Search, Trash2, Download, Eye, RefreshCw, 
  ArrowLeft, CheckCircle, AlertTriangle, TrendingUp, Calendar, 
  ExternalLink, UserCheck, ShieldAlert, FileSpreadsheet, X, Sparkles,
  Plus, Edit3, Crown, UserPlus, CheckSquare, Square,
  Sun, Moon, Globe, LogOut
} from 'lucide-react';
import { 
  apiGetAdminStats, apiGetAdminUsers, apiUpdateUserRole, 
  apiDeleteUser, apiGetAdminDiagnostics, apiDeleteDiagnostic,
  apiCreateAdminUser, apiUpdateAdminUser, apiBulkDeleteUsers, apiBulkUpdateUserRoles
} from '../services/api';

interface AdminDashboardProps {
  isDark: boolean;
  lang: 'id' | 'en';
  onSwitchToUserView: () => void;
  onLogout: () => void;
  onToggleDark: () => void;
  onToggleLang: () => void;
  showToast: (message: string, type: 'success' | 'warning' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isDark,
  lang,
  onSwitchToUserView,
  onLogout,
  onToggleDark,
  onToggleLang,
  showToast,
}) => {
  const t = lang === 'id' ? {
    switchToUser: 'Beralih ke Tampilan User',
    logout: 'Keluar',
    tabOverview: 'Ringkasan Eksekutif',
    tabUsers: 'Manajemen Pengguna',
    tabDiagnostics: 'Audit Riwayat Diagnosa',
    totalUsers: 'Total Pengguna',
    registeredAccounts: 'Akun Terdaftar',
    includingSuperAdmin: 'Termasuk Super Admin & Member Demo',
    totalDiagnostics: 'Total Diagnosa',
    financialCases: 'Kasus Finansial',
    storedInCloud: 'Tersimpan di Cloud Database Aiven',
    avgSystemScore: 'Rata-Rata Skor Sistem',
    points: '/ 100 Poin',
    avgHealthDesc: 'Kesehatan finansial rata-rata entitas',
    crisisZone: 'Zona Krisis (Skor < 60)',
    needsRestructuring: 'Butuh Restrukturisasi',
    highDsr: 'DSR tinggi atau nafas kas tipis',
    gradeDistribution: 'Distribusi Peringkat Kesehatan (Grade Distribution)',
    gradeDistDesc: 'Persentase diagnosa berdasarkan klasifikasi skor algoritma GAAP',
    gradePrima: 'Prima (Skor 85-100)',
    gradeStrong: 'Kuat (Skor 70-84)',
    gradeAlert: 'Waspada (Skor 55-69)',
    gradeVulnerable: 'Rentan (Skor 40-54)',
    gradeCritical: 'Kritis (Skor < 40)',
    cases: 'kasus',
    systemInfra: 'Infrastruktur Sistem',
    searchUser: 'Cari nama, email, telepon...',
    allRoles: 'Semua Peran',
    admin: 'Admin',
    user: 'User',
    addUser: '+ Tambah Pengguna',
    name: 'Nama',
    email: 'Email',
    phone: 'Telepon',
    role: 'Peran',
    target: 'Target',
    joined: 'Bergabung',
    actions: 'Aksi',
    superAdmin: 'ADMIN UTAMA',
    pinnedRoot: 'PINNED ROOT',
    noUsersFound: 'Tidak ada pengguna ditemukan.',
    loading: 'Memuat data...',
    deleteConfirm: 'Hapus pengguna ini?',
    deleteSuccess: 'Pengguna berhasil dihapus',
    deleteFail: 'Gagal menghapus pengguna',
    roleUpdated: 'Peran berhasil diubah',
    roleUpdateFail: 'Gagal mengubah peran',
    searchDiag: 'Cari nama atau email...',
    allGrades: 'Semua Grade',
    exportCsv: 'Export Seluruh Data ke CSV (Excel)',
    no: 'No.',
    score: 'Skor',
    grade: 'Grade',
    runway: 'Runway',
    date: 'Tanggal',
    inspect: 'Inspeksi',
    noDiagFound: 'Tidak ada data diagnosa ditemukan.',
    close: 'Tutup',
    selectedUsers: 'Pengguna Dipilih',
    makeAdmin: 'Jadikan Admin',
    makeUser: 'Jadikan User',
    deleteSelected: 'Hapus Terpilih',
    cancelSelect: 'Batal Pilih',
    createUserTitle: 'Tambah Pengguna Baru',
    createUserDesc: 'Daftarkan akun pengguna atau administrator baru langsung ke cloud',
    fullName: 'Nama Lengkap',
    emailAddress: 'Alamat Email',
    phoneNumber: 'Nomor Telepon',
    password: 'Kata Sandi (Password)',
    rolePicker: 'Peran (Role)',
    memberRole: 'Member Biasa (User)',
    adminRole: 'Administrator (Admin)',
    annualTarget: 'Target Finansial Tahunan (Rp)',
    cancel: 'Batal',
    saving: 'Menyimpan...',
    saveUser: 'Simpan Pengguna',
    editUserTitle: 'Edit Profil Pengguna',
    editUserDesc: 'Perbarui informasi profil pengguna ID',
    changePassword: 'Ganti Password (Opsional)',
    leaveBlank: 'Kosongkan jika tidak diubah',
    updating: 'Menyimpan...',
    updateUser: 'Perbarui Pengguna',
  } : {
    switchToUser: 'Switch to User View',
    logout: 'Logout',
    tabOverview: 'Executive Overview',
    tabUsers: 'User Management',
    tabDiagnostics: 'Diagnostic Audit History',
    totalUsers: 'Total Users',
    registeredAccounts: 'Registered Accounts',
    includingSuperAdmin: 'Including Super Admin & Demo Members',
    totalDiagnostics: 'Total Diagnostics',
    financialCases: 'Financial Cases',
    storedInCloud: 'Stored in Aiven Cloud Database',
    avgSystemScore: 'Average System Score',
    points: '/ 100 Points',
    avgHealthDesc: 'Average entity financial health',
    crisisZone: 'Crisis Zone (Score < 60)',
    needsRestructuring: 'Needs Restructuring',
    highDsr: 'High DSR or thin cash runway',
    gradeDistribution: 'Health Grade Distribution',
    gradeDistDesc: 'Diagnostic percentage by GAAP algorithm score classification',
    gradePrima: 'Excellent (Score 85-100)',
    gradeStrong: 'Strong (Score 70-84)',
    gradeAlert: 'Cautious (Score 55-69)',
    gradeVulnerable: 'Vulnerable (Score 40-54)',
    gradeCritical: 'Critical (Score < 40)',
    cases: 'cases',
    systemInfra: 'System Infrastructure',
    searchUser: 'Search name, email, phone...',
    allRoles: 'All Roles',
    admin: 'Admin',
    user: 'User',
    addUser: '+ Add User',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    target: 'Target',
    joined: 'Joined',
    actions: 'Actions',
    superAdmin: 'SUPER ADMIN',
    pinnedRoot: 'PINNED ROOT',
    noUsersFound: 'No users found.',
    loading: 'Loading data...',
    deleteConfirm: 'Delete this user?',
    deleteSuccess: 'User successfully deleted',
    deleteFail: 'Failed to delete user',
    roleUpdated: 'Role updated successfully',
    roleUpdateFail: 'Failed to update role',
    searchDiag: 'Search name or email...',
    allGrades: 'All Grades',
    exportCsv: 'Export All Data to CSV (Excel)',
    no: 'No.',
    score: 'Score',
    grade: 'Grade',
    runway: 'Runway',
    date: 'Date',
    inspect: 'Inspect',
    noDiagFound: 'No diagnostic data found.',
    close: 'Close',
    selectedUsers: 'Users Selected',
    makeAdmin: 'Make Admin',
    makeUser: 'Make User',
    deleteSelected: 'Delete Selected',
    cancelSelect: 'Cancel Selection',
    createUserTitle: 'Add New User',
    createUserDesc: 'Register a new user or administrator account directly to cloud',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    password: 'Password',
    rolePicker: 'Role',
    memberRole: 'Regular Member (User)',
    adminRole: 'Administrator (Admin)',
    annualTarget: 'Annual Financial Target (Rp)',
    cancel: 'Cancel',
    saving: 'Saving...',
    saveUser: 'Save User',
    editUserTitle: 'Edit User Profile',
    editUserDesc: 'Update user profile information ID',
    changePassword: 'Change Password (Optional)',
    leaveBlank: 'Leave blank if unchanged',
    updating: 'Saving...',
    updateUser: 'Update User',
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'diagnostics'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Multi-select & Bulk Actions state
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Full CRUD - Create User Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user' as 'user' | 'admin',
    annual_target: 120000000,
  });

  // Full CRUD - Edit User Modal state
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user' as 'user' | 'admin',
    annual_target: 120000000,
  });

  // Diagnostics state
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [diagGradeFilter, setDiagGradeFilter] = useState('');
  const [diagSearch, setDiagSearch] = useState('');
  const [inspectModalData, setInspectModalData] = useState<any>(null);

  // Pinned Admin sorting: Root admin and admins ALWAYS pinned on top row
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (a.email === 'admin@financialhealth.com') return -1;
      if (b.email === 'admin@financialhealth.com') return 1;
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (b.role === 'admin' && a.role !== 'admin') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [users]);

  // Load overview stats
  const fetchStats = async () => {
    setLoadingStats(true);
    const data = await apiGetAdminStats();
    if (data) setStats(data);
    setLoadingStats(false);
  };

  // Load users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    const data = await apiGetAdminUsers(userSearch, userRoleFilter);
    setUsers(data);
    setLoadingUsers(false);
  };

  // Load diagnostics
  const fetchDiagnostics = async () => {
    setLoadingDiagnostics(true);
    const data = await apiGetAdminDiagnostics(diagGradeFilter, diagSearch);
    setDiagnostics(data);
    setLoadingDiagnostics(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'diagnostics') fetchDiagnostics();
  }, [activeTab]);

  // Multi-select handlers
  const handleToggleSelectAll = () => {
    if (selectedUserIds.length === sortedUsers.length && sortedUsers.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(sortedUsers.map(u => u.id));
    }
  };

  const handleToggleSelectUser = (id: number) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    const confirmMsg = lang === 'id'
      ? `Apakah Anda yakin ingin MENGHAPUS ${selectedUserIds.length} pengguna terpilih secara massal? Seluruh riwayat diagnosa akun tersebut akan terhapus permanen.`
      : `Are you sure you want to delete ${selectedUserIds.length} selected users?`;

    if (window.confirm(confirmMsg)) {
      setBulkActionLoading(true);
      const res = await apiBulkDeleteUsers(selectedUserIds);
      if (res && res.success) {
        showToast(res.message || 'Pengguna terpilih berhasil dihapus', 'success');
        setSelectedUserIds([]);
        fetchUsers();
        fetchStats();
      } else {
        showToast('Gagal menghapus pengguna terpilih', 'warning');
      }
      setBulkActionLoading(false);
    }
  };

  const handleBulkRole = async (role: 'user' | 'admin') => {
    if (selectedUserIds.length === 0) return;
    setBulkActionLoading(true);
    const res = await apiBulkUpdateUserRoles(selectedUserIds, role);
    if (res && res.success) {
      showToast(res.message || `Peran pengguna berhasil diubah ke ${role}`, 'success');
      setSelectedUserIds([]);
      fetchUsers();
      fetchStats();
    } else {
      showToast('Gagal memperbarui peran pengguna terpilih', 'warning');
    }
    setBulkActionLoading(false);
  };

  // Full CRUD - Create User
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      showToast('Nama, email, dan kata sandi wajib diisi!', 'warning');
      return;
    }

    setCreateLoading(true);
    const res = await apiCreateAdminUser(createForm);
    if (res && res.success) {
      showToast(res.message || 'Pengguna baru berhasil ditambahkan!', 'success');
      setIsCreateModalOpen(false);
      setCreateForm({ name: '', email: '', password: '', phone: '', role: 'user', annual_target: 120000000 });
      fetchUsers();
      fetchStats();
    } else {
      showToast(res?.message || 'Gagal menambahkan pengguna baru', 'warning');
    }
    setCreateLoading(false);
  };

  // Full CRUD - Open Edit User Modal
  const handleOpenEditUser = (u: any) => {
    setEditingUser(u);
    setEditForm({
      name: u.name || '',
      email: u.email || '',
      password: '',
      phone: u.phone || '',
      role: u.role || 'user',
      annual_target: u.annual_target || 120000000,
    });
  };

  // Full CRUD - Submit Edit User
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditLoading(true);
    const payload: any = { ...editForm };
    if (!payload.password) delete payload.password;

    const res = await apiUpdateAdminUser(editingUser.id, payload);
    if (res && res.success) {
      showToast(res.message || 'Data pengguna berhasil diperbarui!', 'success');
      setEditingUser(null);
      fetchUsers();
    } else {
      showToast(res?.message || 'Gagal memperbarui data pengguna', 'warning');
    }
    setEditLoading(false);
  };

  // Handle user role toggle
  const handleToggleRole = async (userId: number, currentRole: string, userName: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const res = await apiUpdateUserRole(userId, newRole);
    if (res && res.success) {
      showToast(res.message || 'Peran berhasil diperbarui', 'success');
      fetchUsers();
      fetchStats();
    } else {
      showToast('Gagal mengubah peran pengguna', 'warning');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number, userName: string) => {
    const res = await apiDeleteUser(userId);
    if (res && res.success) {
      showToast(res.message || 'Pengguna berhasil dihapus', 'success');
      fetchUsers();
      fetchStats();
    } else {
      showToast(res?.message || 'Gagal menghapus pengguna', 'warning');
    }
  };

  // Handle delete diagnostic
  const handleDeleteDiagnostic = async (diagId: number) => {
    const res = await apiDeleteDiagnostic(diagId);
    if (res && res.success) {
      showToast('Riwayat berhasil dihapus', 'success');
      fetchDiagnostics();
      fetchStats();
      // If the deleted diagnostic is currently inspected, close modal
      if (inspectModalData?.id === diagId) setInspectModalData(null);
    } else {
      showToast('Gagal menghapus riwayat', 'warning');
    }
  };

  // Export diagnostics to CSV with native Blob and UTF-8 BOM
  const handleExportCSV = () => {
    if (!diagnostics || diagnostics.length === 0) {
      showToast('Tidak ada data diagnosa untuk diekspor', 'warning');
      return;
    }

    const headers = [
      'No',
      'ID_Kasus',
      'Nama_Pengguna',
      'Email_Pengguna',
      'Nomor_Telepon',
      'Waktu_Pengujian',
      'Skor_Akhir',
      'Peringkat',
      'Arus_Kas_Bersih_IDR',
      'Nafas_Bisnis_Bulan'
    ];

    const rows = diagnostics.map((d, index) => [
      index + 1,
      `"#${d.id}"`,
      `"${(d.user?.name || 'Anonymous User').replace(/"/g, '""')}"`,
      `"${(d.user?.email || '-').replace(/"/g, '""')}"`,
      `"${(d.user?.phone || '-').replace(/"/g, '""')}"`,
      `"${new Date(d.created_at).toLocaleString('id-ID')}"`,
      d.total_score,
      d.grade,
      d.net_cashflow,
      d.runway_months,
    ]);

    // Use \uFEFF for UTF-8 Byte Order Mark so Excel opens properly with correct columns & encoding
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Diagnosa_Finansial_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Data audit riwayat berhasil diunduh dalam format CSV (Excel)!', 'success');
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'} pb-24 transition-colors duration-300 font-sans`}>
      
      {/* Top Admin Navigation Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark ? 'bg-[#0b1120]/80 border-slate-800/80 shadow-2xl' : 'bg-white/85 border-slate-200/90 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          
          {/* Logo & Governance Badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <img
              src="/logo.png"
              alt="Financial Health logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-md shadow-blue-500/20 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent truncate">
                  Enterprise Health Admin Console
                </span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  Super Admin
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                Aiven MySQL Cloud &bull; Cloudinary CDN Connected
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={onSwitchToUserView}
              className={`flex items-center gap-2 px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-800/60 hover:bg-slate-750 border-slate-700 text-slate-200' 
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
              }`}
              title="Lihat Tampilan Pengguna"
            >
              <ArrowLeft size={15} />
              <span className="hidden lg:inline">{t.switchToUser}</span>
            </button>

            {/* Light/Dark mode switcher */}
            <button
              onClick={onToggleDark}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isDark 
                  ? 'border-slate-800 bg-slate-900/40 text-amber-400 hover:text-amber-300 hover:bg-slate-800' 
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Language selector */}
            <button 
              onClick={onToggleLang}
              className={`flex items-center gap-1.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark 
                  ? 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Globe size={13} />
              <span className="hidden sm:inline">{lang === 'en' ? 'EN' : 'ID'}</span>
            </button>

            <button
              onClick={onLogout}
              className="px-2 sm:px-3.5 py-2 sm:py-2.5 flex items-center gap-1.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer"
            >
              <LogOut size={13} className="sm:hidden" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto scrollbar-hide border-t border-slate-200/5 dark:border-slate-800/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity size={16} />
            <span>{t.tabOverview}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'users'
                ? 'border-purple-500 text-purple-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={16} />
            <span>{t.tabUsers}</span>
            {stats && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                {stats.total_users}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'border-purple-500 text-purple-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet size={16} />
            <span>{t.tabDiagnostics}</span>
            {stats && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                {stats.total_diagnostics}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Total Users */}
              <div className={`p-6 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalUsers}</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Users size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {loadingStats ? '...' : stats?.total_users ?? 0}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">{t.registeredAccounts}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{t.includingSuperAdmin}</p>
              </div>

              {/* Card 2: Total Diagnostics */}
              <div className={`p-6 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalDiagnostics}</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <Activity size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {loadingStats ? '...' : stats?.total_diagnostics ?? 0}
                  </span>
                  <span className="text-xs text-purple-400 font-bold">{t.financialCases}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{t.storedInCloud}</p>
              </div>

              {/* Card 3: Avg Score */}
              <div className={`p-6 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.avgSystemScore}</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {loadingStats ? '...' : stats?.avg_score ?? 0}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{t.points}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{t.avgHealthDesc}</p>
              </div>

              {/* Card 4: Critical Count */}
              <div className={`p-6 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.crisisZone}</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-rose-400">
                    {loadingStats ? '...' : stats?.critical_count ?? 0}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{t.needsRestructuring}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{t.highDsr}</p>
              </div>

            </div>

            {/* Distribution Charts & Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Grade Distribution Bar */}
              <div className={`lg:col-span-2 p-6 rounded-2xl border ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <Activity size={16} className="text-purple-400" />
                  {t.gradeDistribution}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.gradeDistDesc}
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    { grade: 'A', label: t.gradePrima, color: 'bg-emerald-500', count: stats?.grade_distribution?.A ?? 0 },
                    { grade: 'B', label: t.gradeStrong, color: 'bg-blue-500', count: stats?.grade_distribution?.B ?? 0 },
                    { grade: 'C', label: t.gradeAlert, color: 'bg-amber-500', count: stats?.grade_distribution?.C ?? 0 },
                    { grade: 'D', label: t.gradeVulnerable, color: 'bg-orange-500', count: stats?.grade_distribution?.D ?? 0 },
                    { grade: 'E', label: t.gradeCritical, color: 'bg-rose-500', count: stats?.grade_distribution?.E ?? 0 },
                  ].map(item => {
                    const total = stats?.total_diagnostics || 1;
                    const pct = Math.round((item.count / total) * 100);
                    return (
                      <div key={item.grade} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold bg-slate-800 text-slate-200">
                              {item.grade}
                            </span>
                            <span className="text-slate-300">{item.label}</span>
                          </span>
                          <span className="text-slate-400">{item.count} {t.cases} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Infrastructure Card */}
              <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400" />
                    Infrastruktur Cloud Aktif
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Status koneksi runtime backend dan integrasi pihak ketiga
                  </p>

                  <div className="mt-5 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <span className="font-bold flex items-center gap-2">
                        <CheckCircle size={15} /> Aiven MySQL Cloud
                      </span>
                      <span className="text-[10px] font-extrabold uppercase">Port 28049 (Live)</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <span className="font-bold flex items-center gap-2">
                        <CheckCircle size={15} /> Cloudinary CDN
                      </span>
                      <span className="text-[10px] font-extrabold uppercase">25 GB Quota</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <span className="font-bold flex items-center gap-2">
                        <CheckCircle size={15} /> Laravel 12 REST API
                      </span>
                      <span className="text-[10px] font-extrabold uppercase">Sanctum Auth</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-6 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Server Localhost: 8000</span>
                  <button onClick={fetchStats} className="text-purple-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <RefreshCw size={12} /> Segarkan
                  </button>
                </div>
              </div>

            </div>

            {/* Recent Diagnostic Submissions Preview */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">5 Riwayat Diagnosa Terbaru</h3>
                  <p className="text-xs text-slate-400">Pemeriksaan finansial terkini yang dijalankan pengguna</p>
                </div>
                <button 
                  onClick={() => setActiveTab('diagnostics')}
                  className="text-xs text-purple-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Lihat Semua Riwayat &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-semibold">Kasus ID</th>
                      <th className="pb-3 font-semibold">Pengguna</th>
                      <th className="pb-3 font-semibold">Waktu Diagnosa</th>
                      <th className="pb-3 font-semibold">Skor Akhir</th>
                      <th className="pb-3 font-semibold">Grade</th>
                      <th className="pb-3 font-semibold">Arus Kas</th>
                      <th className="pb-3 font-semibold">Nafas Bisnis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {stats?.recent_diagnostics?.map((diag: any) => (
                      <tr key={diag.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-mono text-purple-400 font-bold">#{diag.id}</td>
                        <td className="py-3 font-bold text-slate-200">
                          {diag.user?.name || 'Anonymous User'}
                          <span className="block text-[10px] text-slate-500 font-normal">{diag.user?.email || '-'}</span>
                        </td>
                        <td className="py-3 text-slate-400">{new Date(diag.created_at).toLocaleDateString()}</td>
                        <td className="py-3 font-extrabold text-slate-200">{diag.total_score}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            diag.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            diag.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            diag.grade === 'C' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            Grade {diag.grade}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300 font-mono">{formatIDR(diag.net_cashflow)}</td>
                        <td className="py-3 text-slate-400">{diag.runway_months} Bln</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter, Search & Create Bar */}
            <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row gap-3 items-center justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="relative w-full lg:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  placeholder={t.searchUser}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                <select
                  value={userRoleFilter}
                  onChange={(e) => { setUserRoleFilter(e.target.value); fetchUsers(); }}
                  className={`px-3 py-2 text-xs rounded-xl border outline-none font-bold cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="">{t.allRoles}</option>
                  <option value="user">{t.memberRole}</option>
                  <option value="admin">{t.adminRole}</option>
                </select>

                <button
                  onClick={fetchUsers}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <RefreshCw size={13} />
                  <span>Segarkan</span>
                </button>

                {/* Full CRUD - Create User Button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-500/25"
                >
                  <UserPlus size={14} />
                  <span>{t.addUser}</span>
                </button>
              </div>
            </div>

            {/* Users Data Table with Numbering, Checkbox, and Pinned Super Admin */}
            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'}`}>
                    <tr>
                      <th className="py-3.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={sortedUsers.length > 0 && selectedUserIds.length === sortedUsers.length}
                          onChange={handleToggleSelectAll}
                          className="rounded cursor-pointer accent-purple-600 w-3.5 h-3.5"
                          title="Pilih Semua / Batal Pilih"
                        />
                      </th>
                      <th className="py-3.5 px-3 font-bold w-12 text-center">{t.no}</th>
                      <th className="py-3.5 px-4 font-bold">{t.name}</th>
                      <th className="py-3.5 px-4 font-bold">{t.phone}</th>
                      <th className="py-3.5 px-4 font-bold">{t.role}</th>
                      <th className="py-3.5 px-4 font-bold">{lang === 'id' ? 'Jumlah Diagnosa' : 'Diagnostics'}</th>
                      <th className="py-3.5 px-4 font-bold">{lang === 'id' ? 'Target Finansial' : 'Financial Target'}</th>
                      <th className="py-3.5 px-4 font-bold">{t.joined}</th>
                      <th className="py-3.5 px-4 font-bold text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          {t.loading}
                        </td>
                      </tr>
                    ) : sortedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          {t.noUsersFound}
                        </td>
                      </tr>
                    ) : (
                      sortedUsers.map((u, index) => {
                        const isAdmin = u.role === 'admin';
                        const isRootAdmin = u.email === 'admin@financialhealth.com';
                        const isSelected = selectedUserIds.includes(u.id);

                        return (
                          <tr 
                            key={u.id} 
                            className={`transition-colors ${
                              isSelected
                                ? isDark ? 'bg-purple-950/30' : 'bg-purple-50'
                                : isAdmin 
                                  ? isDark ? 'bg-purple-950/15 hover:bg-purple-950/25 border-l-4 border-l-purple-500' : 'bg-purple-50/50 hover:bg-purple-50 border-l-4 border-l-purple-500'
                                  : isDark ? 'hover:bg-slate-800/25' : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* Row Checkbox */}
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectUser(u.id)}
                                className="rounded cursor-pointer accent-purple-600 w-3.5 h-3.5"
                              />
                            </td>

                            {/* Row Number (No.) */}
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                              {index + 1}
                            </td>
                            
                            {/* User Avatar + Name */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {u.avatar ? (
                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-purple-500/40" />
                                  ) : (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                      isAdmin ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-300'
                                    }`}>
                                      {u.name?.charAt(0) || 'U'}
                                    </div>
                                  )}
                                  {isAdmin && (
                                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-sm" title="Administrator">
                                      <Crown size={9} className="fill-slate-950" />
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold block ${isAdmin ? 'text-purple-300 font-extrabold' : 'text-slate-200'}`}>
                                      {u.name}
                                    </span>
                                    {isRootAdmin && (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                        {t.pinnedRoot}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{u.phone || '-'}</td>

                            {/* Role Badge */}
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                                isAdmin
                                  ? 'bg-gradient-to-r from-purple-600/25 to-indigo-600/25 text-purple-300 border border-purple-500/40 shadow-xs'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}>
                                {isAdmin ? <Crown size={11} className="text-amber-400 fill-amber-400" /> : <UserCheck size={11} />}
                                {isAdmin ? t.superAdmin : 'USER'}
                              </span>
                            </td>

                            {/* Diagnoses count */}
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-slate-200">
                                {u.diagnostic_histories_count ?? 0}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-1">{lang === 'id' ? 'kali' : 'times'}</span>
                            </td>

                            {/* Targets */}
                            <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                              {u.annual_target ? formatIDR(u.annual_target) : '-'}
                            </td>

                            <td className="py-3 px-4 text-slate-400 text-[11px]">
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>

                            {/* Actions: Edit, Toggle Role, Delete */}
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                              {/* Full CRUD - Edit Button */}
                              <button
                                onClick={() => handleOpenEditUser(u)}
                                className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer inline-flex items-center"
                                title="Edit Data Pengguna (Nama, Telepon, Target)"
                              >
                                <Edit3 size={13} />
                              </button>

                              {!isRootAdmin && (
                                <>
                                  <button
                                    onClick={() => handleToggleRole(u.id, u.role, u.name)}
                                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all cursor-pointer"
                                    title="Ubah Role (Admin / User)"
                                  >
                                    {isAdmin ? t.makeUser : t.makeAdmin}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer inline-flex items-center"
                                    title="Hapus Akun Pengguna"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Multi-Select Floating Bulk Action Bar */}
            {selectedUserIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom-5">
                <div className="flex items-center gap-2 font-bold text-white pr-2">
                  <CheckSquare size={16} className="text-purple-400" />
                  <span>{selectedUserIds.length} {t.selectedUsers}</span>
                </div>
                
                <div className="h-4 w-px bg-slate-700" />

                <button
                  onClick={() => handleBulkRole('admin')}
                  disabled={bulkActionLoading}
                  className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-200 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
                >
                  {t.makeAdmin}
                </button>

                <button
                  onClick={() => handleBulkRole('user')}
                  disabled={bulkActionLoading}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
                >
                  {t.makeUser}
                </button>

                <button
                  onClick={handleBulkDelete}
                  disabled={bulkActionLoading}
                  className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>{t.deleteSelected}</span>
                </button>

                <button
                  onClick={() => setSelectedUserIds([])}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer ml-1"
                  title={t.cancelSelect}
                >
                  <X size={14} />
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: DIAGNOSTIC AUDITS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter & Export Bar */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-3 items-center justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={diagSearch}
                    onChange={(e) => setDiagSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchDiagnostics()}
                    placeholder={t.searchDiag}
                    className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border outline-none font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <select
                  value={diagGradeFilter}
                  onChange={(e) => { setDiagGradeFilter(e.target.value); fetchDiagnostics(); }}
                  className={`px-3 py-2 text-xs rounded-xl border outline-none font-bold cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="">{t.allGrades}</option>
                  <option value="A">Grade A ({lang === 'id' ? 'Prima' : 'Excellent'})</option>
                  <option value="B">Grade B ({lang === 'id' ? 'Kuat' : 'Strong'})</option>
                  <option value="C">Grade C ({lang === 'id' ? 'Waspada' : 'Cautious'})</option>
                  <option value="D">Grade D ({lang === 'id' ? 'Rentan' : 'Vulnerable'})</option>
                  <option value="E">Grade E ({lang === 'id' ? 'Kritis' : 'Critical'})</option>
                </select>

                <button
                  onClick={fetchDiagnostics}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Segarkan
                </button>
              </div>

              {/* Fixed CSV Export Button with Blob & BOM */}
              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Download size={14} />
                <span>{t.exportCsv}</span>
              </button>
            </div>

            {/* Diagnostics Table with Numbering column */}
            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'}`}>
                    <tr>
                      <th className="py-3.5 px-3 font-bold w-12 text-center">{t.no}</th>
                      <th className="py-3.5 px-4 font-bold">{lang === 'id' ? 'ID Kasus' : 'Case ID'}</th>
                      <th className="py-3.5 px-4 font-bold">{t.name}</th>
                      <th className="py-3.5 px-4 font-bold">{lang === 'id' ? 'Waktu Pengujian' : 'Test Date'}</th>
                      <th className="py-3.5 px-4 font-bold">{t.score}</th>
                      <th className="py-3.5 px-4 font-bold">{t.grade}</th>
                      <th className="py-3.5 px-4 font-bold">{lang === 'id' ? 'Arus Kas Bersih' : 'Net Cashflow'}</th>
                      <th className="py-3.5 px-4 font-bold">{lang === 'id' ? 'Nafas Bisnis' : 'Runway'}</th>
                      <th className="py-3.5 px-4 font-bold text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loadingDiagnostics ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          {t.loading}
                        </td>
                      </tr>
                    ) : diagnostics.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          {t.noDiagFound}
                        </td>
                      </tr>
                    ) : (
                      diagnostics.map((diag, index) => (
                        <tr key={diag.id} className="hover:bg-slate-800/25 transition-colors">
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-purple-400">#{diag.id}</td>
                          
                          <td className="py-3 px-4 font-bold text-slate-200">
                            {diag.user?.name || 'Anonymous User'}
                            <span className="block text-[10px] text-slate-500 font-mono font-normal">
                              {diag.user?.email || '-'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {new Date(diag.created_at).toLocaleString()}
                          </td>

                          <td className="py-3 px-4 font-extrabold text-slate-200 text-sm">
                            {diag.total_score}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              diag.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              diag.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              diag.grade === 'C' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              diag.grade === 'D' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              Grade {diag.grade}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-300">
                            {formatIDR(diag.net_cashflow)}
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-300">
                            {diag.runway_months} Bulan
                          </td>

                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => setInspectModalData(diag)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye size={12} />
                              <span>Inspeksi</span>
                            </button>

                            <button
                              onClick={() => handleDeleteDiagnostic(diag.id)}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                              title="Hapus Kasus"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* INSPECTION DETAIL MODAL */}
      {inspectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Audit Kasus #{inspectModalData.id}</span>
                <h3 className="text-base font-extrabold text-slate-100">
                  {inspectModalData.user?.name || 'Anonymous User'} ({inspectModalData.user?.email || '-'})
                </h3>
              </div>
              <button
                onClick={() => setInspectModalData(null)}
                className="p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Score Summary Box */}
            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Skor</span>
                <span className="text-2xl font-black text-slate-100">{inspectModalData.total_score}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Peringkat</span>
                <span className="text-2xl font-black text-purple-400">Grade {inspectModalData.grade}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Runway</span>
                <span className="text-2xl font-black text-emerald-400">{inspectModalData.runway_months} Bln</span>
              </div>
            </div>

            {/* Raw Financial Inputs Inspect */}
            {inspectModalData.inputs && (
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Input Parameter Finansial Kasus</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                  {Object.entries(inspectModalData.inputs).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
                      <span className="text-slate-500 block truncate font-medium">{key}</span>
                      <span className="font-bold text-slate-200 font-mono">
                        {typeof val === 'number' && val > 1000 ? formatIDR(val) : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan Inspect */}
            {inspectModalData.action_plan && Array.isArray(inspectModalData.action_plan) && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rencana Aksi yang Digenerate</h4>
                <div className="space-y-2.5">
                  {inspectModalData.action_plan.map((act: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs">
                      <div className="flex items-center justify-between font-bold text-purple-300 mb-1">
                        <span>{act.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                          {act.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectModalData(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL CRUD - MODAL CREATE USER */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">{t.createUserTitle}</h3>
                  <p className="text-[11px] text-slate-400">{t.createUserDesc}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.emailAddress} *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="nama@email.com"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.phoneNumber}</label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+62 8..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.password} *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Min. 6 karakter"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.rolePicker}</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'user' | 'admin' })}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-bold cursor-pointer ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="user">{t.memberRole}</option>
                    <option value="admin">{t.adminRole}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t.annualTarget}</label>
                <input
                  type="number"
                  value={createForm.annual_target}
                  onChange={(e) => setCreateForm({ ...createForm, annual_target: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                >
                  {createLoading ? t.saving : t.saveUser}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL CRUD - MODAL EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">{t.editUserTitle}</h3>
                  <p className="text-[11px] text-slate-400">{t.editUserDesc} #{editingUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.emailAddress} *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.phoneNumber}</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+62 8..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.changePassword}</label>
                  <input
                    type="password"
                    minLength={6}
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder={t.leaveBlank}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t.rolePicker}</label>
                  <select
                    disabled={editingUser.email === 'admin@financialhealth.com'}
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'user' | 'admin' })}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-bold cursor-pointer ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="user">{t.memberRole}</option>
                    <option value="admin">{t.adminRole}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t.annualTarget}</label>
                <input
                  type="number"
                  value={editForm.annual_target}
                  onChange={(e) => setEditForm({ ...editForm, annual_target: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {editLoading ? t.updating : t.updateUser}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
