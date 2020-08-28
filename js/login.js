var logInDone = function(userData){
  //guardar el nombre de usuario actual y setear la login flag
  sessionStorage.setItem("currentUser", userData.username);
  sessionStorage.setItem("loginFlag", "true"); 

  if ( (sessionStorage.getItem("preLogInPage") !== null) &&
      (sessionStorage.getItem("preLogInPage") !== window.location.href)){
    window.location.href = sessionStorage.getItem("preLogInPage");  
    //Luego del log in volver a la página pedida antes de la redirección
    // si esta existe  y no era la actual
  } else {
    //redireccionar al index como fallback
    window.location.href = "index.html" ;
  }
}

var logInValidation = function(){
  loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function(event){
    event.preventDefault();
    
    //Validacion de los datos de la forma
    if (loginForm.usuario.value !== "" && loginForm.pwd.value !== ""){
      //Accion en caso de datos no vacios
      let userData = {
        username : loginForm.usuario.value ,
        password : loginForm.pwd.value ,
      }

      if (localStorage.getItem("userRegister") === null){
        //en caso de que no haya un registro crearlo y logearlo
        localStorage.setItem( "userRegister", JSON.stringify({userArray : [ userData ] }) );
        logInDone(userData);
      } else {
        //de lo contrario buscarlo buscar en el registro
        
        if (userValidation(userData)){
          // en caso de datos validos o registro nuevo, logearlo
          logInDone(userData);
        } else {
          //Datos invalidos: usuario existe pero el password es incorrecto
          //TODO: cambiar password
          if (document.getElementById("passalert") == null){ 
            //crear la alerta solo la primera vez
            passAlert = document.createElement("p");
            passAlert.id = "passalert" ;
            passAlert.className = "alert alert-danger" ;
            passAlert.innerHTML = "Datos inválidos" ;
            loginForm.appendChild(passAlert);
          }
          
        }

      }  
    } else {
      //Accion en caso de datos vacios
    }
  })
}

var userValidation = function(userData){
  let userArray = JSON.parse(localStorage.getItem("userRegister")).userArray ;
  //Indice del usuario en el registro, en caso de que no este devuelve -1
  let index = userArray.findIndex(element => element.username === userData.username);
  if (index == -1){ 
    //en caso de que no encuentre el usuario agregarlo
    userArray.push(userData);
    localStorage.setItem("userRegister", JSON.stringify({"userArray" : userArray}));
    return true ; //los nuevos datos son validos
  } else {
    //los datos son validos si el password es correcto
    return userData.password == userArray[index].password ;
  }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  logInValidation();
});