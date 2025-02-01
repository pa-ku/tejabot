'use client'

import { createContext, useState } from 'react'
export const TimeContext = createContext()

export function TimeProvider({ children }) {
  const [timerValue, setTimerValue] = useState('05:59:40')
  const [hasAlarm, setHasAlarm] = useState(true)
  const [alarmActive, setAlarmActive] = useState(false)
  const [timeMessage, setTimeMessage] = useState('')
  const [targetTime, setTargetTime] = useState('06:00')

  return (
    <TimeContext.Provider
      value={{
        targetTime,
        setTargetTime,
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
