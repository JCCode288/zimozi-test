import { client } from "@/lib/graphql/client"

export const clearProductsCache = () => {
  // Evict all products from the cache
  client.cache.evict({ fieldName: "products" })
  client.cache.gc()
}

export const clearProductCache = (id: string) => {
  // Evict a specific product from the cache
  client.cache.evict({ id: `Product:${id}` })
  client.cache.gc()
}

