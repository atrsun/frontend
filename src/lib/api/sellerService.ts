import apiClient from './config';

export interface HolooSeller {
  Code: string;
  Name: string;
  BedSarfasl: string;
  IsPurchaser: boolean;
  IsSeller: boolean;
  IsBlackList: boolean;
  IsVaseteh: boolean;
  VasetehPorsant: number;
  Mandeh: number;
  Credit: number;
  Mobile?: string;
  ErpCode: string;
  type: number;
  IsActive: boolean;
  selectedPriceType: number;
  isAmer: boolean;
}

export interface SellerListParams {
  limit?: number;
  page?: number;
}

export interface SellerFilterParams {
  phone?: string;
  name?: string;
}

const sellerService = {
  /**
   * Get a list of sellers with pagination
   * Default is page 1 and limit 50
   */
  getSellers: async (params: SellerListParams = {}) => {
    const response = await apiClient.get<{ Customer: HolooSeller[] }>('/holoo/sellers', { 
      params: {
        limit: params.limit || 50,
        page: params.page || 1
      } 
    });
    return response.data.Customer;
  },

  /**
   * Filter sellers by phone or name
   */
  filterSellers: async (params: SellerFilterParams = {}) => {
    const response = await apiClient.get<HolooSeller[]>('/holoo/filterSellers', { 
      params: {
        phone: params.phone,
        name: params.name
      } 
    });
    return response.data;
  }
};

export default sellerService; 