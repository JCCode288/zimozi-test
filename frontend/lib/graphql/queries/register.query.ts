"use client";

import { gql, useMutation } from "@apollo/client";

export const REGISTER = gql`
   mutation Register($name: String!, $email: String!, $uid: String!) {
      register(name: $name, email: $email, uid: $uid) {
         id
         name
         email
         admin {
            id
         }
      }
   }
`;

export const useRegister = (name?: string, email?: string, uid?: string) =>
   useMutation(REGISTER, { variables: { name, email, uid } });
