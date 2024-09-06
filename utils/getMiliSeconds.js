export const getMillisecondsUntil = (targetHour, targetMinute) => {
  const now = new Date()
  const targetTime = new Date()

  targetTime.setHours(targetHour, targetMinute, 0, 0)

  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1)
  }

  return targetTime - now
}
