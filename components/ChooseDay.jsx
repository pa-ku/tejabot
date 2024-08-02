'use client'
import Radio from './ui/Radio'

export default function ChooseDay({ setDiaReserva, today, tomorrow }) {
  const daysOfWeek = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ]

  return (
    <>
      <section className='flex w-full flex-col items-center justify-center'>
        <h2>Día</h2>

        <div className='flex gap-2 uppercase'>
          <Radio
            onChange={() => setDiaReserva(today)}
            name={'date'}
            value={today}
          >
            {daysOfWeek[today]}
          </Radio>
          <Radio
            onChange={() => setDiaReserva(tomorrow)}
            defaultChecked
            name={'date'}
            value={tomorrow}
          >
            {daysOfWeek[tomorrow]}
          </Radio>
        </div>
      </section>
    </>
  )
}
