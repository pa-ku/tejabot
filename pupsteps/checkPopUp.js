export async function checkPopUp(page) {
  await new Promise((r) => setTimeout(r, 1000))
  const checkPopUp = await page.$(
    'div[class="sweet-alert showSweetAlert visible"]'
  )
  await new Promise((r) => setTimeout(r, 1000))
  if (checkPopUp) return true
  else return false
}
