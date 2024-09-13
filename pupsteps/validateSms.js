export async function validateSms() {
  addLog('📱 Validando sms...')
  await page.click('input[id="validate_sms_validation_code"]')
  await page.type('input[id="validate_sms_validation_code"]', smsCode)
  await page.click('button[id="validate_sms_guardar"]')
}
