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
import moment from 'moment-timezone'
import { useReserveContext } from '@/context/ReserveContext'


export default function ReservaButton() {
  const { hasAlarm, timerValue, setAlarmActive, targetTime, alarmActive } =
    useContext(TimeContext)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [postData, setPostData] = useState({
    email: '',
    password: '',
    dniInvitado: '',
  })
  const { dia, cancha } = useReserveContext()
  const [horarios, setHorarios] = useState(['19:00 - 20:00'])
  const fetchCounterRef = useRef(0)
  const [logs, setLogs] = useState([])
  const [currentTime, setCurrentTime] = useState()
  const [timeLeft, setTimeLeft] = useState('')
  const launchMp3 = new Audio('/launch.mp3')


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
    const interval = setInterval(() => {
      const currentTime = moment()
        .tz('America/Argentina/Buenos_Aires')
        .format('HH:mm:ss')
      setCurrentTime(currentTime)
      // Obtengo el momento actual con la zona horaria
      const currentMoment = moment().tz('America/Argentina/Buenos_Aires')
      // Convierto el timerValue (que debería estar en "HH:mm:ss") a objeto moment
      let timerMoment = moment(timerValue, 'HH:mm:ss')

      // Si el timer ya pasó hoy, asumimos que es para mañana
      if (timerMoment.isBefore(currentMoment)) {
        timerMoment.add(1, 'day')
      }

      // Calculo la diferencia en milisegundos
      const diffMs = timerMoment.diff(currentMoment)
      // Transformo la diferencia a una duración
      const duration = moment.duration(diffMs)

      const horas = duration.hours()
      const minutos = duration.minutes()
      const segundos = duration.seconds()

      setTimeLeft(`Faltan ${horas}h ${minutos}m ${segundos}s`)

      // Si el currentTime coincide con el timerValue y el alarma está activa, ejecutamos la acción
      if (alarmActive && timerValue === currentMoment.format('HH:mm:ss')) {
        performReserva()
        launchMp3.play()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timerValue, alarmActive])


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
          dia: dia,
          cancha: cancha,
          hora: horarios,
          targetTime: targetTime,
          hasAlarm: hasAlarm
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
    if (horarios.length < 1) {
      return setMessage(' Selecciona al menos un horario')
    }
    if (hasAlarm) {
      setAlarmActive(true)
      setMessage('')
    } else {
      setMessage('')
      performReserva()
      launchMp3.play()
    }
  }

  return (
    <div className={` h-max w-full md:w-[22em] flex items-start flex-col gap-10`}>
      <p
        className='py-1 backdrop-blur-lg text-white font-bold drop-shadow-xl shadow- z-50  font-mono fixed bottom-0 h-max text-xl w-full left-0 top-0  text-center
        '
      >
        {currentTime}
      </p>
      <Title>
      </Title>
      <div
        className={`${(loading && 'pointer-events-none sepia') ||
          (alarmActive && 'pointer-events-none grayscale')
          } px-4 lg:px-0 duration-300   h-max flex items-start flex-col gap-10`}
      >

        <Court setPostData={setPostData}></Court>
        <ChooseDay />
        <ChooseTime
          setHorarios={setHorarios}
          handleHorario={handleHorario}
          horarios={horarios}
        />
        <Users setPostData={setPostData} postData={postData} />
        <Timer></Timer>
      </div>
      <div className='w-full px-4 space-y-2'>
        <ReservarBtn
          onClick={handleReserva}
          disabled={loading}
          alarmActive={alarmActive}
        ></ReservarBtn>

        {alarmActive && (
          <>
            <button
              type='button'
              className=' bg-red-950 rounded-lg text-red-400 border-2 border-red-900 w-full py-3 hover:brightness-110'
              onClick={() => setAlarmActive(false)}
            >
              Desactivar alarma
            </button>
            <p className='text-white'>
              {timeLeft}
            </p>
          </>
        )}



        {message && (
          <p className=' bg-red-950 p-2 rounded-lg text-white'>{message}</p>
        )}
      </div>

      {loading && <LoadingCircle></LoadingCircle>}

      {logs.length > 0 && <div className='w-full space-y-2'>
        <button className=' text-pink-400 rounded-lg ' onClick={() => setLogs([])}>Clear logs</button>
        <LogsLayout logs={logs}></LogsLayout>
      </div>
      }


      <p className='text-violet-200 opacity-50 text-center w-full'>Made with 💜 by paku</p>
    </div>
  )
}
