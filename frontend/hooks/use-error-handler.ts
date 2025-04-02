"use client"

import { useState } from "react"
import { useToast } from "./use-toast"

interface ErrorHandlerConfig {
  // Default error message if none is found
  defaultMessage?: string
  // Whether to show toast notifications for errors
  showToast?: boolean
  // Custom error mappings beyond the default ones
  customErrors?: Record<string, string>
  // Callback to run after error is handled
  onError?: (error: any, message: string) => void
}

export function useErrorHandler(config: ErrorHandlerConfig = {}) {
  const [error, setError] = useState<string>("")
  const { toast } = useToast()

  const defaultConfig = {
    defaultMessage: "An unexpected error occurred",
    showToast: false,
    customErrors: {},
  }

  const mergedConfig = { ...defaultConfig, ...config }

  // Firebase auth error codes and their user-friendly messages
  const authErrorMessages: Record<string, string> = {
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "This account has been disabled",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already in use",
    "auth/weak-password": "Password is too weak",
    "auth/invalid-auth": "Authentication failed",
    ...mergedConfig.customErrors,
  }

  const handleError = (err: any) => {
    console.error("Error caught by useErrorHandler:", err)

    let errorMessage = mergedConfig.defaultMessage

    // Handle Firebase errors
    if (err && err.code && authErrorMessages[err.code]) {
      errorMessage = authErrorMessages[err.code]
    }
    // Handle GraphQL errors with networkError
    else if (err && err.networkError) {
      errorMessage = `Network error: ${err.networkError.message || "Unable to connect to server"}`
    }
    // Handle GraphQL errors with graphQLErrors array
    else if (err && err.graphQLErrors && err.graphQLErrors.length > 0) {
      const gqlError = err.graphQLErrors[0]
      errorMessage = `GraphQL error: ${gqlError.message}`
    }
    // Handle network errors
    else if (err && err.message && typeof err.message === "string" && err.message.includes("network")) {
      errorMessage = "Network error. Please check your connection."
    }
    // Handle other errors with messages
    else if (err && err.message && typeof err.message === "string") {
      errorMessage = err.message
    }
    // Handle errors that might be objects or arrays
    else if (err && typeof err === "object") {
      try {
        errorMessage = `Error: ${JSON.stringify(err)}`
      } catch (e) {
        errorMessage = "An error occurred with a complex error object"
      }
    }

    // Set the error state
    setError(errorMessage)

    // Show toast if configured
    if (mergedConfig.showToast) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }

    // Call the onError callback if provided
    if (mergedConfig.onError) {
      mergedConfig.onError(err, errorMessage)
    }

    return errorMessage
  }

  return {
    error,
    setError,
    handleError,
    clearError: () => setError(""),
  }
}

