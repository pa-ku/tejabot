import { confirmAlert } from '@/utils/confirmAlert'
import puppeteerCore from 'puppeteer-core'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'
import { NextResponse } from 'next/server'

export async function POST(req) {
  let browser

  let logs = []

  function addLog(message) {
    logs.push(message)
    console.log(message)
  }

  try {
    const requestBody = await req.json()
    const { email, password, dniInvitado, dia, cancha, hora,code } = requestBody

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
        addLog('🔒 Logeando...')
        await page.type('input[id="inputEmail"]', email)
        await page.type('input[id="inputPassword"]', password)
        await page.click('button[class="btn btn-primary block full-width m-b"]')

        const failedLogin = await page.$('div[class="alert alert-danger"]')
        await new Promise((r) => setTimeout(r, 1000))

        if (failedLogin) {
          addLog('❌ Usuario no registrado')
          throw new Error('Usuario no registrado.')
        }
        addLog('✅ Login')
      } catch (err) {
        addLog('❌ No se pudo iniciar sesión...')
        throw new Error('No se pudo iniciar sesión: ' + err.message)
      }
    }

    async function chooseDay(dia) {
      try {
        addLog('🔍 Buscando el dia...')
        const daySelector = `#li-dia-${dia} a`
        await page.waitForSelector(daySelector)
        await page.click(daySelector)
        addLog('✅ Dia elegido')
      } catch (err) {
        addLog(`❌ No se encontro el dia elegido`)
        throw new Error('No se pudo seleccionar el día')
      }
    }

    async function checkReservation() {
      addLog('Verificando si ya hay una reserva...')
      const checkAlreadyReserve = await page
        .waitForSelector('div[class="modal inmodal in"]', {
          timeout: 1500,
        })
        .catch(() => null)
      if (checkAlreadyReserve) {
        return true
      } else {
        return false
      }
    }

    async function checkAvaliableTimes(dia, cancha) {
      let horarioEncontrado = false
      const canchas = cancha === 3 ? [1, 2] : [cancha]
      addLog('🔍 Buscando el horario...')
      for (const cancha of canchas) {
        for (const horario of hora) {
          try {
            const horarioSelector = `#grid-predios-${dia} > div:nth-child(${cancha}) > div > ul`
            await page.waitForSelector(horarioSelector, { timeout: 1000 })

            const listaHorarios = await page.$$(horarioSelector + ' > li')

            for (let hora of listaHorarios) {
              const text = await page.evaluate((el) => el.textContent, hora)
              if (text.includes(horario)) {
                const aTag = await hora.$('a.alert-link')
                if (aTag) {
                  await aTag.click()
                  addLog('✅ Horario encontrado')
                  horarioEncontrado = true
                  break
                }
              }
            }

            if (horarioEncontrado) {
              addLog(`✅ Se encontró un horario disponible: ${horario}`)
              break
            } else {
              addLog(
                `❌ No se encontró el horario: ${horario}, probando el siguiente...`
              )
            }
          } catch (error) {
            addLog(
              `❌ Error al buscar el horario: ${horario}, intentando con el siguiente...`
            )
          }
        }

        if (horarioEncontrado) {
          break
        }
      }

      if (!horarioEncontrado) {
        addLog('❌ No se encontro el horario')
        throw new Error(
          'Ninguno de los horarios elegidos se encuentra disponible'
        )
      }
    }

    async function fillForm(dniInvitado) {
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

    async function readReservation() {
      const reserva = await page.evaluate(() => {
        const fecha = document
          .querySelector('.modal-body b:nth-of-type(1)')
          .nextSibling.textContent.trim()
        const horario = document
          .querySelector('.modal-body b:nth-of-type(2)')
          .nextSibling.textContent.trim()

        const cancha = document
          .querySelector('.modal-body b:nth-of-type(4)')
          .nextSibling.textContent.trim()

        return {
          fecha,
          horario,
          cancha,
        }
      })
      addLog('✅ Ya tenes una reserva')
      addLog(`Fecha: ${reserva.fecha}`)
      addLog(`Horario: ${reserva.horario}`)
      addLog(`Cancha: ${reserva.cancha}`)
    }

    async function checkResult() {
      try {
        addLog('Leyendo el popup...')
        const paragraphText = await page.$eval(
          'p[style="display: block;"]',
          (el) => el.textContent
        )
        addLog(`❌ Error: ${paragraphText}`)
        throw new Error(paragraphText)
      } catch (error) {
        throw new Error(`Error al comprobar el resultado: ${error}`)
      }
    }

    async function makeReservation() {
      try {
        await confirmAlert(page)
        await new Promise((r) => setTimeout(r, 1000))
        await page.click('button[id="btn-id-persona"]')
        await page.click('button[id="btn-id-reserva"]')
        await new Promise((r) => setTimeout(r, 1000))
        addLog('✅ Formulario Llenado')
      } catch (err) {
        addLog('❌ Error al rellenar el formolario')
        throw new Error('Error al realizar la reserva: ' + err.message)
      }
    }
    await login(email, password)
    const hasReservation = await checkReservation()

    if (hasReservation) {
      await readReservation()
      throw new Error('Ya tenes una reserva realizada')
    }
    addLog('✅ No tiene una reserva realizada...')
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

    await new Promise((r) => setTimeout(r, 1000))

    const checkPopUp = await page.$(
      'div[class="sweet-alert showSweetAlert visible"]'
    )
    await new Promise((r) => setTimeout(r, 1000))

    if (checkPopUp) await checkResult()
    else {
      await readReservation()
      addLog(`'Reserva realizada con exito! a padelear 💪',`)
    }

    return NextResponse.json({ message: 'Done', logs: logs })
  } catch (error) {
    return NextResponse.json({
      error: 'Error al realizar la reserva',
      logs: logs,
    })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
