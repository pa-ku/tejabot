'use client'

import Radio from './ui/Radio'

export default function Court({ fcCancha }) {
  return (
    <>
      <section className='flex w-full items-center flex-col justify-center gap-4'>
        <h2>Cancha</h2>
        <div className=' w-full items-center justify-center flex gap-3'>
          <Radio value={1} name='cancha' type={'radio'} $onClick={fcCancha}>
            C1
          </Radio>
          <Radio value={2} name='cancha' type={'radio'} $onClick={fcCancha}>
            C2
          </Radio>

          <Radio
            defaultChecked
            value={3}
            name='cancha'
            type={'radio'}
            $onClick={fcCancha}
          >
            Intentar Ambas
          </Radio>
        </div>
      </section>
    </>
  )
}
