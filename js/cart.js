let articles = [];

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
                    <input type="number" min="0" size="3" class="form-control articles-count" value="` + article.count + `" oninput="updateCount(` + index + `);">
                    <button class="btn btn-sm btn-primary" onclick="reduceCount(` + index + `);">-</button>
                    <button class="btn btn-sm btn-primary" onclick="addCount(` + index + `);">+</button><br>
                </div>
                <div class="col-3">
                    <span class="price-tag art-total"> UYU ???</span>
                </div>
            </div>`;
        });

        articlesDiv.innerHTML = htmlContentToAppend;

        articles.forEach((article, index) => {
            //Si el count del articulo es 0 mostrar el boton de quitar articulo
            if(article.count == 0){
                removeButtonRender(index);
            }
        })

        updateTotals();
    }

}

function removeButtonRender(index){
    let removeButton = document.createElement("button")
    removeButton.innerHTML = "Quitar artículo";
    removeButton.className = "btn btn-sm btn-link";
    removeButton.addEventListener("click", () => removeArticle(index));
    document.getElementsByClassName("articles-count")[index].parentElement.appendChild(removeButton);
}

function updateCount(index){
    //Modifica la ctdad del articulo cuando se entra en su input
    let countInput = document.getElementsByClassName("articles-count")[index];
    let countDiv = countInput.parentElement;
    let count = articles[index].count;
    let newCount = parseInt(countInput.value);

    if( isNaN(newCount) || newCount.value < 0){
        newCount = count; //En el caso de input invalido mantener el viejo count
    } else {
        if ( count === 0 && newCount > 0){
            countDiv.lastChild.remove(); //Quita el boton de eliminar articulo si aumento la cantidad de 0
        } else if( newCount === 0 && count > 0){
            //Pone el boton de eliminar articulo si la cantidad baja a 0
            removeButtonRender(index);
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
    articleTotalSpan = document.getElementsByClassName("art-total");

    let subtotal = 0;
    articles.forEach((article, index) => {
        //El precio del artículo en dolares cambiarlo a pesos
        articleTotal = (article.currency == "USD" ? 40 : 1)*article.unitCost*article.count; 
        articleTotalSpan[index].innerHTML = "UYU " + articleTotal.toLocaleString();

        subtotal += articleTotal;
    })
    document.getElementById("subtotal").innerHTML = "UYU " + subtotal.toLocaleString();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getAndShowArticles();
});