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
  const date = new Date()
  const today = date.getDay()
  const tomorrow = (today + 1) % 7

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [diaReserva, setDiaReserva] = useState(tomorrow)
  const [horarios, setHorarios] = useState([])

  const [canchaReserva, setCanchaReserva] = useState(3)
  const [hasAlarm, setHasAlarm] = useState(false)
  const [timerHr, setTimerHr] = useState(6)
  const [timerMin, setTimerMin] = useState(5)
  const [alarmActive, setAlarmActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const [userReserva, setUserReserva] = useState({
    email: '',
    password: '',
    invitado: '',
  })
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

  const handleReserva = async () => {
    if (
      userReserva.email == '' ||
      userReserva.password == '' ||
      userReserva.invitado == ''
    ) {
      return setMessage('Error: Rellena la información del usuario')
    }

    if (horarios.length < 1) {
      return setMessage('Error: Selecciona al menos un horario')
    }

    const millisecondsUntilTarget = getMillisecondsUntil(timerHr, timerMin)
    const secondsUntilTarget = millisecondsUntilTarget / 1000
    setTimeLeft(secondsUntilTarget)

    setMessage(
      `De ${Math.floor(
        secondsUntilTarget
      )} Para ejecutar a las ${timerHr}:${timerMin} PM...`
    )
    setAlarmActive(true)
    setTimeout(
      async () => {
        setAlarmActive(false)
        setLoading(true)
        setMessage('')

        try {
          const response = await fetch('/api/reserva', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userReserva.email,
              password: userReserva.password,
              dniInvitado: userReserva.invitado,
              dia: diaReserva,
              cancha: canchaReserva,
              hora: horarios,
            }),
          })

          const result = await response.json()

          if (response.ok) {
            setMessage(result.message)
            fetchCounterRef.current = 0
          } else {
            setMessage('Error: ' + result.message)
            isRetry && retryFetch()
          }
        } catch (error) {
          setMessage('Error: No se pudo conectar con el servidor')
          isRetry && retryFetch()
        } finally {
          setLoading(false)
        }
      },
      hasAlarm ? millisecondsUntilTarget : 0
    )
  }

  function retryFetch() {
    fetchCounterRef.current += 1
    if (fetchCounterRef.current >= 3) {
      setMessage('Error: No se pudo reservar luego de 3 intentos')
      return
    } else {
      setMessage(` Reintentando en 5 minutos...`)

      setTimeout(() => {
        handleReserva()
      }, 50000)
    }
  }

  return (
    <div className='h-max w-80 flex items-start flex-col gap-10'>
      <Title>TejaBot🤖</Title>

      <Users setUserReserva={setUserReserva} userReserva={userReserva} />

      <ChooseDay
        setDiaReserva={setDiaReserva}
        today={today}
        tomorrow={tomorrow}
      />

      <ChooseTime
        fcHorarios={setHorarios}
        handleHorario={handleHorario}
        arrHorarios={horarios}
      />

      <Court setCanchaReserva={setCanchaReserva}></Court>

      <Timer
        fcHasAlarm={setHasAlarm}
        fcTimerMin={setTimerMin}
        fcTimerHr={setTimerHr}
        hasAlarm={hasAlarm}
        timerHr={timerHr}
        timerMin={timerMin}
      ></Timer>

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
        className=' text-xl duration-300 hover:brightness-110 w-full slick-button p-3 rounded-xl uppercase text-yellow-100'
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
      {message && (
        <MsjStatus message={message}>
          {alarmActive && Math.floor(timeLeft)} {message}
        </MsjStatus>
      )}

      <p className='text-violet-200 text-center w-full'>
        Made with 💜 by paku{' '}
      </p>
    </div>
  )
}
