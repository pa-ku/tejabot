import { useReserveContext } from '@/context/ReserveContext'
import Radio from './ui/Radio'

export default function ChooseDay() {
  const daysOfWeek = [
    { day: 'lunes', value: 1 },
    { day: 'martes', value: 2 },
    { day: 'miércoles', value: 3 },
    { day: 'jueves', value: 4 },
    { day: 'viernes', value: 5 },
    { day: 'sábado', value: 6 },
    { day: 'domingo', value: 7 },
  ]

  const { dia, setDia } = useReserveContext()
  return (
    <>
      <section className='flex w-full flex-col  items-center justify-center'>
        <h2>Día</h2>

        <div className='grid grid-cols-3 gap-2 w-full uppercase'>
          {daysOfWeek.map(({ day, value }) => (
            <Radio
              key={day}
              onChange={() => setDia(value)}
              name={'date'}
              value={value}
              defaultChecked={value === dia}
            >
              {day}
            </Radio>
          ))}
        </div>
      </section>
    </>
  )
}
