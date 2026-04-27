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

/* ejercicio_Integrador3.js */
// ── VERSIÓN CON PROMESAS ───

const usuarios = [101, 102, 103, 104];

// Helper: retorna una promesa que se resuelve después de `ms` milisegundos
function simularConsulta(datos, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(datos), ms));
}

// Procesa UN usuario de forma secuencial internamente:
// datos → seguridad → roles → registro
function procesarUsuario(id) {
  const inicio = Date.now();

  return simularConsulta({ nombre: `Usuario_${id}` }, 1200)
    .then((datosUsuario) => {
      // Paso 2: seguridad (espera a que termine paso 1)
      return simularConsulta({ nivel: "alto", mfa: true }, 800).then(
        (seguridad) => ({ datosUsuario, seguridad })
      );
    })
    .then(({ datosUsuario, seguridad }) => {
      // Paso 3: roles (espera a que termine paso 2) — cuello de botella
      return simularConsulta(["admin", "editor"], 2000).then((roles) => ({
        datosUsuario,
        seguridad,
        roles,
      }));
    })
    .then(({ datosUsuario, seguridad, roles }) => {
      // Paso 4: registro final (espera a que termine paso 3)
      return simularConsulta({ timestamp: new Date().toISOString() }, 600).then(
        () => ({
          id,
          nombre: datosUsuario.nombre,
          seguridad,
          roles,
          tiempoTotal: Date.now() - inicio,
        })
      );
    });
}

export function versionPromesas() {
  console.log("\n===== VERSIÓN CON PROMESAS =====");
  console.log(
    "Los 4 usuarios corren en paralelo, cada uno secuencial internamente.\n"
  );

  const inicioGrupo = Date.now();

  // Promise.all lanza los 4 usuarios AL MISMO TIEMPO
  // y espera a que TODOS terminen antes de continuar
  return Promise.all(usuarios.map((id) => procesarUsuario(id))).then(
    (resultados) => {
      const tiempoGrupo = Date.now() - inicioGrupo;

      console.log("  Resultados por usuario:");
      resultados.forEach((r) =>
        console.log(
          `  Usuario ${r.id} | ${r.nombre} | roles: [${r.roles}] | ⏱ ${r.tiempoTotal}ms`
        )
      );

      // Identificar cuello de botella (etapa más lenta)
      const etapas = {
        "Datos usuario": 1200,
        Seguridad: 800,
        Roles: 2000,
        "Registro final": 600,
      };
      const cuello = Object.entries(etapas).sort((a, b) => b[1] - a[1])[0];

      console.log("\n   Registro final del grupo:");
      console.log(`     Tiempo total del grupo : ${tiempoGrupo}ms`);
      console.log(
        `      Usuarios en paralelo   : ${resultados.map((r) => r.id).join(", ")}`
      );
      console.log(
        `      Cuello de botella      : "${cuello[0]}" con ${cuello[1]}ms`
      );
      console.log(
        `\n  (sin Promise.all serían ~${4 * (1200 + 800 + 2000 + 600)}ms — con paralelo solo ~${1200 + 800 + 2000 + 600}ms)`
      );
    }
  );
}

