const DATASTORAGENAME = "userRegister";

function showUserData(userData){

}

function getUserData(){
    const defaultImageUrl = "https://i.ibb.co/fvnTgsR/mrmeow.jpg";
    const currentUser = window.sessionStorage.getItem("currentUser");
    //cargamos los datos del login del usuario con sesion iniciada
    let userData = JSON.parse(window.localStorage.getItem(DATASTORAGENAME))
    .userArray.find( user => user.username === currentUser);
    
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
                tel : "",
                img : canvas.toDataURL("image/png"),
            };
        });
    }
    console.log(userData);
    showUserData(userData);
}

function saveUserData(userData){

}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
        getUserData();
});