export default function MsjStatus({ message, children }) {
  return (
    <>
      <div
        className={`${
          message.includes('Error')
            ? 'bg-red-950 text-red-200 border-red-800'
            : 'bg-green-950 text-green-200 border-green-800'
        } w-80  rounded-xl px-3 flex break-words border p-2`}
      >
        <p>{children}</p>
      </div>
    </>
  )
}
