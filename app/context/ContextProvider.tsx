import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ContextType {
    loading: boolean,
    pause: boolean,
    setLoading: (v: boolean) => void,
    setPause: (v: boolean) => void
}

const LoadingContext = createContext<ContextType | null>(null)

export const useLoading = () => {
    const value = useContext(LoadingContext)
    if (!value) throw new Error('useLoading must be wrapped inside ContextProvider')
    return value
}

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false)
    const [pause, setPause] = useState(true)
    return (
        <LoadingContext.Provider value={{ loading, setLoading, pause, setPause }}>
            {children}
        </LoadingContext.Provider>
    )
}

export default ContextProvider