import Radio from './ui/Radio'

export default function ChooseDay({ setPostData }) {
  const daysOfWeek = [
    { day: 'lunes', value: 1 },
    { day: 'martes', value: 2 },
    { day: 'miércoles', value: 3 },
    { day: 'jueves', value: 4 },
    { day: 'viernes', value: 5 },
    { day: 'sábado', value: 6 },
    { day: 'domingo', value: 7 },
  ]

  return (
    <>
      <section className='flex w-full flex-col items-center justify-center'>
        <h2>Día</h2>

        <div className=' columns-2 space-y-2 column-gap  w-full uppercase'>
          {daysOfWeek.map(({ day, value }) => (
            <Radio
              key={day}
              onChange={() => setPostData((prev) => ({ ...prev, dia: value }))}
              name={'date'}
              value={value}
            >
              {day}
            </Radio>
          ))}
        </div>
      </section>
    </>
  )
}
