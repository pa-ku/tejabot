export async function checkReservation(page, addLog) {
  try {
    addLog('Verificando si ya hay una reserva...')
    const checkAlreadyReserve = await page
      .waitForSelector('div[class="modal inmodal in"]', {
        timeout: 1500,
      })
      .catch(() => null)
    if (checkAlreadyReserve) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}
