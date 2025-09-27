import apiClient from "./config";

export interface HolooCustomer {
  EconomicId: string;
  IsPurchaser: string;
  IsSeller: string;
  IsBlackList: string;
  IsVaseteh: string;
  VasetehPorsant: string;
  Mandeh: string;
  Credit: string;
  ErpCode: string;
  type: string;
  IsActive: string;
  selectedPriceType: string;
  isAmer: string;
  Code?: string;
  Name?: string;
  BesSarfasl?: string;
  Mobile?: string;
  WebId?: string;
}

export interface UserCustomer {
  createdAt?: string;
  updatedAt?: string;
  Code?: string;
  Name?: string;
  BedSarfasl?: string;
  IsPurchaser: boolean;
  IsSeller: boolean;
  IsBlackList: boolean;
  IsVaseteh: boolean;
  VasetehPorsant: number;
  Mandeh: number;
  Credit: number;
  Mobile?: string;
  Tel?: string;
  City?: string;
  Ostan?: string;
  Address?: string;
  ErpCode: string;
  type: number;
  IsActive: boolean;
  selectedPriceType: number;
  isAmer: boolean;
  Vaseteh?: VasetehItem[];
}

export interface VasetehItem {
  ErpCode: string;
  name: string;
  remain: number;
}

export interface CustomerApiResponse {
  status: number;
  data: UserCustomer[];
}

export interface CustomerListParams {
  limit?: number;
  page?: number;
}

export interface CustomerFilterParams {
  phone?: string;
  name?: string;
}

export interface CustomerAddressParams {
  customerErpCode: string;
}

// Helper function to normalize API responses
const normalizeResponse = <T>(response: any): T => {
  console.log('Raw API response:', JSON.stringify(response, null, 2));
  
  if (!response) {
    console.log('Empty response received');
    return response;
  }
  
  // If response has data property, return that directly
  if (response.data) {
    console.log('Response with data property found:', typeof response.data, Array.isArray(response.data) ? 'array' : 'non-array');
    return response;
  }
  
  // If response is the data itself (array or object without status)
  if (!response.status) {
    // For array responses, wrap in standard format
    if (Array.isArray(response)) {
      console.log('Array response found, wrapping in standard format', response.length, 'items');
      return { status: 200, data: response } as unknown as T;
    }
    
    // For Customer property that contains the data
    if (response.Customer) {
      console.log('Response with Customer property found:', typeof response.Customer, Array.isArray(response.Customer) ? 'array' : 'non-array');
      return { 
        status: 200, 
        data: Array.isArray(response.Customer) ? response.Customer : [response.Customer] 
      } as unknown as T;
    }
    
    // If it's an object with ErpCode, treat as a single customer
    if (typeof response === 'object' && response.ErpCode) {
      console.log('Single customer object found with ErpCode', response.ErpCode);
      return { status: 200, data: [response] } as unknown as T;
    }
  }
  
  console.log('No normalization applied, returning original response');
  return response;
};

const customerService = {
  /**
   * Get a list of customers with pagination
   * Default is page 1 and limit 50
   */
  getCustomers: async () => {
    try {
      const response = await apiClient.get(
        "/users/currentSellerUsers",
        {},
      );
      
      return normalizeResponse<CustomerApiResponse>(response.data);
    } catch (error) {
      console.error("Error in getCustomers:", error);
      throw error;
    }
  },

  /**
   * Filter customers by phone or name
   */
  filterCustomers: async (params: CustomerFilterParams = {}) => {
    try {
      const response = await apiClient.get(
        "/holoo/filterCustomer",
        {
          params: {
            phone: params.phone,
            name: params.name,
          },
        },
      );
      
      return normalizeResponse<CustomerApiResponse>(response.data);
    } catch (error) {
      console.error("Error in filterCustomers:", error);
      throw error;
    }
  },
  
  /**
   * Filter users by name
   */
  filterCustomersByName: async (params: CustomerFilterParams = {}): Promise<UserCustomer[]> => {
    try {
      console.log('Searching customers with params:', params);
      const response = await apiClient.get(
        "/users/filterUsers",
        {
          params: {
            name: params.name,
          },
        },
      );
      
      console.log('Raw filterCustomersByName response:', JSON.stringify(response.data, null, 2));
      
      // Process the response to extract customer data in the most reliable way
      const result = response.data;
      
      if (Array.isArray(result)) {
        console.log('Direct array of customers found');
        return result;
      }
      
      if (result && result.data && Array.isArray(result.data)) {
        console.log('Customers found in data property');
        return result.data;
      }
      
      if (result && result.Customer) {
        console.log('Customers found in Customer property');
        return Array.isArray(result.Customer) ? result.Customer : [result.Customer];
      }
      
      // Single customer object
      if (result && typeof result === 'object' && result.ErpCode) {
        console.log('Single customer object found');
        return [result as UserCustomer];
      }
      
      console.warn('No valid customer data found in API response');
      return [];
    } catch (error) {
      console.error("Error in filterCustomersByName:", error);
      throw error;
    }
  },

  /**
   * Get customer addresses by customer ErpCode
   */
  getCustomerAddresses: async (params: CustomerAddressParams) => {
    try {
      const response = await apiClient.get("/holoo/costumerAddress", {
        params: {
          customerErpCode: params.customerErpCode,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Error in getCustomerAddresses:", error);
      throw error;
    }
  },

  /**
   * Get sellers
   */
  getSellers: async () => {
    try {
      const response = await apiClient.get("/holoo/sellers");
      return response.data;
    } catch (error) {
      console.error("Error in getSellers:", error);
      throw error;
    }
  },
};

export default customerService;
