// Call the dataTables jQuery plugin
$(document).ready(function() {
    // on ready
});

async function registrarSocio(){
let datos = {};
datos.id = new Date().getTime();
datos.nombre = document.getElementById('nombre').value;
datos.apellido = document.getElementById('apellidos').value;
datos.email = document.getElementById('email').value;
datos.password = document.getElementById('pass').value;
let repetirPassword = document.getElementById('repPass').value;
if(repetirPassword != datos.password){
  Swal.fire(
    'Error',
    'Las contraseñas no coinciden',
    'error'
  )     
  return;
}

  const request = await fetch('http://localhost:8080/api/registro', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  }).then(response => {
    console.log(response);
    return response.json();
  })
    .then(data => {
      console.log(data);
      window.location.href = "login.html";
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
