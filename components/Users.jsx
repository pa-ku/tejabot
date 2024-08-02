'use client'
import { useState } from 'react'
import Button from './ui/Button'
import useLocalStorage from 'use-local-storage'

export default function Users({ setUserReserva, userReserva }) {
  const [showUsers, setShowUsers] = useState(false)
  const [userAccounts, setUserAccounts] = useLocalStorage('users', [
    {
      email: '',
      password: '',
      invitado: '',
    },
  ])
  const [msj, setMsj] = useState('')

  function handleSaveUser() {
    const { email, password, invitado } = userReserva

    if (email == '' || password == '' || invitado == '') {
      setMsj('Error: Rellena los campos antes de guardar')
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
  function handleDeleteUser(email) {
    setMsj('Usuario elminiado')
    setUserAccounts((prevAccounts) =>
      prevAccounts.filter((user) => user.email !== email)
    )
  }
  function handleSelectedUser({ email, password, invitado }) {
    setShowUsers(false)
    setMsj('Usuario cargado')
    setUserReserva({
      email: email,
      password: password,
      invitado: invitado,
    })
  }

  function handleShowUsers() {
    if (userAccounts.length < 1) {
      setMsj('No hay usuarios guardados')
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
              <div className='p-1 bg-gray-800 absolute z-10 w-full rounded-md gap-10'>
                {userAccounts.map(({ email, password, invitado }) => (
                  <>
                    <div className='items-center h-full w-full flex'>
                      <button
                        onClick={() =>
                          handleSelectedUser({ email, password, invitado })
                        }
                        className='h-full rounded-l-md bg-gray-700 hover:brightness-110 p-2 pl-3 text-start w-full  text-white '
                      >
                        {email}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(email)}
                        className='m-1 hover:bg-red-300  rounded-r-md p-2 bg-red-400'
                      >
                        ✕
                      </button>
                    </div>
                  </>
                ))}
              </div>
            </>
          )}
        </span>

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

        {msj && (
          <div
            className={`${
              msj.includes('Error')
                ? 'bg-red-950 text-red-200 border-red-500'
                : 'bg-green-950 text-green-200 border-green-500'
            } w-80  rounded-xl flex break-words border p-2`}
          >
            <p>{msj}</p>
          </div>
        )}
      </section>
    </>
  )
}
