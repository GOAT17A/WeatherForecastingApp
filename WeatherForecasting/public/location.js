async function BackgroundImage(user_latitude, user_longitude) {
  const targetDate = new Date();
  const timestamp =
    targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
  const Timezone_API = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${user_latitude},${user_longitude}&timestamp=${timestamp}&sensor=false&key=AIzaSyDuECGhZeMf2MfVW6cYGhPZKBkh0mIbeCI`
  );

  const Timezone_Data = await Timezone_API.json();
  const date = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: `${Timezone_Data.timeZoneId}`,
    })
  );

  const hour = date.getHours();

  if (hour >= 21) {
    document.body.style.backgroundImage = "url(img/NightMoon.jpg)";
    document.body.style.color = "white";
  } else if (hour >= 18) {
    document.body.style.backgroundImage = "url(img/EveningImage.jpg)";
    document.body.style.color = "white";
  } else if (hour >= 12) {
    document.body.style.backgroundImage =
      "url(img/Afternoon.jpg)";
      
  } else if (hour >= 6) {
    document.body.style.backgroundImage = "url(img/BlueSky.jpg)";
    document.body.style.color='black';
  } else if (hour >= 4) {
    document.body.style.backgroundImage = "url(img/Sunrise.jpg)";
  } else if (hour >= 0) {
    document.body.style.backgroundImage = "url(img/NightMoon.jpg)";
    document.body.style.color = "white";
  }
}

function date_daily(dt) {
  const milliseconds = dt * 1000;
  const date = new Date(milliseconds);
  const humanDateFormat = date.toLocaleDateString("en-US", {
    weekday: "long",
  });
  return humanDateFormat;
}
function day_daily(dt){
  const milliseconds = dt * 1000;
 
  var date = new Date(milliseconds);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();
  
  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2);
  return formattedTime;
}

async function RenderHTML(user_latitude, user_longitude) {
  const location_api = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${user_latitude},${user_longitude}&key=AIzaSyDuECGhZeMf2MfVW6cYGhPZKBkh0mIbeCI`
  );

  const location_data = await location_api.json();
  const location_name =
    location_data.results[0].address_components[3].long_name;

  const Weather_API = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${user_latitude}&lon=${user_longitude}&appid=ddc9c9c68551495c367368b0843a7252&units=metric`
  );

  const Weather_Data = await Weather_API.json();
  document.getElementById('sunrise').innerText=day_daily(Weather_Data.current.sunrise);
  document.getElementById('sunset').innerText=day_daily(Weather_Data.current.sunset);
  document.getElementById('UV').innerText=Weather_Data.current.uvi;
  document.getElementById('wind_degree').innerText=`${Weather_Data.current.wind_deg}°`;
  document.getElementById("current_location").innerText = location_name;
  document.querySelector("#current_temp").innerText = `${Math.floor(
    Weather_Data.current.temp
  )}°C`;
  document.querySelector("#current_weather_status").innerText =
    Weather_Data.current.weather[0].main;
  document.querySelector("#feels_like").innerText = `Feels like: ${Math.floor(
    Weather_Data.current.feels_like
  )}°C`; //feels like
  document.querySelector(
    "#humidity"
  ).innerText = `Humidity: ${Weather_Data.current.humidity}%`;
  document.querySelector("#wind_speed").innerText = `Wind Speed: ${Weather_Data.current.wind_speed} m/s`;
  document.querySelector("#dew_point").innerText = `Dew Point: ${Math.floor(Weather_Data.current.dew_point)}°`;
  document.querySelector("#visibility").innerText = `Visibility: ${
    Weather_Data.current.visibility / 1000
  } km`;
  document.querySelector(
    "#Pressure"
  ).innerText = `Pressure: ${Weather_Data.current.pressure} hPa`;

  for (var i = 1; i < 8; i++) {
    document.querySelector(`#day_${i}`).innerText = date_daily(
      Weather_Data.daily[i].dt
    );
    document.querySelector(
      `#day_${i}_icon`
    ).src = `http://openweathermap.org/img/wn/${Weather_Data.daily[i].weather[0].icon}@2x.png`;
    document.querySelector(`#day_${i}_high`).innerText = `${Math.floor(
      Weather_Data.daily[i].temp.max
    )}°C`;
    document.querySelector(`#day_${i}_low`).innerText = `${Math.floor(
      Weather_Data.daily[i].temp.min
    )}°C`;
    document.querySelector(`#day_${i}_status`).innerText =
      Weather_Data.daily[i].weather[0].main;
  }

  BackgroundImage(user_latitude, user_longitude);
}

async function getLocation(callback) {
  let user_latitude = "";
  let user_longitude = "";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      user_latitude = position.coords.latitude;
      user_longitude = position.coords.longitude;
      callback(user_latitude, user_longitude);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

getLocation(async function (user_latitude, user_longitude) {
  RenderHTML(user_latitude, user_longitude);
});
let btn = document.getElementById("btn");
btn.addEventListener("click", async (event) => {
  event.preventDefault();
  const ourRequest = new XMLHttpRequest();
  ourRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const ourData = JSON.parse(ourRequest.responseText);
      const latitude = ourData.results[0].geometry.location.lat;
      const longitude = ourData.results[0].geometry.location.lng;
      RenderHTML(latitude, longitude);
    }
  };
  ourRequest.open( "GET",`https://maps.googleapis.com/maps/api/geocode/json?address=${
 document.getElementById("Search_bar").value
    }&key=AIzaSyDuECGhZeMf2MfVW6cYGhPZKBkh0mIbeCI`
  );
  ourRequest.send();
});
