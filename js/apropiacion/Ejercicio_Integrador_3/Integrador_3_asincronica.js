/* ejercicio_Integrador3.js */
// ── VERSIÓN ASYNC/AWAIT ───
// Misma lógica que la versión con promesas pero con async/await.
// Contraste con version de promesas:
// - Codigo mas legible, sin cadenas de .then()
// - Tiempos medidos por etapa con Date.now()
// - Misma concurrencia: Promise.all en paralelo
// - Misma secuencialidad interna por usuario

const usuarios = [101, 102, 103, 104];

function simularConsulta(datos, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(datos), ms));
}

async function procesarUsuario(id) {
  const inicio = Date.now();

  const t1 = Date.now();
  const datosUsuario = await simularConsulta({ nombre: `Usuario_${id}` }, 1200);
  console.log(`  [${id}] Datos usuario  : ${Date.now() - t1}ms`);

  const t2 = Date.now();
  const seguridad = await simularConsulta({ nivel: "alto", mfa: true }, 800);
  console.log(`  [${id}] Seguridad      : ${Date.now() - t2}ms`);

  const t3 = Date.now();
  const roles = await simularConsulta(["admin", "editor"], 2000);
  console.log(`  [${id}] Roles          : ${Date.now() - t3}ms`);

  const t4 = Date.now();
  await simularConsulta(null, 600);
  console.log(`  [${id}] Registro final : ${Date.now() - t4}ms`);

  return {
    id,
    nombre: datosUsuario.nombre,
    seguridad,
    roles,
    tiempoTotal: Date.now() - inicio,
  };
}

export async function versionAsyncAwait() {
  console.log("\n===== VERSION ASYNC/AWAIT =====");
  console.log("Los 4 usuarios corren en paralelo, cada uno secuencial internamente.\n");

  const inicioGrupo = Date.now();

  const resultados = await Promise.all(usuarios.map((id) => procesarUsuario(id)));

  const tiempoGrupo = Date.now() - inicioGrupo;

  console.log("\nResultados por usuario:");
  resultados.forEach((r) =>
    console.log(
      `  Usuario ${r.id} | ${r.nombre} | roles: [${r.roles}] | tiempo: ${r.tiempoTotal}ms`
    )
  );

  const etapas = {
    "Datos usuario": 1200,
    Seguridad: 800,
    Roles: 2000,
    "Registro final": 600,
  };
  const cuello = Object.entries(etapas).sort((a, b) => b[1] - a[1])[0];

  console.log("\nRegistro final del grupo:");
  console.log(`  Tiempo total del grupo : ${tiempoGrupo}ms`);
  console.log(`  Usuarios en paralelo   : ${resultados.map((r) => r.id).join(", ")}`);
  console.log(`  Cuello de botella      : "${cuello[0]}" con ${cuello[1]}ms`);
}