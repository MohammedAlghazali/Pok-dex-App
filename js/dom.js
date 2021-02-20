let FetchedPokemonData;
const PokemonsRow = document.querySelector(".row");
const loader = document.querySelector(".loader");

// render types section in details modal
function typesRender(Pokemon, types) {
  Pokemon.types.forEach((pokemonType) => {
    const newType = document.createElement("span");
    newType.textContent = pokemonType.type.name;
    types.appendChild(newType);
  });
}

// render stats section in details modal
function statsRender(Pokemon, stats) {
  Pokemon.stats.forEach((statsElement) => {
    const { base_stat, stat } = statsElement;
    const newState = document.createElement("div");
    const stateTitle = document.createElement("div");
    const progress = document.createElement("div");
    const bar = document.createElement("div");
    const percent = document.createElement("p");

    progress.classList.add("progress");
    stateTitle.classList.add("state-title");
    bar.classList.add("bar");
    bar.style.width = `${base_stat > 100 ? 100 : base_stat}%`;
    percent.classList.add("percent");
    newState.classList.add("progress-container");

    percent.textContent = `${base_stat > 100 ? 100 : base_stat}%`;
    stateTitle.textContent = stat.name;
    bar.appendChild(percent);
    progress.appendChild(bar);

    newState.appendChild(stateTitle);
    newState.appendChild(progress);

    stats.appendChild(newState);
  });
}

// render moves section in details modal
function movesRender(Pokemon, moves) {
  Pokemon.moves.forEach((movesElement, index) => {
    if (index < 30) {
      const { name } = movesElement.move;
      const newMove = document.createElement("li");
      newMove.textContent = name;
      moves.appendChild(newMove);
    }
  });
}

// render Details modal
function renderDetails(Pokemon) {
  const modalWrapper = document.querySelector(".modal-wrapper");

  const modal = document.createElement("div");
  const modalContent = document.createElement("div");
  const header = document.createElement("section");
  const imageContainer = document.createElement("div");
  const image = document.createElement("img");
  const title = document.createElement("div");
  const types = document.createElement("section");
  const stats = document.createElement("section");
  const moves = document.createElement("ul");
  const typesHeading = document.createElement("h4");

  typesHeading.textContent = "Type(s)";
  types.appendChild(typesHeading);
  imageContainer.classList.add("details-image-container");
  types.classList.add("types");
  moves.classList.add("moves-container");
  header.classList.add("header");
  modal.classList.add("modal");
  modalContent.classList.add("modal-content");
  modal.setAttribute("id", `modal${Pokemon.id}`);
  if (Pokemon.sprites.front_default) {
    image.src = Pokemon.sprites.front_default;
  } else {
    image.src = "/images/pikachu.svg";
  }
  title.textContent = Pokemon.name;

  typesRender(Pokemon, types);
  statsRender(Pokemon, stats);
  movesRender(Pokemon, moves);

  imageContainer.appendChild(title);
  imageContainer.appendChild(image);
  header.appendChild(imageContainer);
  header.appendChild(types);
  modalContent.appendChild(header);
  modalContent.appendChild(stats);
  modalContent.appendChild(moves);
  modal.appendChild(modalContent);
  modalWrapper.appendChild(modal);
}

// render all data
function render(Pokemon) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  let seenCount = 0;
  let caughtCount = 0;

  Pokemon.sort(compareAlphabetically);

  // Render Each Pokemon
  Pokemon.forEach((Pokemon) => {
    const { id } = Pokemon;
    const isSeen = userData?.[id]?.seen;
    const isCaught = userData?.[id]?.caught;
    isSeen ? ++seenCount : null;
    isCaught ? ++caughtCount : null;

    const PokemonColumns = document.createElement("div");
    const PokemonContainer = document.createElement("div");
    const PokemonImageContainer = document.createElement("div");
    const PokemonLink = document.createElement("a");
    const PokemonImage = document.createElement("img");
    const PokemonActions = document.createElement("div");
    const PokemonSeen = document.createElement("button");
    const PokemonSeenIcon = document.createElement("i");
    const PokemonCaught = document.createElement("button");
    const PokemonCaughtIcon = document.createElement("i");
    const PokemonName = document.createElement("div");

    PokemonColumns.classList.add("col", "s12", "m4");
    PokemonContainer.classList.add("Pokemon", "card");
    PokemonLink.classList.add("waves-effect", "waves-light", "modal-trigger");
    PokemonImageContainer.classList.add("Pokemon__image", "card-image");
    PokemonActions.classList.add("Pokemon__actions");
    PokemonSeen.classList.add(
      "Pokemon__actions__Seen",
      "halfway-fab-left",
      "waves-effect",
      "waves-light",
      "btn-floating"
    );
    PokemonSeenIcon.classList =
      "material-icons" + " grey-text " + (isSeen ? "text-darken-4" : "");
    PokemonCaught.classList.add(
      "Pokemon__actions__Caught",
      "halfway-fab-right",
      "waves-effect",
      "waves-light",
      "btn-floating"
    );
    PokemonCaughtIcon.classList =
      "material-icons" + " grey-text " + (isCaught ? "text-darken-4" : "");
    PokemonName.classList.add("Pokemon__name", "card-content");
    PokemonLink.href = `#modal${id}`;
    if (Pokemon.sprites.front_default) {
      PokemonImage.src = Pokemon.sprites.front_default;
    } else {
      PokemonImage.src = "/images/pikachu.svg";
    }
    PokemonImage.alt = "";
    PokemonImage.title = Pokemon.name;
    PokemonName.textContent = Pokemon.name;
    PokemonSeenIcon.textContent = "remove_red_eye";
    PokemonCaughtIcon.textContent = "check";
    PokemonSeen.setAttribute("data-id", id);
    PokemonCaught.setAttribute("data-id", id);

    // add functionality for action buttons
    PokemonSeen.onclick = seenButton;
    PokemonCaught.onclick = caughtButton;

    // append children
    PokemonSeen.appendChild(PokemonSeenIcon);
    PokemonCaught.appendChild(PokemonCaughtIcon);
    PokemonActions.appendChild(PokemonSeen);
    PokemonActions.appendChild(PokemonCaught);
    PokemonLink.appendChild(PokemonImage);
    PokemonImageContainer.appendChild(PokemonLink);
    PokemonContainer.appendChild(PokemonImageContainer);
    PokemonContainer.appendChild(PokemonActions);
    PokemonContainer.appendChild(PokemonName);
    PokemonColumns.appendChild(PokemonContainer);
    PokemonsRow.appendChild(PokemonColumns);

    // render the details for each pokemon
    renderDetails(Pokemon);
    modalSetUp();
  });

  // render counters
  const seenSpan = document.querySelector(".pokemons-header .seen");
  const caughtSpan = document.querySelector(".pokemons-header .caught");
  seenSpan.textContent = seenCount;
  caughtSpan.textContent = caughtCount;
}

const listOfPokemon = [];
fetch("https://pokeapi.co/api/v2/pokemon/?limit=10000")
  .then((data) => data.json())
  .then((data) => {
    FetchedPokemonData = data;
    randomSelection(listOfPokemon, data);
    getLinks(listOfPokemon, data);
  })
  .then(() => {
    return Promise.all(
      listOfPokemon.map((link) => fetch(link).then((resp) => resp.json()))
    );
  })
  .then((data) => {
    loader.classList.add("hide-loader");
    render(data);
    searchSetUp();
  })
  .catch((err) => {
    errorHandle();
  });
