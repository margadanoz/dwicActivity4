// Import del script de iniciar base de datos:
import { bd,TABLA_USERS,iniciarBaseDatos} from '/scripts/scriptIniciarBD.js';


// imagenes de avatares por el tipo de elemento que son, su atributo name y el tipo de dato que son, img
let avatarImagenes = document.querySelectorAll('input[type="radio"][name="seleccion"] + label img'); 
// Botón reset de avatares:
let resetButton = document.querySelector('#resetButton');
// Boton para añadir usuario:
let addUser = document.querySelector('#addUser');
// Para coger del dom enlace del admin:
let admin = document.querySelector('#admin');

// EVENTOS ASOCIADOS AL FORMULARIO DE REGISTRO:
// Evento para el formulario al hacer clic en el botón "Add user"
    addUser.addEventListener('click', function (event) {
                
        // Evitar que el formulario se envíe automáticamente
        event.preventDefault();

        validarFormulario();
    });
//   PARA LOS AVATARES:
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
              loginAutomatico();
  
            }else if(rolEscogido === 'administrador'){
  
              window.location.href = "admin.html";
              admin.style.display = 'inline-block';
              loginAutomatico();
              
            }
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

    // EJECUCION DE APERTURA DE BASE DE DATOS Y RASTREO EN WEB DE USUARIOS CONECTADOS
    window.addEventListener('load', (event) =>{

        iniciarBaseDatos();
    
    });

    

  

