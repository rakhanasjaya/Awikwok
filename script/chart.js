import { hourlyForecastAPI } from "../script/script.js";

export function dayForecast(latitude, longitude, city) {
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
        `https://api.openweathermap.org/data/2.5/forecast/daily?${param}`
    );
    try {
        const response = fetch(request);
        return response.then((response) => response.json());
    } catch (error) {
        console.log(`Error Occured = ${error}`);
    }
}
export async function getSevenDaysDetails(latitude, longitude) {
    const response = await dayForecast(latitude, longitude);
    const value = [[], [], [], []];
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    for (let i = 0; i < 7; i++) {
        value[0].push(response.list[i].temp.day);
        value[1].push(response.list[i].temp.night);
        value[2].push(
            weekday[
                new Date(Number(response.list[i].dt + "000")).getDay()
            ].substring(0, 3)
        );
    }

    return value;
}

export async function getHourlyDetails(latitude, longitude) {
    const response = await hourlyForecastAPI(latitude, longitude);
    console.log(response.list.length);
    const value = [[], []];

    for (let i = 0; i < 96; i++) {
        let temporaryArray = [];
        temporaryArray.push(
            response.list[i].dt * 1000 +
                new Date().getTimezoneOffset() * 60000 +
                response.city.timezone * 1000
        );
        temporaryArray.push(response.list[i].main.temp);

        value[0].push(temporaryArray);
    }
    for (let i = 0; i < 96; i++) {
        let temporaryArray = [];
        temporaryArray.push(
            response.list[i].dt * 1000 +
                new Date().getTimezoneOffset() * 60000 +
                response.city.timezone * 1000
        );
        temporaryArray.push(response.list[i].main.feels_like);

        value[1].push(temporaryArray);
    }

    return value;
}

export function printChart(latitude, longitude) {
    //Print day temp
    getSevenDaysDetails(latitude, longitude).then((response) => {
        const data = [];
        data.push(response);

        //Print current days temperature day and night
        document.getElementById("day").textContent = data[0][0][0];
        document.getElementById("night").textContent = data[0][1][0];

        chart.updateSeries([
            {
                name: "Day",
                data: data[0][0],
            },
            {
                name: "Night",
                data: data[0][1],
            },
        ]);

        chart.updateOptions({
            xaxis: {
                categories: data[0][2],
            },
        });
    });
}

export function printChartHourly(latitude, longitude) {
    //Print day temp
    getHourlyDetails(latitude, longitude).then((response) => {
        const data = [];
        data.push(response);
        console.log(data);

        //Print current days temperature day and night
        document.getElementById("day").textContent = data[0][0][0][1];
        document.getElementById("night").textContent = data[0][1][0][1];

        chartHourly.updateSeries([
            {
                name: "Feels Like",
                data: data[0][1],
            },
            {
                name: "Temp",
                data: data[0][0],
            },
        ]);
    });
}

// Making Chart
let options = {
    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: 14,
            fontFamily: "Poppins",
        },
        onDatasetHover: {
            highlightDataSeries: true,
        },
    },
    animations: {
        enabled: true,
        easing: "linear",
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 350,
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350,
        },
    },
    noData: {
        text: "Loading...",
    },
    chart: {
        toolbar: {
            show: false,
        },
        type: "area",
        height: 180,
        foreColor: "#000",
        dropShadow: {
            enabled: false,
            enabledSeries: [0],
            top: -2,
            left: 2,
            blur: 0,
            opacity: 0.06,
        },
    },
    colors: ["rgba(203, 151, 0, 1)", "#1D5D9B"],
    stroke: {
        curve: "smooth",
        width: 3.5,
    },
    dataLabels: {
        enabled: false,
    },
    series: [],
    markers: {
        size: 0,
        strokeColor: "#FFF",
        strokeWidth: 2,
        strokeOpacity: 1,
        fillOpacity: 1,
        colors: ["rgba(203, 151, 0, 1)", "#1D5D9B"],
        hover: {
            size: 6,
        },
    },

    xaxis: {
        type: "category",
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
        lines: {
            show: true,
        },
        labels: {
            show: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            style: {
                colors: [],
                fontSize: "15px",
                fontFamily: "Poppins",
                fontWeight: 500,
                cssClass: "apexcharts-xaxis-label",
            },
        },
        axisBorder: {
            show: true,
            color: "#78909C",
            height: 1,
            width: "100%",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: "solid",
            color: "#78909C",
            height: 2,
            offsetX: 0,
            offsetY: 0,
        },
        crosshairs: {
            show: true,
            width: 1,
            position: "back",
            opacity: 1,
            stroke: {
                color: "#000",
                width: 2,
                dashArray: 5,
            },
            fill: {
                type: "solid",
                color: "#000",
            },
        },
        tooltip: {
            enabled: true,
            offsetY: 0,
            style: {
                fontSize: "13px",
                fontFamily: "Poppins",
                fontWeight: "300",
            },
        },
    },
    yaxis: {
        tickAmount: 3,
        labels: {
            show: true,
            align: "right",
            style: {
                colors: [],
                fontSize: "14px",
                fontFamily: "Poppins",
                fontWeight: 400,
                cssClass: "apexcharts-yaxis-label",
            },
            offsetX: 0,
            offsetY: 4,
            rotate: 0,
        },
    },
    grid: {
        borderColor: "rgba(0, 0, 0, 0.13)",

        padding: {
            left: 23,
            right: 23,
        },
    },

    fill: {
        type: "solid",
        opacity: 0.3,
        colors: ["rgba(252, 211, 92, 0.5)", "rgba(117, 194, 246, 0.6)"],
    },
};

// Making Chart
let optionsHourly = {
    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: 14,
            fontFamily: "Poppins",
        },
        onDatasetHover: {
            highlightDataSeries: true,
        },
    },
    animations: {
        enabled: true,
        easing: "linear",
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 350,
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350,
        },
    },
    noData: {
        text: "Loading...",
    },
    chart: {
        toolbar: {
            show: false,
        },
        type: "area",
        height: 180,
        foreColor: "#000",
        dropShadow: {
            enabled: false,
            enabledSeries: [0],
            top: -2,
            left: 2,
            blur: 0,
            opacity: 0.06,
        },
    },
    colors: ["rgba(203, 151, 0, 1)", "#1D5D9B"],
    stroke: {
        curve: "smooth",
        width: 3.5,
    },
    dataLabels: {
        enabled: false,
    },
    series: [],
    markers: {
        size: 0,
        strokeColor: "#FFF",
        strokeWidth: 2,
        strokeOpacity: 1,
        fillOpacity: 1,
        colors: ["rgba(203, 151, 0, 1)", "#1D5D9B"],
        hover: {
            size: 6,
        },
    },

    xaxis: {
        type: "datetime",
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
        lines: {
            show: true,
        },
        labels: {
            show: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            style: {
                colors: [],
                fontSize: "15px",
                fontFamily: "Poppins",
                fontWeight: 500,
                cssClass: "apexcharts-xaxis-label",
            },

            format: "MMM dd",
        },
        axisBorder: {
            show: true,
            color: "#78909C",
            height: 1,
            width: "100%",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: "solid",
            color: "#78909C",
            height: 2,
            offsetX: 0,
            offsetY: 0,
        },
        crosshairs: {
            show: true,
            width: 1,
            position: "back",
            opacity: 1,
            stroke: {
                color: "#000",
                width: 2,
                dashArray: 5,
            },
            fill: {
                type: "solid",
                color: "#000",
            },
        },
        tooltip: {
            enabled: true,
            offsetY: 0,
            formatter: function (val, opts) {
                return new Date(val).toLocaleString();
            },
            style: {
                fontSize: "13px",
                fontFamily: "Poppins",
                fontWeight: "300",
            },
        },
    },
    yaxis: {
        tickAmount: 3,
        labels: {
            show: true,
            align: "right",
            style: {
                colors: [],
                fontSize: "14px",
                fontFamily: "Poppins",
                fontWeight: 400,
                cssClass: "apexcharts-yaxis-label",
            },
            offsetX: 0,
            offsetY: 4,
            rotate: 0,
        },
    },
    grid: {
        borderColor: "rgba(0, 0, 0, 0.13)",

        padding: {
            left: 23,
            right: 23,
        },
    },

    fill: {
        type: "solid",
        opacity: 0.3,
        colors: ["rgba(252, 211, 92, 0.5)", "rgba(117, 194, 246, 0.6)"],
    },
};

var chart = new ApexCharts(
    document.querySelector("#daily-timeline-chart"),
    options
);
var chartHourly = new ApexCharts(
    document.querySelector("#hourly-timeline-chart"),
    optionsHourly
);
chart.render();
chartHourly.render();
