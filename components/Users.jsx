'use client'
import { useState } from 'react'
import Button from './ui/Button'
import useLocalStorage from 'use-local-storage'
import MsjStatus from './MsjStatus'
import { dataUsers } from '@/data'
import { Trash, X } from 'lucide-react'

export default function Users({ setPostData, postData }) {
  const [showUsers, setShowUsers] = useState(false)
  const [userAccounts, setUserAccounts] = useLocalStorage('users', [])
  const [msj, setMsj] = useState('')
  const [loadUsersCounter, setLoadUsersCounter] = useState(5)
  const [isUsed, setIsUsed] = useLocalStorage('usedEmails', [])


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

  function handleIsUsed({ email }) {
    if (isUsed.includes(email)) {
      setIsUsed(prev => prev.filter(e => e !== email))
    }
    else {
      setIsUsed(prev => [...prev, email])
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
          className='text-lg text-start  text-white w-full font-bold'
          onClick={handleLoadUser}
        >
          Usuario
        </button>
        <p className='description'>
          Los datos guardados se almacenan localmente
        </p>
        <span className=' relative w-full'>
          <div className='flex gap-2 w-full justify-center'>

            <Button onClick={handleShowUsers}>Usuarios</Button>
            <Button color='bg-gray-700' onClick={handleSaveUser}>
              Guardar
            </Button>
            <Button
              color={'bg-gray-700'}
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
          </div>

          {showUsers && (
            <>
              <div className='duration-300  py-1  bg-gray-950 absolute z-10 w-full rounded-md gap-10'>
                {userAccounts.map(({ email, password, dniInvitado }, index) => (
                  <div
                    key={index}
                    className='p-1 items-center  justify-between h-full w-full flex'
                  >
                    <button
                      onClick={() =>
                        handleSelectedUser({ email, password, dniInvitado })
                      }
                      className={`${isUsed.includes(email) ? 'bg-red-800' : 'bg-gray-800'} h-full rounded-l-md hover:brightness-150 hover:text-violet-400 p-2 pl-3 text-start w-full text-md text-white`}
                    >
                      {email}
                    </button>
                    <div className='flex  bg-gray-800 h-full'>
                      <button
                        onClick={() => handleIsUsed({ email })}
                        className='font-bold  hover:brightness-150 bg-gray-900 h-full text-white p-2 '
                      >
                        <X size={20}></X>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(index)}
                        className='font-bold  h-full text-white hover:brightness-150 bg-gray-900 flex items-center justify-center p-2 '
                      >
                        <Trash size={20} ></Trash>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </>
          )}
        </span>

        <div className='w-full flex flex-col  gap-2'>
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
          {/*     <Input
            value={postData.codeVerification}
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                codeVerification: e.target.value,
              }))
            }
            placeholder='Codigo de verificación'
          /> */}
        </div>



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
        className='placeholder:text-[#c0478c] hover:brightness-110 w-full p-3 bg-[#55163a]   text-white  rounded-lg'
      />
    </>
  )
}
