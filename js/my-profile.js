const USER_ARRAY = "userArray";

function showUserData(userData){
    const fieldsNames = ["name", "surname", "email", "telnum"]
    fieldsNames.forEach(fieldName => {
        document.getElementById("user-" + fieldName).innerHTML = userData.profile[fieldName];
    });
    document.getElementById("username").innerHTML = userData.username;
    document.getElementById("profile-photo").src = userData.profile.img;
}

function saveUserData(userData){
    const currentUser = window.sessionStorage.getItem("currentUser");
    let userArray = JSON.parse(window.localStorage.getItem(USER_ARRAY));
    let newArray = userArray.filter( user => user.username !== currentUser);
    newArray.push(userData);
    window.localStorage.setItem(USER_ARRAY, JSON.stringify(newArray));
}

function getUserData(){
    const defaultImageUrl = "https://i.ibb.co/MsTXrMf/f184b890-fcab-43d9-9804-86545433d6d3.png";
    const currentUser = window.sessionStorage.getItem("currentUser");
    //cargamos los datos del login del usuario con sesion iniciada
    let userData = JSON.parse(window.localStorage.getItem(USER_ARRAY))
    .find( user => user.username === currentUser);
    
    if ( userData.profile === undefined ){
        //si los datos del perfil no existe setear el default
        let profileImg = document.createElement("img"); 
        profileImg.src = defaultImageUrl;
        profileImg.crossOrigin = "anonymous"; //evita error de CORS
        profileImg.addEventListener("load", function(){
            //esperamos que la imagen cargue para ponerla en un canvas y guardarla 
            let canvas = document.createElement("canvas");
            canvas.width = profileImg.width;
            canvas.height = profileImg.height;
            canvas.getContext("2d").drawImage(profileImg, 0, 0, profileImg.width, profileImg.height);
            userData.profile = {
                name : "",
                surname : "",
                email : "",
                telnum : "",
                img : canvas.toDataURL("image/png"),
            };
            saveUserData(userData);
            showUserData(userData);
        });
    } else {
        //en caso de que ya existan datos solo mostrarlos
        showUserData(userData);
    }
}

function enableEditForm(){
    //muestro los inputs de la forma de edicion de los datos del usuario
    document.querySelectorAll(".new-info-input").forEach( inp => {inp.removeAttribute("hidden")});
    document.getElementById("btn-edit").setAttribute("hidden","");
}

function hideEditForm(){
    //oculta los inputs de la forma de edicion de los datos del usuario
    document.querySelectorAll(".new-info-input").forEach( inp => {inp.setAttribute("hidden","")});
    document.getElementById("btn-edit").removeAttribute("hidden");
}

function editUserData(event){
    //itera en los campos modificables y guarda los cambios
    event.preventDefault();
    const form = document.getElementById("new-info-form");
    const fieldsNames = ["name", "surname", "email", "telnum", "img"];
    let newUserData = {};
    fieldsNames.forEach(field => {newUserData[field] = form[field]});
    hideEditForm();
    saveUserData(newUserData);
    showUserData(newUserData);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getUserData();
    document.getElementById("btn-edit").addEventListener("click", enableEditForm);
    document.getElementById("new-info-form").addEventListener("submit", editUserData);
});