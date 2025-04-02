import Axios from "./axios";
import { AuthURL } from "./be.constant";
import type {
   IRegister,
   IRegisterResponse,
   ILogin,
   ILoginResponse,
} from "./interfaces/login.interfaces";
import type { ApiResponse } from "./interfaces/response.interfaces";

export async function register(
   cred: IRegister
): Promise<IRegisterResponse> {
   const url = AuthURL.REGISTER;
   const {
      data: { data, status, message },
   } = await Axios.post<ApiResponse<IRegisterResponse>>(url, cred);

   console.log(data, "<<< API DATA REGIST");
   return data;
}

export async function login(cred: ILogin): Promise<ILoginResponse> {
   const url = AuthURL.LOGIN;
   const {
      data: { data, status, message },
   } = await Axios.post<ApiResponse<ILoginResponse>>(url, cred);

   return data;
}
