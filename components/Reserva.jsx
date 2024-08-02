'use client'

import { useEffect, useState } from 'react'
import Title from './Title'
import { getMillisecondsUntil } from '@/utils/getMiliSeconds'
import Court from './Court'
import Timer from './Timer'
import ChooseTime from './ChooseTime'
import Users from './Users'

export default function ReservaButton() {
  const today = new Date()
  const day = today.getDay()
  const nextDay = (day + 1) % 7

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [diaReserva, setDiaReserva] = useState(nextDay)
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

  console.log(canchaReserva)

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
          } else {
            setMessage('Error: ' + result.message)
          }
        } catch (error) {
          setMessage('Error: No se pudo conectar con el servidor')
        } finally {
          setLoading(false)
        }
      },
      hasAlarm ? millisecondsUntilTarget : 0
    )
  }

  return (
    <div className='h-max w-80 flex items-start flex-col gap-10'>
      <Title>TejaBot🤖</Title>

      <Users setUserReserva={setUserReserva} userReserva={userReserva} />

      <section className='flex w-full flex-col items-center justify-center'>
        <h2>Día</h2>
        <select
          className=' hover:brightness-110 py-3 w-full  text-violet-200 bg-violet-950 border border-violet-500 p-2 rounded-xl cursor-pointer'
          onChange={(e) => setDiaReserva(e.target.value)}
          name=''
          id=''
          defaultValue={nextDay}
        >
          <option value='1'>Lunes</option>
          <option value='2'>Martes</option>
          <option value='3'>Miercoles</option>
          <option value='4'>Jueves</option>
          <option value='5'>Viernes</option>
          <option value='6'>Sabado</option>
          <option value='7'>Domingo</option>
        </select>
      </section>

      <ChooseTime
        fcHorarios={setHorarios}
        $onClick={handleHorario}
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

      <button
        className='w-full slick-button p-3 rounded-xl uppercase text-white'
        onClick={handleReserva}
        disabled={loading}
      >
        {!loading && !alarmActive && 'Reservar'}
        {loading && 'Reservando'}
        {alarmActive && 'Esperando Timer'}
      </button>

      {loading && (
        <div className='w-full flex items-center justify-center'>
          <div class='loader'></div>
        </div>
      )}
      {message && (
        <div
          className={`${
            message.includes('Error')
              ? 'bg-red-950 text-red-200 border-red-500'
              : 'bg-green-950 text-green-200 border-green-500'
          } w-80  rounded-xl flex break-words border p-2`}
        >
          <p>
            {alarmActive && Math.floor(timeLeft)} {message}
          </p>
        </div>
      )}

      <p className='text-violet-200 text-center w-full'>
        Made with 💜 by paku{' '}
      </p>
    </div>
  )
}
