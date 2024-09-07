export default function LogsLayout({logs}) {
  return (
    <>
      <div className='border-2 duration-500 animate-opacity space-y-1 border-gray-600 text-white bg-gray-900 p-3 w-full rounded-lg'>
        {logs &&
          logs.map((log, index) => (
            <p
              className={`${log.includes('❌') && 'text-red-400'} ${
                log.includes('✅') && 'text-green-300'
              }`}
              key={log}
            >
              <span className='text-gray-600'>{index}:</span> {log}
            </p>
          ))}
      </div>
    </>
  )
}
