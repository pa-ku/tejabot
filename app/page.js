import Reserva from '@/components/Reserva'
import { TimeProvider } from '@/context/TimeContext'
export default function Home() {
  return (
    <>
      <TimeProvider>
        <main className='pt-10 pb-10 flex w-full h-full items-center justify-center'>
          <Reserva></Reserva>
        </main>
      </TimeProvider>
    </>
  )
}
