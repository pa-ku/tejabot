export const getMillisecondsUntil = (targetHour, targetMinute) => {
  const now = new Date()
  const targetTime = new Date()

  targetTime.setHours(targetHour, targetMinute, 0, 0) // Establece la hora objetivo

  if (now > targetTime) {
    // Si la hora objetivo ya pasó hoy, establece la hora objetivo para el próximo día
    targetTime.setDate(targetTime.getDate() + 1)
  }

  return targetTime - now // Devuelve la diferencia en milisegundos
}
