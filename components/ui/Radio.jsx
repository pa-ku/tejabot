export default function Radio({
  name,
  children,
  value,
  onChange,

  actualDays,
  defaultChecked,
}) {
  return (
    <>
      <div className=' group flex items-center relative justify-center'>
        <input
          onChange={onChange}
          name={name}
          className='hover:brightness-110 cursor-pointer w-full   absolute h-full appearance-none peer  '
          value={value}
          type={'radio'}
          defaultChecked={defaultChecked}
        />
        <p
          className={`${
            actualDays && 'bg-gray-900 '
          } text-sm w-full text-center duration-200  border-2 font-bold  bg-gray-800 rounded-xl peer-checked:bg-[#55163a] peer-checked:border-[#cc187e]  border-gray-700 px-4 text-white py-3 cursor-pointer `}
        >
          {children}
        </p>
      </div>
    </>
  )
}
