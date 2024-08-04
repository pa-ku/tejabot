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
        <Checkbox checked={isRetry} value={isRetry} onChange={() => setIsRetry(!isRetry)}>
          Activar Reintentos
        </Checkbox>
        {isRetry ? (
          <div className='p-4 flex gap-2 items-center justify-center'>
            <TimeInput
              onChange={(e) =>
                setRetryConfig((prev) => ({ ...prev, time: e.target.value }))
              }
              value={retryConfig.time}
              type='text'
              placeholder='Tiempo'
            />
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
          </div>
        ) : (
          <p className='description'>
            Permite intentar nuevamente cada 5minutos si no se encuentra el
            turno, hasta un maximo de 3 veces
          </p>
        )}
      </section>
    </>
  )
}
