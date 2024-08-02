'use client'
import { useState } from 'react'
import Button from './ui/Button'
import useLocalStorage from 'use-local-storage'
import MsjStatus from './MsjStatus'

export default function Users({ setUserReserva, userReserva }) {
  const [showUsers, setShowUsers] = useState(false)
  const [userAccounts, setUserAccounts] = useLocalStorage('users', [])
  const [msj, setMsj] = useState('')

  function handleSaveUser() {
    const { email, password, invitado } = userReserva

    if (email == '') {
      setMsj('Error: Rellena el email')
      return
    }
    if (password == '') {
      setMsj('Error: Rellena la password')
      return
    }
    if (invitado == '') {
      setMsj('Error: Rellena el dni del invitado')
      return
    }

    setMsj('Usuario guardado')
    const newUser = {
      email: email,
      password: password,
      invitado: invitado,
    }

    setUserAccounts((prevAccounts) => [...prevAccounts, newUser])

    setUserReserva({
      email: '',
      password: '',
      invitado: '',
    })
  }
  function handleDeleteUser(index) {
    setMsj('Usuario eliminado')
    setUserAccounts((prevAccounts) =>
      prevAccounts.filter((_, i) => i !== index)
    )
  }

  function handleSelectedUser({ email, password, invitado }) {
    setShowUsers(false)
    setMsj('Usuario Cargado')
    setUserReserva({
      email: email,
      password: password,
      invitado: invitado,
    })
  }

  function handleShowUsers() {
    if (userAccounts.length < 1) {
      setMsj('Error: No hay usuarios guardados')
      return
    }
    setShowUsers(!showUsers)
  }
  return (
    <>
      <section className='flex w-full flex-col items-center gap-2 justify-center'>
        <h2>Usuario</h2>
        <p className='description'>
          Los datos guardados se almacenan localmente
        </p>

        <span className=' relative w-full'>
          <Button onClick={handleShowUsers}>Usuarios</Button>

          {showUsers && (
            <>
              <div className=' p-1 bg-gray-800 absolute z-10 w-full rounded-md gap-10'>
                {userAccounts.map(({ email, password, invitado }, index) => (
                  <div key={index} className='items-center h-full w-full flex'>
                    <button
                      onClick={() =>
                        handleSelectedUser({ email, password, invitado })
                      }
                      className='h-full rounded-l-md bg-gray-700 hover:brightness-110 p-2 pl-3 text-start w-full  text-white '
                    >
                      {email}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(index)}
                      className='m-1 hover:bg-red-300  rounded-r-md p-2 bg-red-400'
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </span>

        <div className='w-full flex flex-col pt-5 gap-2'>
          <Input
            placeholder='Email'
            value={userReserva.email}
            onChange={(e) =>
              setUserReserva({
                ...userReserva,
                email: e.target.value,
              })
            }
          />
          <Input
            placeholder='Password'
            value={userReserva.password}
            onChange={(e) =>
              setUserReserva({
                ...userReserva,
                password: e.target.value,
              })
            }
          />
          <Input
            value={userReserva.invitado}
            onChange={(e) =>
              setUserReserva({
                ...userReserva,
                invitado: e.target.value,
              })
            }
            placeholder='Dni Del Invitado'
          />
        </div>

        <Button color={'bg-[var(--primary-300)]'} onClick={handleSaveUser}>
          Guardar Usuario
        </Button>
        <Button
          color={'bg-gray-800'}
          onClick={() =>
            setUserReserva({
              email: '',
              password: '',
              invitado: '',
            })
          }
        >
          Limpiar
        </Button>

        {msj && <MsjStatus message={msj}>{msj}</MsjStatus>}
      </section>
    </>
  )
}

export function Input({ placeholder, value, onChange }) {
  return (
    <>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='placeholder:text-[#c0478c] hover:brightness-110 w-full py-3 bg-[#55163a] border border-[#cc187e] text-white  p-2 rounded-xl'
      />
    </>
  )
}
