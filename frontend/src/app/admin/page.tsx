"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, Edit, Save } from "lucide-react"

// Mock product data
const initialProducts = [
  {
    id: 1,
    name: "Product 1",
    description: "This is a description for product 1",
    price: 19.99,
    stock: 10,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is a description for product 2",
    price: 29.99,
    stock: 15,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is a description for product 3",
    price: 39.99,
    stock: 5,
  },
]

// Mock user data
const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Regular User",
    email: "user@example.com",
    role: "user",
  },
]

export default function AdminPage() {
  const [products, setProducts] = useState(initialProducts)
  const [users, setUsers] = useState(initialUsers)
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "" })
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const router = useRouter()

  // Check if user is authenticated and is an admin
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const userRole = localStorage.getItem("userRole")

    if (!isAuthenticated || userRole !== "admin") {
      router.push("/login")
    }
  }, [router])

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const id = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
    const price = Number.parseFloat(newProduct.price)
    const stock = Number.parseInt(newProduct.stock)

    if (isNaN(price) || isNaN(stock)) {
      alert("Price and stock must be valid numbers")
      return
    }

    setProducts([
      ...products,
      {
        id,
        name: newProduct.name,
        description: newProduct.description,
        price,
        stock,
      },
    ])
    setNewProduct({ name: "", description: "", price: "", stock: "" })
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleEditProduct = (id: number) => {
    setEditingProduct(id)
  }

  const handleSaveProduct = (id: number) => {
    setEditingProduct(null)
  }

  const handleProductChange = (id: number, field: string, value: string) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          if (field === "price") {
            return { ...product, [field]: Number.parseFloat(value) || 0 }
          } else if (field === "stock") {
            return { ...product, [field]: Number.parseInt(value) || 0 }
          }
          return { ...product, [field]: value }
        }
        return product
      }),
    )
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Fill in the details to add a new product</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>Edit or delete existing products</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>
                          {editingProduct === product.id ? (
                            <Input
                              value={product.name}
                              onChange={(e) => handleProductChange(product.id, "name", e.target.value)}
                            />
                          ) : (
                            product.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingProduct === product.id ? (
                            <Input
                              value={product.description}
                              onChange={(e) => handleProductChange(product.id, "description", e.target.value)}
                            />
                          ) : (
                            product.description
                          )}
                        </TableCell>
                        <TableCell>
                          {editingProduct === product.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={product.price}
                              onChange={(e) => handleProductChange(product.id, "price", e.target.value)}
                            />
                          ) : (
                            `$${product.price.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingProduct === product.id ? (
                            <Input
                              type="number"
                              value={product.stock}
                              onChange={(e) => handleProductChange(product.id, "stock", e.target.value)}
                            />
                          ) : (
                            product.stock
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {editingProduct === product.id ? (
                              <Button size="sm" variant="outline" onClick={() => handleSaveProduct(product.id)}>
                                <Save className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleEditProduct(product.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

