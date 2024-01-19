

jQuery.fn.countCharacters = function() {

    $(this).each(function() {

        let textArea = $(this);
        let frase;

        // Emmagatzemar num de cridades a la funció perque només hi hagin 2 frases i no es sumin
        textArea.data("llamadasActualizaMensaje", 0);

        function actualizaMensaje() {

            // Agafar num de cridades:
            let llamadasActualizaMensaje = textArea.data("llamadasActualizaMensaje");

            if (llamadasActualizaMensaje === 2) {

                //només actualitzar contingut:
                frase.find('.textnumCaracteres').text('Hi han ' + textArea.val().length + ' caracters.');

            } else {
                // Creem frases per després només actualitzar-les:
                if (llamadasActualizaMensaje === 0) {

                    frase = $('<div><p class="textnumCaracteres">Hi han ' + textArea.val().length + ' caracters.</p></div>');
                    textArea.after(frase);
                }

                llamadasActualizaMensaje++;

                // Actualitzar el contador de cridades a la funció
                textArea.data("llamadasActualizaMensaje", llamadasActualizaMensaje);
            }
        }

        // Mostrar mensaje inicial:
        actualizaMensaje();

        // keyup event, cada vez que se presiona una tecla
        textArea.on("keyup", function() {
            actualizaMensaje();
        });
    });
}

$(document).ready(function() {
    $("textarea").countCharacters();
});
