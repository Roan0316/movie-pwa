document.addEventListener('DOMContentLoaded', async () => {
  const detailEl = document.getElementById('filmDetail');
  const backBtn = document.getElementById('backBtn');
  const TMDB_API_KEY = window.TMDB_API_KEY;
  const TMDB_BASE_URL = window.BASE_URL;
  const TMDB_IMAGE_BASE_URL = window.TMDB_IMAGE_BASE_URL;

  backBtn.addEventListener('click', () => {
    window.location.href = 'overzicht.html';
  });

  const params = new URLSearchParams(window.location.search);
  const filmId = params.get('id');
  if (!filmId) {
    detailEl.innerHTML = '<p>Geen film geselecteerd.</p>';
    return;
  }

  async function fetchMovieDetails(id) {
    try {
      const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=nl-NL`);
      return await res.json();
    } catch (e) {
      console.error('Fout bij ophalen film details:', e);
      return null;
    }
  }

  function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }

  function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
  }

  function isFavorite(id) {
    return getFavorites().some(f => f.id === id);
  }

  function toggleFavorite(movie) {
    let favs = getFavorites();
    const exists = isFavorite(movie.id);
    if (exists) {
      favs = favs.filter(f => f.id !== movie.id);
    } else {
      favs.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      });
    }
    saveFavorites(favs);
    renderFavoriteButton(movie);
  }

  function renderFavoriteButton(movie) {
    const btn = document.getElementById('favoriteBtn');
    if (!btn) return;
    const icon = btn.querySelector('span');

    if (isFavorite(movie.id)) {
      icon.textContent = 'favorite';
      btn.setAttribute('aria-label', 'Verwijder uit favorieten');
    } else {
      icon.textContent = 'favorite_border';
      btn.setAttribute('aria-label', 'Voeg toe aan favorieten');
    }
  }

  function renderMovie(movie) {
    const poster = movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'assets/placeholder.png';
    const genres = movie.genres.map(g => g.name).join(', ');
    const releaseDate = new Date(movie.release_date).toLocaleDateString('nl-NL');

    detailEl.innerHTML = `
      <div class="detail-container">
        <img class="detail-poster" src="${poster}" alt="${movie.title}">
        <div class="detail-content">
          <h2 class="mdc-typography--headline5">${movie.title}</h2>
          <p><strong>Releasedatum:</strong> ${releaseDate}</p>
          <p><strong>Genres:</strong> ${genres}</p>
          <p><strong>Score:</strong> ${movie.vote_average} / 10</p>
          <p class="mdc-typography--body1">${movie.overview}</p>
          <button id="favoriteBtn" class="favorite-btn" data-id="${movie.id}" title="${isFavorite(movie.id) ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}">
            <span class="material-icons" aria-hidden="true">${isFavorite(movie.id) ? 'favorite' : 'favorite_border'}</span>
          </button>
        </div>
      </div>
    `;

    const favBtn = document.getElementById('favoriteBtn');
    if (favBtn) {
      mdc.ripple.MDCRipple.attachTo(favBtn);
      favBtn.addEventListener('click', () => toggleFavorite(movie));
    }
    renderFavoriteButton(movie);
  }

  const movie = await fetchMovieDetails(filmId);
  if (movie) {
    renderMovie(movie);
  } else {
    detailEl.innerHTML = '<p>Film kon niet geladen worden.</p>';
  }
});
