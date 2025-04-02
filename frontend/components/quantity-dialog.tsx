"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Loader2 } from "lucide-react"

interface QuantityDialogProps {
  productName: string
  maxQuantity: number
  isOpen: boolean
  onClose: () => void
  onConfirm: (quantity: number) => Promise<void>
}

export function QuantityDialog({ productName, maxQuantity, isOpen, onClose, onConfirm }: QuantityDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Reset quantity when dialog opens with a new product
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setError("")
    }
  }, [isOpen, productName])

  // Update the handleQuantityChange function to ensure we always have a valid number
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      // Ensure quantity is at least 1 and at most maxQuantity
      const validQuantity = Math.max(1, Math.min(value, maxQuantity))
      setQuantity(validQuantity)
      setError("")
    } else {
      setError("Please enter a valid number")
    }
  }

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1)
      setError("")
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
      setError("")
    }
  }

  // Update the handleConfirm function to ensure quantity is valid before submission
  const handleConfirm = async () => {
    // Validate quantity before submitting
    if (quantity < 1) {
      setError("Quantity must be at least 1")
      return
    }

    if (quantity > maxQuantity) {
      setError(`Quantity cannot exceed ${maxQuantity}`)
      return
    }

    setIsSubmitting(true)
    try {
      await onConfirm(quantity)
    } catch (error) {
      console.error("Error confirming quantity:", error)
      setError("Failed to add to cart. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Quantity</DialogTitle>
          <DialogDescription>How many {productName} would you like to add to your cart?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isSubmitting}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="grid gap-2 flex-1">
              <Label htmlFor="quantity" className="text-center">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                max={maxQuantity}
                className="text-center"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= maxQuantity || isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="text-sm text-muted-foreground text-center">{maxQuantity} available in stock</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting || !!error}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

