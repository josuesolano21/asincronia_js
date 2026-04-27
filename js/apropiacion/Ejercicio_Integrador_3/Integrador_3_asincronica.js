const usuarios = [101, 102, 103, 104];

function simularConsulta(datos, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(datos), ms));
}

function procesarUsuario(id) {
  const inicio = Date.now();

  return simularConsulta({ nombre: `Usuario_${id}` }, 1200)
    .then((datosUsuario) => {
      return simularConsulta({ nivel: "alto", mfa: true }, 800).then(
        (seguridad) => ({ datosUsuario, seguridad })
      );
    })
    .then(({ datosUsuario, seguridad }) => {
      return simularConsulta(["admin", "editor"], 2000).then((roles) => ({
        datosUsuario,
        seguridad,
        roles,
      }));
    })
    .then(({ datosUsuario, seguridad, roles }) => {
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
  console.log("Los 4 usuarios corren en paralelo, cada uno secuencial internamente.\n");

  const inicioGrupo = Date.now();

  return Promise.all(usuarios.map((id) => procesarUsuario(id))).then(
    (resultados) => {
      const tiempoGrupo = Date.now() - inicioGrupo;

      console.log("  Resultados por usuario:");
      resultados.forEach((r) =>
        console.log(
          `  Usuario ${r.id} | ${r.nombre} | roles: [${r.roles}] | ⏱ ${r.tiempoTotal}ms`
        )
      );

      const etapas = {
        "Datos usuario": 1200,
        Seguridad: 800,
        Roles: 2000,
        "Registro final": 600,
      };
      const cuello = Object.entries(etapas).sort((a, b) => b[1] - a[1])[0];

      console.log("\n   Registro final del grupo:");
      console.log(`     Tiempo total del grupo : ${tiempoGrupo}ms`);
      console.log(`      Usuarios en paralelo   : ${resultados.map((r) => r.id).join(", ")}`);
      console.log(`      Cuello de botella      : "${cuello[0]}" con ${cuello[1]}ms`);
      console.log(`\n  (sin Promise.all serían ~${4 * (1200 + 800 + 2000 + 600)}ms — con paralelo solo ~${1200 + 800 + 2000 + 600}ms)`);
    }
  );
}
