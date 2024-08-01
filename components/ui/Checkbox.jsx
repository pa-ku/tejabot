export default function Checkbox({ children, value, onClick,array }) {
  return (
    <>
      <div className='flex items-center relative justify-center'>
        <input
          onClick={onClick}
          checked={array.includes(value)}
          className='hover:brightness-110 cursor-pointer w-full absolute h-full appearance-none peer  '
          value={value}
          type='checkbox'
        />
        <p className=' w-full text-center duration-200 peer-checked:text-green-200  border-2 font-bold  bg-[#55163a] rounded-xl peer-checked:bg-emerald-950 peer-checked:border-green-800 border-[#cc187e] text-white py-3 cursor-pointer '>
          {children}
        </p>
      </div>
    </>
  )
}
