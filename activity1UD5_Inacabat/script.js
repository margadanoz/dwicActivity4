// imagenes de avatares por el tipo de elemento que son, su atributo name y el tipo de dato que son, img
let avatarImagenes = document.querySelectorAll('input[type="radio"][name="seleccion"] + label img'); 
// Botón reset de avatares:
let resetButton = document.querySelector('#resetButton');
// Boton para añadir usuario:
let addUser = document.querySelector('#addUser');
//LOGIN:
let loginButton = document.querySelector('#loginButton');
// Elemento Logout, enlace:
let enlaceLogout = document.querySelector('#logout');

// API, comprobar navegador
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// referencia base de datos general sobre la que se operara
let bd;
// nuestra database y almacen(tabla)
const DATA_BASE = "usersBD";
const TABLA_USERS = "users";

// ejecutada nada mas abrir navegador
function iniciarBaseDatos(){

  // almacenamos apertyura en variable y disparamos eventos(predeterminados de la API)
  let request = indexedDB.open(DATA_BASE);
  request.addEventListener("error", mostrarError);
  request.addEventListener("success", comenzar);
  request.addEventListener("upgradeneeded", crearAlmacen);
}

// para eventos:
function mostrarError(event){
  console.log("Hay un error: " + event.code + "/" + event.message);
}

// exito na apertura mostramos usuarios
function comenzar(event){
  bd = event.target.result;
  // Comprueba al cargar la pagina, por ende la base de datos i hay algun usuario conectado:
  verSiHayUsuariosConectados();
}

// crea la tabla y los indices de esta:
function crearAlmacen(event){
        // operamos base de datos referencia general
        bd = event.target.result;
        // TABLA DE USERS:
        // variable sobre la que se crean los index, asignar id unico
        let almacen = bd.createObjectStore(TABLA_USERS, {keyPath: "id", autoIncrement: true});
        almacen.createIndex('userName', 'userName', { unique: false });
        almacen.createIndex('email', 'userEmail', { unique: false });
        almacen.createIndex('password', 'password', { unique: false });
        // Indices para los roles y los avatares
        almacen.createIndex('rol', 'rol', {unique: false});
        almacen.createIndex('avatar', 'avatar', {unique:false});
        almacen.createIndex('conectado', 'conectado', {unique:false});
}


// Función para validar el formulario antes de almacenar usuarios
function validarFormulario() {

  let camposCompletos = false;
  let avatarElegido = true;
  let emailValido = false;
  let rolElegido = true; 
 
  let userName = document.getElementById('userName').value.trim();
  let userEmail = document.getElementById('emailUser').value.trim();
  let password = document.getElementById('password').value.trim();
  let usuario = document.getElementById('usuario');
  let admin = document.getElementById('administrador');
  let avatar1 = document.getElementById('avatar1');
  let avatar2 = document.getElementById('avatar2');
  let avatar3 = document.getElementById('avatar3');

  // Para elegir rol; usuario/admin
  if(!usuario.checked && !admin.checked){

    rolElegido = false;
    console.log("Tienes que elegir un rol");
  }else{
    rolElegido = true;
  }

  // Comprobar si hay avatar seleccionado y cual es:
  if (!avatar1.checked && !avatar2.checked && !avatar3.checked) {
    avatarElegido = false;
    console.log("Tienes que elegir un avatar");
} else {
    avatarElegido = true;

}
  if(userName === "" || userEmail ==="" || password ===""){
    console.log("El campo está vacío");
    camposCompletos = false;

  }else{

    camposCompletos = true;
    console.log("LLego hasta aqui");
  }

  // Parte validación email:
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(re.test(userEmail.trim())){

    emailValido = true;

  }else{
    console.log("Su email no es válido.");
    emailValido = false;
  }

  // Requisitos para el password, 8 caracteres almenos con minus y mayus, + caracter especial:
  let contraseñaValida = false;
  const patronPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  if(patronPassword.test(password.trim())){

    contraseñaValida = true;

  }else{

    console.log("Su contraseña no tiene un formato válido");
      contraseñaValida = false;
  }

  // Si todos los campos están validados correctamente:
  if(camposCompletos == true && emailValido == true && contraseñaValida == true && avatarElegido == true && rolElegido == true){
    insertarUsuario();
  }
}

function insertarUsuario() {

  let nombreUsuario = document.getElementById('userName').value;
  let emailUsuario = document.getElementById('emailUser').value;
  let pwdUsuario = document.getElementById('password').value;

  // Imágenes avatar
  let avatar1 = document.getElementById('avatar1');
  let avatar2 = document.getElementById('avatar2');
  let avatar3 = document.getElementById('avatar3');

  let rolEscogido;

      // Verificar qué tipo de rol se ha escogido:
      if (document.getElementById('usuario').checked) {
        rolEscogido = 'usuario';

      } else if (document.getElementById('administrador').checked) {

        rolEscogido = 'administrador';
      }

  let rutaAvatar;

      // Para obtener la ruta de la imagen del avatar seleccionado:
      if (avatar1.checked) {
          rutaAvatar = document.getElementById('avatar1-img').getAttribute('src');

      } else if (avatar2.checked) {
          rutaAvatar = document.getElementById('avatar2-img').getAttribute('src');

      } else if (avatar3.checked) {
          rutaAvatar = document.getElementById('avatar3-img').getAttribute('src');
      }
  
  
  // Recibe 2 parámetros: la transacción sobre la tabla y qué tipo de transacción se lleva a cabo (por defecto readonly).
  let transaccion = bd.transaction([TABLA_USERS], "readwrite");
  let usuarios = transaccion.objectStore(TABLA_USERS);
  let conectado = 1; // 1 para conectado, 0 para desconectado

      // Crear objeto con los datos del usuario
      let usuarioData = {
        userName: nombreUsuario,
        email: emailUsuario,
        password: pwdUsuario,
        rol: rolEscogido,
        avatar: rutaAvatar,
        conectado: conectado
      };

  // Agregar el objeto a la base de datos
  usuarios.add(usuarioData);

  // Cerrar la conexión después del insert:
  transaccion.oncomplete = function () {
          bd.close();
          // Si el rol escogido del usuario que acabamos de insertar es el de usuario lo redirigimos
          // al home:
          if(rolEscogido === 'usuario'){

            window.location.href = "index.html";

            // Para login automatico:
            abrirBaseDatos();

          }else if(rolEscogido === 'administrador'){

            abrirBaseDatos();
          }
  };
}

// FUNCION SECUNDARIA DE ABRIR BASE DE DATOS, LLAMA A LOGINAUTOMATICO CUANDO UN USUARIO SE REGISTRA:
function abrirBaseDatos(){

    let solicitud = indexedDB.open('usersBD');

        solicitud.onsuccess = function (event) {

              bd = event.target.result;
            
              // Llama a la función para leer y mostrar los datos,
              // utilizada cuando se acaba de registrar un usuario:
              loginAutomatico();
        };
        
    solicitud.onerror = function (event) {
      console.error("Error al abrir la base de datos: ", event.target.error);
    };
}

// Funcion a la que se llama cuando el usuario se registar, logea automatico:
function loginAutomatico() {

 // Abre una transacción para la tabla de usuarios
 let transaccion = bd.transaction([TABLA_USERS], 'readonly');
 let usuarios = transaccion.objectStore(TABLA_USERS);
 let nombreUsuario;
 let avatar;

 // Abre un cursor para iterar sobre los datos
 let cursorRequest = usuarios.openCursor();

      cursorRequest.onsuccess = function (event) {

          let cursor = event.target.result;

                // itera sobre los datos de la TABLA_USERS:
                if (cursor) {
                  
                  nombreUsuario = cursor.value.userName;
                  avatar = cursor.value.avatar;

                  cursor.continue();

                  //  cuando para la iteracion:
                } else {

                      // Para dom:
                      document.getElementById('avatarUsuario').setAttribute('src', avatar);
                      document.getElementById('nombreUsuario').textContent = `Hola ${nombreUsuario}`;
                      }
            }
      cursorRequest.onerror = function (event) {
        console.error("Error al abrir el cursor: ", event.target.error);
      };

      transaccion.oncomplete = function () {
      bd.close();
      
      };
 }

 // dispara solo abrir el navegador, por eso parametro load
window.addEventListener('load', (event) =>{

    iniciarBaseDatos();

            document.addEventListener("change", function (event){
              // Cogemos todos los botones de tipo radio y aquellos que comparten el atributo seleccion dado por el name:
              if (event.target.type === "radio" && event.target.name === "seleccion") {
                // Ocultar todas las imágenes de avatares
                avatarImagenes.forEach((img) => {
                  img.style.display = "none";
                });

                //Mostramos la seleccionada solamente, nextElementSibling para coger el label, asociada al input, que luego tiene asociada la img:
                const imagenSeleccionada = event.target.nextElementSibling.querySelector("img");
                imagenSeleccionada.style.display = "block";
              }
            });

            //Evento para el botón reset cuando se hacew click, se muestran de nuevo todas las imagenes:
            resetButton.addEventListener('click', function(){
              // Mostrar todas las imágenes de avatares
              avatarImagenes.forEach((img) => {
                img.style.display = "block";
              });
            });

            // Evento para el formulario al hacer clic en el botón "Add user"
            addUser.addEventListener('click', function (event) {
              
              // Evitar que el formulario se envíe automáticamente
              event.preventDefault();

              validarFormulario();
            });

    // Botón de login:
  // loginButton.addEventListener('click', login);

  // enlaceLogout.addEventListener('click', logout);

});

function logout() {
   
  let transaccion = bd.transaction([TABLA_USERS], "readwrite");
  let usuarios = transaccion.objectStore(TABLA_USERS);

  let cursorRequest = usuarios.openCursor();

  let conectado;

  cursorRequest.onsuccess = function (event) {

    let cursor = event.target.result;

    if(cursor){
     
      conectado = cursor.value.conectado;

      // Verifica si el usuario está conectado
      if (conectado === 1) {
        // si es asi lo desconecta
        cursor.value.conectado = 0;

      }

      cursor.continue();
    } else {

      if (conectado === 0) {

           //borarr contenido dme la imagen y el nombre:
          //  document.getElementById('avatarUsuario').innerHTML = "";
          //  document.getElementById('nombreUsuario').textContent = "";       
      } 
    }
  };
}

// Para login de usuarios, si esta registrado entra, sino lanza aviso para registro:
// function login(){

//   // Capturamos los datos introducidos por usuario en login:
//   let userNameLogin = document.querySelector('#userNameLogin').value.trim();
//   let passwordLogin = document.querySelector('#passwordLogin').value.trim();
  
//   // abrimos base de datos:
//   iniciarBaseDatos();

//   leerDatosLogin(userNameLogin,passwordLogin);
// }

// Compara datos introducidos con los de la base de datos para autenticar:
function leerDatosLogin(userNameLogin,passwordLogin){

      // Vamos a base de datos a leer y comparar los datos obtenidos del form del login:
      let transaccion = bd.transaction(TABLA_USERS, 'readonly');
      let usuarios = transaccion.objectStore(TABLA_USERS);
      let nombreUsuario;
      let contraseña;
      let avatar;
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

          cursor.continue();

        } else {
             // Comparar los datos introducidos con los datos que existen en la db
            //  para ver si existe el usuario en la base de datos
             if(userNameLogin === nombreUsuario && passwordLogin === contraseña){

                        // Darle los valores en el DOM, sacados de IndexedDB:
                    document.getElementById('avatarUsuario').setAttribute('src', avatar);
                    document.getElementById('nombreUsuario').textContent = `Hola ${nombreUsuario}`;

                  if(rol === 'usuario'){
                    // Aqui vendria la redireccion a index
                     
                    // Faltaria cuando sepa como mantener la sesion actualizar el conectado que vendria valor 0 a 1

                  }else if(rol === 'administrador'){
                    // Aqui vendria la redireccion a pagina admin
                  }
                }else{
                  // se informa al usuario y se le redirige a página de registro por si quiere registrarse:
                  console.log("Usuario no registrado.")
                  window.location.href = "form.html";
                }
             }   
        }
}

// Función que rastrea al abrirse el navegador si hay usuarios con valor 1, es decir, conectados, si los hay muestra avatar y usuario y recupera su info:
function verSiHayUsuariosConectados(){

    // Vamos a base de datos a leer y comparar los datos obtenidos del form del login:   
     let transaccion = bd.transaction([TABLA_USERS],"readonly");
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

          cursor.continue();

        } else {
          // Cuando acabe cursor ver si hay algun usuario conectado:
            if(conectado === 1){

                      // Darle los valores en el DOM, sacados de IndexedDB:
                      document.getElementById('avatarUsuario').setAttribute('src', avatar);
                      document.getElementById('nombreUsuario').textContent = `Hola ${nombreUsuario}`;
                      nombreUsuario = nombreUsuario;
                      contraseña = contraseña;
                      email = email;
                      rol = rol;

                      // Darle visibilidad al enlace de logout que dispara la actualizacion del conectado a desconectado
                      enlaceLogout.style.display = 'inline-block';
            }else{
              console.log("No hay ningun usuario conectado.");
            }
        }
}
}





