const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const pagination = document.querySelector("#pagination");
let URL = "https://pokeapi.co/api/v2/pokemon/";

let currentPage = 1;
let totalPages = 0;
const pokemonsPerPage = 9;
fetchPokemons();

function fetchPokemons() {
    fetch(URL)
        .then((response) => response.json())
        .then(data => {
            totalPages = Math.ceil(data.count / pokemonsPerPage);
            fetchPokemonData(currentPage);
        });
}

function fetchPokemonData(page) {
    const offset = (page - 1) * pokemonsPerPage;
    const limit = pokemonsPerPage;

    fetch(`${URL}?offset=${offset}&limit=${limit}`)
        .then((response) => response.json())
        .then(data => {
            listaPokemon.innerHTML = "";
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then((response) => response.json())
                    .then(data => mostrarPokemon(data))
            });

            updatePaginationButtons();
        });
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

function updatePaginationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener("click", () => {
    currentPage--;
    fetchPokemonData(currentPage);
});
nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchPokemonData(currentPage);
});
//

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 201; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))


// busqueda

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    if (searchValue !== '') {
        searchPokemonByInitial(searchValue);
    } else {
        resetPokemonList();
    }
});

function searchPokemonByInitial(initial) {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            return response.json();
        })
        .then(data => {
            const filteredPokemon = data.results.filter(pokemon => pokemon.name.startsWith(initial));
            listaPokemon.innerHTML = '';
            filteredPokemon.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => mostrarPokemon(pokemonData))
                    .catch(error => console.log(error));
            });
        })
        .catch(error => {
            console.log(error);
            alert('Pokémon not found');
        });
}

function resetPokemonList() {
    const listaPokemon = document.querySelector("#listaPokemon");
    listaPokemon.innerHTML = '';
    fetchPokemonData(currentPage);

}