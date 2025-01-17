import axios from 'axios';

const API_BASE_URL = 'https://dev-ks-gatewayapi.p2eppl.com/v1/contract/kalp';
const CONTRACT_ADDRESS = 'hvGiAdp4xcNYsY5fwuUPAfiV7fSilHDB1723447369891';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface BaseParams {
  network: 'DEVNET';
  blockchain: 'KALP';
  walletAddress: string;
}

interface CreateExpenseParams extends BaseParams {
  args: {
    expenseID: string;
    description: string;
    amount: number;
    payer: string;
    participants: string[];
  };
}

interface GetExpenseParams extends BaseParams {
  args: {
    expenseID: string;
  };
}

interface SplitExpenseParams extends BaseParams {
  args: {
    expenseID: string;
  };
}

interface SettleDebtParams extends BaseParams {
  args: {
    from: string;
    to: string;
    expenseID: string;
  };
}

interface QueryAllDebtsParams extends BaseParams {
  args: Record<string, never>;
}

interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error: any): ApiError => {
  const errorResponse = error.response?.data;
  return {
    message: errorResponse?.message || error.message || 'An unknown error occurred',
    status: error.response?.status,
    details: errorResponse
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export const api = {
  createExpense: async (params: CreateExpenseParams) => {
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        const sanitizedParams = {
          ...params,
          args: {
            ...params.args,
            amount: Number(params.args.amount),
            expenseID: String(params.args.expenseID),
          }
        };
        
        const response = await axiosInstance.post(`${API_BASE_URL}/invoke/${CONTRACT_ADDRESS}/CreateExpense`, sanitizedParams);
        return response.data;
      } catch (error: any) {
        const isConflict = error.response?.data?.message?.includes('MVCC_READ_CONFLICT');
        
        if (isConflict && retries < MAX_RETRIES - 1) {
          retries++;
          await delay(INITIAL_RETRY_DELAY * retries);
          continue;
        }
        
        throw handleApiError(error);
      }
    }
  },

  getExpense: async (params: GetExpenseParams) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/query/${CONTRACT_ADDRESS}/GetExpense`, params);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  splitExpense: async (params: SplitExpenseParams) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/invoke/${CONTRACT_ADDRESS}/SplitExpense`, params);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  settleDebt: async (params: SettleDebtParams) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/invoke/${CONTRACT_ADDRESS}/SettleDebt`, params);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  queryAllDebts: async (params: QueryAllDebtsParams) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/query/${CONTRACT_ADDRESS}/QueryAllDebts`, params);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};