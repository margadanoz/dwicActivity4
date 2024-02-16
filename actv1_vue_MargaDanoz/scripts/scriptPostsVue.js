const { createApp,useObjectUrl} = Vue;
// definit contador per portar identificació de posts, i array per emmagatzemar:
 let countComment = 0;   
//  obtenció de data actual i transformació poer llegibilitat amb metode:
 let today = new Date().toDateString();

createApp({
    data() {
        return {
            form: {
                name: '',
                comment: '',
                date: today,
                title: ''
            },
            image: null,
            comments: [],
            // controla canvi de titol al html quan s'edita o es posteja
            toPost: false,
            // per controlar quan s'editen i quan s'afegeix un de nou:
            commentIdEdit: null,
            showError:false
        };
    },
    methods: {
        postComment() {
            // si tots els camps (menys imatge) estàn omplerts tirem cap endavant,
            // sino missateg d'error
            if(this.form.title.length !== 0 && this.form.name.length !== 0 && this.form.comment.length !== 0){
                this.showError = false;
                //Mirem si el comentari ja existeix a l'array:
            let existePost = this.comments.findIndex(comment => comment.commentId === this.commentIdEdit);
            // si existeix actualitzem:
            if (existePost !== -1) {
                this.comments[existePost].name = this.form.name;
                this.comments[existePost].comment = this.form.comment;
                this.comments[existePost].title = this.form.title;
                this.comments[existePost].date = this.form.date;
                // if(this.image !== null){
                    this.comments[existePost].image = this.image;

                // }
                // resetejem valor per la propera cridada
                this.commentIdEdit = null;

            // sino agreguem nou register:
            } else {
                //image d'objecte a partir de l'arxiu:
                this.commentId = countComment++;
                        this.comments.push({
                        commentId: this.commentId,
                        name: this.form.name,
                        comment: this.form.comment,
                        date: this.form.date,
                        title: this.form.title,
                        // mirem si es null, sino ho és asignem imatge si ho es asignem null
                        image: this.image !== null ? this.image : null,
                        mostrarBotones: true,
                        toPost: this.toPost
                    });
                }     
            //neteja camps form
            this.form.name = '';
            this.form.comment = '';
            this.form.title = '';
            this.image = null;         
            //canvi de titol
            this.toPost = false;
            }else{
                this.showError = true;
            }     
        },
        editPost(comment, commentId) {
            // actuali9tzem valors del form per editar
            this.form.name = comment.name;
            this.form.comment = comment.comment;
            this.form.title = comment.title;
            // agafem el camp amb el que controlarerm si s'edita o es crea i li asignem valor del id del post  
            this.commentIdEdit = commentId;
            // canvi de valor per al titol:
            this.toPost = true;
        },
        deletePost(commentId){
            // cerquem comentari amb mateix id que el que ens pasan desde html i eliminem de l'array:
            const index = this.comments.findIndex(comment => comment.commentId === commentId);       
            this.comments.splice(index, 1);           
        },
        asignarImagen(event){
            // agafem file normal
            let file = event.target.files[0];
            // emmagatzemem url de l'objecte imatge per mostrar
            this.image = URL.createObjectURL(file); 
        }
    }
}).mount('#posts');