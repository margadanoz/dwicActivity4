// Import del script de iniciar base de datos:
import { bd,TABLA_USERS,iniciarBaseDatos,logout} from '/scripts/scriptIniciarBD.js';

export function readUser() {
    let transaccion = bd.transaction([TABLA_USERS], 'readonly');
    let usuarios = transaccion.objectStore(TABLA_USERS);
  
    //miramos el usuario que esta conectado y nos traemos sus datos:
    let index = usuarios.index('conectado');
    let singleUserRequest = index.get(1);
  
    singleUserRequest.onsuccess = function (event) {
      let user = event.target.result;
  
      if (user) {
        let userName = user.userName;
        let userPwd = user.password;
        let userAvatar = user.avatar;
        let userRol = user.rol;
        let userConectado = user.conectado;
        let userEmail = user.userEmail;
        let userId = user.id;

        
        user = {
            userName,
            userPwd,
            userAvatar,
            userRol,
            userConectado,
            userEmail,
            userId
        };

      } else {
        console.log("Usuario no encontrado");
      }
  
      transaccion.oncomplete = function () {
        // Llenar el contenido en el resultadoBusqueda después de completar la transacción
        mostrarUsuario(user);
      };
    };
  }
  

  // Esta función mostrará la información del usuario en el HTML:
export function mostrarUsuario(usuario) {
   
    let resultadoBusquedaUser = document.querySelector('.cajaInfoForm');
    resultadoBusquedaUser.innerHTML = '';

    // Formato para el div que está vacío en el admin.html:
    resultadoBusquedaUser.innerHTML +=
      "<div style='margin-bottom:2%; text-align:center;justify-content:center'>" +
      "<form id='formEdit" + usuario.userId + "' class='form' style='padding:10px;'>" +
      "<label for='edit_nombreUsuario' class='form-label'>Nombre de Usuario:</label>" +
      "<input type='text' id='edit_nombreUsuario' placeholder='" + usuario.userName + "' class='form-control-sm'><br>" +
      
      "<label for='edit_rol'>Rol:</label>" +
      "<div class='form-check'>" +
      "<input class='form-check-input' type='radio' name='edit_rol' id='edit_rol_usuario" + usuario.userId + "' value='usuario' " + (usuario.userRol === 'usuario' ? 'checked' : '') + ">" +
      "<label class='form-check-label' for='edit_rol_usuario" + usuario.userId + "'>Usuario</label>" +
      "</div>" +
      "<label for='edit_conectado'>Conectado:</label>" +
      "<input type='text' id='edit_conectado' value='" + usuario.userConectado + " 'class='form-control-sm' readonly><br>" +
      "<label for='edit_email'>Email:</label>" +
      "<input type='email' id='edit_email' placeholder='" + usuario.userEmail + "' class='form-control-sm'><br>" +
      "<label for='edit_id'>ID:</label>" +
      "<input type='text' id='edit_id' value='" + usuario.userId + "'class='form-control-sm' readonly><br>" +
      "<label for='avatarActual'>Avatar Actual: </label>" +
      "<img src='" + usuario.userAvatar + "' alt='Avatar' style='width: 10vh;' id='avatarActual'style='margin-bottom:5px;border-radius:5px;width:50%;'><br>" +
  
      "<label style='margin-top:10px;'>Elegir Avatar:</label>" +
      "<input type='radio' name='avatarRadio' id='avatar1' value='ruta_a_imagen1.jpg'>" +
      "<label for='avatar1'><img src='imagenes/avatar1.png' alt='Avatar 1' style='width: 5vh;'></label>" +
      "<input type='radio' name='avatarRadio' id='avatar2' value='ruta_a_imagen2.jpg'>" +
      "<label for='avatar2'><img src='imagenes/avatar2.png' alt='Avatar 2' style='width: 5vh;'></label>" +
      "<input type='radio' name='avatarRadio' id='avatar3' value='ruta_a_imagen3.jpg'>" +
      "<label for='avatar3'><img src='imagenes/avatar4.jpeg' alt='Avatar 3' style='width: 5vh;margin-bottom:5px;'></label><br>" +
      "<button type='button' user_id=" + usuario.userId + " id=save_changes_usuario" + usuario.userId + " style='margin-top:5px;'>Save Changes</button> " +
      "</form>" +
      "<hr>" +
      "</div>" +
      "<div >" +
      usuario.userId + " " +
      usuario.userName + " " +
     
      usuario.userRol + " " +
      usuario.userConectado + " " +
      usuario.userEmail + " " +
      "<img src='" + usuario.userAvatar + "' alt='Avatar' style='width: 10vh;' id='avatarActual'><br>" +
      "<button user_id=" + usuario.userId + " id=edit_user" + usuario.userId + ">Edit user</button> " +
      "<button user_id=" + usuario.userId + " id=delete_user" + usuario.userId + " style=margin-bottom:3%;>Delete user</button>" +
      "<hr>" +
      "</div>";
    
  
    // Validar formulario antes de enviarlo:
    let botonSaveChanges = document.getElementById("save_changes_usuario" + usuario.userId);
  
    if (botonSaveChanges) {

      botonSaveChanges.addEventListener("click", function () {
        // Utiliza el objeto usuarioActual para actualizar el usuario
        actualizarContacto(usuario);
      });
    }

    agregarEditEventListener(usuario.userId);

    document.getElementById("delete_user" + usuario.userId).addEventListener("click", deleteUser, false);
  
    function agregarEditEventListener(id) {
      document.getElementById("edit_user" + id).addEventListener("click", function () {
        editUser(id);
      }, false);
    }
  }

  let rolSeleccionat;
  let rutaAvatar;

//   Funció per possar els valors a editar als camps del form:
  function editUser(id) {
  
    var transaccion = bd.transaction([TABLA_USERS], 'readwrite');
    var almacen = transaccion.objectStore(TABLA_USERS);
    
    // Vamos a la base de datos a x la info:
    let solicitud = almacen.get(id);

    let usuarioActual = "";
  
    solicitud.addEventListener("success", function () {
      // Almacena los valores del formulario de edición en el objeto usuarioActual
      usuarioActual = {
        userId: solicitud.result.id,
        userName: solicitud.result.userName,
        userPwd: solicitud.result.password,
        userConectado: solicitud.result.conectado,
        userEmail: solicitud.result.userEmail,
        userAvatar: solicitud.result.avatar,
        userRol: solicitud.result.rol
      };
  
      // Asigna los valores del usuario actual a los campos del formulario
      document.getElementById('edit_nombreUsuario').value = usuarioActual.userName;
      document.getElementById('edit_conectado').value = usuarioActual.userConectado;
      document.getElementById('edit_email').value = usuarioActual.userEmail;
      document.getElementById('edit_id').value = usuarioActual.userId;
      document.getElementById('avatarActual').value = usuarioActual.userAvatar;
    });
  }
  
//   Comprova que tots els camps del form estiguin bé i si es així actualitza l'usuari:
  function actualizarContacto(usuario) {

    // Booleans per comprovar el form:
    let rolElegido = true;
    let avatarElegido = true;
    let camposCompletos = true;
    let emailValido = true;

        
      // Obtener elementos del formulario
      let userName = document.querySelector('#edit_nombreUsuario').value.trim();
      let userEmail = document.querySelector('#edit_email').value.trim();
      // let password = document.querySelector('#edit_contraseña').value.trim();
      let avatar1 = document.querySelector('#avatar1');
      let avatar2 = document.querySelector('#avatar2');
      let avatar3 = document.querySelector('#avatar3');
      // Selecció per les etiquetes que pertanyen admin/usari, sino feia aixi em donaba error
      let usuarioRadio = document.querySelector('.form-check-input[name="edit_rol"][value="usuario"]');
    //   let adminRadio = document.querySelector('.form-check-input[name="edit_rol"][value="administrador"]');
      
      if (!usuarioRadio.checked) {
        rolElegido = false;
        console.log("Tienes que elegir un rol");
      } else {
        // Verificar qué tipo de rol se ha escogido:
        if (usuarioRadio.checked) {
          rolSeleccionat = 'usuario';
        }
        rolElegido = true;
      }
    
      // Comprobar si hay avatar seleccionado y cual es:
      if (!avatar1.checked && !avatar2.checked && !avatar3.checked) {
        avatarElegido = false;
        console.log("Tienes que elegir un avatar");
    } else {
        // Insercion directa de rutas poque me daba problemas en este form por su formato al coger el src:
        if (avatar1.checked) {
            rutaAvatar = 'imagenes/avatar1.png';
  
        } else if (avatar2.checked) {
            rutaAvatar = 'imagenes/avatar2.png';
  
        } else if (avatar3.checked) {
            rutaAvatar = 'imagenes/avatar4.jpeg';
        }
        avatarElegido = true;
    
    }
      if(userName === "" || userEmail ===""){
        console.log("El campo de nombre o email está vacío");
        camposCompletos = false;
    
      }else{
    
        camposCompletos = true;
        // console.log("LLego hasta aqui");
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
      // let contraseñaValida = false;
      // const patronPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      // if(patronPassword.test(password.trim())){
    
      //   contraseñaValida = true;
    
      // }else{
    
      //   console.log("Su contraseña no tiene un formato válido");
      //     contraseñaValida = false;
      // }
    
      // Si todos los campos están validados correctamente:
      if(camposCompletos == true && emailValido == true && avatarElegido == true && rolElegido == true){
        
        let conectado = document.getElementById('edit_conectado').value.trim();
        conectado = +conectado;
  
        var tx = bd.transaction([TABLA_USERS], 'readwrite');
        var store = tx.objectStore(TABLA_USERS);
      
        let solicitud = store.get(usuario.userId);
      
        solicitud.addEventListener("success", function () {
          // Variable para almacenar el resultado final de la solicitud si tiene éxito:
          let usuarioActualizado = solicitud.result;
      
          usuarioActualizado.userName = userName ;
          usuarioActualizado.userEmail = userEmail ;
          // Mantenim la mateixa contrassenya que ens ve de la base de dades:
          usuarioActualizado.password = usuarioActualizado.password ;
          usuarioActualizado.rol = rolSeleccionat;
          usuarioActualizado.avatar = rutaAvatar;
          usuarioActualizado.conectado = conectado;
      
          let req = store.put(usuarioActualizado);
      
          req.onsuccess = function (e) {
            console.log("Usuario actualizado correctamente");
            readUser();
            // Per forçar canvi d'avatar i nom a la pàgina quan s'actualitza:
            window.location.href="settings.html";
          };
      
          req.onerror = function (e) {
            console.error("Error al actualizar el usuario", e.target.error);
          };
        });
      }
  }
  

//   Para eliminar al usuario:
function deleteUser(e){

    console.log("deleteUser");
    let buttonId= e.target.id;
    let userId = document.getElementById(buttonId).getAttribute("user_id");
    
      let transaccion = bd.transaction(TABLA_USERS, "readwrite"); 
      let almacen = transaccion.objectStore(TABLA_USERS);
  
      //Delete data in our ObjectStore
      let req = almacen.delete(+userId);

      req.onsuccess = function(e){
        // Hacemos logout para que retorne al index y expulsar al usuario del html, sino se queda su avatar y su userName
        
          logout();
  
        console.log("deleteUser: Data successfully removed: " + userId);  
      };
  
      req.onerror = function(e){
        console.error("deleteUser: Error borrando datos:", e.target.errorCode);
      };
  
      transaccion.oncomplete = function() {
        console.log("deleteUser: transacción completada.");
         
        // bd.close();  
      };
  }

  // EJECUCION DE APERTURA DE BASE DE DATOS Y RASTREO EN WEB DE USUARIOS CONECTADOS
  window.addEventListener('load', (event) =>{
    iniciarBaseDatos();

    // Obtenim botó del dom per manipular tema
    let temaToggleButton = document.getElementById("temaToggle");
    let body = document.body;

    // Ens manté d'una pàgina a l'alter el tema seleccionat mirant al localStorage quin hem escollit:
    let temaGuardado = localStorage.getItem("tema");

    body.classList.toggle("temaOscuro", temaGuardado === "oscuro");

    temaToggleButton.addEventListener("click", function () {
        // Canvia text botó segons pitjin
        if (temaToggleButton.innerHTML === "Switch to dark theme") {
          temaToggleButton.innerHTML = "Switch to light theme";

        } else if(temaToggleButton.innerHTML === "Switch to light theme"){
          temaToggleButton.innerHTML = "Switch to dark theme";
        }

        // Segons pitjin canvia a fosc o clar.
        body.classList.toggle("temaOscuro");

        //Guardem a localStorage, sino quan es salta de pàgina no es manté:
        let temaActual = body.classList.contains("temaOscuro") ? "oscuro" : "claro";
        localStorage.setItem("tema", temaActual);
    }); 
     
});

