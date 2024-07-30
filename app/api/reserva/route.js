import puppeteer from 'puppeteer-core'
import { confirmAlert } from '@/utils/confirmAlert'

// Función para manejar el método POST
export async function POST(req) {
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { email, password, dni, dia, cancha, hora } = await req.json()

    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await confirmAlert(page)
    await page.goto('https://reservar.serviciosmerlo.online/login')

    // Completa el formulario de inicio de sesión
    await page.type('input[id="inputEmail"]', email)
    await page.type('input[id="inputPassword"]', password)
    await page.click('button[class="btn btn-primary block full-width m-b"]')

    // Navega a las reservas
    await page.waitForSelector('a[href="#"]')
    await page.click('a[href="#"]')
    await page.click('#side-menu > li:nth-child(4) > ul > li:first-child > a')

    // Selecciona el día
    const daySelector = `#li-dia-${dia} a`
    await page.waitForSelector(daySelector)
    await page.click(daySelector)

    // Selecciona el horario
    const horarioSelector = `#grid-predios-${dia} > div:nth-child(${cancha}) > div > ul`
    await page.waitForSelector(horarioSelector)

    const listaHorarios = await page.$$(horarioSelector + ' > li')

    for (let item of listaHorarios) {
      const text = await page.evaluate((el) => el.textContent, item)

      if (text.includes(hora)) {
        const aTag = await item.$('a.alert-link')
        if (aTag) {
          await aTag.click()
          break
        }
      }
    }

    // Completa el formulario de reserva
    await page.click('input[id="input-dni"]')
    await page.type('input[id="input-dni"]', dni)

    await page.click('button[id="btn-id-persona"]')
    await page.click('button[id="btn-id-reserva"]')

    await new Promise((r) => setTimeout(r, 1500))
    await page.click('button[id="btn-id-persona"]')
    await page.click('button[id="btn-id-reserva"]')
    await new Promise((r) => setTimeout(r, 1000))

    await page.screenshot({ path: `reserva.png` })
    await browser.close()

    return new Response(
      JSON.stringify({ message: 'Reserva realizada con éxito' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error al realizar la reserva:', error)
    return new Response(
      JSON.stringify({ message: 'Error al realizar la reserva' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
