# Code helper

- [Code helper](#code-helper)
  - [Mini Card code:](#mini-card-code)
    - [HTML:](#html)
    - [Css:](#css)
    - [Js:](#js)

=======================================================================================
## Mini Card code:

### HTML:
<div class="miniGenreCardHolder" id="miniGenreCardHolder"></div>

### Css:

/* Container for mini cards */
.miniGenreCardHolder {
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    gap: .375rem; /* Scaled down gap */
    padding: .375rem;
    width: 100%;
}

/* 25% smaller card (4.875rem width x 6rem height) */
.miniGenreCard {
    border-radius: .56rem;
    padding: .375rem;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 4.875rem;
    height: 6rem;
    box-shadow: 0 3px 4px.5px #2b1a1c0d, 0 7.5px 11px -2rem #2b1a1c08;
}

/* Scaled down internal elements */
.miniGenreCard .genre-emoji {
    font-size: .9rem;
    width: 1.65rem;
    height: 1.65rem;
    line-height: 1.65rem;
    margin-bottom: .0375rem;
    border-radius: 50%;
    display: inline-block;
}

.miniGenreCard .genre-name {
    font-size: .6rem;
    font-weight: 600;
    margin: 0.15rem 0;
    border-radius: .375rem;
    padding: .15rem;
}

.miniGenreCard .movie-count {
    font-size: .6rem;
    font-weight: 200;
    margin-top: 0;
    padding: .3rem;
}

### Js:

function renderMiniGenreCards() {
  const holder = document.getElementById("miniGenreCardHolder");
  if (!holder) return;

  holder.innerHTML = "";

  const rawData = localStorage.getItem("MOVIEAPP_GENRES");
  if (!rawData) return;
  
  const genresArray = JSON.parse(rawData);
  const bgColors = [
    "#f5836d", "#69acf4", "#62f162", "#f6c112", 
    "#877498", "#55adad", "#c990bc", "#e49159"
  ];

  genresArray.forEach((genre, index) => {
    const totalCount = genre.totalMovies || 0;
    const assignedBgColor = bgColors[index % bgColors.length];

    const card = document.createElement("div");
    card.className = "miniGenreCard";
    card.style = `background-color: ${assignedBgColor}35;`;

    card.innerHTML = `
      <span class="genre-emoji" style="background-color: #ff000020;">
        ${genre.emoji || '🎬'}
      </span>
      <span class="genre-name">${genre.name}</span>
      <span class="movie-count">${totalCount}</span>
    `;
    holder.appendChild(card);
  });
}

// Call function when rendering
renderMiniGenreCards();

=========================================================================================
