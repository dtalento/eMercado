let productArray = [];
let orderID = "REL";

function showProductList(){

    let filteredArray = productFilter(productArray);
    let searchFiltArray = searchProduct(filteredArray);
    let sortFiltArray = sortProducts(searchFiltArray);
    
    let htmlContentToAppend = "";
    for(let i = 0; i < sortFiltArray.length; i++){
        let product = sortFiltArray[i];

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
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
        </div>
        `
    }
    document.getElementById("product-list").innerHTML = htmlContentToAppend;
}

function productFilter(productArray){
    let filterMin = document.getElementById("rangeFilterCountMin").value;
    let filterMax = document.getElementById("rangeFilterCountMax").value;
    
    if ( (filterMax !== "") && (filterMin !== "") ){
        return productArray.filter(arrayElement => 
            (arrayElement.cost >= filterMin) && (arrayElement.cost <= filterMax) );
    } else {
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
    /* Usamos string.search() para buscar con regex en el nombre y descripcion
    Se usa toUpperCase() para que sea ignorar si hay mayusculas (case insensitive)*/
    let searchText = document.getElementById("searchfield").value.toUpperCase();
    return array.filter(element => {
        let name = element.name.toUpperCase();
        let desc = element.description.toUpperCase();
        // search devuelve -1 si no hay coincidencia y un int >0 si la hay
        return (desc.search(searchText) > -1)  || (name.search(searchText) > -1) 
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
});