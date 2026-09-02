const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNTMzNjkwZmE0MjU5MjQxZTIyYTZlNDU4N2ExZDEyOSIsIm5iZiI6MTc4ODI1NzIwMS45MSwic3ViIjoiNmE5NmEzYjE2YTNjZjkzODY2Yzg1YjhmIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.9eKEQSm79FSk8gyZjJ0YXXa2IRkJbHdyrzNh7O4zw94';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
  }
};

function injectGenreEmojis() {
  const rawData = localStorage.getItem("MOVIEAPP_GENRES");
  
  if (!rawData) {
    console.error("No data found in localStorage under 'MOVIEAPP_GENRES'");
    return;
  }
  const genresArray = JSON.parse(rawData);
  console.log(genresArray)

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

async function getGenresWithNumbersAPI() {
  console.log('Fetching fresh data from TMDB API...');
  try{
    
    const genreResponse = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options);
    const genreData = await genreResponse.json();
    const genres = genreData.genres;
    console.log(genres);

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
    console.log('Loaded from localStorage:');
    const data = JSON.parse(cachedData);
    //console.log(data);
    return data;
  }

  // Otherwise, fetch from API
  const apiData = await getGenresWithNumbersAPI();
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
    "#ffe6e6", "#e6f2ff", "#e6ffe6", "#fff9e6", 
    "#f3e6ff", "#e6ffff", "#ffe6f9", "#fff0e6"
  ];

  genresArray.forEach((genre, index) => {
    // Safely pull totalMovies, or fall back to 0 if the field is missing
    const totalCount = genre.totalMovies || 0;
    const assignedBgColor = bgColors[index % bgColors.length];
    //console.log(index,genre.totalMovies);

    const card = document.createElement("div");
    card.className = "genreCard";

    // Inject the structured column code (Emoji badge -> Name -> Count)
    card.innerHTML = `
      <span class="genre-emoji" style="background-color: ${assignedBgColor};">
        ${genre.emoji}
      </span>
      <p class="genre-name">${genre.name}</p>
      <p class="movie-count">${totalCount} Movies</p>
    `;
    holder.appendChild(card);
  });
}

getGenres();
//injectGenreEmojis();
renderGenreCards();