let articles = [];
const shipping = {
    standard : 0.05,
    express : 0.07,
    premium : 0.15,
};
const paymentType = {
    transfer : {
        id : "transfer",
        text : "Transferencia bancaria",
        inputs : [
            {name : "transfer-num", regex : /^\d{10,15}$/, valMsg : "Formato: de 10 a 15 dígitos"},
        ],
    } ,
    credit : {
        id : "credit",
        text : "Tarjeta de crédito",
        inputs : [
            {name : "credit-num", regex : /^(\d{4,5}(-|\s)?){3}(\d{4,5})$/, valMsg : "Formato: 1234-5678-1234-5678"},
            {name : "credit-code", regex : /^\d{3,4}$/, valMsg : "Formato: 3 o 4 dígitos"},
            {name : "credit-exp", regex : /^\d{1,2}\/\d{2,4}$/, valMsg : "Formato: MM/AA"},
        ],
    } ,
};
const shippingInputs = ["address", "country", "ship-type"];
const USDtoUYU = 40;
let selectedPayment;

function getAndShowArticles(){
    //Cargamos los articulos del carrito y los mostramos
    getJSONData(CART_INFO_URL).then( function(resp){
        if(resp.status == "ok"){    
            articles = resp.data.articles;
            showArticles();
        }
    });
}

function showArticles(){
    //Mostramos la info de cada articulo del array article
    //Si esta vacio mostramos un mensaje al respecto
    let articlesDiv = document.getElementById("articles");

    if( articles.length == 0){
        articlesDiv.innerHTML = "<p class='text-muted'>No tienes artículos en tu carrito</p>";
    } else {
        let htmlContentToAppend = "";
        articles.forEach((article, index) => {

            //Al mostrar los precios utilizamos toLocaleString para formatearlo adecuadamente
            htmlContentToAppend += `
            <div class="row article-container">
                <div class="col-2">
                    <img class="img-thumbnail" src="` + article.src + `">
                </div>
                <div class="col-3">
                    <span>` + article.name + `</span>
                </div>
                <div class="col-2">
                    <span class="price-tag">` + article.currency + ` ` + article.unitCost.toLocaleString() + `</span>
                </div>
                <div class="col-2">
                    <input type="number" min="0" size="3" class="form-control articles-count" value="` + article.count + `" required>
                    <button class="btn btn-sm btn-primary red-btn">-</button>
                    <button class="btn btn-sm btn-primary add-btn">+</button><br>
                    <button class="btn btn-sm btn-link rmv-btn">Quitar artículo</button>
                    
                </div>
                <div class="col-3">
                    <span class="price-tag art-total"> UYU ???</span>
                </div>
            </div>`;
        });

        articlesDiv.innerHTML = htmlContentToAppend;

        initInputs();
        updateTotals();
    }

}

function initInputs(){
    //addEventListener a los inputs de cada artículo
    let inputs = document.getElementsByClassName("articles-count");
    let redBtns = document.getElementsByClassName("red-btn");
    let addBtns = document.getElementsByClassName("add-btn");
    let rmvBtns = document.getElementsByClassName("rmv-btn");

    articles.forEach((article, index) => {
        inputs[index].addEventListener("input", () => updateCount(index) );
        redBtns[index].addEventListener("click", () => reduceCount(index) );     
        addBtns[index].addEventListener("click", () => addCount(index) );   
        rmvBtns[index].addEventListener("click", () => removeArticle(index) );       
        
        //Si el count del articulo es 0 mostrar el boton de quitar articulo
        if(article.count != 0){
            rmvBtns[index].classList.add("rmv-btn-hidden");
        }
    });
}

function updateCount(index){
    //Modifica la ctdad del articulo cuando se entra en su input
    let count = articles[index].count;
    let newCount = parseInt(document.getElementsByClassName("articles-count")[index].value);

    if( isNaN(newCount) || newCount.value < 0){
        newCount = count; //En el caso de input invalido mantener el viejo count
    } else {
        if ( count === 0 && newCount > 0){
            //Esconde el boton de eliminar articulo si aumento la cantidad de 0
            document.getElementsByClassName("rmv-btn")[index].classList.add("rmv-btn-hidden");
        } else if( newCount === 0 && count > 0){
            //Muestra el boton de eliminar articulo si la cantidad baja a 0
            document.getElementsByClassName("rmv-btn")[index].classList.remove("rmv-btn-hidden");
        }
    }
    articles[index].count = newCount; //Finalmente actualizo el count del array
    updateTotals();
}

function reduceCount(index){
    //Reduce en 1 la cantidad del articulo numero index
    // y actualiza el count
    let count = articles[index].count;
    if(count > 0){
        document.getElementsByClassName("articles-count")[index].value = count - 1;
        updateCount(index);
    }
}

function addCount(index){
    //Aumenta en 1 la cantidad del articulo numero index
    // y actualiza el count
    document.getElementsByClassName("articles-count")[index].value = articles[index].count + 1;
    updateCount(index);
}

function removeArticle(index){
    //Elimina el articulo numero index y muestra un mensaje con el nombre del articulo eliminado

    let articlesDiv = document.getElementById("articles");
    let removedMsg = document.createElement("p");
    removedMsg.innerHTML = `<button class="btn btn-sm btn-link" onclick="dismissRemoved(event);">x</button>
     Se quito <span style="color : blue;">` + articles[index].name + `</span> de tu carrito`;

    articlesDiv.before(removedMsg); //Muetra el mensaje arriba del div de articles 
    articles.splice(index, 1);

    showArticles();
}

function dismissRemoved(event){
    //Elimina el contenedor del mensaje
    event.target.parentElement.remove();
}

function updateTotals(){
    //Actualiza el Subtotal y Total
    let articleTotalSpan = document.getElementsByClassName("art-total");

    let subtotal = 0;
    articles.forEach((article, index) => {
        //El precio del artículo en dolares cambiarlo a pesos
        let articleTotal = (article.currency == "USD" ? USDtoUYU : 1)*article.unitCost*article.count; 
        articleTotalSpan[index].innerHTML = "UYU " + articleTotal.toLocaleString();

        subtotal += articleTotal;
    })
    document.getElementById("subtotal").innerHTML = "UYU " + subtotal.toLocaleString();

    let shipType = document.getElementById("ship-type").value;
    if( shipType in shipping){
        //Agrega el valor de envio y el total si el tipo de envio esta en shippment
        let shipCost = subtotal*shipping[shipType];
        document.getElementById("ship-cost").innerHTML = "UYU " + shipCost.toLocaleString();
        document.getElementById("total").innerHTML = "UYU " + (shipCost+subtotal).toLocaleString();
    }
}

function changePayment(){
    //cambia los campos a entrar dependiendo de la forma de pago
    let buyForm = document.getElementById("buy-form");
    let payment = buyForm["payment"].value;
    let transferFields = document.getElementById("transfer-fields");
    let creditFields = document.getElementById("credit-fields");

    if(payment === paymentType.transfer.id){
        transferFields.removeAttribute("disabled");
        creditFields.setAttribute("disabled","");
        selectedPayment = paymentType.transfer;
    } else if(payment === paymentType.credit.id) {
        transferFields.setAttribute("disabled","");
        creditFields.removeAttribute("disabled");
        selectedPayment = paymentType.credit;
    }
}

function paymentBtnText(){
    //muestra la forma de pago si ha sido elegida, sino un msg
    let paymentBtn = document.getElementById("payment-btn");
    if(modalValidation()){
        //si se eligio una forma de pago valida mostrarla en el boton
        //y mostrar el boton verde
        paymentBtn.innerHTML = selectedPayment.text;
        paymentBtn.classList.remove("btn-outline-danger");
        paymentBtn.classList.add("btn-outline-success");
    } else if(selectedPayment === undefined){
        paymentBtn.classList.add("btn-outline-danger");
        paymentBtn.classList.remove("btn-outline-success");
        paymentBtn.innerHTML = "No has elegido la forma de pago";
    } else {
        paymentBtn.classList.add("btn-outline-danger");
        paymentBtn.classList.remove("btn-outline-success");
        paymentBtn.innerHTML = "Datos inválidos";
    }
}

function paymentBtnInit(){
    //agrega los EventListener que dan funcionalidad al boton de forma de pago
    //muestra la forma de pago en el boton y "Cambiar" cuando esta el cursor en el
    let paymentBtn = document.getElementById("payment-btn");
    paymentBtn.addEventListener("mouseover", () => {
        paymentBtn.innerHTML = "Cambiar";
    });
    paymentBtn.addEventListener("mouseout", paymentBtnText);
    paymentBtnText();
}

function buyCart(event){
    //Muestra un mensaje de compra con éxito luego del submit de la forma de compra
    
    event.preventDefault();
    if( formValidation() ){
        getJSONData(CART_BUY_URL).then( function(resp){
            //Peticiona el mensaje y lo muestra antes de submit
            if(resp.status == "ok"){    
                msg = resp.data.msg;
                alert(msg);
                
                //agregar los id de los articulos a la forma
                //en este caso usamos GET en la forma como demostracion pero lo mejor seria con POST
                artIDInput = document.createElement("input");
                artIDInput.type = "hidden";
                artIDInput.name = "articlesID";
                //pasamos los nombres de los articulos con count > 0 a un string y lo ponemos en un input
                //oculto al final de la forma
                artIDInput.value = JSON.stringify( articles.filter(art => art.count > 0).map(art => art.name) );
                document.getElementById("buy-form").appendChild(artIDInput);

                document.getElementById("buy-form").submit();
            }
        });
    } else {
        //mostrar msg en caso que la validacion fallida
        alert("Faltan completar datos!");
    }
    
}


function formValidation(){
    //chequea que todos los inputs sean validos y que el carrito no este vacio
    
    let countInputs = document.getElementsByClassName("articles-count");
    let artQty = 0;
    for( let i = 0; i < articles.length; i++ ){
        artQty += articles[i].count; //cuenta la cantidad de articulos
        let countValid = countInputs[i].reportValidity();
        if(!countValid){
           return false; //chequea que los inputs de ctdad sean validos
        } 
    }

    if(artQty === 0){
        alert("El carrito esta vacio")
        return false;
    }
    
    for( let i = 0; i < shippingInputs.length; i++ ){
        let shipValid = document.getElementById(shippingInputs[i]).reportValidity();
        if(!shipValid){
            return false; //chequea que los inputs de envio esten correctos
        }
    }
    //si el resto de los inputs es correcto return si el modal es valido
    return modalValidation(); 
}

function modalValidation(){
    //valida el contenido dentro del modal

    let form = document.getElementById("buy-form");
    if (selectedPayment === undefined){
        return false;
    } else {
        for (let i = 0; i < selectedPayment.inputs.length; i++){
            //para cada input, checkea si es valido
            let input = selectedPayment.inputs[i];
            if( !input.regex.test(form[input.name].value)){
                //si no es valido algun input return false
                form[input.name].setCustomValidity(input.valMsg); //Muestra un mensaje adecuado
                form[input.name].reportValidity();
                return false;
            } else {
                form[input.name].setCustomValidity(""); //mostrar input como valido
            }
        }
    }
    
    return true; //si todos los inputs son validos return true
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getAndShowArticles();
    document.getElementById("ship-type").addEventListener("input", updateTotals);
    paymentBtnInit();
    document.getElementById("buy-form")["payment"].forEach( radio => { radio.addEventListener("input", changePayment) });
    //verifica la validez del modal en cada input que haga el usuario
    document.querySelectorAll("#payment-modal input").forEach( inp => {inp.addEventListener("input", modalValidation)});
    $('#payment-modal').on('hidden.bs.modal', paymentBtnText) //cambiar el texto del boton cuando se oculta el modal
    document.getElementById("buy-form").addEventListener("submit", buyCart);
});