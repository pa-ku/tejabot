import { confirmAlert } from '@/utils/confirmAlert'
import puppeteerCore from 'puppeteer-core'
import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'
import { NextResponse } from 'next/server'
import { login } from '@/pupsteps/login'
import { fillForm } from '@/pupsteps/fillForm'
import { checkReservation } from '@/pupsteps/checkReservation'
import { readReservation } from '@/pupsteps/readReservation'
import { chooseDay } from '@/pupsteps/chooseDay'
import { checkResult } from '@/pupsteps/checkResult'
import { checkPopUp } from '@/pupsteps/checkPopUp'
import { makeReservation } from '@/pupsteps/makeReservation'

export async function POST(req) {
  let browser
  let logs = []
  function addLog(message) {
    logs.push(message)
  }
  try {
    const requestBody = await req.json()
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

    async function checkAvaliableTimes() {
      try {
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
                addLog(`✅ ${horario}`)
                break
              } else {
                addLog(`❌ ${horario}`)
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
      } catch (error) {}
      console.log(error)
      throw new Error(error)
    }

    await login(page, addLog, email, password)
    const hasReservation = await checkReservation(page, addLog)
    if (hasReservation) {
      await readReservation(page, addLog)
      throw new Error('Ya tenes una reserva realizada')
    } else {
      addLog('✅ No tiene una reserva realizada...')
      await page.waitForSelector('a[href="#"]')
      await page.click('a[href="#"]')
      await page.waitForSelector(
        '#side-menu > li:nth-child(4) > ul > li:first-child > a'
      )
      await page.click('#side-menu > li:nth-child(4) > ul > li:first-child > a')
    }
    await chooseDay(page, addLog, dia)
    await checkAvaliableTimes()
    await fillForm(page, addLog, dniInvitado)
    await makeReservation(page, addLog)
    const checkIfHasPopUp = await checkPopUp(page, addLog)
    if (checkIfHasPopUp) await checkResult(page, addLog)
    else {
      await readReservation(page, addLog)
      addLog('Reserva realizada con exito! a padelear 💪')
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
