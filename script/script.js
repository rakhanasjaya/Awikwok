//Global Var
let time;
// Function, Async, and API call
import { printChart, printChartHourly } from "./chart.js";
function locAPI(latitude, longitude) {
    const param = new URLSearchParams();
    param.append("lat", latitude);
    param.append("lon", longitude);
    param.append("limit", 5);
    param.append("appid", "5e12c37e2ff0623c3469032dd5ba1d6b");
    param.append("lang", "id");

    const request = new Request(
        `https://api.openweathermap.org/geo/1.0/reverse?${[param]}`
    );

    try {
        const response = fetch(request);
        return response.then((response) => response.json());
    } catch (error) {
        return error;
    }
}

function forecastAPI(latitude, longitude, city) {
    const param = new URLSearchParams();

    //Untuk mengambil parameter yang tepat untuk digunakan dalam URL
    if (latitude === null || longitude === null) {
        param.append("q", city);
    } else {
        param.append("lat", latitude);
        param.append("lon", longitude);
    }

    //Parameter wajib dalam URL
    param.append("appid", "5e12c37e2ff0623c3469032dd5ba1d6b");
    param.append("units", "metric");
    param.append("lang", "id");

    //Membuat request ke server
    const request = new Request(
        `https://api.openweathermap.org/data/2.5/weather?${param}`
    );
    try {
        const response = fetch(request);
        return response.then((response) => response.json());
    } catch (error) {
        return error;
    }
}

function uvAPI(latitude, longitude) {
    const param = new URLSearchParams();
    param.append("lat", latitude);
    param.append("lng", longitude);

    var myHeaders = new Headers();
    myHeaders.append("x-access-token", "openuv-24jv0rlkm8fmi8-io");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = fetch(
            `https://api.openuv.io/api/v1/uv?${param}`,
            requestOptions
        );
        return response.then((response) => response.json());
    } catch (error) {
        return error;
    }
}

export function hourlyForecastAPI(latitude, longitude, city) {
    const param = new URLSearchParams();

    //Untuk mengambil parameter yang tepat untuk digunakan dalam URL
    if (latitude === null || longitude === null) {
        param.append("q", city);
    } else {
        param.append("lat", latitude);
        param.append("lon", longitude);
    }

    //Parameter wajib dalam URL
    param.append("appid", "5e12c37e2ff0623c3469032dd5ba1d6b");
    param.append("units", "metric");
    param.append("lang", "id");
    param.append("cnt", 96);

    //Membuat request ke server
    const request = new Request(
        `https://pro.openweathermap.org/data/2.5/forecast/hourly?${param}`
    );
    try {
        const response = fetch(request);
        return response.then((response) => response.json());
    } catch (error) {
        return error;
    }
}
function historicalAPI(latitude, longitude) {
    const param = new URLSearchParams();

    //Untuk mengambil parameter yang tepat untuk digunakan dalam URL
    param.append("lat", latitude);
    param.append("lon", longitude);

    //Parameter wajib dalam URL
    param.append("cnt", 1);
    param.append("appid", "5e12c37e2ff0623c3469032dd5ba1d6b");

    //Membuat request ke server
    const request = new Request(
        `https://history.openweathermap.org/data/2.5/history/city?${param}`
    );
    try {
        const response = fetch(request);
        return response.then((response) => response.json());
    } catch (error) {
        return error;
    }
}

function makeTime(timezone) {
    document.getElementById("date-time").innerHTML = "";
    const time = new Date(
        new Date().getTime() + new Date().getTimezoneOffset() * 60000 + timezone
    ); //Date to make it from second to milis
    document.getElementById("date-time").textContent = `${time.toLocaleString(
        "default",
        { month: "long" }
    )} ${time.getDate()}, ${time.toLocaleTimeString()} UTC ${
        timezone > 0 ? "+" : ""
    }${timezone / 3600000}`;
}

async function getTemp(latitude, longitude, city) {
    try {
        const response = await forecastAPI(latitude, longitude, city);
        return response;
    } catch (error) {
        return error;
    }
}
async function getLoc(latitude, longitude) {
    try {
        const response = await locAPI(latitude, longitude);
        return response;
    } catch (error) {
        return error;
    }
}
async function getUV(latitude, longitude) {
    try {
        const response = await uvAPI(latitude, longitude);
        return response;
    } catch (error) {
        return error;
    }
}
async function getHourlyForecast(latitude, longitude) {
    try {
        const response = await hourlyForecastAPI(latitude, longitude, city);
        return response;
    } catch (error) {
        return error;
    }
}
async function getHistoryForecast(latitude, longitude) {
    try {
        const response = await historicalAPI(latitude, longitude);
        return response;
    } catch (error) {
        return error;
    }
}

function printData(response) {
    //Print Time
    clearInterval(time ?? 0); //Delete interval pada time, jika null clear 0 (artinya tidak melakukan apapun)
    time = setInterval(() => {
        makeTime(response.timezone * 1000), 1000;
    });

    //Print current data temperature
    document.getElementById("temp").textContent = Math.round(
        response.main.temp
    );

    //Print current data feels temperature
    document.getElementById("feels-temp").textContent = Math.round(
        response.main.feels_like
    );

    //Print current simbol forecast
    const locationTime = new Date(
        new Date().getTime() + response.timezone * 1000
    ).toISOString(); //Algorithm to convert timezone in second to UTC

    if (
        locationTime.substring(11, 13) > 18 ||
        locationTime.substring(11, 13) < 4
    ) {
        if (response.weather[0].id > 800) {
            document
                .getElementById("forecast-icon")
                .setAttribute(
                    "src",
                    `image/forecast icon/${response.weather[0].id}-night.png`
                );
        } else {
            document
                .getElementById("forecast-icon")
                .setAttribute(
                    "src",
                    `image/forecast icon/${response.weather[0].main}-night.png`
                );
        }
    } else {
        if (response.weather[0].id > 800) {
            document
                .getElementById("forecast-icon")
                .setAttribute(
                    "src",
                    `image/forecast icon/${response.weather[0].id}.png`
                );
        } else {
            document
                .getElementById("forecast-icon")
                .setAttribute(
                    "src",
                    `image/forecast icon/${response.weather[0].main}.png`
                );
        }
    }

    //Print current deskripsi forecast ex: clouds, sunny, etc
    document.getElementById("forecast-desc").textContent =
        response.weather[0].main;

    //Print current wind speed
    document.getElementById("wind").textContent = response.wind.speed + " m/s";

    //Print current pressure
    document.getElementById("pressure").textContent =
        response.main.pressure + " hPa";

    //Print current rain
    document.getElementById("rain-volume").textContent =
        (response?.rain?.["1h"] ?? response?.rain?.["3h"] ?? 0) + " mm";

    //Print Cloud Intensity
    document.getElementById("humidity").textContent =
        response.main.humidity + " %";

    //Print Cloud Intensity
    document.getElementById("cloud-intensity").textContent =
        response.clouds.all + " %";

    //Print UV
    try {
        getUV(response.coord.lat, response.coord.lon).then((responseUV) => {
            try {
                document.getElementById("uv-index").textContent = Math.round(
                    responseUV.result.uv
                );
            } catch (error) {
                document.getElementById("uv-index").textContent = "NO DATA";
                console.log(`Error Occured : ${error}`);
            }
        });
    } catch (error) {
        console.log(error);
    }

    //Print hourly
    try {
        getHourlyForecast(response.coord.lat, response.coord.lon).then(
            (responseHourly) => {
                console.log();
                for (let i = 0; i < 12; i++) {
                    const target = document.getElementById(`forecast${i + 1}`);
                    const date = new Date(
                        responseHourly.list[i].dt * 1000 +
                            new Date().getTimezoneOffset() * 60000 +
                            responseHourly.city.timezone * 1000
                    );

                    target.querySelector(
                        "h3"
                    ).textContent = `${date.toLocaleString("en-US", {
                        hour: "numeric",
                        hour12: true,
                    })}`;

                    //If clouds
                    if (responseHourly.list[i].weather[0].id > 800) {
                        target
                            .querySelector("img")
                            .setAttribute(
                                "src",
                                `image/forecast icon/${responseHourly.list[i].weather[0].id}.png`
                            );
                    } else {
                        target
                            .querySelector("img")
                            .setAttribute(
                                "src",
                                `image/forecast icon/${responseHourly.list[i].weather[0].main}.png`
                            );
                    }

                    target.querySelector("span").textContent = `${Math.round(
                        responseHourly.list[i].main.temp
                    )}`;
                }
            }
        );
    } catch (error) {
        console.log(error);
    }

    //Print Chart
    try {
        printChart(response.coord.lat, response.coord.lon);
    } catch (error) {
        document.getElementById("chart").textContent = "No Data";
    }
    try {
        printChartHourly(response.coord.lat, response.coord.lon);
    } catch (error) {
        document.getElementById("chart").textContent = "No Data";
    }

    //Print Gap
    try {
        getHistoryForecast(response.coord.lat, response.coord.lon).then(
            (responseHistory) => {
                for (let i = 1; i <= 5; i++) {
                    const target = document.getElementById(`interval${i}`);
                    const createImg = document.createElement("img");
                    const createP = document.createElement("p");
                    createImg.setAttribute("alt", "");

                    if (target.hasChildNodes()) {
                        target.removeChild(target.firstChild);
                        target.removeChild(target.lastChild);
                    }

                    switch (i) {
                        case 1: //Wind Speed
                            if (
                                response.wind.speed >
                                responseHistory.list[0].wind.speed
                            ) {
                                createImg.src = "image/GapUp.png";
                                createP.textContent = Math.round(
                                    response.wind.speed -
                                        responseHistory.list[0].wind.speed
                                );
                            } else {
                                createImg.src = "image/GapDown.png";
                                createP.textContent = Math.round(
                                    responseHistory.list[0].wind.speed -
                                        response.wind.speed
                                );
                            }

                            break;
                        case 2: //rain-volume
                            if (
                                response?.rain?.["1h"] === null ||
                                responseHistory?.rain?.["1h"] === undefined
                            ) {
                                createImg.src = "image/GapUp.png";
                                createP.textContent = "0";
                            } else if (
                                response.rain["1h"] >
                                responseHistory.list[0].rain["1h"]
                            ) {
                                createImg.src = "image/GapUp.png";
                                createP.textContent = (
                                    response.rain["1h"] -
                                        responseHistory.list[0].rain["1h"] ?? 0
                                ).toFixed(2);
                            } else {
                                createImg.src = "image/GapDown.png";
                                createP.textContent = (
                                    responseHistory.list[0].rain["1h"] ??
                                    0 - response.rain["1h"]
                                ).toFixed(2);
                            }

                            break;
                        case 3: //Pressure
                            if (
                                response.main.pressure >
                                responseHistory.list[0].main.pressure
                            ) {
                                createImg.src = "image/GapUp.png";
                                createP.textContent =
                                    response.main.pressure -
                                    responseHistory.list[0].main.pressure;
                            } else {
                                createImg.src = "image/GapDown.png";
                                createP.textContent =
                                    responseHistory.list[0].main.pressure -
                                    response.main.pressure;
                            }

                            break;
                        case 4: //Humidity
                            if (
                                response.main.humidity >
                                responseHistory.list[0].main.humidity
                            ) {
                                createImg.src = "image/GapUp.png";
                                createP.textContent =
                                    response.main.humidity -
                                    responseHistory.list[0].main.humidity;
                            } else {
                                createImg.src = "image/GapDown.png";
                                createP.textContent =
                                    responseHistory.list[0].main.humidity -
                                    response.main.humidity;
                            }

                            break;
                        case 5: //Clouds
                            if (
                                response.clouds.all >
                                responseHistory.list[0].clouds.all
                            ) {
                                createImg.src = "image/GapUp.png";
                                createP.textContent =
                                    response.clouds.all -
                                    responseHistory.list[0].clouds.all;
                            } else {
                                createImg.src = "image/GapDown.png";
                                createP.textContent =
                                    responseHistory.list[0].clouds.all -
                                    response.clouds.all;
                            }

                            break;
                        default:
                            break;
                    }
                    target.append(createImg);
                    target.append(createP);
                }
            }
        );
    } catch {
        console.log("Error");
    }

    //Print Location
    try {
        getLoc(response.coord.lat, response.coord.lon).then((response) => {
            printLoc(response);
        });
    } catch (error) {
        console.log(`Kota Tidak Ditemukan, Error code: ${error}`);
    }

    //Print Sun Condition
    try {
        const target = document.getElementById("sun-condition");
        target.innerHTML = "";

        for (let i = 1; i <= 2; i++) {
            const createDivGap = document.createElement("div");
            const createDiv = document.createElement("div");
            const createDivTarget = document.createElement("div");
            const createImg = document.createElement("img");
            const createH3 = document.createElement("h3");
            const createP = document.createElement("p");
            const createPGap = document.createElement("p");
            const timeNow = new Date(
                new Date().getTime() +
                    new Date().getTimezoneOffset() * 60000 +
                    response.timezone * 1000
            );
            const sunrise = new Date(
                response.sys.sunrise * 1000 +
                    new Date().getTimezoneOffset() * 60000 +
                    response.timezone * 1000
            );
            const sunset = new Date(
                response.sys.sunset * 1000 +
                    new Date().getTimezoneOffset() * 60000 +
                    response.timezone * 1000
            );
            createDiv.className = "circum-value";
            createDivTarget.className = "card";
            createP.textContent =
                i === 1
                    ? sunrise.toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                      })
                    : sunset.toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                      });
            createImg.src = i === 1 ? `image/Sunrise.png` : `image/Sunset.png`;
            createImg.alt = i === 1 ? "image/Sunrise.png" : "image/Sunset.png";
            createH3.textContent = i === 1 ? "Sunrise" : "Sunset";

            const timeToSunrise = timeNow.getHours() - sunrise.getHours();
            const timeToSunset = timeNow.getHours() - sunset.getHours();

            createPGap.textContent =
                i === 1
                    ? timeToSunrise > 0
                        ? timeToSunrise + "h Ago"
                        : timeToSunrise * -1 + "h Togo"
                    : timeToSunset > 0
                    ? timeToSunset + "h Ago"
                    : timeToSunset * -1 + "h Togo";

            createDivGap.className = "interval";
            createDivGap.appendChild(createPGap);
            createDiv.appendChild(createH3);
            createDiv.appendChild(createP);
            createDivTarget.appendChild(createImg);
            createDivTarget.appendChild(createDiv);
            createDivTarget.appendChild(createDivGap);
            target.appendChild(createDivTarget);
        }
    } catch (error) {
        console.log(error);
    }
}

function printLoc(response) {
    document.getElementById("location").textContent = `${
        response[0].local_names.id ?? response[0].name
    }, ${response[0].state ?? response[0].country}`;
}
function loading() {
    document.querySelector("section").style.display = "none";
    document.querySelector("body").style.overflow = "scroll";
}
function loadingOn() {
    document.querySelector("section").style.display = "block";
    document.querySelector("body").style.overflow = "hidden";
}
function getDataByGPS() {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getTemp(latitude, longitude)
            .then((response) => {
                printData(response);
            })
            .then(() => {
                setTimeout(loading, 2000);
            });
    });
}

//Javascript procedural
document.getElementById("city").addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("city-input").value;

    //Memanggil async function untuk get data
    getTemp(null, null, city)
        .then((response) => {
            loadingOn();
            try {
                printData(response);
            } catch (error) {
                alert("Kota Tidak Ditemukan");
            }
        })
        .then(() => {
            setTimeout(loading, 1000);
        });
    document.getElementById("city-input").value = "";
});

//Print Time
getDataByGPS();
