export interface IRegisterResponse {
   id: number;
   name: string;
   email: string;
   uid: string;
   created_at: string;
   updated_at: string;
}

export type IRegister = Pick<IRegisterResponse, "name" | "uid" | "email">;
