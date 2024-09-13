export async function makeReservation(page, addLog) {
  try {
    await confirmAlert(page)
    await new Promise((r) => setTimeout(r, 1000))
    await page.click('button[id="btn-id-persona"]')
    await page.click('button[id="btn-id-reserva"]')
    await new Promise((r) => setTimeout(r, 1000))
    addLog('✅ Formulario Llenado')
  } catch (err) {
    addLog('❌ Error al rellenar el formolario')
    throw new Error('Error al realizar la reserva: ' + err.message)
  }
}
