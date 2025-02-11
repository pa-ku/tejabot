import moment from 'moment-timezone';

const targetTime = moment.tz('2025-02-10 05:00:45', 'YYYY-MM-DD HH:mm:ss', 'America/Argentina/Buenos_Aires');
const now = moment().tz('America/Argentina/Buenos_Aires');

const diffMs = targetTime.diff(now); // diferencia en milisegundos

if (diffMs > 0) {
  const duration = moment.duration(diffMs);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  console.log(`Faltan ${hours} horas, ${minutes} minutos y ${seconds} segundos.`);
} else {
  console.log('El momento objetivo ya pasó.');
}