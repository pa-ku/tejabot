'use client'

import { createContext, useContext, useState } from 'react'
export const ReserveContext = createContext()

export function useReserveContext() {
    const context = useContext(ReserveContext)
    if (!context) {
        throw new Error('useReserveContext debe estar dentro de un provider')
    }
    return context
}
export function ReserveProvider({ children }) {
    const today = new Date().getDay() // 0 = Domingo, 6 = Sábado
    const mappedDay = today === 0 ? 7 : today // Convertimos 0 (Domingo) en 7
    const nextDay = mappedDay === 7 ? 1 : mappedDay + 1 // Si es domingo, pasa a lunes (1)

    const [cancha, setCancha] = useState(3)
    const [dia, setDia] = useState(nextDay)


    return <ReserveContext.Provider value={{ dia, cancha, setDia, setCancha }}>{children}</ReserveContext.Provider>
}