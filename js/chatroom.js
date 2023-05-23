var stompClient = null;
const txtMensaje = document.getElementById('mensaje').value;
const textArea = document.getElementById('chat-textos');
const divPrivados = document.getElementById('mensajes-privados');
const escribiendoText = document.getElementById('escribiendoText');
const email = document.getElementById('txt-email-socio').value;
const socio = {
    'email': localStorage.email
};

function connect(){
    var socket = new SockJS('http://localhost:8080/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
}

function onConnected() {
    stompClient.subscribe('/chat/public', function(mensaje){
        mostrarMensaje(JSON.parse(mensaje.body));
    });

    stompClient.send("/app/historial", {}, localStorage.email);

    stompClient.subscribe('/chat/historial/'+localStorage.email, function(listaMensajes){
        mostrarHistorial(JSON.parse(listaMensajes.body));
        console.log(JSON.parse(listaMensajes.body));
    });

    stompClient.subscribe('/chat/'+ localStorage.email +'/private', function(mensaje){
        mostrarMensajePrivado(JSON.parse(mensaje.body));
    });
}

function sendMessage(){
    var mensaje = {
        'id': 'id-' + new Date().getTime(),
        'texto': $("#mensaje").val(),
        'socio': socio
    }

    stompClient.send("/app/mensaje", {}, JSON.stringify(mensaje));

}

function sendPrivMessage(){
    const socioReceptor = {
        'email': document.querySelector('#listado-emails').value
    };
    var mensaje = {
        'id': 'id-' + new Date().getTime(),
        'texto': $("#privMensaje").val(),
        'socio': socio,
        'receptor': socioReceptor
    }

    stompClient.send("/app/mensaje-privado", {}, JSON.stringify(mensaje));

}

function mostrarMensaje(mensaje){
    textArea.innerHTML += '<div class="alert alert-info mx-3" role="alert"><h6>'+ mensaje.socio.nombre + ' ' +  mensaje.socio.apellido +'</h6>'+ mensaje.texto +'<small class="float-right">'+ mensaje.fecha.replace('T', ' ').substring(0,19) +'</small></div>'
}

function mostrarMensajePrivado(mensaje){
    divPrivados.innerHTML += '<div class="alert alert-success alert-dismissible fade show mt-3" role="alert"><strong>'+ mensaje.socio.email +'</strong>: '+ mensaje.texto +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
}

function mostrarHistorial(listaMensajes){
    listaMensajes.forEach(mensaje => {
        textArea.innerHTML += '<div class="alert alert-info mx-3" role="alert"><h6>'+ mensaje.socio.nombre + ' ' +  mensaje.socio.apellido +'</h6>'+ mensaje.texto +'<small class="float-right">'+ mensaje.fecha.replace('T', ' ').substring(0,19) +'</small></div>'
    });
}