export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const result = await response.json();
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      if (result.username) {
        localStorage.setItem("authUsername", result.username);
        // localStorage.setItem("authEmail", result.email);
        localStorage.setItem("authID", result.authID);
      }
    }
    return result;
  },
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    const result = await response.json();
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      if (result.username) {
        localStorage.setItem("authUsername", result.username);
        // localStorage.setItem("authEmail", result.email);
        localStorage.setItem("authID", result.authID);
      }
    }
    return result;
  },
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authID");
  },
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },
  getUserID: (): string | null => {
    return localStorage.getItem("authID");
  },
  getUsername: (): string | null => {
    return localStorage.getItem("authUsername");
  },
};
