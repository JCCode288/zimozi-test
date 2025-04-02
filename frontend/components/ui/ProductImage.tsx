"use client"

import Image from "next/image"
import { extractImageId, getImageUrl } from "@/lib/utils/imageUrl"

interface ProductImageProps {
  imageUrl: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function ProductImage({ imageUrl, alt, width = 300, height = 300, className = "" }: ProductImageProps) {
  // Extract the image ID from the URL
  const imageId = extractImageId(imageUrl)

  // Generate the API route URL
  const src = getImageUrl(imageId)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          e.currentTarget.src = `/placeholder.svg?height=${height}&width=${width}`
        }}
      />
    </div>
  )
}

