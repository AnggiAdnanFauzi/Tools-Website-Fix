import { User, Job, Candidate, Application, Requisition, Project, Interview, Task, Stage, NewJobData, NewCandidateData, NewRequisitionData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('ts_token');
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: options?.signal || controller.signal,
      headers: {
        ...getHeaders(),
        ...(options?.headers || {})
      }
    });

    if (!res.ok) {
      console.warn(`API request to ${endpoint} returned ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.data ?? data;
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.warn(`API fetch error on ${endpoint}:`, err);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// 1. Auth API
export async function apiLogin(email: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('ts_token', data.token);
    }
    if (data.user) {
      if (data.user.avatar_url && !data.user.avatarUrl) {
        data.user.avatarUrl = data.user.avatar_url;
      }
    }
    return data;
  } catch (err) {
    return { success: false, message: 'Network error connecting to backend' };
  }
}

export async function apiRegister(name: string, email: string, password: string, phone?: string, companyName?: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, company_name: companyName })
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('ts_token', data.token);
    }
    return data;
  } catch (err) {
    return { success: false, message: 'Network error connecting to backend' };
  }
}

// 2. Jobs API (supports multi-tenant scoping)
export async function apiGetCurrentUser(): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await safeFetch<any>('/user');
    const u = res?.user ?? res;
    if (u && u.id) {
      if (u.avatar_url && !u.avatarUrl) {
        u.avatarUrl = u.avatar_url;
      }
      return { success: true, user: u };
    }
    return { success: false, message: 'Failed to fetch user' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to fetch user' };
  }
}

export async function apiGetJobs(companyId?: string): Promise<Job[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/jobs${query}`);
  if (!data) return null;
  return data.map(j => ({
    ...j,
    projectId: j.project_id || j.projectId,
    project_id: j.project_id || j.projectId,
    companyId: j.company_id || j.companyId,
    company_id: j.company_id || j.companyId,
    totalApplicants: j.total_applicants ?? j.totalApplicants ?? 0,
    salaryMin: j.salary_min ?? j.salaryMin,
    salaryMax: j.salary_max ?? j.salaryMax,
    daysOpen: j.days_open ?? j.daysOpen ?? 0,
    employmentType: j.employment_type || j.employmentType,
    jobDescription: j.job_description || j.jobDescription,
    interviewQuestions: j.interview_questions || j.interviewQuestions
  }));
}

export async function apiGetJob(id: string): Promise<Job | null> {
  return safeFetch<Job>(`/jobs/${id}`);
}

export async function apiCreateJob(jobData: NewJobData, projectId: string, requisitionId?: string): Promise<Job | null> {
  const res = await safeFetch<any>('/jobs', {
    method: 'POST',
    body: JSON.stringify({ 
      ...jobData, 
      project_id: projectId, 
      requisition_id: requisitionId,
      company_id: (jobData as any).companyId || (jobData as any).company_id
    })
  });
  if (!res) return null;
  return {
    ...res,
    projectId: res.project_id || res.projectId,
    project_id: res.project_id || res.projectId,
    companyId: res.company_id || res.companyId,
    company_id: res.company_id || res.companyId,
    totalApplicants: res.total_applicants ?? res.totalApplicants ?? 0,
    salaryMin: res.salary_min ?? res.salaryMin,
    salaryMax: res.salary_max ?? res.salaryMax,
    daysOpen: res.days_open ?? res.daysOpen ?? 0,
    employmentType: res.employment_type || res.employmentType,
    jobDescription: res.job_description || res.jobDescription,
    interviewQuestions: res.interview_questions || res.interviewQuestions
  };
}

export async function apiUpdateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  return safeFetch<Job>(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// 3. Candidates API
export async function apiGetCandidates(companyId?: string): Promise<Candidate[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/candidates${query}`);
  if (!data) return null;
  return data.map(c => ({
    ...c,
    avatarUrl: c.avatar_url || c.avatarUrl,
    experienceYears: c.experience_years ?? c.experienceYears,
    expectedSalary: c.expected_salary ?? c.expectedSalary,
    portfolioUrl: c.portfolio_url || c.portfolioUrl,
    cvUrl: c.cv_url || c.cvUrl,
    dateOfBirth: c.date_of_birth || c.dateOfBirth,
    linkedinUrl: c.linkedin_url || c.linkedinUrl
  }));
}

export async function apiCreateCandidate(candidateData: NewCandidateData): Promise<Candidate | null> {
  const res = await safeFetch<any>('/candidates', {
    method: 'POST',
    body: JSON.stringify({
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone,
      experience_years: candidateData.experienceYears,
      expected_salary: candidateData.expectedSalary,
      portfolio_url: candidateData.portfolioUrl,
      cv_url: candidateData.cvUrl,
      address: candidateData.address,
      date_of_birth: candidateData.dateOfBirth,
      major: candidateData.major,
      skills: candidateData.skills,
      hobbies: candidateData.hobbies,
      aspirations: candidateData.aspirations,
      strengths: candidateData.strengths,
      weaknesses: candidateData.weaknesses,
      linkedin_url: candidateData.linkedinUrl
    })
  });
  if (!res) return null;
  return {
    ...res,
    avatarUrl: res.avatar_url || res.avatarUrl,
    experienceYears: res.experience_years ?? res.experienceYears,
    expectedSalary: res.expected_salary ?? res.expectedSalary,
    portfolioUrl: res.portfolio_url || res.portfolioUrl,
    cvUrl: res.cv_url || res.cvUrl,
    dateOfBirth: res.date_of_birth || res.dateOfBirth,
    linkedinUrl: res.linkedin_url || res.linkedinUrl
  };
}

// 4. Applications API (supports multi-tenant scoping)
export async function apiGetApplications(companyId?: string): Promise<Application[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/applications${query}`);
  if (!data) return null;
  return data.map(a => ({
    ...a,
    candidateId: a.candidate_id || a.candidateId,
    candidate_id: a.candidate_id || a.candidateId,
    jobId: a.job_id || a.jobId,
    job_id: a.job_id || a.jobId,
    companyId: a.company_id || a.companyId,
    company_id: a.company_id || a.companyId,
    appliedDate: a.applied_date || a.appliedDate,
    stageId: a.stage_id || a.stageId,
    stage_id: a.stage_id || a.stageId,
    totalScore: a.total_score ?? a.totalScore,
    knockedOut: a.knocked_out ?? a.knockedOut,
    interviews: (a.interviews || []).map((i: any) => ({
      ...i,
      applicationId: i.application_id || i.applicationId,
      application_id: i.application_id || i.applicationId,
      dateTime: i.date_time || i.dateTime,
      locationOrLink: i.location_or_link || i.locationOrLink,
      interviewers: typeof i.interviewers === 'string' ? JSON.parse(i.interviewers) : (i.interviewers || []),
      scorecard: typeof i.scorecard === 'string' ? JSON.parse(i.scorecard) : i.scorecard
    }))
  }));
}

export async function apiSubmitApplication(jobId: string, candidateData: NewCandidateData, source: string = 'Career Site'): Promise<Application | null> {
  const res = await safeFetch<any>('/applications', {
    method: 'POST',
    body: JSON.stringify({
      job_id: jobId,
      source,
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone,
      experience_years: candidateData.experienceYears,
      expected_salary: candidateData.expectedSalary,
      portfolio_url: candidateData.portfolioUrl,
      cv_url: candidateData.cvUrl,
      address: candidateData.address,
      date_of_birth: candidateData.dateOfBirth,
      major: candidateData.major,
      skills: candidateData.skills,
      hobbies: candidateData.hobbies,
      aspirations: candidateData.aspirations,
      strengths: candidateData.strengths,
      weaknesses: candidateData.weaknesses,
      linkedin_url: candidateData.linkedinUrl
    })
  });
  if (!res) return null;
  return {
    ...res,
    candidateId: res.candidate_id || res.candidateId,
    candidate_id: res.candidate_id || res.candidateId,
    jobId: res.job_id || res.jobId,
    job_id: res.job_id || res.jobId,
    companyId: res.company_id || res.companyId,
    company_id: res.company_id || res.companyId,
    appliedDate: res.applied_date || res.appliedDate,
    stageId: res.stage_id || res.stageId,
    stage_id: res.stage_id || res.stageId,
    totalScore: res.total_score ?? res.totalScore,
    knockedOut: res.knocked_out ?? res.knockedOut
  };
}

export async function apiUpdateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
  return safeFetch<Application>(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function apiDeleteApplication(id: string): Promise<boolean> {
  const res = await safeFetch<{ success: boolean; message?: string }>(`/applications/${id}`, {
    method: 'DELETE'
  });
  return !!res?.success;
}

// 5. Requisitions API
export async function apiGetRequisitions(companyId?: string): Promise<Requisition[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/requisitions${query}`);
  if (!data) return null;
  return data.map(r => ({
    ...r,
    employmentType: r.employment_type || r.employmentType,
    experienceLevel: r.experience_level || r.experienceLevel,
    salaryMin: r.salary_min ?? r.salaryMin,
    salaryMax: r.salary_max ?? r.salaryMax,
    jobId: r.job_id || r.jobId,
    job_id: r.job_id || r.jobId,
    companyId: r.company_id || r.companyId,
    company_id: r.company_id || r.companyId
  }));
}

export async function apiCreateRequisition(data: NewRequisitionData & { company_id?: string; companyId?: string }): Promise<Requisition | null> {
  const res = await safeFetch<any>('/requisitions', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      department: data.department,
      location: data.location,
      employment_type: data.employmentType,
      headcount: data.headcount,
      experience_level: data.experienceLevel,
      salary_min: data.salaryMin,
      salary_max: data.salaryMax,
      deadline: data.deadline,
      company_id: data.companyId || data.company_id
    })
  });
  if (!res) return null;
  return {
    ...res,
    employmentType: res.employment_type || res.employmentType,
    experienceLevel: res.experience_level || res.experienceLevel,
    salaryMin: res.salary_min ?? res.salaryMin,
    salaryMax: res.salary_max ?? res.salaryMax,
    jobId: res.job_id || res.jobId,
    job_id: res.job_id || res.jobId,
    companyId: res.company_id || res.companyId,
    company_id: res.company_id || res.companyId
  };
}

export async function apiUpdateRequisition(id: string, updates: Partial<Requisition>): Promise<Requisition | null> {
  return safeFetch<Requisition>(`/requisitions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// 6. Projects API
export async function apiGetProjects(companyId?: string): Promise<Project[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/projects${query}`);
  if (!data) return null;
  return data.map(p => ({
    ...p,
    ownerId: p.owner_id || p.ownerId || 'int01',
    companyId: p.company_id || p.companyId,
    company_id: p.company_id || p.companyId,
    createdDate: p.created_date || p.createdDate || p.created_at || new Date().toISOString()
  }));
}

export async function apiCreateProject(data: { name: string; description?: string; owner_id?: string; company_id?: string }): Promise<Project | null> {
  const res = await safeFetch<any>('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res) return null;
  return {
    ...res,
    ownerId: res.owner_id || res.ownerId || 'int01',
    companyId: res.company_id || res.companyId,
    company_id: res.company_id || res.companyId,
    createdDate: res.created_date || res.createdDate || res.created_at || new Date().toISOString()
  };
}

// 7. Interviews API
export async function apiGetInterviews(companyId?: string): Promise<Interview[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/interviews${query}`);
  if (!data) return null;
  return data.map(i => ({
    ...i,
    applicationId: i.application_id || i.applicationId,
    application_id: i.application_id || i.applicationId,
    dateTime: i.date_time || i.dateTime,
    locationOrLink: i.location_or_link || i.locationOrLink,
    interviewers: typeof i.interviewers === 'string' ? JSON.parse(i.interviewers) : (i.interviewers || []),
    scorecard: typeof i.scorecard === 'string' ? JSON.parse(i.scorecard) : i.scorecard
  }));
}

export async function apiCreateInterview(data: Omit<Interview, 'id' | 'status'>): Promise<Interview | null> {
  const res = await safeFetch<any>('/interviews', {
    method: 'POST',
    body: JSON.stringify({
      application_id: data.applicationId,
      type: data.type,
      date_time: data.dateTime,
      location_or_link: data.locationOrLink,
      interviewers: data.interviewers,
      notes: data.notes
    })
  });
  if (!res) return null;
  return {
    ...res,
    applicationId: res.application_id || res.applicationId,
    application_id: res.application_id || res.applicationId,
    dateTime: res.date_time || res.dateTime,
    locationOrLink: res.location_or_link || res.locationOrLink,
    interviewers: typeof res.interviewers === 'string' ? JSON.parse(res.interviewers) : (res.interviewers || []),
    scorecard: typeof res.scorecard === 'string' ? JSON.parse(res.scorecard) : res.scorecard
  };
}

// 8. Tasks API
export async function apiGetTasks(companyId?: string): Promise<Task[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/tasks${query}`);
  if (!data) return null;
  return data.map(t => ({
    ...t,
    applicationId: t.application_id || t.applicationId,
    application_id: t.application_id || t.applicationId,
    dueDate: t.due_date || t.dueDate,
    assigneeId: t.assignee_id || t.assigneeId
  }));
}

// 8b. Stages API
export async function apiGetStages(): Promise<Stage[] | null> {
  return safeFetch<Stage[]>('/stages');
}

// 9. Cloudinary Upload API
export async function apiUploadFile(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('ts_token');
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Upload failed' };
  }
}

// 10. Profile Update API
export async function apiUpdateProfile(payload: {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  password?: string;
}): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data?.user) {
      if (data.user.avatar_url && !data.user.avatarUrl) {
        data.user.avatarUrl = data.user.avatar_url;
      }
    }
    return data;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to update profile' };
  }
}

// 11. Super Admin APIs
export async function apiGetAdminUsers(): Promise<User[] | null> {
  return safeFetch<User[]>('/admin/users');
}

export async function apiUpdateAdminUser(id: string, updates: Partial<User>): Promise<User | null> {
  return safeFetch<User>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// Soft Delete (Archive)
export async function apiDeleteAdminUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...getHeaders()
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Restore archived user
export async function apiRestoreAdminUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/restore`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...getHeaders()
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 12. Feedback API
export async function apiSubmitFeedback(payload: {
  tool_category: string;
  rating: number;
  feedback_type: string;
  message: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
}): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/feedbacks`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to submit feedback' };
  }
}

export async function apiGetFeedbacks(): Promise<any[] | null> {
  return safeFetch<any[]>('/feedbacks');
}

// 13. Midtrans Payment & Billing APIs
export async function apiCreateSnapToken(plan: 'pro' | 'enterprise', period: 'monthly' | 'yearly' = 'monthly'): Promise<{
  success: boolean;
  order_id: string;
  snap_token: string;
  redirect_url: string;
  amount: number;
  plan: string;
  client_key: string;
} | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/snap-token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify({ plan, period })
    });
    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.warn('Failed to create Snap token:', err);
    return null;
  }
}

export async function apiGetBillingTransactions(): Promise<any[] | null> {
  return safeFetch<any[]>('/payment/transactions');
}

export async function apiSimulatePaymentSuccess(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/simulate-success`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify({ order_id: orderId })
    });
    const data = await res.json();
    return data.success;
  } catch {
    return false;
  }
}

