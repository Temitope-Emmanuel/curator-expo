import React from "react"

// Create a generic context function to handle undefined context call
export const createGenericContext = <T extends unknown>() => {
    // Create a context with a generic parameter or undefined
    const genericContext = React.createContext<T | undefined>(undefined)
  
    // Check if the value provided to the context is defined or throw an error
    const useGenericContext = () => {
      const contextIsDefined = React.useContext(genericContext)
      if (!contextIsDefined) {
        throw new Error("useGenericContext must be used within a Provider")
      }
      return contextIsDefined
    }
  
    return [useGenericContext, genericContext.Provider] as const
  }