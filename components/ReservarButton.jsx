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
      const response = await fetch('http://localhost:3000/api/reserva', {
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
    <div className=' flex items-start flex-col gap-5'>
      <Title></Title>

      <section className='flex w-full flex-col items-center justify-center'>
        <h2>Usuario</h2>
        <select
          className=' w-full py-3 bg-violet-950 border border-violet-500 text-white p-2 rounded-xl cursor-pointer'
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
      <section className='flex items-center flex-col justify-center gap-4'>
        <h2>Cancha</h2>
        <div className='flex gap-5'>
          <div className='h-10'>
            <input
              id='cancha1'
              className='peer appearance-none'
              onClick={(e) => setCanchaReserva(e.target.value)}
              value={1}
              name='cancha'
              type='radio'
              defaultChecked
            />
            <label
              htmlFor='cancha1'
              className=' peer-checked:text-yellow-200 peer-checked:bg-yellow-950 border border-yellow-500 text-yellow-400 rounded-xl bg-transparent px-4 py-3 cursor-pointer'
            >
              Cancha 1
            </label>
          </div>
          <div className='h-10'>
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
              className='peer-checked:text-yellow-200 peer-checked:bg-yellow-950 border border-yellow-500 text-yellow-500 rounded-xl bg-transparent px-4 py-3 cursor-pointer'
            >
              Cancha 2
            </label>
          </div>
        </div>
      </section>

      <section className='flex w-full flex-col items-center justify-center'>
        <h2>Dia</h2>
        <select
          className='py-3 w-full bg-violet-950 border border-violet-500 text-white p-2 rounded-xl cursor-pointer'
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
        <select
          className='py-3 w-full bg-violet-950 border border-violet-500 text-white p-2 rounded-xl cursor-pointer'
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

      <button
        className='w-full slick-button p-3 rounded-xl uppercase text-white'
        onClick={handleReserva}
        disabled={loading}
      >
        {loading ? 'Reservando...' : 'Reservar'}
      </button>
      {message && <p className='text-red-200'>{message}</p>}
    </div>
  )
}
