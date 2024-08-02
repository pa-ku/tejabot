import { confirmAlert } from '@/utils/confirmAlert'
export async function POST(req) {
  let browser

  try {
    const { email, password, dniInvitado, dia, cancha, hora } = await req.json()

    const isDevelopment = process.env.NODE_ENV === 'development'
    let puppeteer
    let chromium
    if (isDevelopment) {
      // En desarrollo, usa Puppeteer directamente
      puppeteer = await import('puppeteer')
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 5,
      })
    } else {
      // En producción, usa Puppeteer Core con Chromium
      puppeteer = await import('puppeteer-core')
      chromium = await import('@sparticuz/chromium')
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      })
    }

    const page = await browser.newPage()
    await confirmAlert(page)

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
      } catch (err) {
        throw new Error(err + ' No se pudo iniciar sesión')
      }
    }
    async function chooseDay(dia) {
      try {
        const daySelector = `#li-dia-${dia} a`
        await page.waitForSelector(daySelector)
        await page.click(daySelector)
      } catch (err) {
        throw new Error('No se pudo seleccionar el día ' + dia)
      }
    }

    async function goToReservas() {
      try {
        await page.waitForSelector('a[href="#"]')
        await page.click('a[href="#"]')
        await page.waitForSelector(
          '#side-menu > li:nth-child(4) > ul > li:first-child > a'
        )
        await page.click(
          '#side-menu > li:nth-child(4) > ul > li:first-child > a'
        )
      } catch (err) {
        throw new Error('No se pudo navegar a la sección de reservas')
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
            console.error('Error al intentar seleccionar el horario:', error)
            // Continúa con el siguiente horario en caso de error
          }
        }

        if (horarioEncontrado) break
      }

      if (!horarioEncontrado) {
        throw new Error(
          'Ninguno de los horarios disponibles pudo ser reservado'
        )
      }
    }

    async function fillForm(dniInvitado) {
      try {
        await page.click('input[id="input-dni"]')
        await page.type('input[id="input-dni"]', dniInvitado)
      } catch (err) {
        throw new Error(err + ' Error al agregar el invitado ')
      }
    }

    async function makeReservation() {
      try {
        await new Promise((r) => setTimeout(r, 1000))
        await page.click('button[id="btn-id-persona"]')
        await page.click('button[id="btn-id-reserva"]')
        await new Promise((r) => setTimeout(r, 1000))

        await page.screenshot({ path: `public/reserva.png` })

        if (await page.type('button[class="confirm"]')) {
          throw new Error('Ya sacaste turno con tu provedor de internet')
        }
      } catch (err) {
        throw new Error('Ya sacaste turno con tu provedor de internet')
      }
    }

    await login(email, password)

    await goToReservas()
    await chooseDay(dia)

    await checkAvaliableTimes(dia, cancha)

    await fillForm(dniInvitado)

    await makeReservation()

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
