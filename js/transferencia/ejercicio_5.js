/*5. Integración de servicios: disponibilidad, datos del usuario, historial y
recomendaciones
Enunciado
Un sistema central debe preparar la información de un usuario consultando cuatro
servicios externos:
1. Servicio A: disponibilidad de un recurso.
2. Servicio B: información detallada del usuario.
3. Servicio C: historial de acciones.
4. Servicio D: motor de recomendaciones (depende de la información de los servicios
B y C).
El aprendiz debe simular todo el flujo utilizando asincronía avanzada, integrando procesos
dependientes y paralelos, registrando tiempo, orden y validaciones.
Requerimientos
• Ejecutar varios servicios en paralelo.
• Controlar dependencias del servicio D.
• Generar informe final unificado.
• Registrar tiempo total y tiempo por servicio.
• Manejar errores tanto aislados como globales.
Datos de entrada
• ID del usuario.
• Tiempo simulado por cada servicio.
• Parámetro que indica si algún servicio debe fallar (para evaluar manejo de errores).
Datos de salida

• Resultado de cada servicio.
• Informe central detallado.
• Orden real de finalización.
• Estado general del sistema (“Integración exitosa” o error general).
*/

/* ejercicio_integracion_servicios.js */
// Integracion de servicios: A, B, C en paralelo → D depende de B y C

const tiempos = {
  servicioA: 1000,
  servicioB: 1500,
  servicioC: 800,
  servicioD: 600,
};

function simular(nombre, ms, fallar) {
  const inicio = Date.now();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const duracion = Date.now() - inicio;
      console.log(`  [${nombre}] finalizo en ${duracion}ms`);
      if (fallar === nombre) {
        reject(new Error(`${nombre} fallo intencionalmente`));
      } else {
        resolve({ servicio: nombre, duracion, datos: `datos_de_${nombre}` });
      }
    }, ms);
  });
}

async function servicioD(resultadoB, resultadoC) {
  const inicio = Date.now();
  return new Promise((resolve) => {
    setTimeout(() => {
      const duracion = Date.now() - inicio;
      console.log(`  [servicioD] finalizo en ${duracion}ms`);
      resolve({
        servicio: "servicioD",
        duracion,
        datos: `recomendaciones basadas en ${resultadoB.datos} y ${resultadoC.datos}`,
      });
    }, tiempos.servicioD);
  });
}

export async function integrarServicios(usuario) {
  console.log(`\n===== INTEGRACION DE SERVICIOS =====`);
  console.log(`Usuario: ${usuario.id} | Fallo simulado: ${usuario.fallar ?? "ninguno"}\n`);

  const inicioTotal = Date.now();

  // A, B y C en paralelo — allSettled captura errores sin detener los demas
  const [resA, resB, resC] = await Promise.allSettled([
    simular("servicioA", tiempos.servicioA, usuario.fallar),
    simular("servicioB", tiempos.servicioB, usuario.fallar),
    simular("servicioC", tiempos.servicioC, usuario.fallar),
  ]);

  // Servicio D solo si B y C fueron exitosos
  let resD = null;
  if (resB.status === "fulfilled" && resC.status === "fulfilled") {
    try {
      resD = { status: "fulfilled", value: await servicioD(resB.value, resC.value) };
    } catch (e) {
      resD = { status: "rejected", reason: e };
    }
  } else {
    console.log("  [servicioD] no ejecutado — B o C fallaron");
  }

  const tiempoTotal = Date.now() - inicioTotal;

  // Estado general
  const todoOk =
    resA.status === "fulfilled" &&
    resB.status === "fulfilled" &&
    resC.status === "fulfilled" &&
    resD?.status === "fulfilled";

  console.log("\nInforme final:");
  console.log(`  Servicio A : ${resA.status === "fulfilled" ? resA.value.datos : resA.reason.message}`);
  console.log(`  Servicio B : ${resB.status === "fulfilled" ? resB.value.datos : resB.reason.message}`);
  console.log(`  Servicio C : ${resC.status === "fulfilled" ? resC.value.datos : resC.reason.message}`);
  console.log(`  Servicio D : ${resD?.status === "fulfilled" ? resD.value.datos : resD ? resD.reason.message : "no ejecutado"}`);
  console.log(`  Tiempo total : ${tiempoTotal}ms`);
  console.log(`  Estado general : ${todoOk ? "Integracion exitosa" : "Error general"}`);
}