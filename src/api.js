// ============================================================
// HireMinds API Service
// Base: http://recruitermentsystem.runasp.net
// ============================================================

const BASE_URL = "http://recruitermentsystem.runasp.net";

// ─── Token helpers ────────────────────────────────────────────
const getToken = () => localStorage.getItem("accessToken");

const authHeaders = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

async function request(method, path, body = null, isFormData = false) {
  const headers = isFormData
    ? { ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) }
    : authHeaders();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }

  const text = await res.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ================================================================
// AUTH  →  /api/Auth
// ================================================================
export const authAPI = {
  /** Register a new candidate */
  candidateRegister: (data) =>
    request("POST", "/api/Auth/candidate-register", data),

  /** Register a new recruiter/HR */
  recruiterRegister: async (payload) => {
    const response = await fetch(`${BASE_URL}/api/Auth/recruiter-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Recruiter registration failed");
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
  /** Login → returns { accessToken, refreshToken, role, userId } */
  login: ({ email, password }) => {
    return request(
      "POST",
      `/api/Auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    );
  },
  /** Logout current session */
  logout: async () => {
    try {
      await fetch(`${BASE_URL}/api/Auth/logout`, {
        method: "POST",
        headers: authHeaders(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      clearSession();
    }
  },

  /** Refresh access token */
  refreshToken: (data) => request("POST", "/api/Auth/Refresh-token", data),

  /** Revoke a specific refresh token */
  revokeToken: (data) => request("POST", "/api/Auth/Revoke-token", data),

  /** Verify email via token in query string (?token=...) */
  verifyEmail: (token) =>
    request("GET", `/api/Auth/verify-email?token=${token}`),

  /** Resend verification email */
  /** Resend verification email */
  resendVerification: (email) =>
    request(
      "POST",
      `/api/Auth/resend-verification?email=${encodeURIComponent(email)}`,
    ),
  /** Send forget-password email */
  forgetPassword: (email) =>
    request(
      "POST",
      `/api/Auth/forget-password?email=${encodeURIComponent(email)}`,
    ),
  /** Reset password with token */
  resetPassword: ({ userId, token, newPassword }) =>
    request(
      "POST",
      `/api/Auth/reset-password?userId=${encodeURIComponent(
        userId,
      )}&resetToken=${encodeURIComponent(
        token,
      )}&newPassword=${encodeURIComponent(newPassword)}`,
    ),
  /** Revoke all tokens for the current user */
  revokeAll: () => request("POST", "/api/Auth/revoke-all"),

  /** Change password (authenticated) */
  changePassword: (data) => request("POST", "/api/Auth/change-password", data),

  /** Google OAuth login */
  googleLogin: (data) => request("POST", "/api/Auth/google-login", data),
};

// ================================================================
// CANDIDATE  →  /api/Candidate
// ================================================================
// Candidate APIs
export const candidateAPI = {
  getProfile: (userId) => request("GET", `/api/Candidate/${userId}`),

  updateProfile: (data) => request("PUT", "/api/Candidate", data),

  updateSkills: (skills) =>
    request("PUT", "/api/Candidate/update-skills", skills),

  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append("Cv", file);

    const response = await fetch(`${BASE_URL}/api/Candidate/upload-cv`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    return response.json();
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/api/Candidate/upload-photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    return response.json();
  },
};
// ================================================================
// APPLICATIONS  →  /api/Applications
// ================================================================
export const applicationsAPI = {
  /** Apply to a job (jobId as query param) */
  apply: (jobId) => request("POST", `/api/Applications?jobId=${jobId}`),

  /** Get all applications for a candidate */
  getByCandidate: (candidateId) =>
    request("GET", `/api/Applications/candidate/${candidateId}`),

  /** Get all applications for a job */
  getByJob: (jobId) => request("GET", `/api/Applications/job/${jobId}`),
};

// ================================================================
// JOBS  →  /api/jobs
// ================================================================
export const jobsAPI = {
  /**
   * Create a new job post
   * @param {CreateJobDto} data
   */
  create: (data) => request("POST", "/api/jobs", data),

  /**
   * Get all jobs (with optional filters)
   * @param {JobQueryParametersDto} params - { title, location, status, page, pageSize }
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request("GET", `/api/jobs${query ? `?${query}` : ""}`);
  },

  /** Get single job by id */
  getById: (id) => request("GET", `/api/jobs/${id}`),

  /** Update a job */
  update: (id, data) => request("PUT", `/api/jobs/${id}`, data),

  /** Delete a job */
  delete: (id) => request("DELETE", `/api/jobs/${id}`),
};

// ================================================================
// RECRUITERS  →  /api/recruiters
// ================================================================
export const recruitersAPI = {
  /** Get recruiter profile by userId */
  getProfile: (userId) => request("GET", `/api/recruiters/${userId}`),

  /** Update recruiter profile */
  updateProfile: (data) => request("PUT", "/api/recruiters", data),

  /** Upload recruiter photo */
  uploadPhoto: (formData) =>
    request("POST", "/api/recruiters/upload-photo", formData, true),
};

// ================================================================
// COMPANY  →  /Api/Comapny  (note: API typo "Comapny")
// ================================================================
export const companyAPI = {
  /** Get all companies */
  getAll: () => request("GET", "/Api/Comapny"),

  /** Get company by id */
  getById: (id) => request("GET", `/Api/Comapny/${id}`),

  /** Create company */
  create: (data) => request("POST", "/Api/Comapny", data),

  /** Update company */
  update: (data) => request("PUT", "/Api/Comapny", data),

  /** Delete company */
  delete: (id) => request("DELETE", `/Api/Comapny/${id}`),
};

// ================================================================
// CATEGORY  →  /api/Category
// ================================================================
export const categoryAPI = {
  getAll: () => request("GET", "/api/Category"),
  getById: (id) => request("GET", `/api/Category/GetCategory/${id}`),
  create: (data) => request("POST", "/api/Category", data),
  update: (data) => request("PUT", "/api/Category", data),
  delete: (id) => request("DELETE", `/api/Category?id=${id}`),
};

// ================================================================
// SKILL  →  /controller/Skill
// ================================================================
export const skillAPI = {
  getAll: () => request("GET", "/controller/Skill"),
  getById: (id) => request("GET", `/controller/Skill/GetSkill/${id}`),
  create: (data) => request("POST", "/controller/Skill", data),
  update: (data) => request("PUT", "/controller/Skill", data),
  delete: (id) => request("DELETE", `/controller/Skill?id=${id}`),
};

// ================================================================
// USERS  →  /api/users
// ================================================================
export const usersAPI = {
  getById: (id) => request("GET", `/api/users/${id}`),
  update: (data) => request("PUT", "/api/users", data),
};

// ================================================================
// Auth Context helpers
// ================================================================
export const saveSession = ({ accessToken, refreshToken, role, userId }) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);
};

export const clearSession = () => {
  ["accessToken", "refreshToken", "role", "userId"].forEach((k) =>
    localStorage.removeItem(k),
  );
};

export const getSession = () => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  role: localStorage.getItem("role"),
  userId: localStorage.getItem("userId"),
});

export const getRoleFromToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  } catch {
    return null;
  }
};
