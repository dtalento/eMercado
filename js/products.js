productArray = [];

function showProductList(){

    filteredArray = productFilter(productArray);

    let htmlContentToAppend = "";
    for(let i = 0; i < filteredArray.length; i++){
        let product = filteredArray[i];

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
});