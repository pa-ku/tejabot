'use client'

import { useEffect, useState } from 'react'
import Title from './Title'
import { getMillisecondsUntil } from '@/utils/getMiliSeconds'
import Checkbox from './ui/Checkbox'
import useLocalStorage from 'use-local-storage'
import Image from 'next/image'

export default function ReservaButton() {
  const today = new Date()
  const day = today.getDay()
  const nextDay = (day + 1) % 7

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [canchaReserva, setCanchaReserva] = useState(1)
  const [diaReserva, setDiaReserva] = useState(nextDay)
  const [horarios, setHorarios] = useState([])
  const [userReserva, setUserReserva] = useState({
    email: '',
    password: '',
    invitado: '',
  })
  const [hasAlarm, setHasAlarm] = useState(false)

  const [timerHr, setTimerHr] = useState(6)
  const [timerMin, setTimerMin] = useState(5)
  const [alarmActive, setAlarmActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

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

  const cuentas = [
    {
      email: '',
      password: '',
      invitado: '',
    },
    /*     {
      email: 'p4blo.kuhn@gmail.com',
      password: 'tejadito123',
      invitado: '12575504',
    }, */
    {
      email: 'agussisa@outlook.es',
      password: 'tejadito123',
      invitado: '36578219',
    },
    {
      email: 'natuvenitez@hotmail.com',
      password: 'tejadito12345',
      invitado: '14505937',
    },
    {
      email: 'gonzamafe@outlook.com',
      password: 'tejadito123',
      invitado: '14935382',
    },
  ]

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
      `De ${secondsUntilTarget} Para ejecutar a las ${timerHr}:${timerMin} PM...`
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
      <Title></Title>

      <section className='flex w-full flex-col items-center gap-2 justify-center'>
        <h2>Usuario</h2>
        <select
          className='hover:brightness-110 text-violet-200 w-full py-3 bg-violet-950 border border-violet-500  p-2 mb-5 rounded-xl cursor-pointer'
          onClick={(e) =>
            setUserReserva({
              email: e.target.options[e.target.selectedIndex].dataset.email,
              password: e.target.value,
              invitado:
                e.target.options[e.target.selectedIndex].dataset.invitado,
            })
          }
        >
          {cuentas.map((user) => (
            <>
              <option
                key={user.email}
                data-email={user.email}
                data-invitado={user.invitado}
                value={user.password}
              >
                {user.email}
              </option>
            </>
          ))}
        </select>
        <input
          type='text'
          placeholder='Email'
          value={userReserva.email}
          onChange={(e) =>
            setUserReserva({
              ...userReserva,
              email: e.target.value,
            })
          }
          className='placeholder:text-[#c0478c] hover:brightness-110 w-full py-3 bg-[#55163a] border border-[#cc187e] text-white  p-2 rounded-xl'
        />
        <input
          type='text'
          placeholder='Password'
          value={userReserva.password}
          onChange={(e) =>
            setUserReserva({
              ...userReserva,
              password: e.target.value,
            })
          }
          className='placeholder:text-[#c0478c] hover:brightness-110 w-full py-3 bg-[#55163a] border border-[#cc187e] text-white  p-2 rounded-xl'
        />
        <input
          type='text'
          value={userReserva.invitado}
          onChange={(e) =>
            setUserReserva({
              ...userReserva,
              invitado: e.target.value,
            })
          }
          placeholder='Dni Del Invitado'
          className='placeholder:text-[#c0478c] hover:brightness-110 w-full py-3 bg-[#55163a] border border-[#cc187e] text-white  p-2 rounded-xl'
        />
      </section>

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

      <section className=''>
        <h2>Horario</h2>
        <p className='description'>
          Elige los horarios en orden que se intentaran sacar, si no se
          encuentra uno disponible se intentara otro
        </p>
        <div className='grid grid-cols-3 gap-2 py-2'>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='08:00 - 09:00'
          >
            8 - 9
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='09:00 - 10:00'
          >
            9 - 10
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='10:00 - 11:00'
          >
            10 - 11
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='11:00 - 12:00'
          >
            11 - 12
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='12:00 - 13:00'
          >
            12 - 13
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='13:00 - 14:00'
          >
            13 - 14
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='14:00 - 15:00'
          >
            14 - 15
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='15:00 - 16:00'
          >
            15 - 16
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='16:00 - 17:00'
          >
            16 - 17
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='17:00 - 18:00'
          >
            17 - 18
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='18:00 - 19:00'
          >
            18 - 19
          </Checkbox>
          <Checkbox
            array={horarios}
            onClick={handleHorario}
            value='19:00 - 20:00'
          >
            19 - 20
          </Checkbox>
        </div>

        <button
          className='w-full text-violet-200 rounded-xl hover:bg-violet-900 bg-violet-950 py-2'
          onClick={() => setHorarios([])}
        >
          Reset
        </button>
        <div className='flex justify-center w-full flex-wrap gap-2'>
          {horarios.map((h) => (
            <p className=' bg-green-950 text-green-200 px-2 py-1  rounded-xl'>
              {h}
            </p>
          ))}
        </div>
      </section>
      <section className='flex w-full items-center flex-col justify-center gap-4'>
        <h2>Cancha</h2>
        <div className=' w-full items-center justify-center flex gap-5'>
          <div>
            <input
              id='cancha1'
              className='text-violet-200 peer appearance-none'
              onClick={(e) => setCanchaReserva(e.target.value)}
              value={1}
              name='cancha'
              type='radio'
              defaultChecked
            />
            <label
              htmlFor='cancha1'
              className='duration-200 hover:brightness-110 peer-checked:text-[#ffbae1]  border-2 font-bold text-[#ed3ba0] peer-checked:bg-[#55163a]  border-[#cc187e] rounded-xl bg-transparent px-4 py-3 cursor-pointer'
            >
              Cancha I
            </label>
          </div>
          <div>
            <input
              id='cancha2'
              className='peer appearance-none'
              onClick={(e) => setCanchaReserva(e.target.value)}
              value={2}
              name='cancha'
              type='radio'
            />
            <label
              htmlFor='cancha2'
              className='duration-200 hover:brightness-110 peer-checked:text-[#ff6fc0]  border-2 font-bold text-[#ed3ba0] peer-checked:bg-[#55163a]  border-[#cc187e] rounded-xl bg-transparent px-4 py-3 cursor-pointer'
            >
              Cancha II
            </label>
          </div>
        </div>
      </section>
      <section className='flex flex-col '>
        <h2>Timer</h2>
        <p className='description'>
          Reservara a la hora especificada, si se desactiva reservara
          inmediatamente
        </p>

        <div className='h-16 flex items-center gap-3'>
          <span className='relative'>
            {hasAlarm ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                class='icon icon-tabler icon-tabler-alarm-off'
                width='44'
                height='44'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='#ee52ff'
                fill='none'
                stroke-linecap='round'
                stroke-linejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M7.587 7.566a7 7 0 1 0 9.833 9.864m1.35 -2.645a7 7 0 0 0 -8.536 -8.56' />
                <path d='M12 12v1h1' />
                <path d='M5.261 5.265l-1.011 .735' />
                <path d='M17 4l2.75 2' />
                <path d='M3 3l18 18' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                class='icon icon-tabler icon-tabler-alarm'
                width='44'
                height='44'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='#fff'
                fill='none'
                stroke-linecap='round'
                stroke-linejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M12 13m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                <path d='M12 10l0 3l2 0' />
                <path d='M7 4l-2.75 2' />
                <path d='M17 4l2.75 2' />
              </svg>
            )}

            <input
              onChange={() => setHasAlarm(!hasAlarm)}
              type='checkbox'
              className='left-0 top-0 appearance-none cursor-pointer absolute w-full h-full'
            />
          </span>

          {hasAlarm && (
            <>
              <input
                className='text-center hover:brightness-110 w-16 text-violet-200 bg-violet-950  p-2 rounded-xl '
                type='number'
                placeholder='Hr'
                value={timerHr}
                title='horas'
                onChange={(e) => setTimerHr(e.target.value)}
              />
              <input
                className='text-center hover:brightness-110  w-16 text-violet-200 bg-violet-950   p-2 rounded-xl '
                type='number'
                value={timerMin}
                title='minutos'
                onChange={(e) => setTimerMin(e.target.value)}
                placeholder='Min'
              />
            </>
          )}
        </div>
      </section>

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
            {alarmActive && timeLeft} {message}
          </p>
        </div>
      )}
      {/*    <Image
        src='/reserva.png'
        width={500}
        height={500}
        alt='Picture of the author'
      /> */}
      <p className='text-violet-200 text-center w-full'>
        Made with 💜 by paku{' '}
      </p>
    </div>
  )
}
