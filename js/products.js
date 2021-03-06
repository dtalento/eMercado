let productArray = [];
let orderID = "REL";
const CARD = "CARD";
const LIST = "LIST";
let viewMode = CARD;

function showProductList(){

    let filteredArray = productFilter(productArray);
    let searchFiltArray = searchProduct(filteredArray);
    let sortFiltArray = sortProducts(searchFiltArray);
    
    let htmlContentToAppend = "";
    if (viewMode === LIST){
        //mostrar productos en una lista
        htmlContentToAppend += '<div  class="list-group">';

        sortFiltArray.forEach(product => {
            htmlContentToAppend += ` 
            <a href="product-info.html?productid=` + product.name + `" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name +`</h4>
                            <span class="price-tag lead">` +  product.currency + ` ` + product.cost + `</span>
                        </div>
                        <div class="d-flex w-100 justify-content-between">
                            <p>` + product.description + `</p>
                            <small class="soldCount">` +  product.soldCount + ` vendidos</small>
                        </div>
                    </div>
                </div>
            </a>`;
        });

        htmlContentToAppend += "</div>";
    } else {
        //mostrar los productos en cartas por default
        sortFiltArray.forEach(product => {
            htmlContentToAppend += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <a href="product-info.html?productid=${product.name}" class="card prod-card list-group-item list-group-item-action">
                <img src="${product.imgSrc}" alt="${product.description}" class="card-img-top">
                <div class="card-body">
                    <h4 class="mb-1">${product.name}</h4>
                    <span class="price-tag lead">${product.currency} ${product.cost}</span>
                </div>
                <p class="card-text">${product.description}</p>
            </a>
            </div>
            `;
        });
    }
    document.getElementById("product-list").innerHTML = htmlContentToAppend;
}

function productFilter(productArray){
    let filterMin = document.getElementById("rangeFilterCountMin").value;
    let filterMax = document.getElementById("rangeFilterCountMax").value;
    
    if ( (filterMax !== "") && (filterMin !== "") ){
        //si se define ambos inputs filtrar en el rango
        return productArray.filter(arrayElement => 
            (arrayElement.cost >= filterMin) && (arrayElement.cost <= filterMax) );
    } else if (filterMax == ""){
        //si se define solo el minimo filtrar los menores al minimo
        return productArray.filter(arrayElement => arrayElement.cost >= filterMin);
    } else if (filterMin == ""){
        //si se define solo el maximo filtrar los mayores al maximo
        return productArray.filter(arrayElement => arrayElement.cost <= filterMax);
    } else{
        //si no se define ninguno no filtrar
        return productArray;
    }
}

function clearRangeFilter(){
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    showProductList();
}

function sortProducts(productArray){
    if (orderID === "ASC"){
        return productArray.sort( (a,b) => a.cost - b.cost); //precio ascendente
    } else if (orderID === "DSC"){
        return productArray.sort( (a,b) => b.cost - a.cost); //precio descendente
    } else {
        return productArray.sort( (a,b) => b.soldCount - a.soldCount); //default: relevancia
    }
}

function searchProduct(array){
    /* Usamos string.includes() para buscar en el nombre y descripcion
    Se usa toUpperCase() para que sea ignorar si hay mayusculas (case insensitive)*/
    let searchText = document.getElementById("searchfield").value.toUpperCase();
    return array.filter(element => {
        let name = element.name.toUpperCase();
        let desc = element.description.toUpperCase();
        
        return name.includes(searchText) || desc.includes(searchText) 
    })
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

    document.getElementById("rangeFilterCount").addEventListener("click", showProductList);
    document.getElementById("clearRangeFilter").addEventListener("click", clearRangeFilter);
    document.getElementById("sortRelevant").addEventListener("click", function(){
        orderID = "REL" ;
        showProductList();
    });
    document.getElementById("sortAsc").addEventListener("click", function(){
        orderID = "ASC" ;
        showProductList();
    });
    document.getElementById("sortDesc").addEventListener("click", function(){
        orderID = "DSC" ;
        showProductList();
    });
    document.getElementById("searchfield").addEventListener("keyup", showProductList);
    document.getElementById("viewCard").addEventListener("click", function(){
        viewMode = CARD ;
        showProductList();
    });
    document.getElementById("viewList").addEventListener("click", function(){
        viewMode = LIST ;
        showProductList();
    });
});