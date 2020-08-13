var logInDone = function(event){
  //Luego del log in volver a la página pedida antes de la redirección
  // si esta no era la actual, sino volver al index
  sessionStorage.setItem("loginFlag", "true");
  if (sessionStorage.getItem("preLogInPage") == window.location.href) 
  {
    window.location.href = "index.html" ;
  } else {
    window.location.href = sessionStorage.getItem("preLogInPage");  
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


var onGoogleSignIn = function(){
  /* 
    Placeholder para obtener los datos
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());
    
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
  */
  logInDone();
}

var logInRedirect = function(){
  //Si volvemos al login luego de estar loggeados ir al index
  if (window.location.href.endsWith("login.html") &&
      sessionStorage.getItem("loginFlag") == "true"){
      window.location.href = "index.html" ;
    }
}

var logInValidation = function(){
  loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function(event){
    event.preventDefault();
    
    //Validacion de los datos de la forma
    if (loginForm.usuario.value !== "" && loginForm.pwd.value !== ""){
      //Accion en caso de datos validos
      logInDone();
    } else {
      //Accion en caso de datos invalidos
    }

  })
}

logInRedirect();
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  logInValidation();
});