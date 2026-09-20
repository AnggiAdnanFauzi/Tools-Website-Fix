import { FinancialInputs, CalculationResult, HistoryEntry } from '../types';

const API_BASE_URL = 'https://api-financialhealth.kembangin.online/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  goal?: string | null;
  annual_target?: number | null;
  monthly_target?: number | null;
  password?: string;
}

export const getToken = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fhd_api_token') || '';
  }
  return '';
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fhd_api_token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fhd_api_token');
  }
};

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const apiRegister = async (name: string, email: string, password: string, phone?: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
    }
    return data;
  } catch (error) {
    console.warn('API Register offline or failed, fallback to local storage:', error);
    return null;
  }
};

export const apiLogin = async (email: string, password: string) => {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.warn('API Login network failed, fallback to local storage:', error);
    return null; // True network failure, safe to fallback
  }

  try {
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
    }
    return data;
  } catch (error) {
    console.warn('API Login returned non-JSON error (e.g. 500, 419):', error);
    // Server is online but returned an error page. Do NOT fallback to local storage.
    return { success: false, message: 'Server error. Login failed.' };
  }
};

export const apiLogout = async () => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getHeaders(true),
    });
  } catch (err) {
    // Ignore offline error
  } finally {
    removeToken();
  }
};

export const apiGetUserProfile = async () => {
  try {
    const res = await fetch(API_BASE_URL + '/user', {
      method: 'GET',
      headers: getHeaders(true),
    });
    const json = await res.json();
    return json.success && json.user ? json.user : null;
  } catch (error) {
    console.warn('API Get User Profile failed:', error);
    return null;
  }
};

export const apiUpdateProfile = async (profileData: Partial<AuthUser>) => {
  try {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(profileData),
    });
    return await res.json();
  } catch (error) {
    console.warn('API Update Profile offline or failed:', error);
    return null;
  }
};

export const apiSaveDiagnostic = async (result: CalculationResult, inputs: FinancialInputs, email?: string) => {
  try {
    const userEmail = email || (typeof window !== 'undefined' ? localStorage.getItem('fhd_current_user_email') || '' : '');
    if (userEmail === 'demo@gmail.com') return null; // Demo accounts run fully local to avoid cross-user data leaking
    const res = await fetch(`${API_BASE_URL}/diagnostics`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        total_score: result.totalScore,
        grade: result.grade,
        net_cashflow: result.metrics.netCashflow,
        runway_months: result.metrics.runwayMonths,
        inputs: inputs,
        sub_scores: result.subScores,
        action_plan: result.actionPlan,
        email: userEmail,
      }),
    });
    return await res.json();
  } catch (error) {
    console.warn('API Save Diagnostic offline or failed:', error);
    return null;
  }
};

export const apiGetLatestUserDiagnostic = async (email?: string) => {
  try {
    const userEmail = email || (typeof window !== 'undefined' ? localStorage.getItem('fhd_current_user_email') || '' : '');
    if (userEmail === 'demo@gmail.com') return null; // Demo account runs locally
    const url = userEmail ? `${API_BASE_URL}/diagnostics?email=${encodeURIComponent(userEmail)}` : `${API_BASE_URL}/diagnostics`;
    const res = await fetch(url, {
      headers: getHeaders(true),
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      const latest = json.data[0];
      return {
        id: latest.id,
        inputs: latest.inputs,
        totalScore: Number(latest.total_score),
        grade: latest.grade,
        netCashflow: Number(latest.net_cashflow),
        runwayMonths: Number(latest.runway_months),
        subScores: latest.sub_scores,
        actionPlan: latest.action_plan,
        createdAt: latest.created_at,
      };
    }
    return null;
  } catch (error) {
    console.warn('API Get Latest Diagnostic failed:', error);
    return null;
  }
};

export const apiGetHistories = async (email?: string): Promise<HistoryEntry[] | null> => {
  try {
    const userEmail = email || (typeof window !== 'undefined' ? localStorage.getItem('fhd_current_user_email') || '' : '');
    if (userEmail === 'demo@gmail.com') return null; // Demo account runs locally
    const url = userEmail ? `${API_BASE_URL}/diagnostics?email=${encodeURIComponent(userEmail)}` : `${API_BASE_URL}/diagnostics`;
    const res = await fetch(url, {
      headers: getHeaders(true),
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        timestamp: item.created_at || new Date().toISOString(),
        totalScore: Number(item.total_score),
        netCashflow: Number(item.net_cashflow),
        runwayMonths: Number(item.runway_months),
      }));
    }
    return null;
  } catch (error) {
    console.warn('API Get Histories offline, fallback to local:', error);
    return null;
  }
};

export const apiClearHistories = async (email?: string) => {
  try {
    const userEmail = email || (typeof window !== 'undefined' ? localStorage.getItem('fhd_current_user_email') || '' : '');
    if (userEmail === 'demo@gmail.com') return; // Demo account runs locally
    const url = userEmail ? `${API_BASE_URL}/diagnostics/clear?email=${encodeURIComponent(userEmail)}` : `${API_BASE_URL}/diagnostics/clear`;
    await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
  } catch (error) {
    console.warn('API Clear Histories offline:', error);
  }
};

export const apiUploadAvatar = async (file: File, email?: string): Promise<string | null> => {
  try {
    const userEmail = email || (typeof window !== 'undefined' ? localStorage.getItem('fhd_current_user_email') || '' : '');
    const formData = new FormData();
    formData.append('image', file);
    if (userEmail) {
      formData.append('email', userEmail);
    }

    const token = getToken();
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/upload-avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.success && data.url) {
      return data.url;
    }
    return null;
  } catch (error) {
    console.warn('Cloudinary upload via API failed, fallback to local:', error);
    return null;
  }
};

export const apiGetAdminStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getHeaders(true),
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.warn('Failed to fetch admin stats:', error);
    return null;
  }
};

export const apiGetAdminUsers = async (search = '', role = '') => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
      headers: getHeaders(true),
    });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.warn('Failed to fetch admin users:', error);
    return [];
  }
};

export const apiUpdateUserRole = async (userId: number, role: 'user' | 'admin') => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ role }),
    });
    return await res.json();
  } catch (error) {
    console.warn('Failed to update user role:', error);
    return null;
  }
};

export const apiDeleteUser = async (userId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return await res.json();
  } catch (error) {
    console.warn('Failed to delete user:', error);
    return null;
  }
};

export const apiCreateAdminUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'user' | 'admin';
  annual_target?: number;
}) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (error) {
    console.warn('Failed to create admin user:', error);
    return null;
  }
};

export const apiUpdateAdminUser = async (userId: number, userData: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: 'user' | 'admin';
  annual_target?: number;
}) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (error) {
    console.warn('Failed to update admin user:', error);
    return null;
  }
};

export const apiBulkDeleteUsers = async (userIds: number[]) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/bulk-delete`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ ids: userIds }),
    });
    return await res.json();
  } catch (error) {
    console.warn('Failed to bulk delete users:', error);
    return null;
  }
};

export const apiBulkUpdateUserRoles = async (userIds: number[], role: 'user' | 'admin') => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/bulk-role`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ ids: userIds, role }),
    });
    return await res.json();
  } catch (error) {
    console.warn('Failed to bulk update roles:', error);
    return null;
  }
};

export const apiGetAdminDiagnostics = async (grade = '', search = '') => {
  try {
    const params = new URLSearchParams();
    if (grade) params.append('grade', grade);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE_URL}/admin/diagnostics?${params.toString()}`, {
      headers: getHeaders(true),
    });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.warn('Failed to fetch admin diagnostics:', error);
    return [];
  }
};

export const apiDeleteDiagnostic = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/diagnostics/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return await res.json();
  } catch (error) {
    console.warn('Failed to delete diagnostic:', error);
    return null;
  }
};





