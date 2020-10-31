const USER_ARRAY = "userArray";

function imgSrcToDataURL(imgSrc){
    //devuelve una promesa que resulve con el valor de imgen URL
    let img = document.createElement("img"); 
    img.src = imgSrc;
    img.crossOrigin = "anonymous"; //evita error de CORS
    return new Promise( (resolve, reject) => {
        img.addEventListener("load", function(){
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
            resolve(canvas.toDataURL("image/png"));        
        });
    });
}

function showUserData(userData){
    //llena los datos en el html
    const fieldsNames = ["name", "surname", "age", "email", "telnum"];
    fieldsNames.forEach(fieldName => {
        document.getElementById("user-" + fieldName).innerHTML = userData[fieldName];
    });
    document.getElementById("username").innerHTML = userData.username;
    document.getElementById("profile-photo").src = userData.img;
}

function saveUserData(newUserData){
    //actualiza los nuevos datos del usuario y los guarda
    const currentUser = window.sessionStorage.getItem("currentUser");
    let userArray = JSON.parse(window.localStorage.getItem(USER_ARRAY));
    let userData = userArray.find( user => user.username === currentUser);
    Object.keys(newUserData).forEach( fieldName => { userData[fieldName] = newUserData[fieldName];});
    window.localStorage.setItem(USER_ARRAY, JSON.stringify(userArray));
    showUserData(userData);
}

function getUserData(){
    const defaultImageUrl = "https://i.ibb.co/MsTXrMf/f184b890-fcab-43d9-9804-86545433d6d3.png";
    const currentUser = window.sessionStorage.getItem("currentUser");
    //cargamos los datos del login del usuario con sesion iniciada
    let userData = JSON.parse(window.localStorage.getItem(USER_ARRAY))
    .find( user => user.username === currentUser);
    
    if ( userData.name === undefined ){
        //si los datos del perfil no existe setear el default
        imgSrcToDataURL(defaultImageUrl).then( function(imgDataURL){
            //setea los defaults despues de pasar la imagen a dataURL
            const fieldsNames = ["name", "surname", "age", "email", "telnum"];
            fieldsNames.forEach( fieldName => { userData[fieldName] = "";})
            userData.img = imgDataURL;
            saveUserData(userData);
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
    const fieldsNames = ["name", "surname", "age", "email", "telnum"];
    let newUserData = {};
    fieldsNames.forEach(field => {
        if(form[field].value !== ""){
            //cambia los valores no vacios
            newUserData[field] = form[field].value;
        }
    });
    let photoInput = form["photo-input"].files[0];
    if(form["photo-input"].willValidate && form["photo-input"].files.length > 0){
        //si hay nueva foto valida actualizar el src
        imgSrcToDataURL(URL.createObjectURL(photoInput)).then(function(imgDataURL){
            newUserData.img = imgDataURL;
            form["photo-input"].value = "";
            document.getElementById("btn-restore-photo").remove();
            hideEditForm();
            saveUserData(newUserData);
        });
    } else {
        hideEditForm();
        saveUserData(newUserData);
    }
}


function previewPhoto(){
    let photoInput = document.getElementById("photo-input");
    let profileImg = document.getElementById("profile-photo");

    if(photoInput.willValidate && photoInput.files.length > 0){
        //si hay nueva foto valida guardar el src actual
        // y actualizar el src. crea el boton de restaurar si no existe
        let oldSrc = profileImg.src;
        profileImg.src = URL.createObjectURL(photoInput.files[0]);

        if (document.getElementById("btn-restore-photo") === null){
            let resetBtn = document.createElement("button");
            resetBtn.id = "btn-restore-photo";
            resetBtn.className = "btn btn-sm btn-secondary";
            resetBtn.innerHTML = "Cancelar";
            photoInput.parentElement.appendChild(resetBtn);
            resetBtn.addEventListener("click", () => {
                //restaura la anterior foto de perfil y vacia el input
                profileImg.src = oldSrc;
                photoInput.value = "";
                resetBtn.remove();
            });
        }    
    }
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getUserData();
    document.getElementById("btn-edit").addEventListener("click", enableEditForm);
    document.getElementById("new-info-form").addEventListener("submit", editUserData);
    document.getElementById("photo-input").addEventListener("input", previewPhoto);
});