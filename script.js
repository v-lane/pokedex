///////////////
// VARIABLES //
///////////////

const $pokemon_list = document.querySelector('#pokemon-list');
const $modal = document.querySelector('#pokemon-spotlight');
const $modal_close = document.querySelector('#modal-close');
const $release_button = document.querySelector('#release-pokemon');
const $catch_button = document.querySelector('#catch-pokemon');
const $load_button = document.querySelector('#load-more');

/////////////////////
// ASYNC FUNCTIONS //
/////////////////////

// Get intial pokemon list data
async function getPokemonList() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
    const data = await response.json();

    const element = createPokemonList(data.results)
    $pokemon_list.prepend(element)

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
    console.log('GET POKEMON ID FROM ELEMENT - GET DATA - POPULATE MODAL');
    console.log(e.target.closest('.pokemon-list-item').dataset.pokemon);
    console.log($modal);
    $modal.showModal();
    $modal.classList.remove('d-none');
  }
}

// Close modal and cleanup
function closeModal() {
  $modal.classList.add('d-none');
  $modal.close();
  console.log('CHECK IF ANY OTHER MODAL CLEANUP NEEDED');
}

// parseURL
// Will return the Pokemon's id from the provided url
function parseUrl(url) {
  return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
}

// Create single pokemon element, given pokemon ID and name
// Return HTML element
function createPokemonItem(pokemonID, pokemonName) {
  const $column = document.createElement('div')
  $column.className = "col-12 col-sm-6 col-md-4"
  const $item_container = document.createElement('div')
  $item_container.className = "pokemon-list-item"
  $item_container.dataset.pokemon = pokemonID
  const $caught_tag = document.createElement('div')
  $caught_tag.className = "caught-tag"
  $caught_tag.innerHTML = "<p>CAUGHT</p>"
  const $image = document.createElement('img')
  $image.setAttribute('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`)
  $image.setAttribute('alt', pokemonName)
  const $h2 = document.createElement('h2')
  $h2.className = 'h3'
  $h2.textContent = pokemonName

  $item_container.append($caught_tag, $image, $h2)
  $column.append($item_container)

  return $column
}

// Given array of data, create many pokemon elements
// Return HTML element
function createPokemonList(data) {
  console.log('data', data)
  const $row = document.createElement('div')
  $row.className = "row justify-content-center"
  for (const pokemon of data) {
    const id = parseUrl(pokemon.url);
    console.log('id:', id)
    const name = pokemon.name
    console.log('name: ', name)
    const $pokemonItem = createPokemonItem(id, name)
    $row.append($pokemonItem)
  }
  return $row
}


{/*       <div class="row justify-content-center">

  <div class="col-12 col-sm-6 col-md-4">
<div class="pokemon-list-item" data-pokemon="pokemon-1">
  <div class="caught-tag">
    <p>CAUGHT</p>
  </div>
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    alt="Bulbasaur">
  <h2 class="h3">Bulbasaur</h2>
</div>
</div> */}


/////////////////////
// EVENT LISTENERS //
/////////////////////

// On click of any item in pokemon list. 
// Applied to pokemon list, to apply to async populated pokemon list items
$pokemon_list.addEventListener('click', pokemonListAction);


// On click of modal 'X' close button.
$modal_close.addEventListener('click', (() => closeModal()));

// On click of modal 'Release' button.
$release_button.addEventListener('click', () => {
  console.log('RELEASE POKEMON');
});

// On click of modal 'Catch' button.
$catch_button.addEventListener('click', () => {
  console.log('CATCH POKEMON');
});

// On click of 'Load More' pokemon button.
$load_button.addEventListener('click', () => {
  console.log('LOAD MORE POKEMON');
});





// On load
getPokemonList();