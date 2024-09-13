export async function checkResult(page, addLog) {
  try {
    addLog('Leyendo el popup...')
    const paragraphText = await page.$eval(
      'p[style="display: block;"]',
      (el) => el.textContent
    )
    addLog(`❌ Error: ${paragraphText}`)
    throw new Error(paragraphText)
  } catch (error) {
    throw new Error(`Error al comprobar el resultado: ${error}`)
  }
}
