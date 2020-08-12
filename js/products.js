function showProductListOld(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let product = array[i];

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ product.name +`</h4>
                        <span class="price-tag">` +  product.currency + ` ` + product.cost + `</span>
                    </div>
                    <p>` + product.description + `</p>
                </div>
            </div>
        </div>
        `

        document.getElementById("product-list").innerHTML = htmlContentToAppend;
    }
}

var showProductList = function(array){
    container = document.getElementById("product-list"); // en este elemento se muestra la lista

    for (let i = 0; i < array.length; i++){
        let product = array[i];
        
        let productDiv = document.createElement("div");
        productDiv.className = "list-group-item list-group-item-action" ;
        container.appendChild(productDiv);
        
        let rowDiv = document.createElement("div");
        rowDiv.className = "row" ;
        productDiv.appendChild(rowDiv);

        let imgDiv = document.createElement("div");
        imgDiv.className = "col-3" ;
        rowDiv.appendChild(imgDiv);
        
        let img = document.createElement("img");
        img.src = product.imgSrc ;
        img.alt = product.description ;
        img.className = "img-thumbnail" ;
        imgDiv.appendChild(img);

        let dataDiv = document.createElement("div");
        dataDiv.className = "col" ;
        rowDiv.appendChild(dataDiv);

        let dataHeaderDiv = document.createElement("div");
        dataHeaderDiv.className = "d-flex w-100 justify-content-between" ;
        dataDiv.appendChild(dataHeaderDiv);

        let productName = document.createElement("h4");
        productName.className = "mb-1" ;
        productName.innerHTML = product.name ;
        dataHeaderDiv.appendChild(productName);

        let priceTag = document.createElement("span");
        priceTag.innerHTML = product.currency + " " + product.cost ;
        dataHeaderDiv.appendChild(priceTag);
        
        let description = document.createElement("p");
        description.innerHTML = product.description ;
        dataDiv.appendChild(description);
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function(result){
        if(result.status === "ok"){
            productArray = result.data;
            showProductList(productArray);
        }
    });
});