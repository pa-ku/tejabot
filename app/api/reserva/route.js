import { confirmAlert } from '@/utils/confirmAlert'
import puppeteerCore from 'puppeteer-core'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'
import { NextResponse } from 'next/server'

export async function POST(req) {
  let browser

  try {
    const requestBody = await req.json()
    console.log(requestBody)

    const { email, password, dniInvitado, dia, cancha, hora } = requestBody

    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 5,
      })
    } else {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      })
    }

    const page = await browser.newPage()

    try {
      await page.goto('https://reservar.serviciosmerlo.online/login')
    } catch (err) {
      throw new Error(
        'No se pudo navegar a https://reservar.serviciosmerlo.online/login'
      )
    }

    async function login(email, password) {
      try {
        await page.type('input[id="inputEmail"]', email)
        await page.type('input[id="inputPassword"]', password)
        await page.click('button[class="btn btn-primary block full-width m-b"]')
        console.log('Login 🆗')
      } catch (err) {
        throw new Error('No se pudo iniciar sesión: ' + err.message)
      }
    }

    async function chooseDay(dia) {
      try {
        const daySelector = `#li-dia-${dia} a`
        await page.waitForSelector(daySelector)
        await page.click(daySelector)
        console.log('Choose day 🆗')
      } catch (err) {
        throw new Error('No se pudo seleccionar el día ' + dia)
      }
    }

    async function checkReservation() {
      console.log('Verificando si ya hay una reserva...')
      const checkAlreadyReserve = await page
        .waitForSelector('div[class="modal inmodal in"]', {
          timeout: 1500,
        })
        .catch(() => null)
      if (checkAlreadyReserve) {
        /* await page.screenshot({ path: `image/reserva.png` }) */
        console.log('Reserva encontrada 🆗')
        return true
      } else {
        return false
      }
    }

    async function checkAvaliableTimes(dia, cancha) {
      let horarioEncontrado = false
      const canchas = cancha === 3 ? [1, 2] : [cancha]

      for (const cancha of canchas) {
        for (const horario of hora) {
          try {
            const horarioSelector = `#grid-predios-${dia} > div:nth-child(${cancha}) > div > ul`
            await page.waitForSelector(horarioSelector, { timeout: 5000 })

            const listaHorarios = await page.$$(horarioSelector + ' > li')

            for (let hora of listaHorarios) {
              const text = await page.evaluate((el) => el.textContent, hora)
              if (text.includes(horario)) {
                const aTag = await hora.$('a.alert-link')
                if (aTag) {
                  await aTag.click()
                  horarioEncontrado = true
                  break
                }
              }
            }

            if (horarioEncontrado) break
          } catch (error) {
            throw new Error('Error al buscar horarios: ' + error.message)
          }
        }
        console.log('Check horarios 🆗')
        if (horarioEncontrado) break
      }

      if (!horarioEncontrado) {
        throw new Error(
          'Ninguno de los horarios elegidos se encuentra disponible'
        )
      }
    }

    async function fillForm(dniInvitado) {
      try {
        await page.click('input[id="input-dni"]')
        await page.type('input[id="input-dni"]', dniInvitado)
        console.log('fill form 🆗')
      } catch (err) {
        throw new Error('Error al llenar el formulario: ' + err.message)
      }
    }

    async function makeReservation() {
      try {
        await confirmAlert(page)
        await new Promise((r) => setTimeout(r, 1000))
        await page.click('button[id="btn-id-persona"]')
        await page.click('button[id="btn-id-reserva"]')
        await new Promise((r) => setTimeout(r, 1000))
        /*       await page.screenshot({ path: `image/reserva.png` }) */

        console.log('Make reservation 🆗')
      } catch (err) {
        throw new Error('Error al realizar la reserva: ' + err.message)
      }
    }

    // Ejecución del flujo de reserva
    await login(email, password)

    const hasReservation = await checkReservation()
    if (hasReservation) {
      throw new Error('Ya tenes una reserva realizada')
    }

    console.log('No tiene reserva, se continúa 🆗')
    await page.waitForSelector('a[href="#"]')
    await page.click('a[href="#"]')
    await page.waitForSelector(
      '#side-menu > li:nth-child(4) > ul > li:first-child > a'
    )
    await page.click('#side-menu > li:nth-child(4) > ul > li:first-child > a')

    await chooseDay(dia)
    await checkAvaliableTimes(dia, cancha)
    await fillForm(dniInvitado)
    await makeReservation()

    /*   await page.screenshot({ path: `image/reserva.png` }) */
    const checkPopUp = await page.$(
      'div[class="sweet-alert showSweetAlert visible"]'
    )
    if (checkPopUp) {
      console.log('Leyendo el popup🆗')
      const paragraphText = await page.$eval(
        'p[style="display: block;"]',
        (el) => el.textContent
      )
      throw new Error(paragraphText)
    } else {
      return new Response(
        JSON.stringify({
          message: 'Reserva realizada con exito! a padelear 💪',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  } catch (error) {
    console.log(error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
