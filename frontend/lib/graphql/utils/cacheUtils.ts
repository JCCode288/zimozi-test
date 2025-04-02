import { client } from "@/lib/graphql/client"

/**
 * Clears the entire Apollo cache
 */
export const clearCache = () => {
  return client.resetStore()
}

/**
 * Clears specific entities from the Apollo cache
 * @param entityName The GraphQL type name (e.g., 'Product', 'Category')
 * @param id Optional ID to clear a specific entity
 */
export const clearEntityCache = (entityName: string, id?: string) => {
  if (id) {
    // Clear a specific entity
    client.cache.evict({ id: `${entityName}:${id}` })
  } else {
    // Clear all entities of this type
    client.cache.evict({ fieldName: entityName.toLowerCase() })
  }
  // Garbage collection to remove unreachable objects
  client.cache.gc()
}

/**
 * Refetches all active queries
 */
export const refetchQueries = () => {
  return client.refetchQueries({
    include: "active",
  })
}

