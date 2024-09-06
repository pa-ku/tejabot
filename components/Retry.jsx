import Checkbox from './ui/Checkbox'
import TimeInput from './ui/TimeInput'

export default function Retry({
  setIsRetry,
  isRetry,
  retryConfig,
  setRetryConfig,
}) {
  return (
    <>
      <section className='w-full h-32 '>
        <Checkbox
          checked={isRetry}
          value={isRetry}
          onChange={() => setIsRetry(!isRetry)}
        >
          Activar Reintentos
        </Checkbox>
        {isRetry ? (
          <div className='p-4 flex gap-2 items-center justify-center'>
            <label className='text-white '>
              Segundos
              <TimeInput
                onChange={(e) =>
                  setRetryConfig((prev) => ({ ...prev, time: e.target.value }))
                }
                value={retryConfig.time}
                type='text'
                placeholder='Tiempo'
              />
            </label>
            <label className='text-white'>
              Intentos
              <TimeInput
                onChange={(e) =>
                  setRetryConfig((prev) => ({
                    ...prev,
                    nOfRetry: e.target.value,
                  }))
                }
                value={retryConfig.nOfRetry}
                type='text'
                placeholder='Intentos'
              />
            </label>
          </div>
        ) : (
          <p className='description'>
            Permite intentar nuevamente la reserva en el tiempo y cantidad de
            intentos indicados
          </p>
        )}
      </section>
    </>
  )
}
