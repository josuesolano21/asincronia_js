/*Ejercicio integrador 3:
Simulador de Consulta de Usuarios y Roles
Descripción general
Vamos a simular una aplicación que debe consultar información desde diferentes fuentes:
• Datos básicos del usuario
• Información de seguridad
• Roles y permisos
Algunas consultas son lentas y otras rápidas. El propósito es reconstruir el flujo completo,
validar que la aplicación no se bloquee y comprender el orden real de los resultados.
Requerimientos del programa
Datos de entrada
• Un arreglo de IDs de usuarios:
const usuarios = [101, 102, 103, 104];
• Tiempos simulados:
• Consulta de usuario: 1200 ms
• Consulta de seguridad: 800 ms
• Consulta de roles: 2000 ms
• Registro final: 600 ms
Datos de salida esperados
• Para cada usuario, se debe generar un objeto como este:
{
id: 101,
nombre: "Usuario 101",
seguridad: "OK",
roles: ["admin", "ventas"],
tiempoTotal: "3.2 segundos"
}
• Registro final de la operación:
• Tiempo total del grupo
• Usuarios consultados en paralelo
• Identificación de cuellos de botella
Tarea
1. Construir una versión bloqueante (solo de demostración):
o Usar un ciclo que simule operaciones largas.
o Observar cómo el programa se congela.
o Documentar por qué no sirve este enfoque.
2. Versión asincrónica con Promesas:
o Consultar usuario → consultar seguridad → consultar roles → registrar.
o Este flujo debe ejecutarse de forma secuencial para cada usuario, pero en paralelo
entre usuarios.
3. Versión final con Async/Await:
o Implementar la misma lógica usando async/await.
o Registrar tiempos reales con Date.now().
o Contrastar con la ejecución basada en promesas.*/

// ejercicio_Integrador3.js
// ── VERSIÓN BLOQUEANTE ─────────────────────────────────────

const usuarios = [101, 102, 103, 104];

//      Esta versión es INVIABLE en producción porque:
//   1. Usa un bucle síncrono que CONGELA el hilo principal.
//   2. setTimeout no puede esperar de forma síncrona en JS;
//      la simulación aquí es solo ilustrativa con un contador.
//   3. El event loop queda completamente bloqueado: ningún
//      otro evento (clics, I/O, timers) puede procesarse
//      mientras el bucle esté corriendo.
//   4. En Node.js, esto bloquea el proceso entero; en el
//      navegador, congela la UI y puede lanzar un warning
//      de "page unresponsive".

export function versionBloqueante() {
  console.log("\n===== VERSIÓN BLOQUEANTE (NO RECOMENDADA) =====");
  console.log(" El hilo principal está bloqueado durante esta operación.\n");

  const inicio = Date.now();

  for (const id of usuarios) {
    const inicioUsuario = Date.now();

    // Simulamos los 4 pasos con bucles sincrónicos que "queman" tiempo.
    // En un caso real, estas serían llamadas de red sin async/await,
    // lo que bloquearía el hilo esperando la respuesta.

    // Paso 1: datos del usuario (~1200ms)
    let c = 0; while (Date.now() - inicioUsuario < 1200) c++;
    console.log(`  [${id}] Datos usuario   simulado en 1200ms`);

    // Paso 2: seguridad (~800ms)
    const t2 = Date.now();
    c = 0; while (Date.now() - t2 < 800) c++;
    console.log(`  [${id}] Seguridad       simulado en 800ms`);

    // Paso 3: roles (~2000ms) — cuello de botella
    const t3 = Date.now();
    c = 0; while (Date.now() - t3 < 2000) c++;
    console.log(`  [${id}] Roles           simulado en 2000ms`);

    // Paso 4: registro final (~600ms)
    const t4 = Date.now();
    c = 0; while (Date.now() - t4 < 600) c++;
    console.log(`  [${id}] Registro final  simulado en 600ms`);

    const tiempoUsuario = Date.now() - inicioUsuario;
    console.log(`  [${id}] Total usuario: ${tiempoUsuario}ms\n`);
  }

  const total = Date.now() - inicio;
  console.log(` Tiempo total bloqueante: ${total}ms`);
  console.log(` (esperado: ~${4 * (1200 + 800 + 2000 + 600)}ms porque todo es secuencial)`);
  console.log(" Ningún otro código pudo ejecutarse durante este tiempo.\n");
}