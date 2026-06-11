import { authService } from "./authService";

export interface CreatePoll {
  id?: string;
  question?: string;
  options?: string[];
  createdBy?: string | null;
  expiresAt?: Date;
}

const getAuthHeaders = () => {
  const token = authService.getToken();
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const pollService = {
  getActPolls: async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/polls/active`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load tasks");
    }

    return response.json();
  },
  getRecPolls: async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/polls/recent`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load tasks");
    }

    return response.json();
  },
  createPoll: async (pollData: CreatePoll) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/polls/create`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(pollData),
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create poll!");
    }

    return response.json();
  },
  updatePoll: async (pollID: string, option: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/polls/update`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ pollID, option }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update poll!");
    }

    return response.json();
  },
  removePoll: async (pollID: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/polls/remove/${pollID}`,
      {
        method: "DELETE",
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete the poll!");
    }

    return response.json();
  },
  getAllMyPolls: async (authID: string | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/polls/my-polls/${authID}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load polls");
    }

    return response.json();
  },
};
