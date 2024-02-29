export default{
    name: 'HeaderNou',
    props: ['imatge','linkhome','linkregister','linklogin','linkadmin','linksettings','linkposts'],
    template:`
    <header class="container-fluid">
            <nav class="navbar row">
            <nav class="navbar col-5" href="#">
                    <img class="logo"
                    :value="imatge"
                    :src="imatge"
                    alt="Bootstrap"
                    width="145"
                    height="145"
                    />
                    <span class="h1 bounce" style="margin-left: 20px">Travel Doggie</span>
                </nav>
                    <div class="col-5">   
            <div class="contenidoUsuario">
                <img src="" alt="" class="img-fluid" id="avatarUsuario" width="40vh;">
                <p id="nombreUsuario"></p>
            </div>
            </div>
            <div class="col-2">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#menuLateral"
            >
              <img
                src="imagenes/grup.png"
                alt=""
                class="img-fluid"
                id="iconMenuButton"
                style="max-width: 5vh"
              />
              </button>
              <div
            class="offcanvas offcanvas-end"
            id="menuLateral"
            tabindex="-1"
            style="background-color: #721121"
          >
          <div class="offcanvas-header" data-bs-theme="dark">
              <h5>Menu</h5>
              <button
                class="btn-close"
                type="button"
                aria-label="Close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>
            <div class="offcanvas-body">
              <!-- Falta ir enlazandolo todo -->
              <ul class="list-group">
                <li class="list-group-item">
                  <a :href="linkhome" class="enlaceDesplegable">Home</a>
                </li>
                <li class="list-group-item">
                  <a :href="linkregister" class="enlaceDesplegable">Register</a>
                </li>
                <li class="list-group-item">
                  <a :href="linklogin" class="enlaceDesplegable login">Login</a>
                </li>
                <li class="list-group-item">
                  <a href="#" class="enlaceDesplegable logout" id="logout" style="cursor:pointer;">Logout</a>
                </li>
                <li class="list-group-item">
                  <a :href="linkadmin" class="enlaceDesplegable admin" id="admin">Admin</a>
                </li>
                <li class="list-group-item">
                  <a :href="linksettings" class="enlaceDesplegable settings" id="settings">Settings</a>
                </li>
                <li class="list-group-item">
                  <a :href="linkposts" class="enlaceDesplegable posts" id="posts">Posts</a>
                </li>
                </ul>
            </div>
          </div>
        </div>
        </nav>
    </header> `,  
}