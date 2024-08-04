export default function Title({ children }) {
  return (
    <>
      <div
        className='relative
     flex h-max w-full items-center justify-center
      overflow-hidden rounded-xl  p-0.5'
      >
        <div
          className='flex h-full w-full 
    items-center py-8 rounded-xl justify-center 
     bg-gradient-to-t from-[#231a44] to-[#161128] mix-blend-darken'
        >
          <p className='font-extrabold text-center w-full text-5xl text-white'>
            {children}
          </p>
        </div>

        <span
          className='animate-rotation -z-10
    absolute h-96 w-96 animate-spin 
     bg-gradient-to-r
    from-[#ffb731] to-[#f72a9e] '
        ></span>
      </div>
    </>
  )
}
