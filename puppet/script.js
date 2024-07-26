import puppeteer from 'puppeteer'
import { getMillisecondsUntil } from './getMiliSeconds.js'
import { confirmAlert } from './confirmAlert.js'

async function openWebPage() {
  const email = 'natuvenitez@hotmail.com'
  const password = 'tejadito12345'
  const dni = '38398777'

  // ⌛ Alarma
  const horas = 10 // 16:00 en formato 24 horas
  const minutos = 52
  const alarm = false

  // Calcula el tiempo en milisegundos hasta la hora objetivo
  const millisecondsUntilTarget = getMillisecondsUntil(horas, minutos)

  alarm &&
    console.log(
      `Esperando ${
        millisecondsUntilTarget / 1000
      } segundos hasta las ${horas}:${minutos} PM...`
    )

  setTimeout(
    async () => {
      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 20,
      })
      const page = await browser.newPage() // Abrirá una instancia de Chromium
      await confirmAlert(page)
      await page.goto('https://reservar.serviciosmerlo.online/login')

      // LOGIN
      await page.click('input[id="inputEmail"]')
      await page.type('input[id="inputEmail"]', email)
      await page.click('input[id="inputPassword"]')
      await page.type('input[id="inputPassword"]', password)
      await page.click('button[class="btn btn-primary block full-width m-b"]')

      //NAVEGAR A RESERVAS
      await page.waitForSelector('a[href="#"]')
      await page.click('a[href="#"]')
      await page.click('#side-menu > li:nth-child(4) > ul > li:first-child > a')

      //DIA
      await page.waitForSelector('#li-dia-6 a')
      await page.click('#li-dia-6 a')

      //HORARIO
      const Horario =
        '#grid-predios-6 > div:nth-child(2) > div > ul > li:nth-child(1) > a'
      await page.waitForSelector(Horario)
      await page.click(Horario)

      // FORMULARIO
      await page.click('input[id="input-dni"]')
      await page.type('input[id="input-dni"]', dni)

      await new Promise((r) => setTimeout(r, 1500))
      await page.click('button[id="btn-id-persona"]')
      await page.click('button[id="btn-id-reserva"]')
      await new Promise((r) => setTimeout(r, 1000))

      await page.screenshot({ path: 'tejadito.png' })
      /*      await browser.close() */
    },
    alarm ? millisecondsUntilTarget : 0
  )
}

// 1 lunes
// 2 martes
// 3 miercoles
// 4 jueves
// 5 viernes
// 6 sabado
// 7 domingo
