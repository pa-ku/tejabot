export async function readReservation(page, addLog) {
  const reserva = await page.evaluate(() => {
    const fecha = document
      .querySelector('.modal-body b:nth-of-type(1)')
      .nextSibling.textContent.trim()
    const horario = document
      .querySelector('.modal-body b:nth-of-type(2)')
      .nextSibling.textContent.trim()

    const cancha = document
      .querySelector('.modal-body b:nth-of-type(4)')
      .nextSibling.textContent.trim()

    return {
      fecha,
      horario,
      cancha,
    }
  })
  addLog('✅ Ya tenes una reserva')
  addLog(`Fecha: ${reserva.fecha}`)
  addLog(`Horario: ${reserva.horario}`)
  addLog(`Cancha: ${reserva.cancha}`)
}
