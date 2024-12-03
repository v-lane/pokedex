///////////////
// VARIABLES //
///////////////

const $pokemon_list = document.querySelector('#pokemon-list');
const $modal = document.querySelector('#pokemon-spotlight');
const $modal_close = document.querySelector('#modal-close');
const $release_button = document.querySelector('#release-pokemon')
const $catch_button = document.querySelector('#catch-pokemon')
const $load_button = document.querySelector('#load-more')

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

// If pokemon list item exists, open modal with data for clicked pokemon.
function pokemonListAction(e) {
  if (e.target.closest('.pokemon-list-item')) {
    console.log('GET POKEMON ID FROM ELEMENT - GET DATA - POPULATE MODAL')
    console.log(e.target.closest('.pokemon-list-item').dataset.pokemon);
    console.log($modal);
    $modal.showModal();
    $modal.classList.remove('d-none');
  }
}

// Close modal and cleanup
function closeModal() {
  $modal.classList.add('d-none')
  $modal.close();
  console.log('CHECK IF ANY OTHER MODAL CLEANUP NEEDED')
}


/////////////////////
// EVENT LISTENERS //
/////////////////////

// On click of any item in pokemon list. 
// Applied to pokemon list, to apply to async populated pokemon list items
$pokemon_list.addEventListener('click', pokemonListAction);


// On click of modal 'X' close button.
$modal_close.addEventListener('click', (() => closeModal()))

// On click of modal 'Release' button.
$release_button.addEventListener('click', () => {
  console.log('RELEASE POKEMON')
})

// On click of modal 'Catch' button.
$catch_button.addEventListener('click', () => {
  console.log('CATCH POKEMON')
})

// On click of 'Load More' pokemon button.
$load_button.addEventListener('click', () => {
  console.log('LOAD MORE POKEMON')
})





