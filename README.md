# TejaBot 🤖

### La manera mas sencilla para no volverse loco intentando hacer una reserva
Ejemplo de uso:

https://github.com/user-attachments/assets/d15e318f-02b9-4e2a-85a9-51d02e1d5818

## Uso

1. Tener instalado NodeJs: <a href="" target="_blank">https://nodejs.org/en </a>
2. Clonar la repo 
```
git clone https://github.com/@username/tejabot.git
```
3. Ejecutar `npm install` y luego `npm run dev`,
4. Navegar a <a href="" target="_blank">http://localhost:3000</a>  
5. Elige tus opciones para la reserva y presiona **"Reservar"**
6. Mira como el bot trabaja por el salario minimo!
1. Ejecuta npm run dev
2. Ve a http://localhost:3000
3. Elige tus opciones para la reserva
4. Presiona "Reservar"
5. Mira como el bot trabaja por el salario minimo!

- Al iniciar el proceso de reserva se abrira una nueva pestaña de un navegador chrome, no lo cierres, el bot ira haciendo su trabajo automaticamente


## Features
- **Canchas:** te permite validar si una cancha esta disponible, sino intentara en la otra
- **Horarios:** al poder elegir varios horarios te asegura obtener el que este disponible sin tener que reacer la petición
- **Retry:** Cuando esta activo intenta volver a realizar la peticion en el tiempo y cantidad indicado
- **Timer:** Colocando el tiempo se ejecutara del lado del cliente, cuando el timer llegue a 0 se ejecutara la petición

