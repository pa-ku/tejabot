export async function fillForm(page, addLog, dniInvitado) {
  try {
    addLog('Llenando el formulario...')
    await page.click('input[id="input-dni"]')
    await page.type('input[id="input-dni"]', dniInvitado)

    const userAlreadyUsed = await page.$('div[id="alert-invitado"]')
    await new Promise((r) => setTimeout(r, 1000))
    if (userAlreadyUsed) {
      const isHidden = await page.evaluate((element) => {
        return window.getComputedStyle(element).display === 'none'
      }, userAlreadyUsed)

      if (isHidden) {
        addLog('✅ Persona invitada')
        addLog('✅ Confirmando la reserva...')
      } else {
        addLog('❌ La persona ya fue invitada esta semana')
        throw new Error('El usuario ya fue invitado por otra persona')
      }
    } else {
      addLog('✅ Persona invitada')
    }
  } catch (err) {
    addLog('❌ No se pudo llenar el formulario')
    throw new Error('Error al llenar el formulario: ' + err.message)
  }
}
