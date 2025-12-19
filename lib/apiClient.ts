// Utility functions untuk CORS-safe API requests

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  details?: string;
  [key: string]: any;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = 'https://simjur-api.vercel.app/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async fetchWithTimeout(
    url: string, 
    options: RequestInit, 
    timeout: number = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 10000,
      retries = 2
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const fetchOptions: RequestInit = {
          method,
          headers: requestHeaders,
          mode: 'cors', // Explicitly set CORS mode
          credentials: 'omit', // Don't send credentials for cross-origin requests
        };

        if (body && method !== 'GET') {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await this.fetchWithTimeout(url, fetchOptions, timeout);

        // Handle CORS errors specifically
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
          
          throw new Error(`Request failed: ${errorMessage}`);
        }

        const data = await response.json();
        return data as ApiResponse<T>;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on CORS errors or 4xx errors
        if (
          lastError.message.includes('CORS') ||
          lastError.message.includes('Failed to fetch') ||
          (lastError.message.includes('HTTP 4'))
        ) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Return a structured error response
    if (lastError?.message.includes('CORS') || lastError?.message.includes('Failed to fetch')) {
      return {
        error: 'CORS Error',
        details: 'Unable to connect to server. Please check if the server is accessible and CORS is properly configured.',
      };
    }

    if (lastError?.message.includes('HTTP 401')) {
      return {
        error: 'Authentication Required',
        details: 'Please log in to access this resource.',
      };
    }

    if (lastError?.message.includes('HTTP 403')) {
      return {
        error: 'Access Denied',
        details: 'You do not have permission to access this resource.',
      };
    }

    if (lastError?.message.includes('HTTP 404')) {
      return {
        error: 'Not Found',
        details: 'The requested resource was not found.',
      };
    }

    return {
      error: 'Network Error',
      details: lastError?.message || 'Unknown error occurred',
    };
  }

  // Public API methods
  public async get<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body });
  }

  public async put<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public async delete<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Authenticated request helper
  public async withAuth<T = any>(
    requestFn: (client: ApiClient) => Promise<ApiResponse<T>>,
    token: string | null
  ): Promise<ApiResponse<T>> {
    if (!token) {
      return {
        error: 'Authentication Required',
        details: 'Please provide an authentication token.',
      };
    }

    // Create a new client instance with auth headers
    const authClient = new ApiClient(this.baseUrl);
    authClient.defaultHeaders['Authorization'] = `Bearer ${token}`;

    return requestFn(authClient);
  }

  // Test server connectivity
  public async testConnection(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/push`, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Server is accessible and CORS is working properly.',
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      
      return {
        error: 'Connection Test Failed',
        details: errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch')
          ? 'CORS Error: Unable to connect to server. Please check server configuration.'
          : `Network Error: ${errorMessage}`,
      };
    }
  }
}

// Create and export a default instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const { get, post, put, delete: del } = apiClient;

// Push notification specific helpers
export const pushApi = {
  // Test server connectivity
  testConnection: () => apiClient.testConnection(),

  // Send push notification (public endpoint)
  sendNotification: (subscription: any, title: string, message: string, options?: { url?: string; icon?: string }) =>
    apiClient.post('/push', {
      subscription,
      title,
      message,
      ...options,
    }),

  // Save subscription (authenticated)
  saveSubscription: (subscription: any, token: string) =>
    apiClient.withAuth(
      (client) => client.post('/auth/push/subscribe', { subscription }),
      token
    ),

  // Get subscriptions (authenticated)
  getSubscriptions: (token: string) =>
    apiClient.withAuth(
      (client) => client.get('/auth/push/subscribe'),
      token
    ),

  // Remove subscription (authenticated)
  removeSubscription: (endpoint: string, token: string) =>
    apiClient.withAuth(
      (client) => client.delete('/auth/push/subscribe', { body: { endpoint } }),
      token
    ),

  // Send push notification (authenticated)
  sendAuthenticatedNotification: (
    subscription: any, 
    title: string, 
    message: string, 
    token: string,
    options?: { url?: string; icon?: string }
  ) =>
    apiClient.withAuth(
      (client) => client.post('/auth/push', {
        subscription,
        title,
        message,
        ...options,
      }),
      token
    ),
};

export default apiClient;