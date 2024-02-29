export default{
    name: 'Post',
    props:['comment'],
    emits:['editPost','deletePost'],
    template: 
   `<div style="text-align: center;margin-bottom:50px;">
            <h4>{{comment.title}}</h4>
            <p>{{ comment.comment }}</p>
            <p><span>Author:</span>{{ comment.name }}</p>
            <p><span>Publication date:</span>{{ comment.date }}</p>
            <img v-if="comment.image !== null" :src="comment.image" id="imagenPost"></img>
            <button v-show="comment.mostrarBotones" id="editingButton" class="btn btn-primary" v-on:click="$emit('editPost',[comment,comment.commentId])">Edit</button>
            <button v-show="comment.mostrarBotones" id="deleteButton" class="btn btn-primary" v-on:click="$emit('deletePost',comment.commentId)">Delete</button>
        </div>`

}

