"use client";

import { gql } from "@apollo/client";

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
