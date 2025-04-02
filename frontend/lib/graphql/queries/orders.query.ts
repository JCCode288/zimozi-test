"use client"

import { gql, useQuery } from "@apollo/client"

// Queries
export const GET_ORDERS = gql`
  query GetOrders($page: Int, $limit: Int) {
    orders(page: $page, limit: $limit) {
      status
      message
      data {
        product {
          id
          name
          price
        }
        total {
          quantity
          price
        }
        ordered_at
      }
      pagination {
        page
        limit
        total_data
        total_page
      }
    }
  }
`

export function useOrders(page = 1, limit = 10) {
  return useQuery(GET_ORDERS, {
    variables: { page, limit },
    fetchPolicy: "cache-and-network",
  })
}

