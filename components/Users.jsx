'use client'
import { useState } from 'react'
import Button from './ui/Button'
import useLocalStorage from 'use-local-storage'
import MsjStatus from './MsjStatus'
import { dataUsers } from '@/data'

export default function Users({ setPostData, postData }) {
  const [showUsers, setShowUsers] = useState(false)
  const [userAccounts, setUserAccounts] = useLocalStorage('users', [])
  const [msj, setMsj] = useState('')
  const [loadUsersCounter, setLoadUsersCounter] = useState(5)

  function handleSaveUser() {
    const { email, password, dniInvitado } = postData

    if (email == '') {
      setMsj('Error: Rellena el email')
      return
    }
    if (password == '') {
      setMsj('Error: Rellena la password')
      return
    }
    if (dniInvitado == '') {
      setMsj('Error: Rellena el dni del invitado')
      return
    }

    setMsj('Usuario guardado')
    const newUser = {
      email: email,
      password: password,
      dniInvitado: dniInvitado,
    }

    setUserAccounts((prevAccounts) => [...prevAccounts, newUser])

    setPostData((prev) => ({
      ...prev,
      email: '',
      password: '',
      dniInvitado: '',
    }))
  }
  function handleDeleteUser(index) {
    setMsj('Usuario eliminado')
    setUserAccounts((prevAccounts) =>
      prevAccounts.filter((_, i) => i !== index)
    )
  }

  function handleSelectedUser({ email, password, dniInvitado }) {
    setShowUsers(false)
    setMsj('Usuario Cargado')
    setPostData((prev) => ({
      ...prev,
      email: email,
      password: password,
      dniInvitado: dniInvitado,
    }))
  }

  function handleLoadUser() {
    setLoadUsersCounter((prev) => prev - 1)
    if (loadUsersCounter === 0) {
      setUserAccounts(dataUsers)
      setMsj('Usuarios de pablo cargados')
    }
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
        <button
          className='text-lg text-start text-white w-full font-bold'
          onClick={handleLoadUser}
        >
          Usuario
        </button>
        <p className='description'>
          Los datos guardados se almacenan localmente
        </p>

        <span className=' relative w-full'>
          <Button onClick={handleShowUsers}>Usuarios</Button>

          {showUsers && (
            <>
              <div className='duration-300 p-1 bg-gray-800 absolute z-10 w-full rounded-md gap-10'>
                {userAccounts.map(({ email, password, dniInvitado }, index) => (
                  <div key={index} className='items-center h-full w-full flex'>
                    <button
                      onClick={() =>
                        handleSelectedUser({ email, password, dniInvitado })
                      }
                      className='h-full rounded-l-md bg-gray-700 hover:brightness-110 p-2 pl-3 text-start w-full text-white '
                    >
                      {email}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(index)}
                      className='font-bold m-1 hover:bg-red-300  rounded-r-md p-2 bg-red-400'
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
            value={postData.email}
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <Input
            placeholder='Password'
            value={postData.password}
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <Input
            value={postData.dniInvitado}
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                dniInvitado: e.target.value,
              }))
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
            setPostData((prev) => ({
              ...prev,
              email: '',
              password: '',
              dniInvitado: '',
            }))
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
