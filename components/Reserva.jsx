'use client'

import { useEffect, useRef, useState } from 'react'
import Title from './Title'
import { getMillisecondsUntil } from '@/utils/getMiliSeconds'
import Court from './Court'
import Timer from './Timer'
import ChooseTime from './ChooseTime'
import Users from './Users'
import ChooseDay from './ChooseDay'
import MsjStatus from './MsjStatus'
import Retry from './Retry'

export default function ReservaButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [timeMessage, setTimeMessage] = useState('')
  const [postData, setPostData] = useState({
    email: '',
    password: '',
    dniInvitado: '',
    cancha: 3,
    dia: undefined,
  })
  const [horarios, setHorarios] = useState([])
  const [timer, setTimer] = useState({
    hasAlarm: false,
    hr: 6,
    min: 0,
  })
  const [alarmActive, setAlarmActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRetry, setIsRetry] = useState(false)
  const fetchCounterRef = useRef(0)
  const [retryConfig, setRetryConfig] = useState({
    time: 60,
    nOfRetry: 4,
  })
  const [logs, setLogs] = useState([''])

  const [timeToRetry, settimeToRetry] = useState(0)

  useEffect(() => {
    let timerRetry
    if (timeToRetry > 0) {
      timerRetry = setInterval(() => {
        settimeToRetry((prev) => {
          if (prev <= 1) {
            clearInterval(timerRetry)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timerRetry)
  }, [timeToRetry])

  useEffect(() => {
    let timer
    if (alarmActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [alarmActive, timeLeft])

  function handleHorario(e) {
    const value = e.target.value
    setHorarios((prev) => {
      if (prev.includes(value)) {
        return prev.filter((hora) => hora !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  function handleHorario(e) {
    const value = e.target.value
    setHorarios((prev) => {
      if (prev.includes(value)) {
        return prev.filter((hora) => hora !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const performReserva = async () => {
    setAlarmActive(false)
    setLoading(true)
    setTimeMessage('')
    setMessage('')

    try {
      const response = await fetch('/api/reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: postData.email,
          password: postData.password,
          dniInvitado: postData.dniInvitado,
          dia: postData.dia,
          cancha: postData.cancha,
          hora: horarios,
        }),
      })

      const result = await response.json()
      console.log(result.logs)

      setLogs(result.logs)

      if (response.ok) {
        setMessage('Reserva realizada con exito! a padelear 💪')
        fetchCounterRef.current = 0
      } else {
        setMessage('Error: ' + result.error)
        if (isRetry) retryFetch()
      }
    } catch (error) {
      setMessage(`hubo un problema en la peticion: ${error}`)
      if (isRetry) retryFetch()
    } finally {
      setLoading(false)
    }
  }

  const handleReserva = async () => {
    if (
      postData.email === '' ||
      postData.password === '' ||
      postData.dniInvitado === ''
    ) {
      return setMessage('Error: Rellena la información del usuario')
    }
    if (postData.dia === undefined) {
      return setMessage('Error: Elige un dia para reservar')
    }
    if (horarios.length < 1) {
      return setMessage('Error: Selecciona al menos un horario')
    }

    if (timer.hasAlarm) {
      const millisecondsUntilTarget = getMillisecondsUntil(timer.hr, timer.min)
      const secondsUntilTarget = millisecondsUntilTarget / 1000
      setTimeLeft(secondsUntilTarget)

      setTimeMessage(
        `De ${Math.floor(secondsUntilTarget)} Para ejecutar a las ${timer.hr}:${
          timer.min
        } PM...`
      )
      setAlarmActive(true)
      setTimeout(() => {
        performReserva()
      }, millisecondsUntilTarget)
    } else {
      performReserva()
    }
  }

  function retryFetch() {
    fetchCounterRef.current += 1
    if (fetchCounterRef.current >= retryConfig.nOfRetry) {
      setTimeMessage(
        `Error: No se pudo reservar luego de ${retryConfig.nOfRetry} intentos`
      )
      return
    } else {
      settimeToRetry(retryConfig.time)
      setTimeMessage(
        ` Reintentando en ${retryConfig.time} segundos. Intentos restantes ${retryConfig.nOfRetry}`
      )
      setTimeout(() => {
        performReserva()
      }, retryConfig.time * 1000)
    }
  }

  return (
    <div
      className={`${
        alarmActive && 'pointer-events-none  '
      }  h-max w-80 flex items-start flex-col gap-10`}
    >
      <Title>
        TejaB
        <svg
          className='inline animate-rotate'
          width='38'
          height='38'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='#ffffff'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
          <path d='M6 5.3a9 9 0 0 1 0 13.4' />
          <path d='M18 5.3a9 9 0 0 0 0 13.4' />
        </svg>
        t
      </Title>
      <div
        className={`${
          loading && 'pointer-events-none grayscale'
        } duration-300  h-max w-80 flex items-start flex-col gap-10`}
      >
        <Users setPostData={setPostData} postData={postData} />

        <ChooseDay postData={postData} setPostData={setPostData} />

        <ChooseTime
          setHorarios={setHorarios}
          handleHorario={handleHorario}
          horarios={horarios}
        />

        <Court setPostData={setPostData}></Court>

        <Timer setTimer={setTimer} timer={timer}></Timer>

        <Retry
          setRetryConfig={setRetryConfig}
          retryConfig={retryConfig}
          isRetry={isRetry}
          setIsRetry={setIsRetry}
        />
      </div>
      <button
        className=' text-xl duration-300 hover:brightness-110 w-full slick-button p-3 rounded-xl uppercase text-yellow-50'
        onClick={handleReserva}
        disabled={loading}
      >
        {!loading && !alarmActive && 'Reservar'}
        {loading && 'Reservando'}
        {alarmActive && 'Esperando Timer'}
      </button>
      {loading && (
        <div className='w-full flex items-center justify-center'>
          <div className='loader'></div>
        </div>
      )}
      {timeMessage && (
        <p className='text-violet-400'>
          {alarmActive && formatTime(timeLeft)} {timeToRetry > 0 && timeToRetry}
          {timeMessage}
        </p>
      )}

      <div className='border-2 space-y-1 border-gray-600 text-white bg-gray-900 p-3 w-full rounded-lg'>
        {logs.map((log, index) => (
          <p
            className={`${log.includes('❌') && 'text-red-400'} ${
              log.includes('✅') && 'text-green-300'
            }`}
            key={log}
          >
            <span className='text-gray-600'>{index}:</span> {log}
          </p>
        ))}
      </div>
      <p className='text-violet-200 text-center w-full'>Made with 💜 by paku</p>
    </div>
  )
}
