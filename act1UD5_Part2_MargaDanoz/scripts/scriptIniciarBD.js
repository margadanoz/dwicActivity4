// Import del script del admin, para leer datos de la base si se carga su página:
import { readUsers,resultadoBusqueda} from '/scripts/scriptAdminPagPrincipal.js';
import { readUser} from '/scripts/settingsUsers.js';
// API, comprobar navegador
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Para enlace logout, para hacerlo visible:
let enlaceLogout = document.querySelector('#logout');

// referencia base de datos general sobre la que se operara
export let bd;
// nuestra database y almacen(tabla)
const DATA_BASE = "usersBDMarga";
export const TABLA_USERS = "users";

// ejecutada nada mas abrir navegador
export function iniciarBaseDatos(){

    // almacenamos apertyura en variable y disparamos eventos(predeterminados de la API)
    let request = indexedDB.open(DATA_BASE);
    request.addEventListener("error", mostrarError);
    request.addEventListener("success", comenzar);
    request.addEventListener("upgradeneeded", crearAlmacen);
  }
  
  // para eventos:
export function mostrarError(event){
    console.log("Hay un error: " + event.code + "/" + event.message);
  }

    // crea la tabla y los indices de esta
export function crearAlmacen(event){
        // operamos base de datos referencia general
        bd = event.target.result;
        // TABLA DE USERS:
        // variable sobre la que se crean los index, asignar id unico
        let almacen = bd.createObjectStore(TABLA_USERS, {keyPath: "id", autoIncrement: true});
        almacen.createIndex('userName', 'userName', { unique: false });
        almacen.createIndex('userEmail', 'userEmail', { unique: false });
        almacen.createIndex('password', 'password', { unique: false });
        almacen.createIndex('rol', 'rol', { unique: false });
        almacen.createIndex('avatar', 'avatar', { unique: false });
        almacen.createIndex('conectado', 'conectado', { unique: false });

}
  
  // exito na apertura mostramos usuarios
export function comenzar(event){
  
    bd = event.target.result;
   
            //Carga datos de avatar y nombre, tb muestra ya enlace de logout:
            verSiHayUsuariosConectados();
        }


  // Función que rastrea al abrirse el navegador si hay usuarios con valor 1, es decir, conectados, si los hay muestra avatar y usuario y recupera su info:
export function verSiHayUsuariosConectados() {
    let transaccion = bd.transaction([TABLA_USERS], "readonly");
    let usuarios = transaccion.objectStore(TABLA_USERS);

    let nombreUsuario;
    let contraseña;
    let avatar;
    let email;
    let rol;
    let conectado;

    let cursorRequest = usuarios.openCursor();

    cursorRequest.onsuccess = function (event) {
        let cursor = event.target.result;

        if (cursor) {
            nombreUsuario = cursor.value.userName;
            contraseña = cursor.value.password;
            avatar = cursor.value.avatar;
            rol = cursor.value.rol;
            conectado = cursor.value.conectado;
            email = cursor.value.userEmail;

                  //Verifica si hay algún usuario conectado:
                  if (conectado === 1) {
                    // Establece los valores en el DOM, obtenidos de IndexedDB:
                    document.getElementById('avatarUsuario').setAttribute('src', avatar);
                    document.getElementById('nombreUsuario').textContent = `Hola ${nombreUsuario}`;

                    // Haz visible el enlace de cierre de sesión
                    document.getElementById('logout').style.display = 'block';
                    
                    // Si es administrador hace visible su enlace en menyu lateral
                    if(rol === 'administrador'){
                        document.querySelector('#admin').style.display = 'block';
                        readUsers();
                    }
                    if(rol === 'usuario'){
                      document.querySelector('#settings').style.display = 'block';
                      readUser();
                    }
                }

            cursor.continue();
        } else {
          

    }
}
}

  enlaceLogout.addEventListener('click',logout);

//   Funcion logout para que esté presente en todas las páginas:
export function logout() {
    // console.log("Logout ejecutado.");

      let transaccion = bd.transaction([TABLA_USERS], "readwrite");
      let usuarios = transaccion.objectStore(TABLA_USERS);
    
      let cursorRequest = usuarios.openCursor();
    
      cursorRequest.onsuccess = function (event) {
      let cursor = event.target.result;
     
        if (cursor) {
    
           let conectado = cursor.value.conectado;
           let rol = cursor.value.rol;
     
           if (conectado === 1) {
              // Si está conectado, lo desconecta
              cursor.value.conectado = 0;
              // Actualizacion de valor en la base de datos:
              cursor.update(cursor.value); 

               // Limpiar la entrada de tema en localStorage para no tener problemas
            localStorage.removeItem("tema");
           }
     
           cursor.continue();
          //  Para cuando el cursor acaba la iteracion:
        } else {
          // Si todo ha ido bien en terminar el bucle cerramos base de datos:
           transaccion.oncomplete = function () {
             // Limpiar la entrada de tema en localStorage para no tener problemas
             localStorage.removeItem("tema");
            // redireccion
            window.location.href="index.html";
            bd.close();    
            };
        }
     };
    }
    
window.addEventListener('load', (event) =>{

    iniciarBaseDatos();

});