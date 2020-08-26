const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

var userNavbar = function(){
  //agregamos al div dentro del navbar (que lo obtenemos como el elemento nav
  // con class site-header) 
  if ( (sessionStorage.getItem("currentUser") !== null) &&
   (document.querySelector("nav.site-header").lastElementChild !== null) ) {
    let username = sessionStorage.getItem("currentUser");
    let userNavElement = document.createElement("div");
    userNavElement.className = "py-2 d-none d-md-inline-block" ;

    let profileLink = document.createElement("a");
    profileLink.href = "my-profile.html" ;
    profileLink.innerHTML = username;
    userNavElement.appendChild(profileLink);

    //Agregar un link para cerrar sesion
    let logOutLink = document.createElement("a");
    logOutLink.href = "#";
    //llama a la función logOut sin seguir el href
    logOutLink.setAttribute("onclick","logOut(); return false;"); 
    logOutLink.style = "margin : 1em;"
    logOutLink.innerHTML = "<small class='text-info'>Cerrar Sesión</small>";
    userNavElement.appendChild(logOutLink);

    document.querySelector("nav.site-header").lastElementChild.appendChild(userNavElement);
    
  }
}

var logOut = function(){
  event.preventDefault();
  //elimina las flags de login y lo redirecciona al login
  sessionStorage.removeItem("currentUser");
  sessionStorage.setItem("loginFlag","false");
  window.location.href="login.html"
}

var checkLogIn = function(){
  let isLoggedIn = JSON.parse(sessionStorage.getItem("loginFlag"));
  let isPageLogin = window.location.href.endsWith("login.html");
  
  // checkeo si ya existe la flag sino la declaro
  if (isLoggedIn === null){ isLoggedIn = false; }
  
  //Si el usuario no inicio sesión  y no se encuentra en el login
  //guardar ruta de la página y redirigir al login
  if (!isLoggedIn && !isPageLogin){
    sessionStorage.setItem("preLogInPage", window.location.href);
    window.location.href = "login.html";
  }
  
  //Si esta en el login luego de estar logeado dirigir al index
  if (isLoggedIn && isPageLogin){
      window.location.href = "index.html" ;
    }
}

//checkeo que este loggeado antes de cargar la página requerida
checkLogIn();

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  userNavbar(); //agrego un elemento al navbar con el nombre de usuario
});