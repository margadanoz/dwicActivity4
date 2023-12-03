// Import del script de iniciar base de datos:
import { bd,TABLA_USERS,iniciarBaseDatos} from '/scripts/scriptIniciarBD.js';

// DOM:
export let resultadoBusqueda = document.querySelector('.cajaInfo');

// Leerá la info de los usuarios para imprimirla en el html:
export function readUsers() {
  let transaccion = bd.transaction([TABLA_USERS], 'readonly');
  let usuarios = transaccion.objectStore(TABLA_USERS);

  // Array para almacenar la información de los usuarios
  let usuariosArray = []; 

  let cursorRequest = usuarios.openCursor();

  cursorRequest.onsuccess = function (event) {
    let cursor = event.target.result;

    if (cursor) {
      let nombreUsuario = cursor.value.userName;
      let contraseña = cursor.value.password;
      let avatar = cursor.value.avatar;
      let rol = cursor.value.rol;
      let conectado = cursor.value.conectado;
      let email = cursor.value.email;
      let id = cursor.value.id;

      // Si imprimo directamente el html aqui me salen duplicados.
      // por eso almacenaje en array:
      usuariosArray.push({
        nombreUsuario,
        contraseña,
        avatar,
        rol,
        conectado,
        email,
        id
      });

      cursor.continue();
    } else {
      // No cierro la base de datos aqui porque sino me da fallo el logout en el script de IniciarBD:
      transaccion.oncomplete = function () {
        // bd.close();

        // Llenar el contenido en el resultadoBusqueda después de completar la transacción
        mostrarUsuarios(usuariosArray);
      };
    }
  };
}

function mostrarUsuarios(usuariosArray) {

  let resultadoBusqueda = document.querySelector('.cajaInfo');
  resultadoBusqueda.innerHTML = '';

  // Recorremos el array con los datos para sacarlo en el div que tenemos vacio
  usuariosArray.forEach((usuario) => {
  
    // Formato para el div que está vacio en el admin.html:
  resultadoBusqueda.innerHTML  += `
      <div class="usuarioInfo" style="padding: 10px; text-align: center;">
        <h2>Users web page</h2>
        <hr>
        User name: ${usuario.nombreUsuario}<br>
        Password: ${usuario.contraseña}<br>
        User role: ${usuario.rol}<br>
        Connection status: ${usuario.conectado}<br>
        Email: ${usuario.email}
        User id: ${usuario.id}
        Avatar: <img src="${usuario.avatar}" alt="Avatar" style="width: 10vh;"></p>
        <hr>
      </div>
    `;  
  });
}

    // EJECUCION DE APERTURA DE BASE DE DATOS Y RASTREO EN WEB DE USUARIOS CONECTADOS
    window.addEventListener('load', (event) =>{

      
      iniciarBaseDatos();
  });



