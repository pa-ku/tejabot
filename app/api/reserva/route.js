import { confirmAlert } from '@/utils/confirmAlert'
import puppeteerCore from 'puppeteer-core'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function POST(req) {
  let browser
  let logs = []

  const addLog = (message) => {
    logs.push(message)
    console.log(message)
  }

  try {
    const {
      email,
      password,
      dniInvitado,
      dia,
      cancha,
      hora,
      targetTime,
      hasAlarm,
    } = await req.json()
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Lanzamos el browser según ambiente
    if (isDevelopment) {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 1,
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

    // Funciones
    async function login(email, password) {
      try {
        addLog('🔒 Logeando...')
        await page.type('input[id="inputEmail"]', email)
        await page.type('input[id="inputPassword"]', password)
        await page.click('button[class="btn btn-primary block full-width m-b"]')
        addLog('✅ Login exitoso')
      } catch (err) {
        addLog('❌ No se pudo iniciar sesión')
        throw new Error('No se pudo iniciar sesión: ' + err.message)
      }
    }

    async function checkReservation() {
      addLog('Verificando si ya hay una reserva...')
      const alreadyReserved = await page
        .waitForSelector('div[class="modal inmodal in"]', { timeout: 1500 })
        .catch(() => null)
      return !!alreadyReserved
    }

    async function checkAvaliableTimes(dia, cancha) {
      let horarioEncontrado = false
      const canchas = cancha === 3 ? [1, 2] : [cancha]
      addLog('🔍 Buscando el horario...')
      await wait(1000)
      for (const canchaActual of canchas) {
        for (const horario of hora) {
          try {
            const horarioSelector = `#grid-predios-${dia} > div:nth-child(${canchaActual}) > div > ul`
            await page.waitForSelector(horarioSelector, { timeout: 1000 })
            const listaHorarios = await page.$$(horarioSelector + ' > li')
            for (let li of listaHorarios) {
              const text = await page.evaluate((el) => el.textContent, li)
              if (text.includes(horario)) {
                const aTag = await li.$('a.alert-link')
                if (aTag) {
                  await aTag.click()
                  addLog(`✅ Horario ${horario} encontrado`)
                  horarioEncontrado = true
                  break
                }
              }
            }
            if (horarioEncontrado) break
            else
              addLog(
                `❌ Horario ${horario} no disponible en cancha ${canchaActual}`
              )
          } catch (error) {
            addLog(`❌ Error al buscar el horario ${horario}: ${error.message}`)
          }
        }
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
        addLog('Llenando el formulario...')
        await page.click('input[id="input-dni"]')
        await page.type('input[id="input-dni"]', dniInvitado)
        const userAlreadyUsed = await page.$('div[id="alert-invitado"]')
        await wait(1000)
        if (userAlreadyUsed) {
          const isHidden = await page.evaluate(
            (el) => window.getComputedStyle(el).display === 'none',
            userAlreadyUsed
          )
          if (!isHidden) {
            addLog('❌ La persona ya fue invitada esta semana')
            throw new Error('El usuario ya fue invitado por otra persona')
          }
        }
        addLog('✅ Persona invitada')
      } catch (err) {
        addLog('❌ No se pudo llenar el formulario')
        throw new Error('Error al llenar el formulario: ' + err.message)
      }
    }

    async function readReservation() {
      try {
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
          return { fecha, horario, cancha }
        })
        addLog('✅ Ya tenés una reserva')
        addLog(`👑 ${reserva.fecha} / ${reserva.horario} / ${reserva.cancha}`)
      } catch (error) {
        throw new Error('Error al leer la reserva: ' + error.message)
      } finally {
        await takeScreenshot({ page, email, addLog })
      }
    }

    async function checkResult() {
      try {
        await new Promise((r) => setTimeout(r, 2000))
        addLog('Leyendo el popup...')
        const paragraphText = await page.$eval(
          'p[style="display: block;"]',
          (el) => el.textContent
        )
        addLog(`❌ Error: ${paragraphText}`)
        await takeScreenshot({ page, email, addLog })
      } catch (error) {
        throw new Error('Error al comprobar el resultado: ' + error.message)
      }
    }

    async function makeReservation() {
      try {
        await confirmAlert(page)
        await page.click('button[id="btn-id-persona"]')
        await page.click('button[id="btn-id-reserva"]')
        addLog('✅ Formulario llenado')
      } catch (err) {
        addLog('❌ Error al rellenar el formulario')
        throw new Error('Error al realizar la reserva: ' + err.message)
      }
    }

    // Ejecutamos el login primero
    await login(email, password)
    if (await checkReservation()) {
      await readReservation()
      throw new Error('Ya tenés una reserva realizada')
    }
    addLog('✅ No tenés reserva previa')

    await navigateToTheDayMenu({ page })
    await checkDayTimer({ targetTime, page, hasAlarm, dia, addLog })
    await checkAvaliableTimes(dia, cancha)
    await fillForm(dniInvitado)
    await makeReservation()
    await checkResult()

    return NextResponse.json({ message: 'Ejecutado con exito', logs })
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: 'Hay un problema',
      logs,
    })
  } finally {
    if (browser) await browser.close()
  }
}

async function navigateToTheDayMenu({ page }) {
  try {
    await page.waitForSelector('a[href="#"]')
    await page.click('a[href="#"]')
    await page.waitForSelector(
      '#side-menu > li:nth-child(4) > ul > li:first-child > a'
    )
    await page.click('#side-menu > li:nth-child(4) > ul > li:first-child > a')
  } catch (error) {
    throw new Error('Error al navegar al menú del día: ' + error.message)
  }
}

async function checkDayTimer({ targetTime, page, hasAlarm, dia, addLog }) {
  try {
    if (!hasAlarm) {
      await chooseDay({ page, dia, addLog })
    } else {
      // Calculamos el delay para ejecutar chooseDay a las 6 AM
      const now = new Date()
      const dayTimer = new Date(now)
      const [hour, minute] = targetTime.split(':').map(Number)
      dayTimer.setHours(hour, minute, 0, 0)
      if (now >= dayTimer) {
        // Si ya pasó la 23:14 de hoy, programamos para mañana
        dayTimer.setDate(dayTimer.getDate() + 1)
      }
      const delay = dayTimer.getTime() - now.getTime()
      addLog(
        `⏱️ Esperando ${Math.ceil(
          delay / 1000
        )} segundos para ejecutar chooseDay a las 23: 14`
      )

      await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            await page.reload()

            await chooseDay({ page, dia, addLog })
            resolve()
          } catch (error) {
            // Si falla en chooseDay, rechaza el timer
            resolve() // o se podría hacer un reject, según lo que necesites
          }
        }, delay)
      })
    }
  } catch (error) {
    throw new Error('Error al esperar el timer: ' + error.message)
  }
}

async function chooseDay({ page, dia, addLog }) {
  try {
    addLog('🔍 Buscando el día...')
    const daySelector = `#li-dia-${dia} a`
    await page.waitForSelector(daySelector, { timeout: 5000 })
    await page.click(daySelector)
    addLog('✅ Día elegido')
  } catch (err) {
    addLog('❌ No se encontró el día elegido')
    throw new Error('No se pudo seleccionar el día: ' + err.message)
  }
}

async function takeScreenshot({ page, email, addLog }) {
  try {
    const desktopPath = path.join(require('os').homedir(), 'Desktop')
    const imagesFolder = path.join(desktopPath, 'tejabot')

    // Crear la carpeta si no existe
    if (!fs.existsSync(imagesFolder)) {
      fs.mkdirSync(imagesFolder, { recursive: true })
    }

    const timestamp = new Date()
      .toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\//g, '-')
      .replace(/:/g, '-')
      .replace(',', '')

    const screenshotPath = path.join(imagesFolder, `${email}_${timestamp}.png`)
    await page.screenshot({ path: screenshotPath })
    addLog(`📸 Captura guardada en el escritorio`)
    console.log(`📸 Captura guardada en: ${screenshotPath}`)
  } catch (error) {
    throw new Error('Error al tomar la captura de pantalla: ' + error)
  }
}

async function wait(time) {
  await new Promise((r) => setTimeout(r, time))
}
