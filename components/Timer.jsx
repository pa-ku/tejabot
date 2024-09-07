'use client'

import { TimeContext } from '@/context/TimeContext'
import { useContext } from 'react'

export default function Timer() {
  const { setHasAlarm, setTimerValue, hasAlarm } = useContext(TimeContext)

  const clockSvg = (
    <svg
      className={`duration-200 ${
        hasAlarm ? 'stroke-[var(--primary-100)] ' : ' stroke-white'
      }  `}
      width='44'
      height='44'
      viewBox='0 0 24 24'
      strokeWidth='2'
      fill='none'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 13m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
      <path d='M12 10l0 3l2 0' />
      <path d='M7 4l-2.75 2' />
      <path d='M17 4l2.75 2' />
    </svg>
  )

  return (
    <>
      <section className='flex flex-col '>
        <h2>Timer</h2>
        <p className='description'>
          Reservara a la hora especificada, si se desactiva reservara
          inmediatamente
        </p>

        <div className='h-16 flex items-center gap-3'>
          <span className='relative'>
            {clockSvg}
            <input
              onChange={() => setHasAlarm((prev) => !prev)}
              type='checkbox'
              className='hover:brightness-110 left-0 top-0 appearance-none cursor-pointer absolute w-full h-full'
            />
          </span>
          {hasAlarm && (
            <>
              <input
                className=' bg-[var(--primary-500)] px-4 py-2 rounded-xl text-white'
                type='time'
                defaultValue={'06:00'}
                onChange={(e) => setTimerValue(e.target.value)}
              />
            </>
          )}
        </div>
      </section>
    </>
  )
}
