export default function ReservarBtn({
  onClick,
  disabled,
  alarmActive,
}) {
  return (
    <>
      {!alarmActive && <button
        className={`text-xl duration-300 hover:brightness-110  w-full slick-button p-3 py-4 rounded-lg uppercase text-white space `}
        onClick={onClick}
        disabled={disabled}
      >
        Reservar
      </button>}
    </>
  )
}
