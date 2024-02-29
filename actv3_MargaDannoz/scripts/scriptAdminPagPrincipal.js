// Import del script de iniciar base de datos:
import { bd,TABLA_USERS,iniciarBaseDatos,verSiHayUsuariosConectados} from '/scripts/scriptIniciarBD.js';

// DOM:
export let resultadoBusqueda = document.querySelector('.cajaInfo');

//per mantenir la contrassenya:
let passwordUser;
 
// Leerá la info de los usuarios para imprimirla en el html:
export function readUsers() {

  passwordUser = "";

  let transaccion = bd.transaction([TABLA_USERS], 'readonly');
  let usuarios = transaccion.objectStore(TABLA_USERS);

  // Array para almacenar la información de los usuarios
  let usuariosArray = []; 

  let cursorRequest = usuarios.openCursor();

  cursorRequest.onsuccess = function (event) {
    let cursor = event.target.result;

    if (cursor) {
      let nombreUsuario = cursor.value.userName;
      // passwordUser = cursor.value.password;
      let avatar = cursor.value.avatar;
      let rol = cursor.value.rol;
      let conectado = cursor.value.conectado;
      let email = cursor.value.userEmail;
      let id = cursor.value.id;

      // Si imprimo directamente el html aqui me salen duplicados.
      // por eso almacenaje en array:
      usuariosArray.push({
        nombreUsuario,
        // contraseña,
        avatar,
        rol,
        conectado,
        email,
        id
      });

      console.log("Dentro de la funcion de readUsers()", usuariosArray);

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

  // Recorremos el array con los datos para sacarlo en el div que tenemos vacío
  for (let i = 0; i < usuariosArray.length; i++) {

    // Formato para el div que está vacío en el admin.html:
    resultadoBusqueda.innerHTML +=
  
  "<div >" +
  usuariosArray[i].id + " "+
  usuariosArray[i].nombreUsuario + " "+
  
  usuariosArray[i].rol + " "+
  usuariosArray[i].conectado + " "+
  usuariosArray[i].email + " "+
  "<img src='" + usuariosArray[i].avatar + "' alt='Avatar' style='width: 10vh;' id='avatarActual'><br>" +
  "<button user_id=" + usuariosArray[i].id + " id=edit_" + usuariosArray[i].id + ">Edit user</button> " +
  "<button user_id=" + usuariosArray[i].id + " id=delete_" + usuariosArray[i].id + " style=margin-bottom:3%;>Delete user</button>" +
  "<button user_id=" + usuariosArray[i].id + " id=save_changes" + usuariosArray[i].id + " style=margin-bottom:3%;>Save Changes</button>" +
  "<hr>" +
  "</div>"; 
  }

  // Recorrem array agafant l'id del usuari quan es pitjin els respectius botons i cridem funcions asociades
  for (let i = 0; i < usuariosArray.length; i++) {

    document.getElementById("edit_"+usuariosArray[i].id).addEventListener("click", readUserToEdit, false);
   
    document.getElementById("save_changes"+usuariosArray[i].id).addEventListener("click", insertEditUser, false);;

    document.getElementById("delete_"+usuariosArray[i].id).addEventListener("click", deleteUser, false);
  }
}

  // per llegir dades de l'usuari i mostrarles posteriorment
  function readUserToEdit(e){
    // console.log("readUser");
 
    let userId = e.target.getAttribute("user_id");
  
    
      console.log("Id user: " + userId);
  
      let transaccion = bd.transaction(TABLA_USERS, "readonly"); 
      let store = transaccion.objectStore(TABLA_USERS);
  
      //Obtenim id de l'usuari en questió:
      let req = store.get(+userId);
      
      req.onsuccess = function(e){

        let record = e.target.result;
        console.log(record);  
        
        //Després de llegir l'usuari el passem a la següent funció que mostrarà les dades a editar al form:
        updateFormInputsToEdit(record);
      };
  
      req.onerror = function(e){
        console.error("readUser: error reading:", e.target.errorCode);
      };
  
      transaccion.oncomplete = function() {
        console.log("readUser: transaction completed");
        
      };
  }

  // OMPLE EL FORM AMB ELS VALORS QUE VENEN DE LA DB:
  function updateFormInputsToEdit (record){
    const esUsuario = record.rol === 'usuario';
    const esAdministrador = record.rol === 'administrador';
    document.getElementById("edit_nombreUsuario").value = record.userName;
    document.getElementById('edit_rol_usuario').checked = esUsuario;
    document.getElementById('edit_rol_admin').checked = esAdministrador;
    document.getElementById("edit_conectado").value = record.conectado;
    document.getElementById("edit_email").value = record.userEmail;
    document.getElementById("avatarActual").value = record.avatar;
    document.getElementById("edit_id").value = record.id;
    document.getElementById("avatarActual").src = record.avatar;
    // Com no la mostrem en lloc la pwd...:
    passwordUser = record.password;
  }

    // PER INSERTAR USUARI DESDE EL BOTÓ SAVE_CHANGES:
  function insertEditUser(){

    // Variables per emmagatzemar respectius valors de rol e imatges:
    let rolEscollit;
    let rutaAvatar;
    // Boolean peer verificar abanas d'isnertar usuari que els camps no estan buits
    let camposCompletos = false;   
    let avatarElegido = true; 

    let nomUsuari = document.getElementById("edit_nombreUsuario");
    let userId = document.getElementById("edit_id");
    let conectat = document.getElementById("edit_conectado");
    let userEmail = document.getElementById("edit_email");
    let avatar1 = document.getElementById("avatar1");
    let avatar2 = document.getElementById("avatar2");
    let avatar3 = document.getElementById("avatar3");

    if(!document.getElementById('edit_rol_usuario').checked){

          rolEscollit = 'administrador';
          
    }else if(!document.getElementById('edit_rol_admin').checked){

      rolEscollit = 'usuario';
      
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
      
      if(nomUsuari === "" || userEmail ===""){
        console.log("El campo del nombre o el email está vacío.");
        camposCompletos = false;
    
      }else{
    
        camposCompletos = true;
        console.log("LLego hasta aqui");
      }
      // Construimos el objeto a insertar con los datos:
      let obj = { id: parseInt(userId.value), 
              userName: nomUsuari.value,   
              userEmail: userEmail.value,
              password: passwordUser,
              rol: rolEscollit,
              avatar: rutaAvatar,
              conectado: parseInt(conectat.value) };
              
  
              let transaccion = bd.transaction(TABLA_USERS, "readwrite");   
              let store = transaccion.objectStore(TABLA_USERS);

  //Actaulitzar objecte a database:
  let req = store.put(obj);

  req.onsuccess = function (e) {
    console.log("Data successfully updated");
    
    //Netejar camps i forçar reload de la pagina per actualitzar avatar
    // i nom d'usuari en cas de que sigui l'admin qui s'el canviï
    document.getElementById("edit_nombreUsuario").value = " ";
    document.getElementById(`edit_rol_usuario`).checked = " ";
    document.getElementById(`edit_rol_admin`).checked = " ";
    document.getElementById("edit_conectado").value =" ";
    document.getElementById("edit_email").value = " ";
    document.getElementById("avatarActual").value = " ";
    document.getElementById("edit_id").value = " ";
    document.getElementById("avatarActual").src = " ";
    window.location.reload();
    readUsers();
  };

  req.onerror = function(e) {
    console.error("editUser: Error updating data", this.error);   
  };

  transaccion.oncomplete = function() {
    console.log("editUser: transaction completed");
  };
  }
  }


  // PER ELIMINAR USUARI:
function deleteUser(e) {
  console.log("deleteUser");

  let button_id = e.target.id;
  let user_id = document.getElementById(button_id).getAttribute("user_id");

  console.log(user_id);
  let transaccion = bd.transaction(TABLA_USERS, "readwrite");
  let store = transaccion.objectStore(TABLA_USERS);

  // Obtener el usuario antes de eliminarlo
  let getRequest = store.get(parseInt(user_id));

  getRequest.onsuccess = function (e) {
    let user = e.target.result;

    // Verificar los valores de los campos rol y conectado, para ver si es admin y asi salir de la pagina:
    let rolAntiguo = user.rol;
    let conectadoAntiguo = user.conectado;

    
      //Eliminació de l'usuari:
      var req = store.delete(parseInt(user_id));

      req.onsuccess = function (e) {

        console.log("deleteUser: Data successfully deleted: " + user_id);

        // Si entra es que era l'admin qui hi havia a la pagina, per tant, sortim:
        if (rolAntiguo === "administrador" && conectadoAntiguo === 1) {
        
        window.location.href = "index.html";
           // Limpiar la entrada de tema en localStorage
           localStorage.removeItem("tema");

        // Si es un altre usuari continuem llegint:
      } else {
        readUsers();
      }
      };

      req.onerror = function (e) {
        console.error("deleteUser: error deleting:", e.target.errorCode);
      };

      transaccion.oncomplete = function () {
        console.log("deleteUser: transaction completed");
      };
    
  };

  getRequest.onerror = function (e) {
    console.error("deleteUser: error retrieving user data:", e.target.errorCode);
  };
}


    // EJECUCION DE APERTURA DE BASE DE DATOS Y RASTREO EN WEB DE USUARIOS CONECTADOS
    window.addEventListener('load', (event) =>{
      iniciarBaseDatos();

      let temaToggle2Button = document.getElementById("temaToggle2");
      let body = document.body;
      // Ens manté d'una pàgina a l'alter el tema seleccionat mirant al localStorage quin hem escollit:
      let temaGuardado = localStorage.getItem("tema");

      body.classList.toggle("temaOscuro", temaGuardado === "oscuro");

    temaToggle2Button.addEventListener("click", function () {
        // Canvia text botó segons pitjin
        if (temaToggle2Button.innerHTML === "Switch to dark theme") {
          temaToggle2Button.innerHTML = "Switch to light theme";

        } else if(temaToggle2Button.innerHTML === "Switch to light theme"){
          temaToggle2Button.innerHTML = "Switch to dark theme";
        }

        // Segons pitjin canvia a fosc o clar.
        body.classList.toggle("temaOscuro");

        //Guardem a localStorage, sino quan es salta de pàgina no es manté:
        let temaActual = body.classList.contains("temaOscuro") ? "oscuro" : "claro";
        localStorage.setItem("tema", temaActual);
    }); 
  });


