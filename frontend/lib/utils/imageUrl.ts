/**
 * Generates a URL for an image using our API route
 * @param id The image ID
 * @returns The URL to the image
 */
export function getImageUrl(id: string): string {
  if (!id) return "/placeholder.svg?height=300&width=300"
  return `/api/image/${encodeURIComponent(id)}`
}

/**
 * Extracts the image ID from a URL or filename
 * @param url The image URL or filename
 * @returns The extracted image ID
 */
export function extractImageId(url: string): string {
  if (!url) return ""

  // If the URL already contains our API path, extract the ID
  if (url.includes("/api/image/")) {
    return url.split("/api/image/").pop() || ""
  }

  // For filenames like "pas foto.jpg-1743512208656", use the whole string as ID
  return url
}

