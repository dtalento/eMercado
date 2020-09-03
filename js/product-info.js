function showProductInfo(){
    //obtengo el id del producto de la peticion
    const productId = new URLSearchParams(window.location.search).get("productid");
    
    //fetch la informacion del producto con id de la peticion
    //(en este caso solo hay un producto)
    getJSONData(PRODUCT_INFO_URL).then(function(result){
        if(result.status === "ok"){
            let productInfo = result.data;
            //muestro la info del producto
            document.getElementById("product-name").innerHTML = productInfo.name ;
            document.getElementById("product-desc").innerHTML = productInfo.description ;
            document.getElementById("product-cost").innerHTML = productInfo.currency + " " +  productInfo.cost ;
            document.getElementById("product-sold").innerHTML = productInfo.soldCount ;
            document.getElementById("product-cat").innerHTML = productInfo.category ;

            //muestro las imagenes en un carousel

            /*
            <div class="item active">
                <img src="la.jpg" style="width:100%;">
            </div>
            <div class="item">
                <img src="chicago.jpg" style="width:100%;">
            </div>
            */ 
            let imgDiv = document.getElementById("product-img");
            productInfo.images.forEach(imgSrc => {
                imgDiv.innerHTML += "<img src='" + imgSrc + 
                "' class='carousel-item w-100 img-fluid img-thumbnail'></img>" ;
            });
            //la primera imagen tiene que tener la class active
            imgDiv.firstChild.className += " active";

            //muestro la informacion de productos relacionados
            showRelatedProducts(productInfo.relatedProducts);
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
            let relProdDiv = document.getElementById("product-related");
            relatedProducts.forEach(product => {
                relProdDiv.innerHTML += `
                <a href="product-info.html?productid=` + product.name + `" class=" col-md-4 list-group-item list-group-item-action">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class ="img-fluid img-thumbnail"/>
                    <h4>` + product.name + `</h4> 
                    <span class="price-tag lead">` +  product.currency + ` ` + product.cost + `</span>
                </a>
                `;
            });
        }
    });
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    showProductInfo();
});