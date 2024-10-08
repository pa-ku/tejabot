'use client'
import Button from './ui/Button'
import Checkbox from './ui/Checkbox'

export default function ChooseTime({ horarios, handleHorario, setHorarios }) {
  const arrTime = [
    { name: '8 - 9', value: '08:00 - 09:00' },
    { name: '9 - 10', value: '09:00 - 10:00' },
    { name: '10 - 11', value: '10:00 - 11:00' },
    { name: '11 - 12', value: '11:00 - 12:00' },
    { name: '12 - 13', value: '12:00 - 13:00' },
    { name: '13 - 14', value: '13:00 - 14:00' },
    { name: '14 - 15', value: '14:00 - 15:00' },
    { name: '15 - 16', value: '15:00 - 16:00' },
    { name: '16 - 17', value: '16:00 - 17:00' },
    { name: '17 - 18', value: '17:00 - 18:00' },
    { name: '18 - 19', value: '18:00 - 19:00' },
    { name: '19 - 20', value: '19:00 - 20:00' },
  ]

  return (
    <>
      <section>
        <h2>Horarios</h2>
        <p className='description'>
          Elige los horarios en el orden que se intentaran sacar, si no se
          encuentra uno disponible se intentara otro
        </p>
        <div className='grid grid-cols-3 gap-2 py-2'>
          {arrTime.map(({ name, value }) => (
            <Checkbox
              key={value}
              checked={horarios.includes(value)}
              onChange={handleHorario}
              value={value}
            >
              {name}
            </Checkbox>
          ))}
        </div>

        <Button color={'bg-gray-800'} onClick={() => setHorarios([])}>
          Limpiar
        </Button>
        <div className='pt-2 flex justify-center w-full flex-wrap gap-1 '>
          {horarios.map((time) => (
            <p
              key={time}
              className='bg-violet-950 text-white px-4 py-1 rounded-md'
            >
              {time}
            </p>
          ))}
        </div>
      </section>
    </>
  )
}
