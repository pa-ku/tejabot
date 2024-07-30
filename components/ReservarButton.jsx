'use client'

import { useState } from 'react'
import Title from './Title'

export default function ReservaButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [horaReserva, setHoraReserva] = useState('08:00 - 09:00')
  const [canchaReserva, setCanchaReserva] = useState(1)
  const [diaReserva, setDiaReserva] = useState(1)
  const [userReserva, setUserReserva] = useState({
    email: 'p4blo.kuhn@gmail.com',
    password: 'tejadito123',
    invitado: '12575504',
  })
  const [timer, setTimer] = useState(false)

  const [horas, setHoras] = useState(7)
  const [minutos, setMinutos] = useState(0)

  const cuentas = [
    {
      email: 'p4blo.kuhn@gmail.com',
      password: 'tejadito123',
      invitado: '12575504',
    },
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
  ]

  const handleReserva = async () => {
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
          dni: userReserva.invitado,
          dia: diaReserva,
          cancha: canchaReserva,
          hora: horaReserva,
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
  }

  return (
    <main className='w-80 flex items-start flex-col gap-5'>
      <Title></Title>

      <section className='flex w-full flex-col items-center justify-center'>
        <h2>Usuario</h2>
        <p className='description text-start w-full mb-2'>
          La contraseña del usuario ya se aplicara automaticamente, asi como el
          DNI de la "persona invitada"
        </p>
        <select
          className=' hover:brightness-110 text-violet-200 w-full py-3 bg-violet-950 border border-violet-500 text-white p-2 rounded-xl cursor-pointer'
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
      </section>
      <section className='flex w-full items-center flex-col justify-center gap-4'>
        <h2>Cancha</h2>
        <div className='w-full items-center justify-center flex gap-4'>
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
              className=' hover:brightness-110 peer-checked:text-[#ffe0f1] text-[#e0218c] peer-checked:bg-[#e0218c]  border-2 font-bold border-[#cc187e] rounded-xl bg-transparent px-4 py-3 cursor-pointer'
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
              className=' hover:brightness-110 peer-checked:text-[#ffe0f1]  border-2 font-bold text-[#e0218c] peer-checked:bg-[#e0218c]  border-[#cc187e] rounded-xl bg-transparent px-4 py-3 cursor-pointer'
            >
              Cancha II
            </label>
          </div>
        </div>
      </section>

      <section className='flex w-full flex-col items-center justify-center'>
        <h2>Día</h2>
        <select
          className=' hover:brightness-110 py-3 w-full  text-violet-200 bg-violet-950 border border-violet-500 p-2 rounded-xl cursor-pointer'
          onChange={(e) => setDiaReserva(e.target.value)}
          name=''
          id=''
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

      <section className='w-full flex flex-col items-center justify-center'>
        <h2>Horario</h2>
        <p className='description text-start w-full mb-2'>
          Si el horario ya fue tomado no se terminara de reservar la cancha
        </p>
        <select
          className=' hover:brightness-110 py-3 w-full text-violet-200 bg-violet-950 border border-violet-500  p-2 rounded-xl cursor-pointer'
          onChange={(e) => setHoraReserva(e.target.value)}
          name=''
          id=''
        >
          <option value='08:00 - 09:00'>8 - 9</option>
          <option value='09:00 - 10:00'>9 - 10</option>
          <option value='10:00 - 11:00'>10 - 11</option>
          <option value='11:00 - 12:00'>11 - 12</option>
          <option value='12:00 - 13:00'>12 - 13</option>
          <option value='13:00 - 14:00'>13 - 14</option>
          <option value='14:00 - 15:00'>14 - 15</option>
          <option value='15:00 - 16:00'>15 - 16</option>
          <option value='16:00 - 17:00'>16 - 17</option>
          <option value='17:00 - 18:00'>17 - 18</option>
          <option value='18:00 - 19:00'>18 - 19</option>
          <option value='19:00 - 20:00'>19 - 20</option>
        </select>
      </section>

      <section className='flex flex-col '>
        <h2>Timer</h2>
        <p className='description'>
          Ejecutara el codigo a la hora especificada, si se desactiva se
          ejecutara inmediatamente
        </p>

        <div className='h-16 flex items-center gap-3'>
          <input
            type='checkbox'
            onChange={() => setTimer(!timer)}
            className='relative flex h-6 w-12
  cursor-pointer appearance-none items-center rounded-xl
  bg-white duration-200 before:pointer-events-none 
  before:absolute before:h-4 before:w-4 before:translate-x-1
  before:rounded-xl before:bg-violet-500 
  before:duration-200 checked:bg-violet-500 
  checked:shadow-center checked:shadow-violet-700 
  checked:before:translate-x-7 checked:before:bg-white'
          />

          {timer && (
            <>
              <input
                className='text-center hover:brightness-110 w-16 text-violet-200 bg-violet-950 border border-violet-500  p-2 rounded-xl '
                type='number'
                placeholder='Hr'
                value={horas}
                title='horas'
                onChange={(e) => setHoras(e.target.value)}
              />
              <input
                className='text-center hover:brightness-110  w-16 text-violet-200 bg-violet-950 border border-violet-500  p-2 rounded-xl '
                type='number'
                value={minutos}
                title='minutos'
                onChange={(e) => setMinutos(e.target.value)}
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
        {loading ? 'Reservando...' : 'Reservar'}
      </button>

      {loading && (
        <div className='w-full flex items-center justify-center'>
          <div class='loader'></div>
        </div>
      )}
      {message && (
        <div className=' text-red-200 w-80 border-red-200 rounded-xl flex bg-red-950 break-words  border p-2'>
          {' '}
          <p className=' text-bold '>{message}</p>
        </div>
      )}
    </main>
  )
}
