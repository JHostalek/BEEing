// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + "").replace(",", "").replace(" ", "");
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
        dec = typeof dec_point === "undefined" ? "." : dec_point,
        s = "",
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return "" + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
}

var numOfDays = 7;
chartBatt();
chartTemp();
chartAudio();
chartAccX();
chartAccY();
chartAccZ();
chartGyX();
chartGyY();
chartGyZ();
setInterval(checkTimeMode, 500);

async function checkTimeMode() {
    let old = numOfDays;
    if ($("#day").is(":checked")) {
        numOfDays = 1;
    } else if ($("#week").is(":checked")) {
        numOfDays = 7;
    } else if ($("#month").is(":checked")) {
        numOfDays = 30;
    } else if ($("#days").is(":checked")) {
        if (!document.getElementById("daysInput").value.isNaN) {
            numOfDays = document.getElementById("daysInput").value;
        } else {
            document.getElementById("daysInput").value = 10;
        }
    }
    if (old != numOfDays) {
        chartBatt();
        chartTemp();
        chartAudio();
        chartAccX();
        chartAccY();
        chartAccZ();
        chartGyX();
        chartGyY();
        chartGyZ();
    }
}

async function getApiBatt(days) {
    xAxeBatt = [];
    yAxeBatt = [];
    xAxeBattFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/1112090/fields/1.json?api_key=JVM954R6BIE3P1PE&results=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    let data = await fetch(api_url);
    let table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field1))) {
            xAxeBattFull.push(table.feeds[i].created_at);
            xAxeBatt.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            ); //xAxeBatt.push(String(table.feeds[i].created_at).substr(11, 5) +
            yAxeBatt.push(parseFloat(table.feeds[i].field1));
        }
    }
}

async function getApiTemp(days) {
    xAxeTemp = [];
    yAxeTemp = [];
    xAxeTempFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/1.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field1))) {
            xAxeTempFull.push(table.feeds[i].created_at);
            xAxeTemp.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeTemp.push(parseFloat(table.feeds[i].field1));
        }
    }
}

async function getApiAudio(days) {
    xAxeAudio = [];
    yAxeAudio = [];
    xAxeAudioFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/2.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field2))) {
            xAxeAudioFull.push(table.feeds[i].created_at);
            xAxeAudio.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeAudio.push(parseFloat(table.feeds[i].field2));
        }
    }
}

async function getApiAccX(days) {
    xAxeAccX = [];
    yAxeAccX = [];
    xAxeAccXFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/3.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field3))) {
            xAxeAccXFull.push(table.feeds[i].created_at);
            xAxeAccX.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeAccX.push(parseFloat(table.feeds[i].field3));
        }
    }
}

async function getApiAccY(days) {
    xAxeAccY = [];
    yAxeAccY = [];
    xAxeAccYFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/4.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field4))) {
            xAxeAccYFull.push(table.feeds[i].created_at);
            xAxeAccY.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeAccY.push(parseFloat(table.feeds[i].field4));
        }
    }
}

async function getApiAccZ(days) {
    xAxeAccZ = [];
    yAxeAccZ = [];
    xAxeAccZFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/5.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field5))) {
            xAxeAccZFull.push(table.feeds[i].created_at);
            xAxeAccZ.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeAccZ.push(parseFloat(table.feeds[i].field5));
        }
    }
}

async function getApiGyX(days) {
    xAxeGyX = [];
    yAxeGyX = [];
    xAxeGyXFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/6.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field6))) {
            xAxeGyXFull.push(table.feeds[i].created_at);
            xAxeGyX.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeGyX.push(parseFloat(table.feeds[i].field6));
        }
    }
}

async function getApiGyY(days) {
    xAxeGyY = [];
    yAxeGyY = [];
    xAxeGyYFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/7.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field7))) {
            xAxeGyYFull.push(table.feeds[i].created_at);
            xAxeGyY.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeGyY.push(parseFloat(table.feeds[i].field7));
        }
    }
}

async function getApiGyZ(days) {
    xAxeGyZ = [];
    yAxeGyZ = [];
    xAxeGyZFull = [];
    let api_url =
        "https://api.thingspeak.com/channels/829059/fields/8.json?api_key=WAPRJ7PQ2NN58XPO&days=" +
        String(days) +
        "&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field8))) {
            xAxeGyZFull.push(table.feeds[i].created_at);
            xAxeGyZ.push(
                String(table.feeds[i].created_at).substr(8, 2) +
                "/" +
                String(table.feeds[i].created_at).substr(5, 2)
            );
            yAxeGyZ.push(parseFloat(table.feeds[i].field8));
        }
    }
}
async function chartBatt() {
    await getApiBatt(numOfDays);
    if (window.chart1 && window.chart1 !== null) {
        window.chart1.destroy();
    }
    var ctx1 = document.getElementById("BATT").getContext('2d');
    window.chart1 = new Chart(ctx1, {
        type: "line",
        data: {
            labels: xAxeBatt,
            datasets: [{
                label: "Napětí",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeBatt,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicsLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + " V";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,

                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeBattFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeBattFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeBattFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeBattFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return (
                            datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + " V "
                        );
                    },
                },
            },
        },
    });
}



async function chartTemp() {
    await getApiTemp(numOfDays);

    if (window.chart2 && window.chart2 !== null) {
        window.chart2.destroy();
    }
    var ctx2 = document.getElementById("TEMP").getContext('2d');
    window.chart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: xAxeTemp,
            datasets: [{
                label: "TEPLOTA",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeTemp,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + " °C";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,
                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeTempFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeTempFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeTempFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeTempFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return (
                            datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + " °C"
                        );
                    },
                },
            },
        },
    });
}


async function chartAudio() {
    await getApiAudio(numOfDays);
    if (window.chart3 && window.chart3 !== null) {
        window.chart3.destroy();
    }
    var ctx3 = document.getElementById("AUDIO").getContext('2d');
    window.chart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: xAxeAudio,
            datasets: [{
                label: "AUDIO",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeAudio,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "date",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value;
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,
                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeAudioFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeAudioFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeAudioFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeAudioFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel);
                    },
                },
            },
        },
    });
}

async function chartAccX() {
    await getApiAccX(numOfDays);
    if (window.chart4 && window.chart4 !== null) {
        window.chart4.destroy();
    }
    var ctx4 = document.getElementById("ACCX").getContext('2d');
    window.chart4 = new Chart(ctx4, {
        type: "line",
        data: {
            labels: xAxeAccX,
            datasets: [{
                label: "GYRO",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeAccX,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "date",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,

                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeAccXFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeAccXFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeAccXFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeAccXFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                    },
                },
            },
        },
    });
}

async function chartAccY() {
    await getApiAccY(numOfDays);
    if (window.chart5 && window.chart5 !== null) {
        window.chart5.destroy();
    }
    var ctx5 = document.getElementById("ACCY").getContext('2d');
    window.chart5 = new Chart(ctx5, {
        type: "line",
        data: {
            labels: xAxeAccY,
            datasets: [{
                label: "GYRO",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeAccY,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "date",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,

                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeAccYFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeAccYFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeAccYFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeAccYFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                    },
                },
            },
        },
    });
}

async function chartAccZ() {
    await getApiAccZ(numOfDays);
    if (window.chart6 && window.chart6 !== null) {
        window.chart6.destroy();
    }
    var ctx6 = document.getElementById("ACCZ").getContext('2d');
    window.chart6 = new Chart(ctx6, {
        type: "line",
        data: {
            labels: xAxeAccZ,
            datasets: [{
                label: "GYRO",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeAccZ,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "date",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,

                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeAccZFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeAccZFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeAccZFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeAccZFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                    },
                },
            },
        },
    });
}

async function chartGyX() {
    await getApiGyX(numOfDays);
    if (window.chart7 && window.chart7 !== null) {
        window.chart7.destroy();
    }
    var ctx7 = document.getElementById("GYX").getContext('2d');
    window.chart7 = new Chart(ctx7, {
        type: "line",
        data: {
            labels: xAxeGyX,
            datasets: [{
                label: "GYRO",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeGyX,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "date",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,

                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeGyXFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeGyXFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeGyXFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeGyXFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                    },
                },
            },
        },
    });
}

async function chartGyY() {
    await getApiGyY(numOfDays);
    if (window.chart8 && window.chart8 !== null) {
        window.chart8.destroy();
    }
    var ctx8 = document.getElementById("GYY").getContext('2d');
    window.chart8 = new Chart(ctx8, {
        type: "line",
        data: {
            labels: xAxeGyY,
            datasets: [{
                label: "GYRO",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeGyY,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "date",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,

                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeGyYFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeGyYFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeGyYFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeGyYFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                    },
                },
            },
        },
    });
}

async function chartGyZ() {
    await getApiGyZ(numOfDays);
    if (window.chart9 && window.chart9 !== null) {
        window.chart9.destroy();
    }
    var ctx9 = document.getElementById("GYZ").getContext('2d');
    window.chart9 = new Chart(ctx9, {
        type: "line",
        data: {
            labels: xAxeGyZ,
            datasets: [{
                label: "GYRO",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: yAxeGyZ,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0,
                },
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "date",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#6e707e",
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 18,
                bodyFontSize: 14,
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: "index",
                caretPadding: 10,

                callbacks: {
                    title: function(tooltipItems, data) {
                        var tooltipItem = tooltipItems[0];
                        return (
                            xAxeGyZFull[tooltipItem.index].substr(11, 5) +
                            " " +
                            xAxeGyZFull[tooltipItem.index].substr(8, 2) +
                            "/" +
                            xAxeGyZFull[tooltipItem.index].substr(5, 2) +
                            "/" +
                            xAxeGyZFull[tooltipItem.index].substr(0, 4)
                        );
                    },
                    label: function(tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                    },
                },
            },
        },
    });
}