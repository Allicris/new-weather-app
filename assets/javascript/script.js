const apiKey = "a8728083f6cd70d2fc97143b788ab4cd";

const searchBox = document.querySelector(".search-input");
const searchCity = document.querySelector(".search-input input");
const searchBtn = document.querySelector("button");
const weatherIcon = document.querySelector(".weather-icon");
const searchContainer = document.querySelector(".saved-searches");
const cityInput = document.getElementById("cityinput");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const slider = document.querySelector(".slider");

function saved() {
  var savedCity = cityInput.value.trim();
  var storedCity = JSON.parse(localStorage.getItem("storedCity")) || [];
  var city = {
    savedCity: savedCity,
  };
  storedCity.push(city);

  localStorage.setItem("storedCity", JSON.stringify(storedCity));
}

var clearHistory = document.querySelector(".clear");
clearHistory.addEventListener("click", function () {
  const historyContainer = document.getElementById("history");
  historyContainer.innerHTML = "";
  localStorage.clear();
});

function getCurrentDate() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date());
}

// Add this code to your 'currentWeather' function where you update other elements
document.querySelector(".todays-date").innerHTML = getCurrentDate();

function getFutureDate(daysToAdd) {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + daysToAdd + 1); // +1 because you want the future date
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(futureDate);
}

async function getFiveDay() {
  // const searchCity = document.querySelector(".search input");
  const fiveDayUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchCity.value +
    "&appid=" +
    apiKey +
    "&units=imperial";
  const response = await fetch(fiveDayUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  if (!data || !data.list || data.list.length === 0) {
    console.log("Invalid or empty data received from the API");
    return;
  }

  const fiveDays = document.querySelectorAll(".future-day");

  for (i = 0; i < Math.min(5, data.list.length); i++) {
    const tempElements = document.querySelectorAll(".tempy");
    const windyElements = document.querySelectorAll(".windy");
    const humidElements = document.querySelectorAll(".humid");
    const fiveDayElement = fiveDays[i].querySelector(".future-date");

    fiveDayElement.textContent = getFutureDate(i);
    console.log(fiveDayElement);
    tempElements[i].innerHTML =
      Math.round(data.list[i].main.temp) + " " + "&deg;";
    windyElements[i].innerHTML =
      " " + Math.round(data.list[i].wind.speed) + " " + "mph/hr";
    humidElements[i].innerHTML =
      "Humidity" + " " + Math.round(data.list[i].main.humidity);
  }
}

async function currentWeather(city) {
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";

  const response = await fetch(apiUrl);
  var data = await response.json();

  if (response.status == 404) {
    document.querySelector(".search-input p").style.display = "block";
    document.querySelector(".current-weather").style.display = "none";
    document.querySelector(".right-card").style.display = "none";
  }

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML =
    Math.round(data.main.temp) + " " + "&deg;";
  document.querySelector(".wind").innerHTML =
    Math.round(data.wind.speed) + " " + "mph/hr";
  document.querySelector(".humidity").innerHTML =
    "Humidity" + " " + Math.round(data.main.humidity);

  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "assets/images/cloudy.png";
  } else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "assets/images/sunny.png";
  } else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "assets/images/rainy.png";
  } else if (data.weather[0].main == "Snow") {
    weatherIcon.src = "assets/images/snow.png";
  }

  getFiveDay();
}

searchBtn.addEventListener("click", () => {
  currentWeather(searchCity.value);
  document.querySelector(".search-input p").style.display = "none";
  document.querySelector(".current-weather").style.display = "block";
  document.querySelector(".right-card").style.display = "block";
});

const savedSearches = [];

const createHistoryElement = (cityInput) => {
  const capitalizedCity = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
  const link = document.createElement('div');
  link.textContent = capitalizedCity;

  link.addEventListener('click', () => {
    getCurrentDate();
    currentWeather(capitalizedCity);
  });
  const historyContainer = document.getElementById("history");
  historyContainer.appendChild(link);
};

searchBtn.addEventListener("click", () => {
  createHistoryElement(cityInput.value);
});

let slideIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".future-day");
  slides.forEach((slide) => (slide.style.display = "none"));
  slides[index].style.display = "block";
}

function nextSlide() {
  if (slideIndex < slider.children.length - 1) {
    slideIndex++;
  } else {
    slideIndex = 0;
  }
  showSlide(slideIndex);
}

function prevSlide() {
  if (slideIndex > 0) {
    slideIndex--;
  } else {
    slideIndex = slider.children.length - 1;
  }
  showSlide(slideIndex);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

showSlide(slideIndex);
