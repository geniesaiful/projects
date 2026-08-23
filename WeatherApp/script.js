const apiKey = '4c4bfb50e8aa436c81193431262208';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
//getWeatherData("Dhaka");
//
const allSavedObjects = JSON.parse(localStorage.getItem('weatherAppApiData')) || [];
updateUI(allSavedObjects[allSavedObjects.length-1]);

//

searchBtn.addEventListener('click', () => {
    getWeatherData(cityInput.value.trim());
});

// Enable search when pressing the Enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherData(cityInput.value.trim());
    }
});

async function getWeatherData(city) {
    if (!city) {
        alert('Please enter a city name.');
        return;
    }
    const cityName = city;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(cityName)}`;
    try{
        const response = await fetch(url);
        if(!response.ok) throw new Error('city name not found');
        
        const data = await response.json();
        updateUI(data);
        saveData(data);
        updateRecent();
    }catch(error){
        document.getElementById('resultT').innerHTML = error.message;
    }

}

function updateUI(data){
    document.getElementById('mdDateTime').innerHTML=`${data.current.last_updated}`;
    document.getElementById('mdLocation').innerHTML=`${data.location.name}, ${data.location.country}`;
    document.getElementById('resultT').innerHTML=`${data.current.temp_c}`;
    document.getElementById('mdCondition').innerHTML=`${data.current.condition.text}`;
    document.getElementById('mdFeelsLike').innerHTML=`Feels Like: ${data.current.feelslike_c}&deg;C`;
    
    document.getElementById('mdHumidity').innerHTML=`${data.current.humidity}%`;
    document.getElementById('mdWind').innerHTML=`${data.current.wind_kph} km/h`;
    document.getElementById('mdPressure').innerHTML=`${data.current.pressure_mb} hPa`;
    document.getElementById('mdVisibility').innerHTML=`${data.current.vis_km} km`;

//    console.log(data);

    document.getElementById('mdUVIndex').innerHTML=`${data.current.uv}`;
    document.getElementById('mdCloudCover').innerHTML=`${data.current.cloud}%`;
    document.getElementById('mdWindDirection').innerHTML=`${data.current.wind_dir} ${data.current.wind_degree}&deg;`;
    document.getElementById('mdDewPoint').innerHTML=`${data.current.dewpoint_c}&deg;C`;
    document.getElementById('mdWindTemperature').innerHTML=`${data.current.windchill_c}&deg;C`;
    document.getElementById('mdHeatIndex').innerHTML=`${data.current.heatindex_c}&deg;C`;
    updateRecent();
}

function saveData(newData){
    const savedData = localStorage.getItem('weatherAppApiData');
    const dataList = savedData ? JSON.parse(savedData) : [];
    dataList.push(newData);
    localStorage.setItem('weatherAppApiData', JSON.stringify(dataList));
    const allSavedObjects = JSON.parse(localStorage.getItem('weatherAppApiData')) || [];
   // console.log("Here is last data      "+allSavedObjects[allSavedObjects.length-2].location.name); 
}

function updateRecent(){
    const totalSavedData = JSON.parse(localStorage.getItem('weatherAppApiData')) || [];
    const recentSavedData = totalSavedData.slice(-7);

    const cardHolder = document.getElementById('infoCardHolder');
    cardHolder.innerHTML = "";

    //let totalInfoCard = "";
    recentSavedData.forEach(item => {
               
        const div = document.createElement('div');
        div.className = "infoCards";
        div.role = "button";
        div.tabIndex = 0;

        div.innerHTML = `
            <img src="https:${item.current.condition.icon}">
            <div class="infoCardText smallText">
                <p>${item.location.name}</p><p>${item.current.temp_c}&deg;C</p>
            </div>
        `;
        div.addEventListener('click', () => {
            updateUI(item);
        });
        cardHolder.appendChild(div);
        // totalInfoCard += `
        // <div class="infoCards" onclick="updateUI(item)">
        //     <img src="https:${item.current.condition.icon}">
        //     <div style="display: flex; flex-direction: column;">
        //         <p>${item.location.name}</p><p>32&deg;C</p>
        //     </div>
        // </div>
        //`
    });
    updateRecentAll();
    //document.getElementById('infoCardHolder').innerHTML = totalInfoCard;
}

function updateRecentAll(){
    const totalSavedData = JSON.parse(localStorage.getItem('weatherAppApiData')) || [];

    const cardHolder = document.getElementById('bigInfoCardHolder');
    cardHolder.innerHTML = "";
    totalSavedData.forEach(item => {
        
        const div = document.createElement('div');
        div.className = "infoCards";
        div.role = "button";
        div.tabIndex = 0;

        div.innerHTML = `
            <img src="https:${item.current.condition.icon}">
            <div class="infoCardText smallText">
                <p>${item.location.name}</p><p>${item.current.temp_c}&deg;C</p>
            </div>
        `;
        div.addEventListener('click', () => {
            updateUI(item);
            showRigtContainer('homeDiv');
        });
        cardHolder.appendChild(div);
    }
    );
}

function showRigtContainer(sectionName){
    const allSections = document.querySelectorAll('.container');
    for (let i = 0; i < allSections.length; i++) {
        allSections[i].classList.remove('active');  
    }
    const selectedSection = document.getElementById(sectionName);
    selectedSection.classList.add('active');
        
}