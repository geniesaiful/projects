const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNTMzNjkwZmE0MjU5MjQxZTIyYTZlNDU4N2ExZDEyOSIsIm5iZiI6MTc4ODI1NzIwMS45MSwic3ViIjoiNmE5NmEzYjE2YTNjZjkzODY2Yzg1YjhmIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.9eKEQSm79FSk8gyZjJ0YXXa2IRkJbHdyrzNh7O4zw94';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
  }
};
const pageState = {
  popular: 1,
  top_rated: 1,
  now_playing: 1,
  upcoming: 1
};

// Config for sections mapping to container IDs
const movieSections = [
  { key: 'popular', endpoint: 'popular', containerId: 'contentPopularID' },
  { key: 'top_rated', endpoint: 'top_rated', containerId: 'contentTopRatedID' },
  { key: 'now_playing', endpoint: 'now_playing', containerId: 'contentNowPlayingID' },
  { key: 'upcoming', endpoint: 'upcoming', containerId: 'contentUpcomingID' },
  { key: 'search', endpoint: '', containerId: 'contentSearchID' }
];
pageState.search = 1;
let currentSearchQuery = '';

function injectGenreEmojis() {
  const rawData = localStorage.getItem("MOVIEAPP_GENRES");
  
  if (!rawData) {
    console.error("No data found in localStorage under 'MOVIEAPP_GENRES'");
    return;
  }
  const genresArray = JSON.parse(rawData);
  //console.log(genresArray)

  const emojiMap = {
    "action": "💥",
    "adventure": "🤠",
    "animation": "🎨",
    "comedy": "😂",
    "crime": "🕵️",
    "documentary": "📹",
    "drama": "🎭",
    "family": "🏡",
    "fantasy": "🧙",
    "history": "📜",
    "horror": "👻",
    "music": "🎵",
    "mystery": "🔍",
    "romance": "💖",
    "sci-fi": "🚀",
    "science fiction": "🚀",
    "tv movie": "📺",
    "thriller": "⏳",
    "war": "🪖",
    "western": "🌵"
  };

  const updatedGenres = genresArray.map(genreObj => {

    const normalizedName = genreObj.name.toLowerCase().trim();
    
    const assignedEmoji = emojiMap[normalizedName] || "🎬";
    return {
      ...genreObj,
      emoji: assignedEmoji
    };
  });

  localStorage.setItem("MOVIEAPP_GENRES", JSON.stringify(updatedGenres));
  
  console.log("Successfully injected emojis into MOVIEAPP_GENRES!", updatedGenres);
}
function setupNavigation() {
  const menuButtons = document.querySelectorAll('.menuItem');
  const contentSections = document.querySelectorAll('.content');

  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');

      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      contentSections.forEach(section => {
        if (section.id === targetId) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });
}

async function fetchGenresWithNumbersAPI() {
  //console.log('Fetching fresh data from TMDB API...');
  try{
    
    const genreResponse = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options);
    const genreData = await genreResponse.json();
    const genres = genreData.genres;
    //console.log(genres);

    //Get movies for each genres using genre id, so that we can count how many movies are there.
    //We will use promise so that the function will execute sequentially.

    const numberofMoviesPerGenre = genres.map(async (g) => {
      const discoverResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${g.id}`,options);
      const discoverData = await discoverResponse.json();
      
      return {
        id: g.id,
        name: g.name,
        totalMovies: discoverData.total_results
      };
    });
    // Promise is used when those awit functions are not really depending on the results of each other.
    const results = await Promise.all(numberofMoviesPerGenre);

  localStorage.setItem('MOVIEAPP_GENRES', JSON.stringify(results));
  
  return results;
  
  }catch (error) {
    console.error('Error fetching data from TMDB API:', error);
  }
  
}
async function getGenres(fromAPI = false) {
  const cachedData = localStorage.getItem('MOVIEAPP_GENRES');

  if (cachedData && !fromAPI) {
    //console.log('Loaded from localStorage:');
    const data = JSON.parse(cachedData);
    //console.log(data);
    return data;
  }

  const apiData = await fetchGenresWithNumbersAPI();
  //console.log(apiData);
  return apiData;
}

function renderGenreCards() {
 
  const holder = document.getElementById("genreCardHolder");
  if (!holder) return;

  holder.innerHTML = "";

  const rawData = localStorage.getItem("MOVIEAPP_GENRES");
  if (!rawData) {
    holder.innerHTML = "<p>No genres found. Please run your injector script first!</p>";
    return;
  }
  const genresArray = JSON.parse(rawData);

  const bgColors = [
    "#f5836d", "#69acf4", "#62f162", "#f6c112", 
    "#877498", "#55adad", "#c990bc", "#e49159"
  ];

  genresArray.forEach((genre, index) => {
    // Safely pull totalMovies, or fall back to 0 if the field is missing
    const totalCount = genre.totalMovies || 0;
    const assignedBgColor = bgColors[index % bgColors.length];
    //console.log(index,genre.totalMovies);

    const card = document.createElement("div");
    card.className = "genreCard";
    card.style = `background-color: ${assignedBgColor}35;`;
    
  
    card.innerHTML = `
      <span class="genre-emoji" style="background-color: #ff000020;">
        ${genre.emoji}
      </span>
      <span class="genre-name catTxt">${genre.name}</span>
      <span class="movie-count catTxtLt">${totalCount}</span>
    `;
    holder.appendChild(card);
  });
}
async function getData(storageKey, apiFetcher) {
  const isApiChecked = document.getElementById('liveApiToggleID')?.checked;
  const cached = localStorage.getItem(storageKey);

  // If checkbox is NOT checked and local data exists, use localStorage
  if (!isApiChecked && cached) {
    return JSON.parse(cached);
  }

  // Otherwise (checkbox is checked OR no cache available), fetch fresh data
  const freshData = await apiFetcher();
  localStorage.setItem(storageKey, JSON.stringify(freshData));
  return freshData;
}

async function loadSectionPage(sectionKey, endpoint, containerId, page = 1) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<p>Loading page ${page}...</p>`;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${endpoint}?language=en-US&page=${page}`,
      options
    );
    const data = await response.json();
    const movies = data.results;

    // Save current 20 items to localStorage for immediate section use
    localStorage.setItem(`MOVIEAPP_${sectionKey.toUpperCase()}`, JSON.stringify(movies));
    //console.log(`Successfully fetched and stored to MOVIEAPP_${sectionKey.toUpperCase()}; ${sectionKey}, ${page}, ${containerId}`);
    // Render movies and pagination buttons
    renderMovieGrid(container, movies, sectionKey, page, data.total_pages);

  } catch (error) {
    console.error(`Error loading page ${page} for ${sectionKey}:`, error);
    container.innerHTML = `<p>Failed to load data.</p>`;
  }
}

function renderMovieGrid(container, movies, sectionKey, currentPage, totalPages) {
  container.innerHTML = `<h2 class="btrh2">${sectionKey.toUpperCase()}</h2>`; // Clear container

  // 1. Movie Grid Container
  const grid = document.createElement('div');
  grid.className = 'moviesHolder';

  movies.forEach(movie => {
    const poster = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;

    const card = document.createElement('div');
    card.className = 'movieCard';
    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}">
      <div class="movieInfo">
        <span>⭐ ${movie.vote_average.toFixed(1)}</span>
      </div>
      <h4 class="normalTxtBold">${movie.title}<span class="yearText">(${(movie.release_date).split("-")[0]})</span></h4>
    `;
    //console.log(card.innerHTML);
    card.addEventListener('click', () => handleMovieClick(movie.id));
    grid.appendChild(card);
  });
  
  // 2. Pagination Controls
  const pagination = document.createElement('div');
  pagination.className = 'pagination-controls';

  pagination.innerHTML = `
    <button class="page-btn" id="first-${sectionKey}" ${currentPage === 1 ? 'disabled' : ''}>« First</button>
    <button class="page-btn" id="prev-${sectionKey}" ${currentPage === 1 ? 'disabled' : ''}>‹ Prev</button>
    <span class="page-info">Page <strong>${currentPage}</strong> of ${totalPages}</span>
    <button class="page-btn" id="next-${sectionKey}" ${currentPage >= totalPages ? 'disabled' : ''}>Next ›</button>
  `;

  container.appendChild(grid);
  container.appendChild(pagination);

  // 3. Attach Event Listeners to Buttons
  const sectionConfig = movieSections.find(s => s.key === sectionKey);

  document.getElementById(`first-${sectionKey}`).addEventListener('click', () => {
    pageState[sectionKey] = 1;
    loadSectionPage(sectionKey, sectionConfig.endpoint, sectionConfig.containerId, 1);
  });

  document.getElementById(`prev-${sectionKey}`).addEventListener('click', () => {
    if (pageState[sectionKey] > 1) {
      pageState[sectionKey]--;
      loadSectionPage(sectionKey, sectionConfig.endpoint, sectionConfig.containerId, pageState[sectionKey]);
    }
  });

  document.getElementById(`next-${sectionKey}`).addEventListener('click', () => {
    if (pageState[sectionKey] < totalPages) {
      pageState[sectionKey]++;
      if (sectionKey === 'search') {
        executeMovieSearch(currentSearchQuery, pageState[sectionKey]);
      } else {
        loadSectionPage(sectionKey, sectionConfig.endpoint, sectionConfig.containerId, pageState[sectionKey]);
      }
    }
  });
}

async function handleMovieClick(movieId) {
  
  // Render loading skeleton inside overlay
  openMovieModal('<div class="modalLoading">Loading details...</div>');

  try {
    const movie = await FetchMovieDetails(movieId);
    
    // Extract Directors & Cast
    const directors = movie.credits?.crew
      .filter(member => member.job === 'Director')
      .map(d => d.name)
      .join(', ') || 'N/A';

    const topCast = movie.credits?.cast
      .slice(0, 5)
      .map(actor => actor.name)
      .join(', ') || 'N/A';

    const genresMarkup = movie.genres
      ? movie.genres.map(g => `<span class="mdGerneTag">${g.name}</span>`).join('')
      : '';

    const poster = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : 'https://via.placeholder.com/342x513?text=No+Poster';

    const backdrop = movie.backdrop_path 
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : '';
      // if it is in watchlist button become remove from watchlist.
    const watchlist = getWatchlist();
    const isInWatchlist = watchlist.some(m => m.id === movie.id);
    const btnText = isInWatchlist ? '❌ Remove from Watchlist' : '🔖 Add to Watchlist';
    const btnBg = isInWatchlist ? '#cf7c7c' : 'var(--selectorBg)';
    // Populate modal container
    const modalContent = `
      <div class="modalBanner" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url('${backdrop}');">
        <button class="mdCloseBtn" id="modalCloseBtn">&times;</button>
        <img class="modalPoster" src="${poster}" alt="${movie.title}">
      </div>
      <div class="mdBody">
        <h2>${movie.title}</h2>
        <div class="mdMetadata">
          <span>⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}</span>
          <span>📅 ${movie.release_date?.split('-')[0] || 'N/A'}</span>
          <span>⏱️ ${movie.runtime ? movie.runtime + ' mins' : 'N/A'}</span>
        </div>
        <div class="mdGernes">${genresMarkup}</div>
        <div class="mdOverview">
          <h3>Overview</h3>
          <p>${movie.overview || 'No overview available.'}</p>
        </div>
        <div class="mdCredits">
          <p><strong>Director:</strong> ${directors}</p>
          <p><strong>Cast:</strong> ${topCast}</p>
        </div>
        <div class="mdFooter">
          <button class="mdAddWLBtn" id="watchlistToggleBtn" style="background-color: ${btnBg};">${btnText}</button>
        </div>
      </div>
    `;
    openMovieModal(modalContent)
    // listener to Watchlist button
    const watchlistBtn = document.getElementById('watchlistToggleBtn');
    if (watchlistBtn) {
      watchlistBtn.addEventListener('click', () => toggleWatchlist(movie));
    }

  } catch (error) {
    console.error('Failed to display movie details:', error);
    openMovieModal('<div class="modalError">Failed to load movie details.</div>');
  }
}
function openMovieModal(contentHTML) {
  let modalOverlay = document.getElementById('movieModalOverlay');
  
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'movieModalOverlay';
    modalOverlay.className = 'modalOverlay';
    document.body.appendChild(modalOverlay);

    // Close when clicking outside content box
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Close on Escape keypress
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  modalOverlay.innerHTML = `<div class="modalCard">${contentHTML}</div>`;
  modalOverlay.classList.add('active');

  // Attach close event to button dynamically
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
}
async function FetchMovieDetails(movieID) {
  const url = `https://api.themoviedb.org/3/movie/${movieID}?append_to_response=credits,release_dates,recommendations`;
  
  try{
    const response = await fetch(url, options);
    const rawData = await response.json();
    return rawData;
  }catch(error){
    console.error('Error fetching data with TMDB v4:', error);
  }

}
function closeModal() {
  const modalOverlay = document.getElementById('movieModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
}
function setupSearchFeature() {
  // takes input, make it query and execute
  const searchInput = document.getElementById('mainSearchInputID');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();

      if (query !== '') {
        currentSearchQuery = query; // saving the query to global variable so that we can use it to call the api function for page 2 and so on.
        pageState.search = 1;
        saveSearchQuery(query);
        executeMovieSearch(query, 1);
      }
    }
  });
}

async function executeMovieSearch(query, page = 1) {
  const searchContainer = document.getElementById('contentSearchID');
  if (!searchContainer) return;

  switchToSearchSection();
  searchContainer.innerHTML = `<p>Searching for "${query}"...</p>`;

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&include_adult=false&language=en-US&page=${page}`,
      options
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      searchContainer.innerHTML = `<p class="btrh2">No movies found matching "${query}".</p>`;
      return;
    }

    // Reuse your existing rendering function
    renderMovieGrid(searchContainer, data.results, 'search', page, data.total_pages);

  } catch (error) {
    console.error('Error executing movie search:', error);
    searchContainer.innerHTML = `<p>Failed to load search results.</p>`;
  }
}
function switchToSearchSection() {
  // the active stat changer.
  const contentSections = document.querySelectorAll('.content');
  const menuButtons = document.querySelectorAll('.menuItem');

  contentSections.forEach(section => {
    if (section.id === 'contentSearchID') {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  menuButtons.forEach(btn => btn.classList.remove('active'));
}
function renderHomePage() {
  const popularData = JSON.parse(localStorage.getItem('MOVIEAPP_POPULAR')) || [];
  renderHomeMovieRow('homePopularGrid', popularData.slice(0,12));

  const topRatedData = JSON.parse(localStorage.getItem('MOVIEAPP_TOP_RATED')) || [];
  renderHomeMovieRow('homeTopRatedGrid', topRatedData.slice(0,12));

  // 3. Clone existing genre cards into Home genres container
  const homeGenreContainer = document.getElementById('homeGenresGrid');
  const mainGenreHolder = document.getElementById('genreCardHolder');
  if (homeGenreContainer && mainGenreHolder) {
    homeGenreContainer.innerHTML = '';
    // Reuses rendered genre cards from localStorage
    const cards = mainGenreHolder.querySelectorAll('.genreCard');
    cards.forEach(card => {
      homeGenreContainer.appendChild(card.cloneNode(true));
    });
  }

  // 4. Attach View All button triggers using existing navigation logic
  setupViewAllButtons();
}
function renderHomeMovieRow(containerId, movies) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  movies.forEach(movie => {
    const poster = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
    const card = document.createElement('div');
    card.className = 'movieCard';
    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}">
      <div class="movieInfo">
        <span>⭐ ${movie.vote_average.toFixed(1)}</span>
      </div>
      <h4 class="normalTxtBold">${movie.title}<span class="yearText">(${(movie.release_date).split("-")[0]})</span></h4>
    `;
    // Reuses existing movie details modal trigger
    card.addEventListener('click', () => handleMovieClick(movie.id));
    container.appendChild(card);
  });
}
function setupViewAllButtons() {
  const viewAllBtns = document.querySelectorAll('.viewAllBtn');
  viewAllBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Programmatically click the matching menu button to sync menu active states
      const targetMenuBtn = document.querySelector(`.menuItem[data-target="${targetId}"]`);
      if (targetMenuBtn) {
        targetMenuBtn.click();
      }
    });
  });
}

function getWatchlist() {
  return JSON.parse(localStorage.getItem('MOVIEAPP_WATCHLIST')) || [];
}

function saveWatchlist(watchlist) {
  localStorage.setItem('MOVIEAPP_WATCHLIST', JSON.stringify(watchlist));
  updateWatchlistBadge();
}

function updateWatchlistBadge() {
  const badge = document.getElementById('menuWatchlistNumber');
  if (badge) {
    const list = getWatchlist();
    badge.textContent = list.length;
  }
}
function toggleWatchlist(movie) {
  let watchlist = getWatchlist();
  const exists = watchlist.some(m => m.id === movie.id); // watchlist.some will check if the element is exist in the array. returs true or false.

  if (exists) {
    watchlist = watchlist.filter(m => m.id !== movie.id); // creates a copy of the array without that item. Used as remove from watchlist function.
  } else {
    // Save minimal data needed for rendering cards and reopening details
    watchlist.push({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    });
  }

  saveWatchlist(watchlist);
  renderWatchlistSection();

  // Re-render modal footer button if open
  const btn = document.getElementById('watchlistToggleBtn');
  if (btn) {
    const isNowInList = watchlist.some(m => m.id === movie.id);
    btn.textContent = isNowInList ? '❌ Remove from Watchlist' : '🔖 Add to Watchlist';
    btn.style.backgroundColor = isNowInList ? '#c92a2a' : 'var(--selectorBg)';
  }
}

function renderWatchlistSection() {
  const container = document.getElementById('contentWatchlistID');
  if (!container) return;
  container.innerHTML=`<h2 class="btrh2">My Watchlist</h2>`;
  const watchlist = getWatchlist();

  if (watchlist.length === 0) {
    container.innerHTML = `<p class="btrh2" style="padding: 1rem;">Your watchlist is empty.</p>`;
    return;
  }

  // Create grid container using existing styles
  const grid = document.createElement('div');
  grid.className = 'moviesHolder';

  watchlist.forEach(movie => {

    const card = document.createElement('div');
    card.className = 'movieCard';
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w342${movie.poster_path}" alt="${movie.title}">
      <div class="movieInfo">
        <span>⭐ ${movie.vote_average.toFixed(1)}</span>
      </div>
      <h4 class="normalTxtBold">${movie.title}</h4>
    `;
    card.addEventListener('click', () => handleMovieClick(movie.id));
    grid.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(grid);
}
function getRecentSearches() {
  return JSON.parse(localStorage.getItem('MOVIEAPP_RECENT_SEARCHES')) || [];
}
function saveSearchQuery(query) {
  let searches = getRecentSearches();
  searches = searches.filter(item => item.toLowerCase() !== query.toLowerCase()); // take out the query if it exists.

  searches.unshift(query); // unshift adds item in the beginning and increases the length by 1

  searches = searches.slice(0, 6);

  localStorage.setItem('MOVIEAPP_RECENT_SEARCHES', JSON.stringify(searches));
  renderRecentSearches();
}
function renderRecentSearches() {
  const listContainer = document.getElementById('recentSearchesListID');
  if (!listContainer) return;

  const searches = getRecentSearches();
  listContainer.innerHTML = '';

  searches.forEach(query => {
    const li = document.createElement('li');
    li.className = 'rcntTxt';
    li.style.cssText = 'cursor: pointer; margin-bottom: 0.4rem; list-style: none;';
    li.textContent = query;

    // Click event to re-execute search using existing functions
    li.addEventListener('click', () => {
      const searchInput = document.getElementById('mainSearchInputID');
      if (searchInput) searchInput.value = query; //showing the search query in the search input field.

      currentSearchQuery = query;
      pageState.search = 1;
      executeMovieSearch(query, 1);
    });

    listContainer.appendChild(li);
  });
}
function setupThemeToggle() {
  const toggleSwitch = document.getElementById('toggleSwitchID');
  if (!toggleSwitch) return;

  const savedTheme = localStorage.getItem('MOVIEAPP_THEME') || 'dark';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark'); 
    toggleSwitch.checked = true;
  } else {
    document.body.classList.remove('dark'); 
    toggleSwitch.checked = false;
  }

  toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
      document.body.classList.add('dark');
      localStorage.setItem('MOVIEAPP_THEME', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('MOVIEAPP_THEME', 'light');
    }
  });
}

async function initApp() {
  setupThemeToggle();
  renderWatchlistSection();
  renderRecentSearches();
  await getGenres();
  renderGenreCards();
  setupNavigation();
  
  // Wait for section pages to populate localStorage, then render Home page
  await Promise.all(
    movieSections
      .filter(s => s.key !== 'search') // take all section without search section
      .map(s => loadSectionPage(s.key, s.endpoint, s.containerId, 1)) // do(run the function) for all sections
  );

  renderHomePage();
  setupSearchFeature();
  updateWatchlistBadge();

}

initApp();

//getGenres();
//injectGenreEmojis();
//renderGenreCards();
//setupNavigation();
//getPopularFromAPI();
//fetchAndStoreMoviesFP();
//renderMovieSectionsAll();
//initAllMovieSections();
//setupSearchFeature();

//// OLD functions

function initAllMovieSections() {
  movieSections.forEach(section => {
    if (section.key === 'search') return;
    loadSectionPage(section.key, section.endpoint, section.containerId, 1);
  });
}
async function getPopularFromAPI(){
  try{

    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, options);
    const data = await response.json();
    console.log(`Fetched Data: ${data.results[0].id}`);
    //localStorage.setItem(MOVIEAPP_POPULAR, JSON.stringify(data.results));
  }catch(error){
    console.error('Error fetching data from TMDB API: ', error);
  }
}

async function fetchAndStoreMoviesFP() {
  const categories = [
    { key: 'MOVIEAPP_POPULAR', endpoint: 'popular' },
    { key: 'MOVIEAPP_TOP_RATED', endpoint: 'top_rated' },
    { key: 'MOVIEAPP_NOW_PLAYING', endpoint: 'now_playing' },
    { key: 'MOVIEAPP_UPCOMING', endpoint: 'upcoming' }
  ];

  try {
    const fetchPromises = categories.map(async (cat) => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${cat.endpoint}?language=en-US&page=1`, options);
      const data = await response.json();

      localStorage.setItem(cat.key, JSON.stringify(data.results));
      
      return { category: cat.endpoint, movies: data.results };
    });

    // Resolve all requests in parallel
    const results = await Promise.all(fetchPromises);

    console.log('--- Fetched Movie Categories ---');
    results.forEach(item => {
      console.log(`[${item.category.toUpperCase()}]:`, item.movies);
    });

  } catch (error) {
    console.error('Error fetching movie lists from TMDB:', error);
  }
}

function renderMovieSectionsAll(){

  const popularDiv = document.getElementById('contentPopularID');
  const topRatedDiv = document.getElementById('contentTopRatedID');
  const nowPlayingDiv = document.getElementById('contentNowPlayingID');
  const upcomingDiv = document.getElementById('contentUpcomingID');

  const cachedPopularData = JSON.parse(localStorage.getItem('MOVIEAPP_POPULAR'));
  const cachedTopRatedData = JSON.parse(localStorage.getItem('MOVIEAPP_TOP_RATED'));
  const cachedNowPlayigData = JSON.parse(localStorage.getItem('MOVIEAPP_NOW_PLAYING'));
  const cachedUpcomingData = JSON.parse(localStorage.getItem('MOVIEAPP_UPCOMING'));

  const targetSections = [
  { element: popularDiv, movies: cachedPopularData },
  { element: topRatedDiv, movies: cachedTopRatedData },
  { element: nowPlayingDiv, movies: cachedNowPlayigData },
  { element: upcomingDiv, movies: cachedUpcomingData }
  ];

  targetSections.forEach(({ element, movies }) =>  {
    //console.log(movies);
    element.innerHTML="";
    const moviesHolder = document.createElement('div');
    moviesHolder.classList.add('moviesHolder');
    movies.forEach(movie =>{
      const movieCard = document.createElement('div');
      movieCard.classList.add('movieCard');
      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w194${movie.poster_path}" alt="${movie.title}">
        <span>${movie.title}</span>
      `;
      movieCard.addEventListener("click", ()=>{
        showMovieDetail(movie,element.id);
      });

      moviesHolder.appendChild(movieCard);
    });
    //console.log( moviesHolder.classList);
    element.appendChild(moviesHolder);
  });
  
}


async function showMovieDetail(selectedMovie,containerID){
  //console.log(movie.id,containerID);
  const sectionDiv = document.getElementById(containerID);
  const prevDiv = sectionDiv.querySelector('.movieDetailsDiv');
  if (prevDiv) {
    prevDiv.remove();
  }
  try{
    const movie = await FetchMovieDetails(selectedMovie.id);
    console.log(movie);
    const directorsArray = movie.credits.crew.filter(member => member.job === 'Director');
    const directorNames = directorsArray.map(d => d.name).join(', ');
    const topCastArray = movie.credits.cast.slice(0, 5);
    const castNames = topCastArray.map(actor => actor.name).join(', ');

    const movieDetailDiv = document.createElement('div');
    movieDetailDiv.innerHTML=`
      <div class='mdHeader'>
        <img src="https://image.tmdb.org/t/p/w154${movie.poster_path}" alt="${movie.title}">
        <button class='mdCloseBtn'>close</button>
      </div> 
      <div class='mdBody'>
        
        <h4>${movie.title}</h4>
        
        <div class='mdMetadata'> 
          <span> ${movie.vote_average?.toFixed(1)} </span> 
          <span>${movie.release_date?.split('-')[0]}</span>
          <span> ${movie.runtime}</span>
        </div>
        
        <div class='mdGernes'></div>
        
        <div class='mdCredits'>
          <p><span class='mdcTxtTitle'>Director </span><span class='mdcTxtDetails'>${directorNames}</span></p>
          <p><span class='mdcTxtTitle'>Cast </span><span class='mdcTxtDetails'></span>${castNames}</p>
          <p><span class='mdcTxtTitle'>Release Date </span><span class='mdcTxtDetails'>${movie.release_date}</span></p>    
        </div>
        
        <div>
          <p>Overview</p>
          <p> ${movie.overview}</p>
        </div>
      </div>

      <div class='mdFooter'>
        <button class='mdAddWLBtn'>Add to watchlist</button>
      </div>
    `;    
    movieDetailDiv.classList.add('movieDetailsDiv');

    sectionDiv.appendChild(movieDetailDiv);
    movieDetailDiv.querySelector('.mdCloseBtn').addEventListener('click', () => movieDetailDiv.remove());
    // Because .mdFernes is created now i can use the loop.
    
    const genresContainer = movieDetailDiv.querySelector('.mdGernes');

    if (movie.genres && movie.genres.length > 0) {
      movie.genres.forEach(genre => {
        const tag = document.createElement('span');
        tag.classList.add('mdGerneTag'); 
        tag.textContent = genre.name;
        genresContainer.appendChild(tag);
      });
    }
  }catch(error){
    console.error("Error from the other side...", error);
  }
  

}




