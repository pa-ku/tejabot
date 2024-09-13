export async function chooseDay(page, addLog, dia) {
  try {
    addLog('🔍 Buscando el dia...')
    const daySelector = `#li-dia-${dia} a`
    await page.waitForSelector(daySelector)
    await page.click(daySelector)
    addLog('✅ Dia elegido')
  } catch (err) {
    addLog(`❌ No se encontro el dia elegido`)
    throw new Error('No se pudo seleccionar el día')
  }
}
