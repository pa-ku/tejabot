import puppeteer from 'puppeteer'

import { confirmAlert } from '@/utils/confirmAlert'

/*     args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true, */

/*   headless: false,
      slowMo: 10, */

export default async function POST(req) {
  let browser
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { email, password, dni, dia, cancha, hora } = await req.json()
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
    })

    const page = await browser.newPage()
    await confirmAlert(page)

    try {
      await page.goto('https://reservar.serviciosmerlo.online/login')
    } catch (error) {
      console.error('Error al cargar la página de inicio de sesión:', error)
      throw new Error('No se pudo acceder a la página de inicio de sesión')
    }

    // Completa el formulario de inicio de sesión
    try {
      await page.type('input[id="inputEmail"]', email)
      await page.type('input[id="inputPassword"]', password)
      await page.click('button[class="btn btn-primary block full-width m-b"]')
    } catch (error) {
      console.error(
        'Error al completar el formulario de inicio de sesión:',
        error
      )
      throw new Error('No se pudo completar el formulario de inicio de sesión')
    }

    // Navega a las reservas
    try {
      await page.waitForSelector('a[href="#"]', { timeout: 5000 })
      await page.click('a[href="#"]')
      await page.waitForSelector(
        '#side-menu > li:nth-child(4) > ul > li:first-child > a',
        { timeout: 5000 }
      )
      await page.click('#side-menu > li:nth-child(4) > ul > li:first-child > a')
    } catch (error) {
      console.error('Error al navegar a la sección de reservas:', error)
      throw new Error('No se pudo navegar a la sección de reservas')
    }

    // Selecciona el día
    try {
      const daySelector = `#li-dia-${dia} a`
      await page.waitForSelector(daySelector, { timeout: 5000 })
      await page.click(daySelector)
    } catch (error) {
      console.error('Error al seleccionar el día:', error)
      throw new Error('No se pudo seleccionar el día especificado')
    }

    // Selecciona el horario
    try {
      const horarioSelector = `#grid-predios-${dia} > div:nth-child(${cancha}) > div > ul`
      await page.waitForSelector(horarioSelector, { timeout: 5000 })

      const listaHorarios = await page.$$(horarioSelector + ' > li')

      let horarioEncontrado = false
      for (let item of listaHorarios) {
        const text = await page.evaluate((el) => el.textContent, item)

        if (text.includes(hora)) {
          const aTag = await item.$('a.alert-link')
          if (aTag) {
            await aTag.click()
            horarioEncontrado = true
            break
          }
        }
      }

      if (!horarioEncontrado) {
        throw new Error('Horario no disponible')
      }
    } catch (error) {
      console.error('Error al seleccionar el horario:', error)
      throw new Error('No se pudo seleccionar el horario especificado')
    }

    // Completa el formulario de reserva

    try {
    } catch (error) {}

    try {
      await page.click('input[id="input-dni"]')
      await page.type('input[id="input-dni"]', dni)
      await new Promise((r) => setTimeout(r, 1500))
    } catch (error) {
      console.error('Error al completar el formulario de reserva:', error)
      throw new Error('No se pudo completar el formulario de reserva')
    }
    try {
      await page.click('button[id="btn-id-persona"]')
      await page.click('button[id="btn-id-reserva"]')
      await new Promise((r) => setTimeout(r, 1500))
      await page.screenshot({ path: `reserva.png` })

      if (await page.type('button[class="confirm"]')) {
        throw new Error('Ya sacaste turno con esta ip')
      }
    } catch (err) {
      console.error('Ya sacaste turno con esta ip:', err)
      throw new Error('Ya sacaste turno con esta ip')
    }

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
    console.error('Error al realizar la reserva:', error.message)
    return new Response(
      JSON.stringify({
        message: error.message || 'Error al realizar la reserva',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
