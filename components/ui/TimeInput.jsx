export default function TimeInput({ value, title, onChange, placeholder }) {
  return (
    <>
      <input
        className='font-bold placeholder:text-pink-200  text-center hover:brightness-110 w-full text-white bg-[var(--primary-500)] p-2 rounded-xl '
        type='number'
        value={value}
        title={title}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  )
}
