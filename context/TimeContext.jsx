'use client'

import { createContext, useState } from 'react'
export const TimeContext = createContext()

export function TimeProvider({ children }) {
  const [timerValue, setTimerValue] = useState('05:59:54')
  const [hasAlarm, setHasAlarm] = useState(true)
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
