"use client"

import { gql, useQuery } from "@apollo/client"

// This query is to check if the Image type has an id field
export const GET_IMAGE_SCHEMA = gql`
  query {
    __type(name: "Image") {
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`

export function useImageSchema() {
  return useQuery(GET_IMAGE_SCHEMA, {
    fetchPolicy: "no-cache",
  })
}

