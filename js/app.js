document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service Worker geregistreerd'))
      .catch(err => console.error('Service Worker registratie mislukt:', err));
  }

  function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  function isFavorite(filmId) {
    return getFavorites().some(f => f.id === filmId);
  }

  function toggleFavorite(film) {
    let favorites = getFavorites();
    const index = favorites.findIndex(f => f.id === film.id);
    let added;

    if (index === -1) {
      favorites.push(film);
      added = true;
    } else {
      favorites.splice(index, 1);
      added = false;
    }

    saveFavorites(favorites);
    return added;
  }

  function createFilmCard(film) {
    const poster = film.poster_path ? `${TMDB_IMAGE_BASE_URL}${film.poster_path}` : 'assets/placeholder.png';
    const release = film.release_date ? new Date(film.release_date).toLocaleDateString('nl-NL') : 'Onbekend';

    const card = document.createElement('div');
    card.className = 'film-card mdc-card';

    card.innerHTML = `
      <a href="detail.html?id=${film.id}" class="film-link" title="Bekijk details van ${film.title}">
        <img src="${poster}" alt="Poster van ${film.title}" class="film-poster" />
        <div class="film-info">
          <h4 class="film-title">${film.title}</h4>
          <p class="film-overview">${film.overview || ''}</p>
          <p class="film-release">Release: ${release}</p>
        </div>
      </a>
      <button class="favorite-btn" data-id="${film.id}" title="${isFavorite(film.id) ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}">
        <span class="material-icons" aria-hidden="true">${isFavorite(film.id) ? 'favorite' : 'favorite_border'}</span>
      </button>
    `;

    const favBtn = card.querySelector('.favorite-btn');
    favBtn.addEventListener('click', e => {
      e.preventDefault();
      const added = toggleFavorite(film);
      favBtn.querySelector('span').textContent = added ? 'favorite' : 'favorite_border';
      favBtn.title = added ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten';
    });

    return card;
  }

  const filmList = document.getElementById('film-list');

  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=nl-NL&page=1`);
    const data = await response.json();

    data.results.forEach(film => {
      filmList.appendChild(createFilmCard(film));
    });
    window.createFilmCard = createFilmCard;
  } catch (err) {
    filmList.innerHTML = '<p>Fout bij ophalen films.</p>';
    console.error(err);
  }
});
