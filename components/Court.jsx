'use client'

import Radio from './ui/Radio'

export default function Court({ setPostData }) {
  return (
    <>
      <section className='flex w-full items-start flex-col justify-start gap-1'>
        <h2>Cancha</h2>
        <div className=' w-full items-start justify-start flex gap-3'>
          <Radio
            defaultChecked
            value={3}
            name='cancha'
            type={'radio'}
            onChange={(e) => setPostData((prev) => ({ ...prev, cancha: 3 }))}
          >
            1+2
          </Radio>
          <Radio
            value={1}
            name='cancha'
            type={'radio'}
            onChange={(e) => setPostData((prev) => ({ ...prev, cancha: 1 }))}
          >
            1
          </Radio>
          <Radio
            value={2}
            name='cancha'
            type={'radio'}
            onChange={(e) => setPostData((prev) => ({ ...prev, cancha: 2 }))}
          >
           2
          </Radio>


        </div>
      </section>
    </>
  )
}
