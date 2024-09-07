'use client'

import { createContext, useState } from 'react'
export const TimeContext = createContext()

export function TimeProvider({ children }) {
  const [timerValue, setTimerValue] = useState('06:00')
  const [hasAlarm, setHasAlarm] = useState(false)
  const [alarmActive, setAlarmActive] = useState(false)
  const [timeMessage, setTimeMessage] = useState('')
  return (
    <TimeContext.Provider
      value={{
        setHasAlarm,
        hasAlarm,
        timerValue,
        setTimerValue,
        setTimeMessage,
        timeMessage,
        setAlarmActive,
        alarmActive,
      }}
    >
      {children}
    </TimeContext.Provider>
  )
}
