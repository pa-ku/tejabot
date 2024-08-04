'use client'

import { useEffect, useRef, useState } from 'react'
import Title from './Title'
import { getMillisecondsUntil } from '@/utils/getMiliSeconds'
import Court from './Court'
import Timer from './Timer'
import ChooseTime from './ChooseTime'
import Users from './Users'
import ChooseDay from './ChooseDay'
import Checkbox from './ui/Checkbox'
import MsjStatus from './MsjStatus'

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
    min: 5,
  })
  const [alarmActive, setAlarmActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRetry, setIsRetry] = useState(false)
  const fetchCounterRef = useRef(0)

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

      if (response.ok) {
        setMessage(result.message)
        fetchCounterRef.current = 0
      } else {
        setMessage('Error: ' + result.message)
        if (isRetry) retryFetch()
      }
    } catch (error) {
      setMessage('Error: No se pudo conectar con el servidor')
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
    if (fetchCounterRef.current >= 4) {
      setTimeMessage('Error: No se pudo reservar luego de 3 intentos')
      return
    } else {
      setTimeMessage(` Reintentando en ${10000}ms...`)
      setTimeout(() => {
        performReserva()
      }, 10000)
    }
  }

  return (
    <div
      className={`${alarmActive && 'pointer-events-none'} ${
        loading && 'pointer-events-none'
      } h-max w-80 flex items-start flex-col gap-10`}
    >
      <Title>TejaBot🤖</Title>

      <Users setPostData={setPostData} postData={postData} />

      <ChooseDay setPostData={setPostData} />

      <ChooseTime
        fcHorarios={setHorarios}
        handleHorario={handleHorario}
        arrHorarios={horarios}
      />

      <Court setPostData={setPostData}></Court>

      <Timer setTimer={setTimer} timer={timer}></Timer>

      <section>
        <Checkbox value={isRetry} onChange={() => setIsRetry(!isRetry)}>
          Activar reintentos
        </Checkbox>
        <p className='description'>
          Permite intentar nuevamente cada 5minutos si no se encuentra el turno,
          hasta un maximo de 3 veces
        </p>
      </section>

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
      {message && <MsjStatus message={message}>{message}</MsjStatus>}
      {timeMessage && (
        <p className='text-violet-400'>
          {alarmActive && formatTime(timeLeft)} {timeMessage}
        </p>
      )}

      <p className='text-violet-200 text-center w-full'>
        Made with 💜 by paku{' '}
      </p>
    </div>
  )
}
