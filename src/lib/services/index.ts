import { ISupport } from "@/components/Support/SupportModal";
import {
  API_BUY,
  API_DEPOSIT,
  API_EDIT_PASSWORD,
  API_FORGOT_PASSWORD,
  API_LOGIN,
  API_PAIRS,
  API_PROFILE,
  API_REGISTER,
  API_RESET_PASSWORD,
  API_SELL,
  API_SUPPORT,
  API_WITHDRAW,
} from "@/constants";
import {
  IAccount,
  IEditPassword,
  IProfileUpdate,
  IResetPassword,
  ITokenDetails,
  ITokenPair,
} from "@/types";

import { AuthenticatedAPI, UnauthenticatedAPI } from "./config";

// TYPES
type TradeServiceParams = {
  symbol: string;
  amount: number;
  price: number;
  fee: number;
};

// AUTH ========================================
export const registerService = async (data: IAccount) => {
  return await UnauthenticatedAPI.post(API_REGISTER, data);
};

export const loginService = async (data: IAccount) => {
  return await UnauthenticatedAPI.post(API_LOGIN, data);
};

export const forgotPasswordService = async (email: string) => {
  return await UnauthenticatedAPI.post(API_FORGOT_PASSWORD, { email });
};

export const resetPasswordService = async (data: IResetPassword) => {
  return await UnauthenticatedAPI.post(API_RESET_PASSWORD, data);
};

// PROFILE ========================================
export const editProfileService = async (data: IProfileUpdate) => {
  return await AuthenticatedAPI.put(API_PROFILE, data);
};

export const editProfilePictureService = async (imgUrl: string) => {
  return await AuthenticatedAPI.put(API_PROFILE, { image: imgUrl });
};
export const editPasswordService = async (data: IEditPassword) => {
  return await AuthenticatedAPI.put(API_EDIT_PASSWORD, data);
};

// TRANSACTION ========================================
export const depositService = async (depositAmount: number) => {
  return await AuthenticatedAPI.post(API_DEPOSIT, { amount: depositAmount });
};

export const buyService = async ({
  symbol,
  amount,
  price,
  fee,
}: TradeServiceParams) => {
  return await AuthenticatedAPI.post(API_BUY, { symbol, amount, price, fee });
};

export const sellService = async ({
  symbol,
  amount,
  price,
  fee,
}: TradeServiceParams) => {
  return await AuthenticatedAPI.post(API_SELL, { symbol, amount, price, fee });
};

export const withdrawService = async (withdrawAmount: number) => {
  return await AuthenticatedAPI.post(API_WITHDRAW, { amount: withdrawAmount });
};

// TOKENS ========================================
export const getPairsService = async () => {
  return await UnauthenticatedAPI.get<ITokenPair[]>(API_PAIRS);
};

export const getTokenDetailsService = async (ticker_id: string) => {
  return await UnauthenticatedAPI.get<ITokenDetails>(
    `${API_PAIRS}/${ticker_id}`,
  );
};

// SUPPORT ========================================
export const supportService = async (data: ISupport) => {
  return await AuthenticatedAPI.post(API_SUPPORT, data);
};
