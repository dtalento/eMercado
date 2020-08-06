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

var checkLogIn = function(){
  let isLoggedIn = sessionStorage.getItem("loginFlag");//loginFlag = true si se esta loggeado 
  let currentPage = window.location.href.split("/").pop() // ruta realtiva pagina actual 

  // checkeo si ya existen la flag sino la declaro
  if (isLoggedIn == undefined){ isLoggedIn = "false"; }

  //Si el usuario no inicio sesión  y no se encuentra en el login
  //recorar la página y redirigir al login
  if (isLoggedIn == "false" & currentPage != "login.html"){
    sessionStorage.setItem("preLogInPage", window.location.href);
    window.location.href = "login.html";
  }
}

var logInDone = function(){
 //Luego del log in volver a la página pedida antes de la redirección
 // si esta no era la actual, sino volver al index
 
  sessionStorage.setItem("loginFlag", "true");
  if(sessionStorage.getItem("preLogInPage") == window.location.href) 
  {
    window.location.href = "index.html";
  } else {
    window.location.href = sessionStorage.getItem("preLogInPage");  
  }
}

//checkeo que este loggeado antes de cargar la página requerida
checkLogIn();

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
});