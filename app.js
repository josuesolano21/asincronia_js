/* archivo para importar todo lo que hay en la carpeta js */

import * as ejercicios from "./js/index.js";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

async function menu() {
  while (true) {
    console.log("\n===== MENÚ =====");
    console.log("6. Ejercicio 6 - Proceso aleatorio");
    console.log("7. Ejercicio 7 - Async/Await");
    console.log("8. Ejercicio Integrador 3 - Versión bloqueante");
    console.log("9. Ejercicio Integrador 3 - Versión con promesas");
    console.log("0. Salir");    
    /* Mostrar ejercicios en consola aqui:*/

    const opcion = prompt("Elige una opción: ").trim();

    switch (opcion) {
      case "6":
        await ejercicios.ejecutarProceso();
        break;

      case "7":
        await ejercicios.ejecutarAsync();
        break;

        case "8":
        await ejercicios.versionBloqueante();
        break;

        case "9":
        await ejercicios.versionPromesas();
        break;

        /* introducir siguientes ejercicios aqui con este formato:
    switch (opcion) {
        case "6":
        await ejercicios.ejecutarProceso();
        break;*/

      case "0":
        console.log("Hasta luego.");
        process.exit(0);

      default:
        console.log("Opción no válida.");
    }
  }
}

menu();