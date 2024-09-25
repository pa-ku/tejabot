export async function chooseDay({ page, dia }) {
  try {
    const daySelector = `#li-dia-${dia} a`
    await page.waitForSelector(daySelector)
    await page.click(daySelector)
    console.log('Choose day 🆗')
  } catch (error) {
    console.log('error choose day ' + error)
    throw new Error(`Error al seleccionar el día  ${error.message}`)
  }
}
