import Axios from "./axios";
import { AuthURL } from "./be.constant";
import {
   IRegister,
   IRegisterResponse,
} from "./interfaces/login.interfaces";
import { ApiResponse } from "./interfaces/response.interfaces";

export async function register(
   cred: IRegister
): Promise<IRegisterResponse> {
   const url = AuthURL.REGISTER;
   const {
      data: { data, status, message },
   } = await Axios.post<ApiResponse<IRegisterResponse>>(url, cred);

   return data;
}
