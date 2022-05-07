let $form = document.querySelector("form");
let $input = document.querySelector("input");
let $msg = document.querySelector(".msg");
let $list = document.querySelector(".cidades");

let apiKey = "91a4e1a69c63045deabf2609a06ae5dc";

$form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = $input.value;

  let listItems = $list.querySelectorAll(".ajax-section .city");
  let listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    let filteredArray = listItemsArray.filter(el => {
        let content = "";

        if (inputVal.includes(",")) {
            if (inputVal.split(",")[1].length > 2) {
                inputVal = inputVal.split(",")[0];
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
        return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      $msg.textContent = `Já foi feita a pesquisa de ${
        filteredArray[0].querySelector(".city-name span").textContent
      }`;
      $form.reset();
      $input.focus();
      return;
    }
  }

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let { main, name, sys, weather } = data;
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      let li = document.createElement("li");
      li.classList.add("city");

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
      li.innerHTML = markup;
      $list.appendChild(li);
    })
    .catch(() => {
      $msg.textContent = "Insira uma cidade válida";
    });

	$msg.textContent = "";
	$form.reset();
	$input.focus();
});