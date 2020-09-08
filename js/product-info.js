var commentsArray = [];

function showProductInfo(){
    //obtengo el id del producto de la peticion
    const productId = new URLSearchParams(window.location.search).get("productid");
    
    //fetch la informacion del producto con id de la peticion
    //(en este caso solo hay un producto)
    getJSONData(PRODUCT_INFO_URL).then(function(result){
        if(result.status === "ok"){
            let productInfo = result.data;

            //muestro la id producto que fue pedido en una nota antes del nombre
            //en el caso de que el id exista
            if(productId){
                warningNote = document.createElement("p");
                warningNote.className = "small alert-warning py-3";
                warningNote.innerHTML = `<strong>Nota:</strong> has seleccionado <strong>`
                 + productId + `</strong>, por simplicidad siempre se visualizará la información de 
                 <strong>Chevrolet Onix Joy</strong>.`;
                document.getElementById("product-name").before(warningNote);
            };
            
             //muestro la info del producto
            document.getElementById("product-name").innerHTML = productInfo.name ;
            document.getElementById("product-desc").innerHTML = productInfo.description ;
            document.getElementById("product-cost").innerHTML = productInfo.currency + " " +  productInfo.cost ;
            document.getElementById("product-sold").innerHTML = productInfo.soldCount ;
            document.getElementById("product-cat").innerHTML = productInfo.category ;

            //muestro las imagenes en un carousel
            let imgDiv = document.getElementById("product-img");
            let htmlContentToAppend = "";
            productInfo.images.forEach(imgSrc => {
                htmlContentToAppend += "<img src='" + imgSrc + 
                "' class='carousel-item w-100 img-fluid img-thumbnail'></img>" ;
            });
            imgDiv.innerHTML = htmlContentToAppend;
            //la primera imagen tiene que tener la class active
            imgDiv.firstChild.className += " active";

            //muestro la informacion de productos relacionados
            showRelatedProducts(productInfo.relatedProducts);
            getAndShowComments(productId);
        }
    });
    
    
}

function showRelatedProducts(relProductIds){
    //peticiono la informacion de los productos y los agrego 
    getJSONData(PRODUCTS_URL).then(function(result){
        if(result.status === "ok"){
            //selecciono los productos relacionados 
            //(que en este caso depende de su indice y no de in Id)
            let relatedProducts = result.data.filter( (prod, index) => relProductIds.includes(index) );
            
            //los agrego al html
            let htmlContentToAppend = "";
            relatedProducts.forEach(product => {
                htmlContentToAppend += `
                <a href="product-info.html?productid=` + product.name + `" class=" col-md-4 list-group-item list-group-item-action">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class ="img-fluid img-thumbnail"/>
                    <h4>` + product.name + `</h4> 
                    <span class="price-tag lead">` +  product.currency + ` ` + product.cost + `</span>
                </a>
                `;
            });
            document.getElementById("product-related").innerHTML = htmlContentToAppend;
        }
    });
}

function getAndShowComments(productId){
    //peticiona los comentarios correspondientes al productId
    //los guarda en una variable global y los muestra
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(result){
        if(result.status === "ok"){
            commentsArray = result.data;
            showComments();
        }
    });
}

function showComments(){
    //muestra los comentarios con su fecha en locale y formato según dateFormat
    const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
    
    let htmlContentToAppend = "";
    commentsArray.forEach(comment => {
        htmlContentToAppend += `
        <div class="list-group-item">
            <div>
                <span class="comment-user">` + comment.user + `</span><br>` 
                + starRating(comment.score) + `<br>
                <time class="comment-date text-muted" datetime="` 
                    + comment.dateTime + `">Calificado el ` 
                    + new Date(comment.dateTime).toLocaleString(undefined, dateFormat) 
                    + `</time>
            </div>
            <br>
            <p class="comment-body">` + comment.description + `</p>
        </div>` ;
    });
    document.getElementById("comments-container").innerHTML = htmlContentToAppend;
}

function starRating(score){
    //devuelve un string para mostrar la calificación en estrellas
    let star = '<span class="fa fa-star checked"></span>';
    let noStar = '<span class="fa fa-star"></span>';
    return star.repeat(score) + noStar.repeat(5 - score);
}

function newCommentHandler(){
    //arma un nuevo comentario a partir de la forma al hacer submit
    //con //el formato de los datos de la database 
    let form = document.getElementById("new-comment-form");
    form.addEventListener("submit", function(e){
        e.preventDefault();

        let date = new Date().toISOString();
        let newComment = {
            'score' : form['score'].value,
            'description' : form['comment'].value, 
            'user' : sessionStorage.getItem("currentUser"),
            'dateTime' : date.slice(0,10) + " " + date.slice(11,19),
        };
    });
}

function showScoreStars(){
    //muestra la cantidad de estrellas encendidas dependiendo del score
    let score = document.getElementById("new-comment-form")['score'].value;
    let stars = document.getElementById("new-comment-stars")
    .getElementsByTagName('span');
    for(let i = 0; i < score; i++)
        stars[i].className = "fa fa-star new-score checked";;

    for(let i = score; i < 5; i++)
         stars[i].className = "fa fa-star new-score";
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    showProductInfo();
    newCommentHandler();

    //muestra las estrellas cuando cargamos la página
    //y cuando cambiamos el score
    showScoreStars(); 
    document.getElementById("new-comment-stars") 
    .addEventListener("click", () => {showScoreStars();});
});