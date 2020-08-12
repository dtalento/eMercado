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

var logInRedirect = function(){
  //Si volvemos al login luego de estar loggeados ir al index
  if (window.location.href.endsWith("login.html") &&
      sessionStorage.getItem("loginFlag") == "true"){
      window.location.href = "index.html" ;
    }
}

var logInVerification = function(){
  loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function(event){
    event.preventDefault();
    logInDone();
  })
}

logInRedirect();

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  logInVerification();
});