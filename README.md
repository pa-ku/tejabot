# TejaBot 🤖

Te permite desde una inteface crear una petición con timer, para reservar canchas en el tejadito

https://github.com/user-attachments/assets/d15e318f-02b9-4e2a-85a9-51d02e1d5818

## Uso

1. Instalar Node: https://nodejs.org/en Ejecuta 
2. Ejecutar `npm run dev`, e ir a http://localhost:3000
3. Elige tus opciones para la reserva
4. Presiona "Reservar"
5. Mira como el bot trabaja por el salario minimo!

- Al iniciar el proceso de reserva se abrira una nueva pestaña de un navegador de chrome, no lo cierres, el bot ira siguiendo los pasos solo para completar
## Features

- Retry: Cuando esta activo intenta volver a realizar la peticion en el tiempo y cantidad indicado
- Canchas: te permite validar si una cancha tiene el turno disponible, sino intentara en la otra
- Horarios: al poder elegir varios horarios te asegura obtener el que este disponible sin tener que reacer la petición
- Timer: Colocando el tiempo se ejecutara del lado del cliente, cuando el timer llegue a 0 se ejecutara la petición
- LocalStorage: Te permite guardar tu usuario contraseña y dni sin que se almacene la informacion sino que solo estara en tu dispositivo
