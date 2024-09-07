'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import Title from './Title'
import Court from './Court'
import Timer from './Timer'
import ChooseTime from './ChooseTime'
import Users from './Users'
import ChooseDay from './ChooseDay'
import { TimeContext } from '@/context/TimeContext'
import LoadingCircle from './ui/LoadingCircle'
import LogsLayout from '@/components/LogsLayout'
import ReservarBtn from './ReservarBtn'

export default function ReservaButton() {
  const { hasAlarm, timerValue, setAlarmActive, alarmActive } =
    useContext(TimeContext)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [postData, setPostData] = useState({
    email: '',
    password: '',
    dniInvitado: '',
    codeVerification: '',
    cancha: 3,
    dia: 7,
  })
  const [horarios, setHorarios] = useState(['19:00 - 20:00'])
  const fetchCounterRef = useRef(0)
  const [logs, setLogs] = useState([])
  console.log(horarios)

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

  useEffect(() => {
    if (alarmActive) {
      const interval = setInterval(() => {
        const currentTime = new Date().toTimeString().slice(0, 5) // Formato 'HH:MM'
        if (timerValue === currentTime) {
          performReserva()
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [alarmActive, timerValue])

  async function performReserva() {
    setAlarmActive(false)
    setLoading(true)
    setMessage('')
    setLogs([])
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
          code: postData.codeVerification,
          hora: horarios,
        }),
      })

      const result = await response.json()
      setLogs(result.logs)

      if (response.ok) {
        console.log(result)
        fetchCounterRef.current = 0
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleReserva() {
    if (
      postData.email === '' ||
      postData.password === '' ||
      postData.dniInvitado === ''
    ) {
      return setMessage(' Rellena la información del usuario')
    }
    if (postData.dia === undefined) {
      return setMessage(' Elige un dia para reservar')
    }
    if (horarios.length < 1) {
      return setMessage(' Selecciona al menos un horario')
    }
    if (hasAlarm) {
      setAlarmActive(true)
    } else {
      performReserva()
    }
  }

  return (
    <div className={` h-max w-full md:w-80 flex items-start flex-col gap-10`}>
      <Title>
        TejaB
        <svg
          className='inline animate-rotate'
          width='58'
          height='58'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='#161128'
          fill='#f83596'
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
          (loading && 'pointer-events-none sepia') ||
          (alarmActive && 'pointer-events-none grayscale')
        } px-4 lg:px-0 duration-300   h-max flex items-start flex-col gap-10`}
      >
        <Users setPostData={setPostData} postData={postData} />
        <Court setPostData={setPostData}></Court>
        <ChooseDay postData={postData} setPostData={setPostData} />
        <ChooseTime
          setHorarios={setHorarios}
          handleHorario={handleHorario}
          horarios={horarios}
        />

        <Timer></Timer>
      </div>
      <div className='w-full px-4 space-y-2'>
        <ReservarBtn
          onClick={handleReserva}
          disabled={loading}
          alarmActive={alarmActive}
          timerValue={timerValue}
          loading={loading}
        ></ReservarBtn>
        {alarmActive && (
          <button
            type='button'
            className=' bg-red-950 rounded-lg text-red-400 border-2 border-red-900 w-full py-3 hover:brightness-110'
            onClick={() => setAlarmActive(false)}
          >
            Desactivar alarma
          </button>
        )}
        {message && (
          <p className='bg-red-950 p-2 rounded-lg text-white'>{message}</p>
        )}
      </div>

      {loading && <LoadingCircle></LoadingCircle>}

      {logs.length > 0 && <LogsLayout logs={logs}></LogsLayout>}
      <p className='text-violet-200 text-center w-full'>Made with 💜 by paku</p>
    </div>
  )
}
