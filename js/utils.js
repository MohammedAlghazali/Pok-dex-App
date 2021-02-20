function randomSelection(arr, data) {
  while (arr.length < 5) {
    const r = Math.floor(Math.random() * data.count) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
}

function getLinks(arr, data) {
  arr.forEach((_, index) => {
    arr[index] = data.results[arr[index]].url;
  });
}

function compareAlphabetically(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function handleActionsButton(seenOrCaught, pokemonId, buttonClass) {
  const userData = localStorage.getItem("userData");
  if (!userData) {
    localStorage.setItem(
      "userData",
      JSON.stringify({ [pokemonId]: { [seenOrCaught]: true } })
    );
  } else {
    const userDataObject = JSON.parse(userData);
    const oldState = userDataObject[pokemonId];
    if (oldState) {
      userDataObject[pokemonId][seenOrCaught] = !oldState[seenOrCaught];
    } else {
      userDataObject[pokemonId] = { [seenOrCaught]: true };
    }
    localStorage.setItem("userData", JSON.stringify(userDataObject));
  }

  const clickedIcon = document.querySelector(
    `button.${buttonClass}[data-id='${pokemonId}'] i`
  );

  const isChecked = clickedIcon.classList.contains("text-darken-4");
  clickedIcon.classList.toggle("text-darken-4");

  const currentCounter = document.querySelector(
    `.pokemons-header .${seenOrCaught}`
  );

  !isChecked
    ? (currentCounter.textContent = +currentCounter.textContent + 1)
    : (currentCounter.textContent = +currentCounter.textContent - 1);
}

function seenButton() {
  const pokemonId = this.dataset.id;
  handleActionsButton("seen", pokemonId, "Pokemon__actions__Seen");
}

function caughtButton() {
  const pokemonId = this.dataset.id;
  handleActionsButton("caught", pokemonId, "Pokemon__actions__Caught");
}

function modalSetUp() {
  const modal = document.querySelectorAll(".modal");
  const options = {
    opacity: 0.5,
    inDuration: 250,
    outDuration: 250,
    preventScrolling: true,
    dismissible: true,
    startingTop: "4%",
    endingTop: "10%",
  };
  const instances = M.Modal.init(modal, options);
}

function searchSetUp() {
  const storData = {};
  const { results } = FetchedPokemonData;
  for (let i = 0; i < results.length; i++) {
    storData[results[i].name] = null;
  }
  const autocomplete = document.querySelectorAll(".autocomplete");
  const instances = M.Autocomplete.init(autocomplete, {
    data: storData,
    limit: 10,
    minLength: 1,
    onAutocomplete: function (val) {
      // here will add functionality to display more data about the selected pokemon from the search
    },
  });
}

function errorHandle() {
  const loader = document.querySelector("#loader");
  loader.classList.remove("loader");
  const errorMessage = document.createElement("h5");
  errorMessage.textContent = "Sorry Something went wrong !! Please Try Again";
  errorMessage.style.color = "red";
  loader.appendChild(errorMessage);
}
