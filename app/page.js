import Reserva from '@/components/Reserva'
import { ReserveProvider } from '@/context/ReserveContext'
import { TimeProvider } from '@/context/TimeContext'
export default function Home() {
  return (
    <>
      <TimeProvider>
        <ReserveProvider>
          <main className='pt-10 pb-10 flex w-full h-full items-center justify-center'>
            <Reserva></Reserva>
          </main>
        </ReserveProvider>
      </TimeProvider>
    </>
  )
}
