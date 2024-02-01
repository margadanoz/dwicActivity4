

$(document).ready(function(){

    // contadores para llevar cuentas de notas en cada div
    let contadorContainerAzul = 0;
    let contadorContainerVerde = 0;
    // per emmagatzemar color que surt aleatori:
    let arrayColor = ['white', 'yellow'];

    // Creación elementos principales, divs y boton
    $('body').html('<div class="containerPrincipal"><div id="containerNotas"></div><div id="container1"><p id="textoContainer1">Hay '+contadorContainerAzul+' notas</p></div><div id="container2"><p id="textoContainer2">Hay '+contadorContainerVerde+' notas.</p></div></div>');
    $('body').append('<button id="crearNota">Crear Nota</button>');
    // pel botó on creem les notes, vinculat a les notes per després esborrarles
    let botonCrearNota = $('#crearNota');

// FUNCIÓ PER TREURE COLOR DEL QUE SERÀ LA NOTA
   function generarNotaColorRandom(){

        let indexColor = Math.floor(Math.random()*arrayColor.length);

        return arrayColor[indexColor];
    }

// CREACIÓ CONTAINERS QUE CONTINDRÁN LES NOTES:
    // orpietat droppable() pels containers que treballarà junt draggable()
    // configurem perque només s'acceptin certs colors de notas a cada banda:
    let containerAzul = $('#container1').droppable(

                        {accept: '.notaContainerAzul',

                        drop: function (event, ui) {
                            console.log("Esta entrando por aqui");
                            // ui.helper rastrea objeto actual que se está moviendo, que esta siendo arrastrado
                            let notaAfegidaBlau = ui.helper.addClass('afegida');
                            actualizarContador(containerAzul, notaAfegidaBlau);
                        },
                        out: function(event, ui) {

                            ui.helper.removeClass('afegida');

                            // comprovem si hi han notes sino inicialitzem
                            let notasSoltadas = containerAzul.data('notasSoltadas') || [];

                            // agafem objecte jQuery sobre ek que esta l'ui.helper
                            const index = notasSoltadas.indexOf(ui.helper[0]);

                            // el treiem del array perque després ens ho sumi, sino no entra pel condicional
                            // del contador d'abaix quan  es torna a afegir la nota treta
                            if (index !== -1) {
                                notasSoltadas.splice(index, 1);
                            }
                        
                            if (contadorContainerAzul !== 0) {
                                contadorContainerAzul--;
                            }
                        
                            $('#textoContainer1').text('Hay ' + contadorContainerAzul + ' notas');
                            containerAzul.data('notasSoltadas', notasSoltadas);
                        }
        });


        // manipular qué acepta contador verde
        let containerVerde = $('#container2').droppable({
            
                        accept: '.notaContainerVerde',
                        drop: function (event, ui) {
                            let notaAfegidaVerde = ui.helper.addClass('afegida');
                            actualizarContador(containerVerde, notaAfegidaVerde);
                        },
                        out: function (event, ui) {

                            ui.helper.removeClass('afegida');

                            let notasSoltadas = containerVerde.data('notasSoltadas') || [];

                            const index = notasSoltadas.indexOf(ui.helper[0]);

                            // el treiem del array perque després ens ho sumi, sino no entra pel condicional
                            // del contador d'abaix quan  es torna a afegir la nota treta
                            if (index !== -1) {
                                notasSoltadas.splice(index, 1);
                            }
                    
                            if (contadorContainerVerde !== 0) {
                                contadorContainerVerde--;
                            }
                    
                            $('#textoContainer2').text('Hay ' + contadorContainerVerde + ' notas');
                            containerVerde.data('notasSoltadas', notasSoltadas);
                }
        });

        
// FUNCIÓ CLICK DEL BOTÓ CREAR NOTA, DEFINEIX DINS FUNCIUÓ CSS DE LES NOTES, CONTAINER ON S'ASOCIEN
// I BOTONS PER TANCAR I REDIMENSIONAR LA NOTA:
    botonCrearNota.on('click', function () {

        let randomColor = generarNotaColorRandom();
    
        // crear postit, contenteditable="true" para habilitar escritura
        let notaCreada = $('<div class="nota"><span class="textoNota"></span></div>');
    
        // estilos a la nota
        notaCreada.css({
            "background-color": randomColor,
            "width": '50px',
            "height": '50px',
            "border": '1px solid black',
            "position": 'absolute',
            "margin": "15px",
            "contenteditable" : true
        }).draggable();

        // Agregar la nota al div que las contendrá
        $('#containerNotas').append(notaCreada);
    
        // agregar clases segun el color de la nota, para permitir
        // ponerla en un div o en otro:
        if (randomColor === "white") {
            notaCreada.addClass('notaContainerAzul');
        } else {
            notaCreada.addClass('notaContainerVerde');
        }
    
        //creació de botons de tancar i redimensionar:
        let botonCerrarNota = $('<span class="cerrarNota">x</span>').appendTo(notaCreada);
        let botonResizable = $('<span class="redimensionarNota">-</span>').appendTo(notaCreada);
    
        // Estilos para el botón de cerrar, x esquina superior derecha
        botonCerrarNota.css({
            "position": 'absolute',
            "top": '0',
            "right": '5px',
            "cursor": 'pointer',
            "color": 'black',
            "font-size": '20px'
        });

          // Estilos para el botón de maximizar/minimizar esquina superior izquierda
          botonResizable.css({
            "position": 'absolute',
            "top": '0',
            "left": '5px',
            "cursor": 'pointer',
            "color": 'black',
            "font-size": '20px'
        });

// EVENT CLICK PER QUAN ES TANCA LA NOTA:
        // evento de cerrar la nota cuando pulsamos la x
        botonCerrarNota.on('click', function () {

            // creem modal per confirmar que s'elimini la nota:
            $('body').append('<div id="dialogoCerrar"><p id="textoModal">Estás seguro de que quieres eliminar la nota?</p><button id="confirmarEliminar">Confirmar</button><button id="cancelarElimNota">Cancelar</button></div>');
            
            let modalCerrar = $('#dialogoCerrar');

            // la propietat dialog() ja el dota del botó per tancarlo:
            modalCerrar.dialog({
                width: 200,
                height: 200,
                position: 'center',
                close: function () {
                    //asociat a botó de tancament del modal, per tancvarlo
                    modalCerrar.remove(); 
                }
            });

            let botonEliminarNota = $('#confirmarEliminar');
            let botonCancelar = $('#cancelarElimNota');
            let textoDelModal = $('#textoModal');

            // BOTÓ PER ELIMINAR NOTA I DISPARAR CONTADORS QUE RESTEN SEGONS TIPUS NOTA:
            botonEliminarNota.on('click',function(){

                        notaCreada.remove();

                        textoDelModal.text('Nota eliminada');

                        setTimeout(function(){
                            modalCerrar.remove();
                        },700);

                        // comprobamos si tienen ambas clases, sino está condicional de afegida
                        // podrian restarnos el contador x debajo de cero cerrando las notas del div donde se generan
                            if(notaCreada.hasClass('notaContainerAzul') && notaCreada.hasClass('afegida')){

                                contadorContainerAzul--;
                                $('#textoContainer1').text('Hay ' + contadorContainerAzul + ' notas');
                
                            }else if(notaCreada.hasClass('notaContainerVerde') && notaCreada.hasClass('afegida')){
                
                                contadorContainerVerde--;
                                $('#textoContainer2').text('Hay ' + contadorContainerVerde + ' notas');
                            }
            });   
            
            // EVENT PER BOTÓ CANCELAR, NO RESTA NI RES, NOMÉS INFORMA I TANCA MODAL:
            botonCancelar.on('click',function(){

                textoDelModal.text('Tu nota no será eliminada');

                setTimeout(function(){
                    modalCerrar.remove();
                },700); 
            });
        });

// EVENT CLICK PER REDIMENSIONAR LA NOTA:
        // evento click para poder escribir en la nota vinculado al icono - :
        botonResizable.on('click', function () {
         
                notaCreada.resizable({
                    minWidth: 50,
                    minHeight: 50,
                    maxWidth: 350,
                    maxHeight: 250,
                    // detecta el redimensionamiento de la nota:
                    resize: function(event, ui) {

                        // amplada menor ocultem el text
                        if(notaCreada.width() < 300){

                            notaCreada.find('.textoNota').hide();

                            // amplada major tornem a mostrar
                        }else{
                            notaCreada.find('.textoNota').show();
                    }      
                }
            });
        });

// FUNCIÓ DOBLE CLICK PER ESCRIURE EN LA NOTA:
        notaCreada.on('dblclick', function(){

            // si este objeto tiene un length superior a 2 es que en la nota ya hay texto,por tangto editamos
            let notaActual = $(this).text();

            // per que afecti només contingut, si es varia la nota directament es canvia l'html, desapareixen iconos, etc..
            let notaModificada = notaCreada.find('.textoNota');

            notaModificada.css({
                "display":'inline-block',
                "margin-top":'20px',
                "max-width": '300px'
            });

            console.log(notaActual);
            notasEscritas = notaCreada.data('notaEscritas');

            console.log(notaActual.length);

            // una nota que no estigui escrita no tindrà length supoerior a 2, que son els 2 iconos
            // que surten en el postit
            if(notaActual.length === 2){

                notaModificada.text('escribe');
                // establecer el conrenido en editable:
                notaModificada.attr('contenteditable',true);
                notaModificada.focus();
                //marge al voltant del text
                let nuevoAncho = notaModificada.width() + 300; 
                let nuevoAlto = notaModificada.height() + 200; 
                notaCreada.width(nuevoAncho);
                notaCreada.height(nuevoAlto);
                
                 // evento keyup para obtener texto mientras se escribe en la nota:
                //  actualitzem objecte data
                notaCreada.find('.textoNota').on('keyup', function () {
        
                    let textoNota = $(this).text();

                    notaCreada.data('notaEscritas', textoNota);

                    console.log("Texto actual en la nota:", textoNota);
                });
                
            }else{

                    notaModificada.attr('contenteditable',true);
                    notaModificada.focus();
                    //marge al voltant del text
                    let nuevoAncho = notaModificada.width() + 300; 
                    let nuevoAlto = notaModificada.height() + 200; 
                    notaCreada.width(nuevoAncho);
                    notaCreada.height(nuevoAlto);

                     // evento keyup para obtener texto mientras se escribe en la nota:
                    //  actualitzem amb el nou text editat l'objecte data
                    notaCreada.find('.textoNota').on('keyup', function () {
            
                        let textoNota = $(this).text();

                        notaCreada.data('notaEscritas', textoNota);
                    });
            }
        });
    });


    // FINS AQUI CLICK DEL BOTON CERRAR, EVENT. TOT DE DINS PER ASOCIAR-HO A LA NOTA CORRESPONENT



// ACTUALITZAR CONTADOR QUAN ES SUMA, EL DE RESTA ESTÀ DALT A OUT DELS CONTAINERS I AL CLICK DE QUAN ES TANCA LA NOTA:
    function actualizarContador(container, notaSoltada) { 

        //asociamos al objeto container un objeto data para marcar
        // las notas que ya han sido soltadas en el div
        let notasSoltadas = container.data('notasSoltadas') || [];

        // si se añade a clase afegida y no está en el array la metemos para no tenerla en cuenta
        // y no volver a contarla si se mueve del div,funciona solo con 0 porque representa el objeto actual clickado
        if (notaSoltada.hasClass('afegida') && notasSoltadas.indexOf(notaSoltada[0]) === -1) {

            if (container.attr('id') === 'container1') {

                contadorContainerAzul++;
                container.find('#textoContainer1').text('Hay ' + contadorContainerAzul + ' notas');

            } else if (container.attr('id') === 'container2') {

                contadorContainerVerde++;
                container.find('#textoContainer2').text('Hay ' + contadorContainerVerde + ' notas');
            }
            // sino la teniamos en el array la añadimos para impedir que se siga sumanso al moverla dentro del div
            notasSoltadas.push(notaSoltada[0]);
            container.data('notasSoltadas', notasSoltadas);
        }
    }
});