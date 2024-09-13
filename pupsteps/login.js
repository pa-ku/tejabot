export async function login(page, addLog, email, password) {
  try {
    addLog('🔒 Logeando...')
    await page.type('input[id="inputEmail"]', email)
    await page.type('input[id="inputPassword"]', password)
    await page.click('button[class="btn btn-primary block full-width m-b"]')
    addLog('✅ Login')
  } catch (err) {
    addLog('❌ No se pudo iniciar sesión...')
    throw new Error('No se pudo iniciar sesión: ' + err.message)
  }
}
