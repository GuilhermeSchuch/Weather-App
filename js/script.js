let $form = document.querySelector("form");
let $input = document.querySelector("input");
let $msg = document.querySelector(".msg");
let $list = document.querySelector(".cidades");

let apiKey = "91a4e1a69c63045deabf2609a06ae5dc";

$form.addEventListener("submit", e => {
    e.preventDefault();
    let valorInput = $input.value;

    let itens = $list.querySelectorAll(".ajax-section .city");
    let itensArray = Array.from(itens);

    if (itensArray.length > 0) {
      let ArrayFiltrada = itensArray.filter(el => {
          let content = "";

          if (valorInput.includes(",")) {
              if (valorInput.split(",")[1].length > 2) {
                  valorInput = valorInput.split(",")[0];
                  content = el
                  .querySelector(".city-name span")
                  .textContent.toLowerCase();
              }
              else{
                  content = el.querySelector(".city-name").dataset.name.toLowerCase();
              }
          }
          else{
              content = el.querySelector(".city-name span").textContent.toLowerCase();
          }
          return content == valorInput.toLowerCase();
      });

      if (ArrayFiltrada.length > 0) {
        $msg.textContent = `Já foi feita a pesquisa de ${
			ArrayFiltrada[0].querySelector(".city-name span").textContent
        }`;
        $form.reset();
        $input.focus();
        return;
      }
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${valorInput}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        let { main, name, sys, weather } = data;
        let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
          weather[0]["icon"]
        }.svg`;

        let $li = document.createElement("li");
        $li.classList.add("city");

        let markup = `
          <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <figure>
            <img class="city-icon" src="${icon}" alt="${
          weather[0]["description"]
        }">
            <figcaption>${weather[0]["description"]}</figcaption>
          </figure>
        `;
        $li.innerHTML = markup;
        $list.appendChild($li);
      })
      .catch(() => {
        $msg.textContent = "Insira uma cidade válida";
      });

    $msg.textContent = "";
    $form.reset();
    $input.focus();
});