import puppeteer from 'puppeteer'
/* import chromium from '@sparticuz/chromium' */
import { confirmAlert } from '@/utils/confirmAlert'
export async function POST(req) {
  let browser
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { email, password, dni, dia, cancha, hora } = await req.json()

    browser = await puppeteer.launch({
      headless: false,
      slowMo: 20,
      /*     args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless, */
    })

    const page = await browser.newPage()
    await confirmAlert(page)

    try {
      await page.goto('https://reservar.serviciosmerlo.online/login')
    } catch (error) {
      throw new Error('No se pudo acceder a la página de inicio de sesión')
    }

    // Completa el formulario de inicio de sesión
    try {
      await page.type('input[id="inputEmail"]', email)
      await page.type('input[id="inputPassword"]', password)
      await page.click('button[class="btn btn-primary block full-width m-b"]')
    } catch (error) {
      throw new Error('No se pudo completar el formulario de inicio de sesión')
    }

    // Navega a las reservas
    try {
      await page.waitForSelector('a[href="#"]')
      await page.click('a[href="#"]')
      await page.waitForSelector(
        '#side-menu > li:nth-child(4) > ul > li:first-child > a'
      )
      await page.click('#side-menu > li:nth-child(4) > ul > li:first-child > a')
    } catch (error) {
      throw new Error('No se pudo navegar a la sección de reservas')
    }

    // Selecciona el día
    try {
      const daySelector = `#li-dia-${dia} a`
      await page.waitForSelector(daySelector)
      await page.click(daySelector)
    } catch (error) {
      throw new Error('No se pudo seleccionar el día' + dia)
    }

    // Intenta seleccionar un horario de los disponibles
    let horarioEncontrado = false
    for (const horario of hora) {
      try {
        const horarioSelector = `#grid-predios-${dia} > div:nth-child(${cancha}) > div > ul`
        await page.waitForSelector(horarioSelector, { timeout: 5000 })

        const listaHorarios = await page.$$(horarioSelector + ' > li')

        for (let item of listaHorarios) {
          const text = await page.evaluate((el) => el.textContent, item)

          if (text.includes(horario)) {
            const aTag = await item.$('a.alert-link')
            if (aTag) {
              await aTag.click()
              horarioEncontrado = true
              break
            }
          }
        }

        if (horarioEncontrado) break
      } catch (error) {
        console.error('Error al intentar seleccionar el horario:', error)
        // Continúa con el siguiente horario en caso de error
      }
    }

    if (!horarioEncontrado) {
      throw new Error('Ninguno de los horarios disponibles pudo ser reservado')
    }

    // Completa el formulario de reserva

    try {
    } catch (error) {}

    try {
      await page.click('input[id="input-dni"]')
      await page.type('input[id="input-dni"]', dni)
      await new Promise((r) => setTimeout(r, 1000))
    } catch (error) {
      console.error('Error al completar el formulario de reserva:', error)
      throw new Error('No se pudo completar el formulario de reserva')
    }
    try {
      await page.click('button[id="btn-id-persona"]')
      await page.click('button[id="btn-id-reserva"]')
      await new Promise((r) => setTimeout(r, 500))
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
