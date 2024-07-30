export default function Title() {
  return (
    <>
      <div
        class='relative
     flex h-max w-max items-center justify-center
      overflow-hidden  p-0.5'
      >
        <div
          class='flex h-full w-full 
    items-center p-5 justify-center 
    bg-[#161128] mix-blend-darken'
        >
          <p className='w-full text-5xl text-white'>TejaHack</p>
        </div>

        <span
          class='animate-rotation -z-10
    absolute h-80 w-80 animate-spin 
     bg-gradient-to-r
    from-[#eaa221] to-[#e0218c]'
        ></span>
      </div>
    </>
  )
}
