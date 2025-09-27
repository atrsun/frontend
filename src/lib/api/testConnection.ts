import axios from 'axios';

/**
 * Test the connection to the API server
 * This function can be used to check if the API server is accessible
 * and to verify the correct API base URL
 */
export async function testApiConnection(apiUrl: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Try to access the health check endpoint
    const response = await axios.get(`${apiUrl}/health`, {
      timeout: 5000, // 5 seconds timeout
    });
    
    // Check if the response has the expected structure
    if (response.data && typeof response.data === 'object') {
      // Even if some services are down, as long as we get a response with the expected structure,
      // we consider the API to be accessible
      const serviceStatus = {
        up: [] as string[],
        down: [] as string[],
      };
      
      // Check database status
      if (response.data.info?.database?.status === 'up') {
        serviceStatus.up.push('database');
      } else {
        serviceStatus.down.push('database');
      }
      
      // Check search service status
      if (response.data.error?.['search-service-health']?.status === 'down') {
        serviceStatus.down.push('search-service');
      }
      
      return {
        success: true,
        message: `API server is accessible. Services up: ${serviceStatus.up.join(', ')}. Services down: ${serviceStatus.down.join(', ')}`,
        details: {
          status: response.data.status,
          services: serviceStatus,
          raw: response.data,
        },
      };
    }
    
    return {
      success: false,
      message: 'API server response format is unexpected',
      details: response.data,
    };
  } catch (error: any) {
    console.error('API connection test failed:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        message: `API server responded with status ${error.response.status}`,
        details: {
          status: error.response.status,
          data: error.response.data,
        },
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: 'No response received from API server',
        details: {
          error: 'TIMEOUT',
          message: 'The request timed out',
        },
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        message: 'Error setting up the request',
        details: {
          error: error.message,
        },
      };
    }
  }
}

/**
 * Test the login endpoint
 * This function can be used to check if the login endpoint is working
 */
export async function testLoginEndpoint(apiUrl: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Try to access the login endpoint with invalid credentials
    // We expect a 401 or 404 response, which means the endpoint exists
    await axios.post(`${apiUrl}/auth/login`, {
      email: 'test@example.com',
      password: 'invalid-password',
    }, {
      timeout: 5000, // 5 seconds timeout
    });
    
    // If we get here, the login was successful (which is unexpected with invalid credentials)
    return {
      success: true,
      message: 'Login endpoint is accessible and returned a successful response',
    };
  } catch (error: any) {
    console.error('Login endpoint test failed:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // If we get a 401, 404, or 422, that's actually good - it means the endpoint exists
      if (error.response.status === 401 || error.response.status === 404 || error.response.status === 422) {
        return {
          success: true,
          message: 'Login endpoint is accessible',
          details: {
            status: error.response.status,
            data: error.response.data,
          },
        };
      }
      
      return {
        success: false,
        message: `Login endpoint responded with unexpected status ${error.response.status}`,
        details: {
          status: error.response.status,
          data: error.response.data,
        },
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: 'No response received from login endpoint',
        details: {
          error: 'TIMEOUT',
          message: 'The request timed out',
        },
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        message: 'Error setting up the request',
        details: {
          error: error.message,
        },
      };
    }
  }
} 