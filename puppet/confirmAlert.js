export async function confirmAlert(page) {
  // Manejar diálogos de alerta
  page.on('dialog', async dialog => {
    console.log('Mensaje del diálogo:', dialog.message());
    await dialog.accept(); // Acepta el diálogo
  });
}
