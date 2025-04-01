import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Mock product data
const products = [
  {
    id: 1,
    name: "Product 1",
    description: "This is a description for product 1",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is a description for product 2",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is a description for product 3",
    price: 39.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Product 4",
    description: "This is a description for product 4",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Product 5",
    description: "This is a description for product 5",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Product 6",
    description: "This is a description for product 6",
    price: 69.99,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function ProductsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.description}</p>
              <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

