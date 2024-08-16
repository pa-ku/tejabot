export async function confirmAlert(page) {
  let dialogHandled = false; // Variable de control para saber si ya se manejó un diálogo

  const handleDialog = async (dialog) => {
    if (dialogHandled) return; // Si ya se manejó un diálogo, no hacer nada
    dialogHandled = true; // Marcar que ya se manejó un diálogo
    console.log('Mensaje del diálogo:', dialog.message());
    await dialog.accept();
    // Desregistrar el evento después de aceptar el diálogo
    page.off('dialog', handleDialog);
  };

  // Escuchar el evento dialog
  page.on('dialog', handleDialog);
}