export default function ReservarBtn({
  onClick,
  disabled,
  alarmActive,
  timerValue,
  loading,
}) {
  return (
    <>
      <button
        className={`${
          alarmActive && 'pointer-events-none'
        } text-xl duration-300 hover:brightness-110  w-full slick-button p-3 py-4 rounded-lg uppercase text-yellow-200 `}
        onClick={onClick}
        disabled={disabled}
      >
        {!loading && !alarmActive && 'Reservar'}
        {(loading && 'Reservando') ||
          (alarmActive && `Esperando hasta ${timerValue}`)}
      </button>
    </>
  )
}
