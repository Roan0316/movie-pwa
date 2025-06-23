const TMDB_API_KEY = window.TMDB_API_KEY;
const BASE_URL = window.BASE_URL;
const filmList = document.getElementById('film-list');
const inputElement = document.querySelector('.mdc-text-field__input');

async function loadMovies(url) {
    const res = await fetch(url);
    const data = await res.json();

    filmList.innerHTML = '';

    if (!data.results || data.results.length === 0) {
        filmList.innerHTML = '<p>Geen films gevonden.</p>';
        return;
    }

    data.results.forEach(film => {
        filmList.appendChild(createFilmCard(film));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));

    if (!inputElement || !filmList) return;

    loadMovies(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=nl-NL`);

    inputElement.addEventListener('input', () => {
        const query = inputElement.value.trim();

        if (query.length < 2) {
            loadMovies(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=nl-NL`);
        } else {
            loadMovies(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=nl-NL&query=${encodeURIComponent(query)}`);
        }
    });
});
