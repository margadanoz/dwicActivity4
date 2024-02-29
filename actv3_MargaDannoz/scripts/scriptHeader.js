import HeaderNou from '../scripts/headerComponent.js'; 

          const {createApp } = Vue;
          createApp({
             data: function() {
              return{
                imatge: 'imagenes/logo.png',
                linkhome: 'index.html',
                linkregister: 'form.html',
                linklogin: 'loginForm.html',
                linkadmin: 'admin.html',
                linksettings: 'settings.html',
                linkposts: 'posts.html'
              }
            },
            components:{
                  HeaderNou
                }
          }).mount('#app');