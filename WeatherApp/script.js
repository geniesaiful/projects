getWeatherData('Dhaka');
async function getWeatherData(city) {
    
    const apiKey = '4c4bfb50e8aa436c81193431262208';
    const cityName = 'Dhaka';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(cityName)}`;

    try{
        const response = await fetch(url);
        if(!response.ok) throw new Error('city name not found');
        
        //console.log(response);
        const data = await response.json();
        console.log(data);
        const city=data.location.name;
        const tempC = data.current.temp_c;

        console.log(city,tempC);
        document.getElementById('resultT').innerHTML=`${tempC}`;

    }catch(error){
        document.getElementById('resultP').innerHTML = error.message;

    }

}