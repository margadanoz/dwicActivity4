import Post from '../scripts/postComponent.js'; 

const { createApp} = Vue;
// definit contador per portar identificació de posts, i array per emmagatzemar:
 let countComment = 0; 
 let auxCountComment;
 let cargaId = false;
//  array de info portada del LS:
let posts = [];
//  obtenció de data actual i transformació poer llegibilitat amb metode:
 let today = new Date().toDateString();

createApp({ 
     
    data() {
        return {
            form: [{
                name: '',
                comment: '',
                date: today,
                title: '',
        }],                
        image: null,
        comments: [],
        // controla canvi de titol al html quan s'edita o es posteja
        toPost: false,
        // per controlar quan s'editen i quan s'afegeix un de nou:
        commentIdEdit: null,
        showError:false,
        };
    },
     // carregar informacio local storage:
    mounted(){
        let contenidoLS = localStorage.getItem('posts'); 

        if(contenidoLS){
            posts = JSON.parse(contenidoLS);
            posts.forEach((post)=>{
                // recuperem últim registre del id guardatr al local
                // per després abaix sumarlo a partir d'aqui
                auxCountComment = post.commentId;
                cargaId = true;
            });
            this.comments = posts;
        }
    }, 
    components: {
        Post
      },
    methods: {
        postComment() {
            
            // let almacenamiento = localStorage.getItem('posts');
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
                console.log(this.form.date);
                // if(this.image !== null){
                    this.comments[existePost].image = this.image;
                // }
                // resetejem valor per la propera cridada
                this.commentIdEdit = null;
                // actualitzem a local:
                localStorage.setItem('posts',JSON.stringify(this.comments));

            // sino agreguem nou register:
            } else {
                // se ten valor ven do local
                if(auxCountComment && cargaId){

                    countComment = auxCountComment;
                    countComment++;
                    this.commentId = countComment;
                    cargaId = false;
                    
                }else{

                    countComment++;
                    this.commentId = countComment;
                }
                
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
                    // pujem al local
                    localStorage.setItem('posts',JSON.stringify(this.comments));
                }     
            //neteja camps form
            this.form.name = '';
            this.form.comment = '';
            this.form.title = '';
            // neteja de input de file
            this.$refs.inputImagen.value = null;
            this.image = null;         
            //canvi de titol
            this.toPost = false;
            }else{
                this.showError = true;
            }     
        },
        editPost(datos) {

            let comment = datos[0];
            let commentId = datos[1];

            // actualitzem valors del form per editar
            this.form.name = comment.name;
            this.form.comment = comment.comment;
            this.form.title = comment.title;
            this.form.date = comment.date;
            // agafem el camp amb el que controlarerm si s'edita o es crea i li asignem valor del id del post  
            this.commentIdEdit = commentId;
            // canvi de valor per al titol:
            this.toPost = true;
        },
        deletePost(commentId){
            // cerquem comentari amb mateix id que el que ens pasan desde html i eliminem de l'array:
            const index = this.comments.findIndex(comment => comment.commentId === commentId);       
            this.comments.splice(index, 1);  
            // actualitzem a localStorage després d'esborrar comentrari
            localStorage.setItem('posts',JSON.stringify(this.comments));
        },
        asignarImagen(event){
            // agafem file normal
            let file = event.target.files[0];
            // emmagatzemem url de l'objecte imatge per mostrar
            this.image = URL.createObjectURL(file); 
        }
    }
}).mount('#posts');
