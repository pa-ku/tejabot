export default function Title() {
  return (
    <>
      <div
        className='relative
     flex h-max w-full items-center justify-center
      overflow-hidden  p-0.5'
      >
        <div
          className='flex h-full w-full 
    items-center p-5 justify-center 
    bg-[#161128] mix-blend-darken'
        >
          <p className='text-center w-full text-5xl text-white'>TejaHack</p>
        </div>

        <span
          className='animate-rotation -z-10
    absolute h-96 w-96 animate-spin 
     bg-gradient-to-r
    from-[#eaa221] to-[#e0218c]'
        ></span>
      </div>
    </>
  )
}
