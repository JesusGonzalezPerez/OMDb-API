let url = "https://www.omdbapi.com/?"
let apikey = "apikey=3695b132"
let pagina = 1;

// apikey=56686ffa
// apikey=3695b132
// apikey=3aa482bb

/**
 * Empty div, restart variables to default, and search the new petition
 * 
 * @author Jesús González <jesusgpeligros@gmail.com>
 */
function restart() {
    $('#div').empty();
    pagina = 1;
    search();
}
$("#buscar").on("click", () => restart());

/**
 * Perform the search
 * 
 * @author Jesús González <jesusgpeligros@gmail.com>
 */
function search() {
    let nombreBuscar = $("#titulo").val();
    let nombre = nombreBuscar.split(" ");
    let buscar = "";
    // Split the words with "+"
    for (x = 0; x < nombre.length; x++) {
        if (x == 0 && nombre.length > 1) {
            buscar += nombre[x] + "+";
        } else if (x < nombre.length - 1) {
            buscar += nombre[x] + "+";
        } else {
            buscar += nombre[x];
        }
    }
    // URL
    let urlSearch = url + "s=" + buscar + "&page=" + pagina + "&" + apikey;
    // Make the AJAX request
    $.ajax({
        url: urlSearch,
        success: function (response) {
            layoutObjects(response);
        }
    })
    // Increase the variable
    pagina++;
}

/**
 * Mock up the objects it receives from the request to the api
 * 
 * @param {JSON} response 
 * 
 * @author Jesús González <jesusgpeligros@gmail.com>
 */
function layoutObjects(response) {
    // Main div
    $('#div').attr('class', 'd-flex justify-content-around');
    let div = document.getElementById('div');
    
    // Loop all objects of response
    $.each(response.Search, function (index,objetoJSON) {
        // Object div
        let card = document.createElement('div');
        $(card).on('click', () => datosPelicula(card.id))
        card.id = objetoJSON.imdbID;
        card.setAttribute("class", "card");
        card.setAttribute("data-toggle", "modal");
        card.setAttribute("data-target", "#info");
        card.setAttribute("id", objetoJSON.imdbID);
        // Set default imagen if the object does not have
        let img = document.createElement('img');
        if (objetoJSON.Poster == "N/A") {
            img.src = "https://i.pinimg.com/originals/51/9c/18/519c18a68160ffb6d5aa5d92cd1e3d59.jpg";
            card.append(img);
        } else {
            img.src = "" + objetoJSON.Poster + "";
            card.append(img);
        }
        // Title div
        let Divtexto = document.createElement('div');
        Divtexto.setAttribute("class", "Divtexto");
        Divtexto.style.display = "flex";
        Divtexto.style.alignItems = "center";
        // Title
        let texto = document.createElement('p');
        texto.style.margin = "0";
        texto.setAttribute("class", "texto");
        texto.textContent = objetoJSON.Title;
        Divtexto.append(texto);
        card.append(Divtexto);

        div.append(card);
    })
    // Button to load more elements
    if(response.Response!="False"){
        let divBtn = document.createElement("div");
        divBtn.classList.add("divMore","d-flex","justify-content-center","my-2");
        divBtn.style.width = "100vw";
        let btn = document.createElement("button");
        btn.classList.add("btn","btn-outline-success","btn-lg","moreBtn");
        btn.textContent = "More";
        btn.addEventListener("click", () => {
            search();
            $(".moreBtn").css("display","none");
        });

        divBtn.append(btn);
        div.append(divBtn);
    }
}

/**
 * Request to the api to receive the data with the object id
 * 
 * @param {String} id 
 * 
 * @author Jesús González <jesusgpeligros@gmail.com>
 */
function datosPelicula(id) {
    let id1 = "i=" + id;
    let urlDatos = url + id1 + "&" + apikey;
    $.ajax({
        url: urlDatos,
        success: function (response) {
            colocarModal(response);
        }
    })

}

/**
 * Fill the modal with the object data
 * 
 * @param {JSON} response 
 * 
 * @author Jesús González <jesusgpeligros@gmail.com>
 */
function colocarModal(response) {
    $('.modal-title').text(response.Title);
    // Set default imagen if the object does not have
    if (response.Poster == 'N/A') {
        $('#imagen').attr('src', 'https://i.pinimg.com/originals/51/9c/18/519c18a68160ffb6d5aa5d92cd1e3d59.jpg');
    } else {
        $('#imagen').attr('src', response.Poster);
    }
    
    $('#genre').text(response.Genre)
    $('#released').text(response.Released)
    $('#director').text(response.Director)
    $('#writer').text(response.Writer)
    $('#actors').text(response.Actors)
    $('#plot').text(response.Plot)
    $('#rating').text(response.imdbRating)
}