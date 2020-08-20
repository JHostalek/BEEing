"use strict";

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = "Nunito", '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
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
        toFixedFix = function toFixedFix(n, prec) {
            var k = Math.pow(10, prec);
            return "" + Math.round(n * k) / k;
        }; // Fix for IE parseFloat(0.55).toFixed(0) = 0;


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

var xAxeBatt,
    yAxeBatt,
    xAxeTemp,
    yAxeTemp,
    xAxeAudio,
    yAxeAudio = [];
var xAxeAccX,
    yAxeAccX,
    xAxeAccY,
    yAxeAccY,
    xAxeAccZ,
    yAxeAccZ = [];
var xAxeGyX,
    yAxeGyX,
    xAxeGyY,
    yAxeGyY,
    xAxeGyZ,
    yAxeGyZ = [];
chartBatt(); //setInterval(chartIt, 10000);

function getApiBatt(days) {
    var api_url, data, table, i;
    return regeneratorRuntime.async(function getApiBatt$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    xAxeBatt = [];
                    yAxeBatt = [];
                    xAxeBattFull = [];
                    api_url = "https://api.thingspeak.com/channels/1112090/fields/1.json?api_key=JVM954R6BIE3P1PE&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context.next = 6;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 6:
                    data = _context.sent;
                    _context.next = 9;
                    return regeneratorRuntime.awrap(data.json());

                case 9:
                    table = _context.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field1))) {
                            xAxeBattFull.push(table.feeds[i].created_at);
                            xAxeBatt.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeBatt.push(parseFloat(table.feeds[i].field1));
                        }
                    }

                case 11:
                case "end":
                    return _context.stop();
            }
        }
    });
}

function getApiTemp(days) {
    var i;
    return regeneratorRuntime.async(function getApiTemp$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    xAxeTemp = [];
                    yAxeTemp = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/1.json?api_key=WAPRJ7PQ2NN58XPO&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context2.sent;
                    _context2.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context2.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field1))) {
                            xAxeTemp.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeTemp.push(parseFloat(table.feeds[i].field1));
                        }
                    }

                case 10:
                case "end":
                    return _context2.stop();
            }
        }
    });
}

function getApiAudio(days) {
    var i;
    return regeneratorRuntime.async(function getApiAudio$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    xAxeAudio = [];
                    yAxeAudio = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/2.json?api_key=WAPRJ7PQ2NN58XPO&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context3.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context3.sent;
                    _context3.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context3.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field2))) {
                            xAxeAudio.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeAudio.push(parseFloat(table.feeds[i].field2));
                        }
                    }

                case 10:
                case "end":
                    return _context3.stop();
            }
        }
    });
}

function getApiAccX(days) {
    var i;
    return regeneratorRuntime.async(function getApiAccX$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    xAxeAccX = [];
                    yAxeAccX = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/3.json?api_key=WAPRJ7PQ2NN58XPO&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context4.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context4.sent;
                    _context4.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context4.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field3))) {
                            xAxeAccX.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeAccX.push(parseFloat(table.feeds[i].field3));
                        }
                    }

                case 10:
                case "end":
                    return _context4.stop();
            }
        }
    });
}

function getApiAccY(days) {
    var i;
    return regeneratorRuntime.async(function getApiAccY$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    xAxeAccY = [];
                    yAxeAccY = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/4.json?api_key=WAPRJ7PQ2NN58XPO&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context5.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context5.sent;
                    _context5.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context5.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field4))) {
                            xAxeAccY.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeAccY.push(parseFloat(table.feeds[i].field4));
                        }
                    }

                case 10:
                case "end":
                    return _context5.stop();
            }
        }
    });
}

function getApiAccZ(days) {
    var i;
    return regeneratorRuntime.async(function getApiAccZ$(_context6) {
        while (1) {
            switch (_context6.prev = _context6.next) {
                case 0:
                    xAxeAccZ = [];
                    yAxeAccZ = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/5.json?api_key=WAPRJ7PQ2NN58XPO&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context6.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context6.sent;
                    _context6.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context6.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field5))) {
                            xAxeAccZ.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeAccZ.push(parseFloat(table.feeds[i].field5));
                        }
                    }

                case 10:
                case "end":
                    return _context6.stop();
            }
        }
    });
}

function getApiGyX(days) {
    var i;
    return regeneratorRuntime.async(function getApiGyX$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    xAxeGyX = [];
                    yAxeGyX = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/6.json?api_key=WAPRJ7PQ2NN58XPO&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context7.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context7.sent;
                    _context7.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context7.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field6))) {
                            xAxeGyX.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeGyX.push(parseFloat(table.feeds[i].field6));
                        }
                    }

                case 10:
                case "end":
                    return _context7.stop();
            }
        }
    });
}

function getApiGyY(days) {
    var i;
    return regeneratorRuntime.async(function getApiGyY$(_context8) {
        while (1) {
            switch (_context8.prev = _context8.next) {
                case 0:
                    xAxeGyY = [];
                    yAxeGyY = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/7.json?api_key=WAPRJ7PQ2NN58XPO&days=" + String(days) + "&timezone=Europe%2FPrague";
                    _context8.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context8.sent;
                    _context8.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context8.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field7))) {
                            xAxeGyY.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeGyY.push(parseFloat(table.feeds[i].field7));
                        }
                    }

                case 10:
                case "end":
                    return _context8.stop();
            }
        }
    });
}

function getApiGyZ(days) {
    var i;
    return regeneratorRuntime.async(function getApiGyZ$(_context9) {
        while (1) {
            switch (_context9.prev = _context9.next) {
                case 0:
                    xAxeGyZ = [];
                    yAxeGyZ = [];
                    api_url = "https://api.thingspeak.com/channels/829059/fields/8.json?api_key=WAPRJ7PQ2NN58XPO&results=8000&timezone=Europe%2FPrague";
                    _context9.next = 5;
                    return regeneratorRuntime.awrap(fetch(api_url));

                case 5:
                    data = _context9.sent;
                    _context9.next = 8;
                    return regeneratorRuntime.awrap(data.json());

                case 8:
                    table = _context9.sent;

                    for (i = 0; i < table.feeds.length; i++) {
                        if (!isNaN(parseFloat(table.feeds[i].field8))) {
                            xAxeGyZ.push(String(table.feeds[i].created_at).substr(11, 5));
                            yAxeGyZ.push(parseFloat(table.feeds[i].field8));
                        }
                    }

                case 10:
                case "end":
                    return _context9.stop();
            }
        }
    });
}

function chartBatt() {
    var ctx1, myLineChart1;
    return regeneratorRuntime.async(function chartBatt$(_context10) {
        while (1) {
            switch (_context10.prev = _context10.next) {
                case 0:
                    _context10.next = 2;
                    return regeneratorRuntime.awrap(getApiBatt(7));

                case 2:
                    ctx1 = document.getElementById("BATT");
                    myLineChart1 = new Chart(ctx1, {
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
                                data: yAxeBatt
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicsLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + " V";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + " V " + xAxeBattFull[tooltipItem.index];
                                    }
                                }
                            }
                        }
                    });

                case 4:
                case "end":
                    return _context10.stop();
            }
        }
    });
}

function chartIt() {
    var ctx2, myLineChart2, ctx3, myLineChart3, ctx4, myLineChart4, ctx5, myLineChart5, ctx6, myLineChart6, ctx7,
        myLineChart7, ctx8, myLineChart8, ctx9, myLineChart9;
    return regeneratorRuntime.async(function chartIt$(_context11) {
        while (1) {
            switch (_context11.prev = _context11.next) {
                case 0:
                    _context11.next = 2;
                    return regeneratorRuntime.awrap(getAPI());

                case 2:
                    ctx2 = document.getElementById("TEMP");
                    myLineChart2 = new Chart(ctx2, {
                        type: "line",
                        data: {
                            labels: xAxeTemp,
                            datasets: [{
                                label: "BMP 280",
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
                                data: yAxeTemp
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + " °C";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + " °C";
                                    }
                                }
                            }
                        }
                    });
                    ctx3 = document.getElementById("AUDIO");
                    myLineChart3 = new Chart(ctx3, {
                        type: "line",
                        data: {
                            labels: xAxeAudio,
                            datasets: [{
                                label: "GY-MAX",
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
                                data: yAxeAudio
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    time: {
                                        unit: "date"
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value;
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel);
                                    }
                                }
                            }
                        }
                    });
                    ctx4 = document.getElementById("ACCX");
                    myLineChart4 = new Chart(ctx4, {
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
                                data: yAxeAccY
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    time: {
                                        unit: "date"
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + "°";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                                    }
                                }
                            }
                        }
                    });
                    ctx5 = document.getElementById("ACCY");
                    myLineChart5 = new Chart(ctx5, {
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
                                data: yAxeAccY
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    time: {
                                        unit: "date"
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + "°";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                                    }
                                }
                            }
                        }
                    });
                    ctx6 = document.getElementById("ACCZ");
                    myLineChart6 = new Chart(ctx6, {
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
                                data: yAxeAccZ
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    time: {
                                        unit: "date"
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + "°";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                                    }
                                }
                            }
                        }
                    });
                    ctx7 = document.getElementById("GYX");
                    myLineChart7 = new Chart(ctx7, {
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
                                data: yAxeGyX
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    time: {
                                        unit: "date"
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + "°";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                                    }
                                }
                            }
                        }
                    });
                    ctx8 = document.getElementById("GYY");
                    myLineChart8 = new Chart(ctx8, {
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
                                data: yAxeGyY
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    time: {
                                        unit: "date"
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + "°";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                                    }
                                }
                            }
                        }
                    });
                    ctx9 = document.getElementById("GYZ");
                    myLineChart9 = new Chart(ctx9, {
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
                                data: yAxeGyZ
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                xAxes: [{
                                    time: {
                                        unit: "date"
                                    },
                                    gridLines: {
                                        display: false,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        maxTicksLimit: 8,
                                        maxRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        maxTicksLimit: 8,
                                        padding: 10,
                                        // Include a dollar sign in the ticks
                                        callback: function callback(value, index, values) {
                                            return value + "°";
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(234, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: false,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                titleMarginBottom: 10,
                                titleFontColor: "#6e707e",
                                titleFontSize: 14,
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                intersect: false,
                                mode: "index",
                                caretPadding: 10,
                                callbacks: {
                                    label: function label(tooltipItem, chart) {
                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                                        return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
                                    }
                                }
                            }
                        }
                    });

                case 18:
                case "end":
                    return _context11.stop();
            }
        }
    });
}