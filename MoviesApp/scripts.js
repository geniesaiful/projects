



const OMDB_API_KEY = '61423af4'; 

const BASE_URL = `https://www.omdbapi.com/?i=tt3896198&apikey=${OMDB_API_KEY}`;

/**
 * FEATURE 1: Search movies containing a keyword
 * Uses OMDb parameter `s` (Search)
 */
async function searchMovies(keyword) {
  console.log(`--- Searching for titles containing: "${keyword}" ---`);
  
  // URL simply appends the search string directly to the end
  const endpoint = `${BASE_URL}&s=${encodeURIComponent(keyword)}&type=movie`;
  
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    
    if (data.Response === "False") {
      console.log(`Error from API: ${data.Error}`);
      return;
    }

    // Display basic items returned in the search payload
    data.Search.forEach(movie => {
      console.log(`Title: ${movie.Title} (${movie.Year}) - IMDb ID: ${movie.imdbID}`);
    });

  } catch (error) {
    console.error('Search failed:', error.message);
  }
}

/**
 * FEATURE 2: Get full details using the exact title text
 * Uses OMDb parameter `t` (Title)
 */
async function getMovieDetailsByTitle(titleText) {
  console.log(`\n--- Fetching details for Title: "${titleText}" ---`);
  
  // URL simply looks up the full profile by matching text string directly
  const endpoint = `${BASE_URL}&t=${encodeURIComponent(titleText)}&plot=full`;
  
  try {
    const response = await fetch(endpoint);
    const movie = await response.json();
    
    if (movie.Response === "False") {
      console.log(`Error from API: ${movie.Error}`);
      return;
    }

    // Print all your required dataset variables directly to the console
    console.log(`Title: ${movie.Title}`);
    console.log(`Release Year: ${movie.Year}`);
    console.log(`Rating: ⭐ ${movie.imdbRating} / 10`);
    console.log(`Genre: ${movie.Genre}`);
    console.log(`Poster Image URL: ${movie.Poster}`);
    console.log(`Plot/Description:\n"${movie.Plot}"`);

  } catch (error) {
    console.error('Failed to get movie details:', error.message);
  }
}

// ==========================================
// TEST EXECUTION RUNNERS
// ==========================================

// Run search query test first
searchMovies('avengers').then(() => {
  // Directly pull exact details matching the title string text
  getMovieDetailsByTitle('Infinity War (2018)');
});