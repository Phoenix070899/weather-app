const wrapper = document.querySelector('.wrapper')
const inputPart = wrapper.querySelector('.input-part')
const weatherPart = wrapper.querySelector('.weather-part')
const header = wrapper.querySelector('header')

const backArrow = header.querySelector('i')

const inputInfo = inputPart.querySelector('.info-txt')
const inputField = inputPart.querySelector('input[type="text"]')
const locationBtn = inputPart.querySelector('.content button')

const temp = weatherPart.querySelector('.temp .numb')
const weather = weatherPart.querySelector('.weather')
const locationPart = weatherPart.querySelector('.location > span')
const tempFeel = weatherPart.querySelector('.numb-2')
const humid = weatherPart.querySelector('.humid')
const weatherIcon = weatherPart.querySelector('.weather-icon') 

let api

inputField.addEventListener('keyup', (e) => {
    if (e.key == 'Enter' && inputField.value != '') {
        {
            fetchCity(inputField.value)
        }
    }
})

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
})

function onSuccess(position) {
    const { latitude, longitude } = position.coords
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=d4bd8f78f03068332156c3038c3ee92f`
    fetchData()
}
function onError() {

}
function fetchCity(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d4bd8f78f03068332156c3038c3ee92f`
    fetchData()
}

function fetchData() {
    const invalidName = 'Please enter valid city name'
    const validName = 'Getting weather detail...'
    inputInfo.classList.add('pending')
    inputInfo.innerHTML = validName;
    fetch(api)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            inputInfo.classList.add('error')
            inputInfo.innerHTML = invalidName;
        })
        .then((data) => {
            console.log(data)
            showWeather(data)
        })
        .catch((error) => {
            inputInfo.innerText = `${inputField.value} isn't a valid city name or we don't have infomation about ${inputField.value}`;
            inputInfo.classList.replace("pending", "error");
        });
}

function showWeather(data) {
    if (data.cod == "404") {
        inputPart.classList.replace("pending", "error");
        inputInfo.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        wrapper.classList.add('active')
        temp.innerHTML = Math.floor(data.main.temp)
        weather.innerHTML = data.weather[0].description
        locationPart.innerHTML = `${data.name}, ${data.sys.country}`
        tempFeel.innerHTML = Math.floor(data.main.feels_like)
        humid.innerHTML = data.main.humidity
        inputInfo.classList.remove('pending', 'error')
        inputInfo.innerHTML = ''
        inputField.value = ''

        if(data.weather[0].id == 800){
            weatherIcon.src = "icons/clear.svg";
        }else if(data.weather[0].id >= 200 && data.weather[0].id <= 232){
            weatherIcon.src = "icons/storm.svg";  
        }else if(data.weather[0].id >= 600 && data.weather[0].id <= 622){
            weatherIcon.src = "icons/snow.svg";
        }else if(data.weather[0].id >= 701 && data.weather[0].id <= 781){
            weatherIcon.src = "icons/haze.svg";
        }else if(data.weather[0].id >= 801 && data.weather[0].id <= 804){
            weatherIcon.src = "icons/cloud.svg";
        }else if((data.weather[0].id >= 500 && data.weather[0].id <= 531) || (data.weather[0].id >= 300 && data.weather[0].id <= 321)){
            weatherIcon.src = "icons/rain.svg";
        }
    }

}

backArrow.addEventListener('click', () => {
    wrapper.classList.remove('active')
})