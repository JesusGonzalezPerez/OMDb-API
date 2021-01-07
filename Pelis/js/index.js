var pag = 1;
var id = 1;
$(window).scroll(peticionAJAX);

function peticionAJAX() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            maquetaRespuesta(JSON.parse(this.responseText));
        }
    };

    var buscar = document.getElementById('textfield').value;
    var nombre = buscar.split(" ");
    var busqueda = "";
    for (x = 0; x < nombre.length; x++) {
        if (x == 0 && nombre.length > 1) {
            busqueda += nombre[x] + "+";
        } else if (x < nombre.length - 1) {
            busqueda += nombre[x] + "+";
        } else {
            busqueda += nombre[x];
        }
    }

    xhttp.open("GET", "https://www.omdbapi.com/?s=" + busqueda + "&page=" + pag + "&apikey=56686ffa", true);

    // apikey=56686ffa
    // apikey=3695b132
    // apikey=3aa482bb

    xhttp.send();
    pag += 1;
}


function maquetaRespuesta(objetoJSON) {
    var div = document.getElementById('div');
    for (var i = 0; i < objetoJSON.Search.length; i++) {

        var card = document.createElement('div');
        card.setAttribute("class", "card");
        card.setAttribute("data-toggle", "modal");
        card.setAttribute("data-target", "#info");
        card.setAttribute("id", objetoJSON.Search[i].imdbID);
        card.setAttribute("onclick", "peticionPeli(event)");

        var img = document.createElement('img');
        if (objetoJSON.Search[i].Poster == "N/A") {
            img.src = "https://i.pinimg.com/originals/51/9c/18/519c18a68160ffb6d5aa5d92cd1e3d59.jpg";
            card.append(img);
        } else {
            img.src = "" + objetoJSON.Search[i].Poster + "";
            card.append(img);
        }

        var texto = document.createElement('div');
        texto.setAttribute("class", "texto");
        texto.textContent = objetoJSON.Search[i].Title;
        card.append(texto);

        div.append(card);

        id++;
    }
}






function peticionPeli(event) {
    var id = event.target.id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            maquetaModal(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", "https://www.omdbapi.com/?i=" + id + "&apikey=56686ffa", true);
    xhttp.send();

}

function maquetaModal(peli) {
    var imgModal = document.getElementById('poster');
    var datosModal = document.getElementById('datos');

    while (imgModal.firstChild) {
        imgModal.removeChild(imgModal.firstChild);
    }

    datosModal.innerHTML = "";

    var poster = document.createElement('img');
    if (peli.Poster == "N/A") {
        poster.src = "https://i.pinimg.com/originals/51/9c/18/519c18a68160ffb6d5aa5d92cd1e3d59.jpg";
    } else {
        poster.src = peli.Poster;
    }


    var titulo = document.getElementById('modalTitle');
    titulo.innerHTML = peli.Title;

   var year = document.createElement('p');
   year.innerHTML =  "Año: "+  peli.Year;

    var genre = document.createElement('p');
    genre.innerText = "Género : " + peli.Type;

    var idioma = document.createElement('p');
    idioma.innerText = "Idioma : " + peli.Language;

    var value = document.createElement('p');
    value.innerText = "Value : " + peli.imdbRating;

    var plot = document.createElement('p');
    plot.innerText = "Resumen : " + peli.Plot;

    imgModal.append(poster);
    datosModal.append(year);
    datosModal.append(genre);
    datosModal.append(idioma);
    datosModal.append(plot);
    datosModal.append(value);

}



window.onload = function () {
    peticionAJAX();
    // maquetaModal();
    setInterval(function () {
        if ((window.scrollY + window.innerHeight) >= (window.innerHeight + 150)) {
            peticionAJAX();
        }
    }, 1000);

};