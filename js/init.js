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
  //agregamos al button dentro del navbar (que lo obtenemos como el elemento nav
  // con class site-header) 
  if ( (sessionStorage.getItem("currentUser") !== null) &&
   (document.querySelector("nav.site-header") !== null) ) {
    let username = sessionStorage.getItem("currentUser");
    let userNavElement = document.createElement("button");
    userNavElement.className = "btn btn-primary user-nav" ;

    userNavElement.innerHTML= `<span>` + username + `</span>
    <div class="user-nav-content">
      <a href="my-profile.html">Mi Perfil</a>
      <a href="cart.html">Mi Carrito</a>
      <hr>
      <button class="btn btn-link btn-sm" onclick="logOut();">Cerrar Sesión</button>
    </div>`;

    document.querySelector("nav.site-header").lastElementChild.appendChild(userNavElement);
    
  }
}

var logOut = function(){
  //elimina las flags de login y lo redirecciona al login
  sessionStorage.removeItem("currentUser");
  localStorage.removeItem("rememberUser");
  
  localStorage.setItem("rememberFlag","false")
  sessionStorage.setItem("loginFlag","false");
  
  window.location.href="login.html" ;
}

var checkLogIn = function(){
  let isLoggedIn = JSON.parse(sessionStorage.getItem("loginFlag"));
  let rememberFlag = JSON.parse(localStorage.getItem("rememberFlag"));
  let isPageLogin = window.location.href.endsWith("login.html");
 
  // checkeo si ya existe las flags sino la declaro
  if (rememberFlag === null){ rememberFlag = false;};
  //si rememberFlag = true, entonces logear al usuario
  if (rememberFlag){ 
    sessionStorage.setItem("currentUser", localStorage.getItem("rememberUser"));
    sessionStorage.setItem("loginFlag", "true"); 
    isLoggedIn = true; 
  } else if (isLoggedIn === null){ isLoggedIn = false; };
  
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