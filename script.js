///////////////
// VARIABLES //
///////////////

const $pokemon_list = document.getElementById('pokemon-list');
const $modal = document.getElementById('pokemon-spotlight');
const $modal_close = document.getElementById('modal-close');
const $release_button = document.getElementById('release-pokemon');
const $catch_button = document.getElementById('catch-pokemon');
const $load_button = document.getElementById('load-more');

const caught_pokemon = getCaughtPokemon();
let next_url = '';


/////////////////////
// ASYNC FUNCTIONS //
/////////////////////

// Get pokemon list data and create html elements.
// default url pulls first 20 pokemon
async function getPokemonList(url = 'https://pokeapi.co/api/v2/pokemon/') {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const element = createPokemonList(data.results);
    $pokemon_list.prepend(element);

    next_url = data.next;

    updateCaughtPokemon();
  } catch (error) {
    console.error('Error: ', error);
  }
}

// Get single pokemon data and update modal element info
// given pokemon id
async function getPokemonData(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();

    updateModal(data);

  } catch (error) {
    console.error('Error: ', error);
  }
}


//////////////////////
// HELPER FUNCTIONS //
//////////////////////

// If pokemon list item exists, open modal with data for clicked pokemon.
function pokemonListAction(e) {
  if (e.target.closest('.pokemon-list-item')) {
    const id = e.target.closest('.pokemon-list-item').dataset.pokemon;
    getPokemonData(id);

    $modal.showModal();
    $modal.classList.remove('d-none');
  }
}

// Close modal and cleanup
function closeModal() {
  $modal.classList.add('d-none');
  $modal.close();

  const $modal_body_details = document.getElementById('modal-body-details').children;
  for (let i = 0; i < $modal_body_details.length; i++) {
    if ($modal_body_details[0].tagName === 'P' || $modal_body_details[0].tagName === 'H2') {
      $modal_body_details[0].remove();
      i -= 1;
    }
  }

  const $modal_img = document.getElementById('modal-img');
  $modal_img.removeAttribute('src');
  $modal_img.removeAttribute('alt');

  const $modal_h1 = document.getElementById('modal-h1');
  $modal_h1.textContent = '';
}

// parseURL
// Will return the Pokemon's id from the provided url
function parseUrl(url) {
  return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
}

// Create single pokemon element, given pokemon ID and name
// Return HTML element
function createPokemonItem(pokemonID, pokemonName) {
  const $column = document.createElement('div');
  $column.className = "col-12 col-sm-6 col-md-4";
  const $item_container = document.createElement('div');
  $item_container.className = "pokemon-list-item";
  $item_container.dataset.pokemon = pokemonID;
  const $caught_tag = document.createElement('div');
  $caught_tag.className = "caught-tag d-none";
  $caught_tag.innerHTML = "<p>CAUGHT</p>";
  const $image = document.createElement('img');
  $image.setAttribute('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`);
  $image.setAttribute('alt', pokemonName);
  const $h2 = document.createElement('h2');
  $h2.className = 'h3';
  $h2.textContent = pokemonName;

  $item_container.append($caught_tag, $image, $h2);
  $column.append($item_container);

  return $column;
}

// Given array of data, create many pokemon elements
// Return HTML element
function createPokemonList(data) {
  let $row;

  if ($pokemon_list.contains(document.querySelector('div'))) {
    $row = $pokemon_list.firstElementChild;
  } else {
    $row = document.createElement('div');
    $row.className = "row justify-content-center";
  }

  for (const pokemon of data) {
    const id = parseUrl(pokemon.url);
    const name = pokemon.name;
    const $pokemonItem = createPokemonItem(id, name);
    $row.append($pokemonItem);
  }
  return $row;
}

// Given pokemon data, update modal
function updateModal(data) {
  const $h1 = document.getElementById('modal-h1');
  const $img = document.getElementById('modal-img');
  const $modal_body = document.getElementById('modal-body-details');

  $h1.textContent = data.name;
  $h1.dataset.pokemon = data.id;
  $img.setAttribute('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`);
  $img.setAttribute('alt', data.name);

  const $h2_types = document.createElement('h2');
  $h2_types.textContent = 'Types';
  const $h2_abilities = document.createElement('h2');
  $h2_abilities.textContent = 'Abilities';

  const $types = document.createElement('p');
  const types = [];
  for (const type of data.types) {
    types.push(type.type.name);
  }
  $types.textContent = types.join(', ');

  const $abilities = document.createElement('p');
  const abilities = [];
  for (const ability of data.abilities) {
    abilities.push(ability.ability.name);
  }
  $abilities.textContent = abilities.join(', ');

  if (caught_pokemon.includes(`${data.id}`)) {
    $release_button.classList.remove('d-none');
    $catch_button.classList.add('d-none');
  } else {
    $release_button.classList.add('d-none');
    $catch_button.classList.remove('d-none');
  }

  $modal_body.prepend($h2_types, $types, $h2_abilities, $abilities);
}

// Check localstorage for caught pokemon
function getCaughtPokemon() {
  if (localStorage.getItem('caught_pokemon')) {
    return JSON.parse(localStorage.getItem('caught_pokemon'));
  } else {
    return [];
  }
}

// check and update pokemon with 'caught' banner
function updateCaughtPokemon() {
  const $pokemon_items = document.querySelectorAll('.pokemon-list-item');
  for (const pokemon of $pokemon_items) {
    const id = pokemon.dataset.pokemon;
    const $caught_tag = pokemon.querySelector('.caught-tag');
    if (caught_pokemon.includes(`${id}`)) {
      $caught_tag.classList.remove('d-none');
    } else {
      $caught_tag.classList.add('d-none');
    }
  }
}


/////////////////////
// EVENT LISTENERS //
/////////////////////

// On click of any item in pokemon list. 
// Applied to pokemon list, to apply to async populated pokemon list items
$pokemon_list.addEventListener('click', pokemonListAction);


// On click of modal 'X' close button.
$modal_close.addEventListener('click', closeModal);

// On click of modal 'Release' button.
$release_button.addEventListener('click', () => {
  const id = document.getElementById('modal-h1').dataset.pokemon;
  caught_pokemon.splice(caught_pokemon.indexOf(`${id}`), 1);
  localStorage.setItem('caught_pokemon', JSON.stringify(caught_pokemon));
  updateCaughtPokemon();
  closeModal();
});

// On click of modal 'Catch' button.
$catch_button.addEventListener('click', (e) => {
  localStorage.removeItem('caught_pokemon');
  const id = document.getElementById('modal-h1').dataset.pokemon;
  caught_pokemon.push(id);
  localStorage.setItem('caught_pokemon', JSON.stringify(caught_pokemon));
  updateCaughtPokemon();
  closeModal();
});

// On click of 'Load More' pokemon button.
$load_button.addEventListener('click', () => getPokemonList(next_url));





// On load
getPokemonList();