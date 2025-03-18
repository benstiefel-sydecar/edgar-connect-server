
import { AuthTokens, ApiResponse, DraftSubmission, Filing, Filer, FormTypeVersion, UploadResult, ValidationResult, EdgarCredentials } from "@/types/edgar-api";

const API_BASE_URL = "https://api-bravo.edgarfiling.sec.gov/";

class EdgarApiService {
  private filerApiToken: string | null = null;
  private userApiToken: string | null = null;

  /**
   * Set the API tokens manually
   */
  setTokens(tokens: AuthTokens) {
    this.filerApiToken = tokens.filerApiToken;
    this.userApiToken = tokens.userApiToken;
    localStorage.setItem('edgar_tokens', JSON.stringify(tokens));
  }

  /**
   * Get the stored tokens
   */
  getStoredTokens(): AuthTokens | null {
    const tokens = localStorage.getItem('edgar_tokens');
    return tokens ? JSON.parse(tokens) : null;
  }

  /**
   * Load tokens from localStorage if available
   */
  loadStoredTokens(): boolean {
    const tokens = this.getStoredTokens();
    if (tokens) {
      this.filerApiToken = tokens.filerApiToken;
      this.userApiToken = tokens.userApiToken;
      return true;
    }
    return false;
  }

  /**
   * Clear stored tokens
   */
  clearTokens() {
    this.filerApiToken = null;
    this.userApiToken = null;
    localStorage.removeItem('edgar_tokens');
  }

  /**
   * Check if the service has tokens set
   */
  hasTokens(): boolean {
    return !!(this.filerApiToken && this.userApiToken);
  }

  /**
   * Get the required headers for API calls
   */
  private getHeaders(useFilerToken: boolean = false) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (useFilerToken && this.filerApiToken) {
      headers['Authorization'] = `Bearer ${this.filerApiToken}`;
    } else if (this.userApiToken) {
      headers['Authorization'] = `Bearer ${this.userApiToken}`;
    }

    return headers;
  }

  /**
   * Make API request with proper error handling
   */
  private async apiRequest<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    useFilerToken: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: this.getHeaders(useFilerToken),
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Error ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data as T
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate API tokens through the SEC's token generation process
   * This is a theoretical implementation - actual implementation will depend on SEC's requirements
   */
  async generateTokens(credentials: EdgarCredentials): Promise<ApiResponse<AuthTokens>> {
    try {
      // NOTE: This is a theoretical implementation
      // The actual implementation would depend on the SEC's token generation process
      // which is not fully documented in the provided API reference
      
      // Step 1: Authenticate with username/password to get authorization code
      const authResponse = await fetch(`${API_BASE_URL}auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password,
          client_id: credentials.clientID,
          client_secret: credentials.clientSecret
        })
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        return {
          success: false,
          error: errorData.message || `Authentication failed: ${authResponse.statusText}`
        };
      }

      const tokenData = await authResponse.json();
      
      // Save the tokens
      this.setTokens({
        userApiToken: tokenData.user_token,
        filerApiToken: tokenData.filer_token
      });

      return {
        success: true,
        data: {
          userApiToken: tokenData.user_token,
          filerApiToken: tokenData.filer_token
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during token generation'
      };
    }
  }

  // Submission-related API calls
  
  /**
   * Get all draft submissions
   */
  async getDraftSubmissions(): Promise<ApiResponse<DraftSubmission[]>> {
    return this.apiRequest<DraftSubmission[]>('submissions/draft');
  }

  /**
   * Get a specific draft submission
   */
  async getDraftSubmission(submissionId: string): Promise<ApiResponse<DraftSubmission>> {
    return this.apiRequest<DraftSubmission>(`submissions/draft/${submissionId}`);
  }

  /**
   * Create a new draft submission
   */
  async createDraftSubmission(formType: string, cik: string): Promise<ApiResponse<DraftSubmission>> {
    return this.apiRequest<DraftSubmission>(
      'submissions/draft',
      'POST',
      { formType, cik }
    );
  }

  /**
   * Delete a draft submission
   */
  async deleteDraftSubmission(submissionId: string): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`submissions/draft/${submissionId}`, 'DELETE');
  }

  /**
   * Validate a draft submission
   */
  async validateSubmission(submissionId: string): Promise<ApiResponse<ValidationResult>> {
    return this.apiRequest<ValidationResult>(`submissions/draft/${submissionId}/validate`, 'POST');
  }

  /**
   * Submit a draft submission
   */
  async submitDraftSubmission(submissionId: string): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`submissions/draft/${submissionId}/submit`, 'POST');
  }

  // File upload-related API calls
  
  /**
   * Upload a file to a draft submission
   * Note: This is a simplified version. In practice, you'd need multipart/form-data handling
   */
  async uploadFile(submissionId: string, file: File): Promise<ApiResponse<UploadResult>> {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const url = `${API_BASE_URL}submissions/draft/${submissionId}/files`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.userApiToken}`,
          // Don't set Content-Type, browser will set it with correct boundary
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Error ${response.status}: ${response.statusText}`
        };
      }
      
      return {
        success: true,
        data: data as UploadResult
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during file upload'
      };
    }
  }

  /**
   * Delete a file from a draft submission
   */
  async deleteFile(submissionId: string, fileName: string): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(
      `submissions/draft/${submissionId}/files/${fileName}`,
      'DELETE'
    );
  }

  // Filer-related API calls
  
  /**
   * Get filer information
   */
  async getFiler(cik: string): Promise<ApiResponse<Filer>> {
    return this.apiRequest<Filer>(`filers/${cik}`);
  }

  /**
   * Get available form types
   */
  async getFormTypes(): Promise<ApiResponse<FormTypeVersion[]>> {
    return this.apiRequest<FormTypeVersion[]>('formsupport/formtypes');
  }

  /**
   * Get filing history
   */
  async getFilingHistory(cik: string): Promise<ApiResponse<Filing[]>> {
    return this.apiRequest<Filing[]>(`filers/${cik}/filings`);
  }
}

// Create a singleton instance
const edgarApi = new EdgarApiService();

// Try to load stored tokens on initialization
edgarApi.loadStoredTokens();

export default edgarApi;
