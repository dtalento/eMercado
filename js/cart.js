let articles = [];

function getAndShowArticles(){
    getJSONData(CART_INFO_URL).then( function(resp){
        articles = resp.data.articles;
        articles.forEach(article => {showArticle(article);});
    })
}

function showArticle(article){
    articleDiv = document.createElement("div");
    articleDiv.innerHTML = `
    <div class="container row">
        <div class="col-2">
            <img class="img-thumbnail w100" src="` + article.src + `">
        </div>
        <div class="col-3">
            <span>` + article.name + `</span>
        </div>
        <div class="col-2">
            <div><span class="price-tag">` + article.currency + ` ` + article.unitCost + `</span></div>
        </div>
        <div class="col-2">
            <input type="number" min="0" size="3" class="articles-count" value="` + article.count + `">
        </div>
        <div class="col-3">
            <div><span class="price-tag">UYU ` + article.unitCost*article.count + `</span></div>
        </div>
    </div>
    <hr>`;

    document.getElementById("articles").appendChild(articleDiv);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getAndShowArticles();
});