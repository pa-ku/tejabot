export default function Checkbox({ name, children, value, onChange, array }) {
  return (
    <>
      <div className='flex items-center relative justify-center'>
        <input
          onChange={onChange}
          name={name}
          checked={array && array.includes(value)}
          className=' cursor-pointer w-full  absolute h-full appearance-none peer  '
          value={value}
          type={'checkbox'}
        />
        <p className='text-sm w-full text-center duration-200  border-2 font-bold  bg-gray-800 rounded-xl peer-checked:bg-[#55163a] peer-checked:border-[#cc187e]  border-gray-700 px-4 text-white py-3 cursor-pointer '>
          {children}
        </p>
      </div>
    </>
  )
}
