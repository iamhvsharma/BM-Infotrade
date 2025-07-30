// API Configuration for Backend Integration

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("authToken");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // Forms
  async getForms() {
    return this.request("/forms");
  }

  async getForm(formId: string) {
    return this.request(`/forms/${formId}`);
  }

  async createForm(formData: any) {
    return this.request("/forms", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  }

  async updateForm(formId: string, formData: any) {
    return this.request(`/forms/${formId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(formId: string) {
    return this.request(`/forms/${formId}`, {
      method: "DELETE",
    });
  }

  // Form Responses
  async getFormResponses(formId: string) {
    return this.request(`/forms/${formId}/responses`);
  }

  async submitFormResponse(formId: string, responseData: any) {
    return this.request(`/forms/${formId}/responses`, {
      method: "POST",
      body: JSON.stringify(responseData),
    });
  }

  // User Profile
  async getUserProfile() {
    return this.request("/auth/profile");
  }

  async updateUserProfile(profileData: any) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Helper functions for common operations
export const api = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    apiClient.login(credentials),

  signup: (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => apiClient.signup(userData),

  logout: () => apiClient.logout(),

  // Forms
  getForms: () => apiClient.getForms(),
  getForm: (formId: string) => apiClient.getForm(formId),
  createForm: (formData: any) => apiClient.createForm(formData),
  updateForm: (formId: string, formData: any) =>
    apiClient.updateForm(formId, formData),
  deleteForm: (formId: string) => apiClient.deleteForm(formId),

  // Responses
  getFormResponses: (formId: string) => apiClient.getFormResponses(formId),
  submitFormResponse: (formId: string, responseData: any) =>
    apiClient.submitFormResponse(formId, responseData),

  // User
  getUserProfile: () => apiClient.getUserProfile(),
  updateUserProfile: (profileData: any) =>
    apiClient.updateUserProfile(profileData),
};

// Hook for API calls with loading states
export const useApi = () => {
  const callApi = async <T>(
    apiCall: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const response = await apiCall();

      if (response.success && response.data) {
        onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.error || "An error occurred";
        onError?.(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Network error";
      onError?.(errorMessage);
      throw error;
    }
  };

  return { callApi };
};

export default api;
