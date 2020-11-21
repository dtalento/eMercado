const USER_ARRAY = "userArray"; 

var logInDone = function(userData){
  //guardar el nombre de usuario actual y setear la login flag
  if (document.getElementById("remember").checked){
    //en caso que chequeado remember logearlo hasta que cierre sesion
    localStorage.setItem("rememberUser", userData.username);
    localStorage.setItem("rememberFlag", "true")
  } else {
    //en caso contrario logearlo por una sesion
    sessionStorage.setItem("currentUser", userData.username);
    sessionStorage.setItem("loginFlag", "true"); 
  }
    
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

var onGoogleLoad = function () {
  //Setup Google OAuth2 cuando cargue la api (que esta en el head)
  gapi.load('auth2', function () {
    googleAuth = gapi.auth2.init({
      client_id: '248596847490-dldboe8r0m1qodiem693m103clqdi4qo.apps.googleusercontent.com',
      scope: 'profile email', 
      redirect_uri: 'products.html'
    });

    //Dibujar el boton en div con id="google_button"
    gapi.signin2.render("google-button", {
      scope: 'profile email',
      //las mismas dimensiones que el botón submit
      width:  document.getElementById("submit-button").getBoundingClientRect().width, 
      height: document.getElementById("submit-button").getBoundingClientRect().height,
      longtitle: true,
      theme: 'dark',
      onsuccess: onGoogleSignIn,
    });

  });
}


var onGoogleSignIn = function(googleUser){
  //Obtiene los datos de perfil del google sign in y hace la validacion

  let profile = googleUser.getBasicProfile();
  let userData = {
    loginType : "google",
    username : profile.getName(),
    gmail : profile.getEmail(),
  }    
  document.getElementById("google-button").addEventListener("click", () => logInValidation(userData));
}

var onLocalLogin = function(event){
  //Obtiene los datos y valida el login local

  event.preventDefault();
  //Si se lleno la forma validar los datos
  if (loginForm.usuario.value !== "" && loginForm.pwd.value !== ""){
    //Accion en caso de datos no vacios
    let userData = {
      loginType : "local",
      username : loginForm.usuario.value ,
      password : loginForm.pwd.value ,
    }
    logInValidation(userData);
  }
}

var logInRedirect = function(){
  //Si volvemos al login luego de estar loggeados ir al index
  if (window.location.href.endsWith("login.html") &&
      sessionStorage.getItem("loginFlag") == "true"){
      window.location.href = "index.html" ;
    }
}

var logInValidation = function(userData){
  //Busca los datos en el registro de usuarios o los agrega
  
  if (localStorage.getItem(USER_ARRAY) === null){
    //en caso de que no haya un registro crearlo y logearlo
    localStorage.setItem(USER_ARRAY, JSON.stringify([userData]) );
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
}

var userValidation = function(userData){
  let userArray = JSON.parse(localStorage.getItem(USER_ARRAY)) ;
  //Indice del usuario en el registro, en caso de que no este devuelve -1
  let index = userArray.findIndex(element => element.username === userData.username);
  if (index == -1){ 
    //en caso de que no encuentre el usuario agregarlo
    userArray.push(userData);
    localStorage.setItem(USER_ARRAY, JSON.stringify(userArray) );
    return true ; //los nuevos datos son validos
  } else {
    //los datos son validos si el password es correcto o es un login con google
    return userData.loginType === "google"  || userData.password == userArray[index].password ;
  }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", onLocalLogin);
});