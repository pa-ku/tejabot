export async function checkLogin(page, addLog) {
  const failedLogin = await page.$('div[class="alert alert-danger"]')
  await new Promise((r) => setTimeout(r, 1000))

  if (failedLogin) {
    addLog('❌ Usuario no registrado')
    throw new Error('Usuario no registrado.')
  }
}
