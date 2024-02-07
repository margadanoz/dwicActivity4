let clientId = 'e18b07ec08f4454f8fd09a39d0a4aae0';
let clientSecret = '5d785afb155d465fbb7832744771cecc';
let access_token = '';
// per si no hi ha imatge posar una per defecte
let rutaImagen = '/cascos.jpg';
let divCancionesRetornadas = $('#cancionesRetornadas');
let divArtistasRetornados = $('#artistasRetornados');
// per mostrar missatge quan no hi han resuktats:
let noResults = document.querySelector('#noResults');

// modal per treure els albums:
let modalAlbums = $('.modal');
// estils perque surti centrat el contingut al modal:
$('.modal').css({
    'text-align':'center',
    'padding':40
})

// funció de neteja del modal
function limpiarModal(){

        // esborrem contingut anterior si existís per presentar el nou:
        $('.cancionesAlbumArtista').empty();
        $('.tituloCanciones').empty();
        $('.detalleCancion').empty();
        $('.albumArtista').empty();
}

function Spotify() {
    this.apiUrl = 'https://api.spotify.com/';
  }

    // funcions per mostrar els artistes:
    function crearEspacioArtistas(artistas){
        // buidat del input:
        $('#inputBuscador').val(' ');
        
        for(let i = 0; i < artistas.length;i++){

            // per associar camp images als que no tenen imatges:
            if(artistas[i].images.length === 0){

                artistas[i].images[0] = rutaImagen;
                divArtistasRetornados.append('<div class="artistId" id="' + artistas[i].id + '"><h1>' + artistas[i].name + '</h1><img id="imgArtist" src="'+ artistas[i].images[0] +'"><h3>Popularity: '+artistas[i].popularity+'</h3></div><br>');

            }else{
                divArtistasRetornados.append('<div class="artistId" id="' + artistas[i].id + '"><h1>' + artistas[i].name + '</h1><img id="imgArtist" src="'+ artistas[i].images[0].url +'"><h4>Popularity: '+artistas[i].popularity+'</h4></div><br>');
            }
        }    

        $('#inputBuscador').on('keyup', function(){
            // buidem containers quan esborrin al cercador
            divArtistasRetornados.empty();
            divCancionesRetornadas.empty();
        });
    }

    // funcion para las canciones:
    function crearEspacioCanciones(canciones){
        
        for(let i = 0; i < canciones.length; i++){

            // per so ens trovem que no té foto assignar una per defecte:
            if(canciones[i].album.images[0].url === 0){

                canciones[i].album.images[0] = rutaImagen;
                divCancionesRetornadas.append('<div class="songsInfo" data-id="' + canciones[i].id + '"><img id="imgCanciones" src="'+ canciones[i].album.images[0] +'"><h4>' + canciones[i].name + '</h4></div><br>');
            }
            divCancionesRetornadas.append('<div class="songsInfo" data-id="' + canciones[i].id + '"><img id="imgCanciones" src="'+ canciones[i].album.images[0].url +'"><h4>' + canciones[i].name + '</h4></div><br>');
        }

        //   per quan fan click a sobre d'una cançó veure la seva info:
       $('#cancionesRetornadas').on('click', '.songsInfo', function(){

        // esborrem contingut anterior si existís per presentar el nou:
       limpiarModal();
       // cercar la cancço que s'ha escollit per mostrar les seves caracteristiques:
       let idCancion = ($(this).attr("data-id"));
        console.log('id de la cancion seleccionada',idCancion);
        console.log('lista de canciones',canciones);
       //cercar a l'array de les cançons:
       let cancionSeleccionada = canciones.find(cancion => cancion.id === idCancion);
       console.log('cancion seleccionada',cancionSeleccionada);
                       // Mostrar els detalls de la cançó
           modalAlbums.append('<div class="detalleCancion"><p>Song name:'+cancionSeleccionada.name+'</p><a href="'+cancionSeleccionada.external_urls.spotify+'">Letter</a></div>')


           // obrim modal
           $('#ex1').modal({
               escapeClose: true,
               clickClose: true,
               showClose: true
           });
           
       });
    }


    // per crear el div per als albums associats a l'artista
    function crearEspacioAlbumPortArtista(albumArtista){

        // esborrem contingut anterior si existís per presentar el nou:
        limpiarModal();

        for(let i = 0; i < albumArtista.length;i++){

            if(albumArtista[i].images.length === 0){

                albumArtista[i].images = rutaImagen;
                modalAlbums.append('<div class="albumArtista" data-id="' +albumArtista[i].id+ '"><h4>'+albumArtista[i].name+'</h4><img id="imgAlbum" src="'+ albumArtista[i].images[0].url+'"><h6>'+albumArtista[i].release_date+'</h6></div>');

            }else{

                modalAlbums.append('<div class="albumArtista" data-id="' +albumArtista[i].id+ '"><h4>'+albumArtista[i].name+'</h4><img id="imgAlbum" src="'+ albumArtista[i].images[0].url+'"><h6>'+albumArtista[i].release_date+'</h6></div>');
            }
        }
    }

    // per crear el visual on es veuen les cançons del album pel modal:
    function crearEspacioCancionesAlbumEscogido(cancionesDelAlbumEscogido){

        // esborrem contingut anterior si existís per presentar el nou:
        limpiarModal();

        modalAlbums.append('<div class="tituloCanciones">SONGS OF THIS ALBUM:</div>');
        for(let i = 0; i < cancionesDelAlbumEscogido.length;i++){

            // esborrem contingut que hi havia per presentar el nou:
                $('.albumArtista').empty();
                modalAlbums.append('<div class="cancionesAlbumArtista" data-id="' +cancionesDelAlbumEscogido[i].id+ '"><h4>Song name:'+cancionesDelAlbumEscogido[i].name+'</h4><p>Track Number:'+cancionesDelAlbumEscogido[i].track_number+'</p><a href="'+cancionesDelAlbumEscogido[i].external_urls.spotify+'">Letter</a><br><hr></div>');      
        }
    }

Spotify.prototype.getArtist = function(artist){

    // comprovació perque no peti de que hi ha algo al input
    if(artist.length > 0){
        
    $.ajax({
        type: 'GET',
        url: this.apiUrl + 'v1/search?type=artist&q=' + artist,
        headers: {
            'Authorization' : 'Bearer ' + access_token
        },
    }).done(function(response){

        console.log(response.artists.items);
        crearEspacioArtistas(response.artists.items)
    });
    }else{
        noResults.style.display = 'block';

        setTimeout(function(){
            noResults.style.display = 'none';
        },1500);
    }
};

Spotify.prototype.getArtistById = function(song){

    console.log(song);
    // comprovació perque no peti de que hi ha algo al input
    if(song.length > 0){
        $.ajax({
            type: 'GET',
            url: this.apiUrl + 'v1/search?type=track&q=' + song,
            headers: {
                'Authorization' : 'Bearer ' + access_token
            },
        }).done(function(response){
            console.log('canciones retornadas info:',response.tracks.items);
            // llamada a funcion de impresion:
            crearEspacioCanciones(response.tracks.items);
        });
    }else{
        
        noResults.style.display = 'block';

        setTimeout(function(){
            noResults.style.display = 'none';
        },1500);
        console.log('campos vacios');
    }
};

// Funció per quan es fa el click:
Spotify.prototype.obtenerAlbumsArtistas = function(idArtista){
    $.ajax({
        type:"GET",
        url:this.apiUrl + 'v1/artists/' + idArtista + '/albums',
        headers: {
            'Authorization' : 'Bearer ' + access_token
        },
    }).done(function(response){  
        crearEspacioAlbumPortArtista(response.items);
        console.log('respuesta al hacer click en el artista',response);
    });
}
// petició per obtenir cancçons de l'album a sobre del qual es fa click:
Spotify.prototype.obtenerCancionesDelAlbum = function(idAlbum){

    $.ajax({
        type:"GET",
        url:this.apiUrl + 'v1/albums/' + idAlbum + '/tracks',
        headers: {
            'Authorization' : 'Bearer ' + access_token
        },
    }).done(function(response){  
        crearEspacioCancionesAlbumEscogido(response.items);
        console.log('respuesta al hacer click en el artista',response.items);
    });
}

// funció d'identificació a la api
$(function (){
    $.ajax({
        type: 'POST',
        url: 'https://accounts.spotify.com/api/token',

        beforeSend: function(http){
                http.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ':' + clientSecret));
        },
        datatype: 'json',
        data:{grant_type: 'client_credentials'}
    }).done(function(response){
        access_token = response.access_token;
    });

    let spotify = new Spotify();

    // empra valor que li entrem per el input:
    $('#buscadorBoton').on('click', function () {
        spotify.getArtist($('#inputBuscador').val());
        spotify.getArtistById($('#inputBuscador').val());
      });


      $('#artistasRetornados').on('click', '.artistId', function (){
        $('.cancionesAlbumArtista').empty();
            $('.tituloCanciones').empty();
            $('.detalleCancion').empty();

        let idArtista =($(this).attr("id"));
        spotify.obtenerAlbumsArtistas(idArtista);
       
        // metode per manipulació del modal perque s'obri automatic
        // en fer click a la imatge de l'album, proporcionat per la biblioteca
        // de jQuery Modal
        $('#ex1').modal({
            escapeClose: true,
            clickClose: true,
            showClose: true
        });
      });

    //   event per quan pitjin a sobre d'un album d'un artista llançar petició per obtenir cançons:
      $('.modal').on('click','.albumArtista', function(){

        $('.cancionesAlbumArtista').empty();
            $('.tituloCanciones').empty();
            $('.detalleCancion').empty();

                let idAlbum = ($(this).attr("data-id"));
                spotify.obtenerCancionesDelAlbum(idAlbum);
      });
});
