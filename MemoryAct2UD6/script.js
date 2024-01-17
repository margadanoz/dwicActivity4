

$(document).ready(function(){

    $('body').html('<div id="content"><h1 class="mensaje"></h1><div id="container"></div></div>');

    let div = $('#container');

    // Multiplicar els divs, metode per crearne fins 20 desde 4:
    // reestablecer a 9 cuando este todo probado:
    let numRandom = Math.floor(Math.random()*2)*2+4;

    // console.log(numRandom);

    // array para almacenar los números random:
    let arrayNumsEnDiv = [];

    // // obtencion de números random, necesitamos solo la mitad
    // de la cantidad de divs que hay:
    while(arrayNumsEnDiv.length < numRandom / 2){

        let numRandomParaDiv = Math.floor(Math.random()*10)*2+2;

        // Comprovem si existeix nombnre en array, sino es així afegim:
        if(arrayNumsEnDiv.indexOf(numRandomParaDiv) === -1){

            arrayNumsEnDiv.push(numRandomParaDiv);
        }
    }

    let numsRepetidos = arrayNumsEnDiv.concat(arrayNumsEnDiv);

    // Per baraixar nombres de manera random:
    numsRepetidos.sort(() =>Math.random() -0.5)

    for(let i = 0; i < numRandom; i++){

        div.append('<div class="numerosOcultos"><span class="numero">'+numsRepetidos[i]+'</span></div>');

        // Ocultem els nombres:
        $('span').hide();

        comprobarPareja();
    }



    function comprobarPareja() {

        let contadorCartasSeleccionadas = 0;
        
        // event que afecta als descendents de container, tots els divs que contenen nombres
        // etiquetats amb clase numerosOcultos;
        $('#container').on(

            'click', '.numerosOcultos', function () {

            // agafem l'element sobre el que es fa click,el div amb clase numeroOculto;
            let cartaClicada = $(this);

            // missatge per quan es guanya o es perd:
            $('.mensaje').text(" ");
    
            //condicional per comprovar quantes cartes hi han picades i si ja contenen las classes que asignem
            // durant l'execució de la funció, en aquest cas no deixa picar més, ni tornar a picar la que ja ho està:
            if (cartaClicada.hasClass('ganador') || cartaClicada.hasClass('seleccionada') || contadorCartasSeleccionadas === 2) {
                
                return;
            }
    
            cartaClicada.find('span').show();
    
            // Marcar la carta como seleccionada, al div se li agrega la classe
            cartaClicada.addClass('seleccionada');
            
            contadorCartasSeleccionadas++;
    
            
            if(contadorCartasSeleccionadas === 2){

                // Comportament de colecció, array
                let cartasSeleccionadas = $('.seleccionada');

                // comparació nombres dels span, mateix que fer first().text() === last().text()
                if (cartasSeleccionadas[0].textContent === cartasSeleccionadas[1].textContent) {

                    // Áfegim clase a span de ganador si hi ha coincidencia i eliminem seleccionada per resetejar:
                    cartasSeleccionadas.addClass('ganador').removeClass('seleccionada');
                    // console.log("coleccio cartes seleccionades",cartasSeleccionadas);
                    // console.log("Length del array de gabanor",$(('.ganador')).length);

                    // si hi ha mateix nombre d'elemnts a la classe ganador que nombre random que hem generat vol dir que hem guanyat
                    if($(('.ganador')).length === numRandom){

                        // sense setTimeOut no funciona la impresió de missatges:
                        setTimeout(function(){
                            $('.mensaje').text("Enhorabona! Has guanyat la partida!");
                        });

                    }else{

                        setTimeout(function(){
                        $('.mensaje').text("Enhorabona! Has format una parella!");
                    });
                    }

                }else{

                    // Esborrar clases i ocultar nombres quan no coincideixen:
                    setTimeout(function(){

                        cartasSeleccionadas.removeClass('seleccionada').find('span').fadeOut(600);
                        $('.mensaje').text("Els nombres no coincideixen!");
                        contadorCartasSeleccionadas = 0;

                    },200);
                };
            }
        });
        }
    });




















   