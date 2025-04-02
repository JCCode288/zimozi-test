export interface IRegisterResponse {
   id: number;
   name: string;
   email: string;
   uid: string;
   created_at: string;
   updated_at: string;
}

export interface ILogin {
   email: string;
   password: string;
}

export interface ILoginResponse {
   token: string;
   user: {
      id: number;
      name: string;
      email: string;
      role: string;
   };
}

export type IRegister = Pick<IRegisterResponse, "name" | "uid" | "email">;
