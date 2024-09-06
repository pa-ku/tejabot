export default function Button({ color, children, onClick }) {
  return (
    <>
      <button
        className={`${
          color ? color : 'bg-purple-900'
        } w-full text-white rounded-lg hover:brightness-110  py-2`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  )
}
