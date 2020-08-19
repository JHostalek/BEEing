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
    toFixedFix = function (n, prec) {
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

xAxeBatt = [];
yAxeBatt = [];
xAxeTemp = [];
yAxeTemp = [];
xAxeAudio = [];
yAxeAudio = [];
xAxeAccX = [];
yAxeAccX = [];
xAxeAccY = [];
yAxeAccY = [];
xAxeAccZ = [];
yAxeAccZ = [];
xAxeGyX = [];
yAxeGyX = [];
xAxeGyY = [];
yAxeGyY = [];
xAxeGyZ = [];
yAxeGyZ = [];

chartIt();
//setInterval(chartIt, 10000);

async function getAPI() {
  xAxeBatt = [];
  yAxeBatt = [];

  xAxeTemp = [];
  yAxeTemp = [];

  xAxeAudio = [];
  yAxeAudio = [];

  xAxeAccX = [];
  yAxeAccX = [];

  xAxeAccY = [];
  yAxeAccY = [];

  xAxeAccZ = [];
  yAxeAccZ = [];

  xAxeGyX = [];
  yAxeGyX = [];

  xAxeGyY = [];
  yAxeGyY = [];

  xAxeGyZ = [];
  yAxeGyZ = [];

  let api_url =
    "https://api.thingspeak.com/channels/1112090/fields/1.json?api_key=JVM954R6BIE3P1PE";
  let data = await fetch(api_url);
  let table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field1))) {
      xAxeBatt.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeBatt.push(parseFloat(table.feeds[i].field1));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/1.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  console.log(table)
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field1))) {
      xAxeTemp.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeTemp.push(parseFloat(table.feeds[i].field1));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/2.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field2))) {
      xAxeAudio.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeAudio.push(parseFloat(table.feeds[i].field2));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/3.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field3))) {
      xAxeAccX.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeAccX.push(parseFloat(table.feeds[i].field3));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/4.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field4))) {
      xAxeAccY.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeAccY.push(parseFloat(table.feeds[i].field4));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/5.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field5))) {
      xAxeAccZ.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeAccZ.push(parseFloat(table.feeds[i].field5));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/6.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field6))) {
      xAxeGyX.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeGyX.push(parseFloat(table.feeds[i].field6));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/7.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field7))) {
      xAxeGyY.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeGyY.push(parseFloat(table.feeds[i].field7));
    }
  }

  api_url =
    "https://api.thingspeak.com/channels/829059/fields/8.json?api_key=WAPRJ7PQ2NN58XPO";
  data = await fetch(api_url);
  table = await data.json();
  for (let i = 0; i < table.feeds.length; i++) {
    if (!isNaN(parseFloat(table.feeds[i].field8))) {
      xAxeGyZ.push(String(table.feeds[i].created_at).substr(11,5));
      yAxeGyZ.push(parseFloat(table.feeds[i].field8));
    }
  }
}

async function chartIt() {
  await getAPI();
  var ctx1 = document.getElementById("BATT");
  var myLineChart1 = new Chart(ctx1, {
    type: "line",
    data: {
      labels: xAxeBatt,
      datasets: [
        {
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
        },
      ],
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
        xAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 8,
              maxRotation: 0,
            },
          },
        ],
        yAxes: [
          {
            
            ticks: {
              maxTicsLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + " V";
          },
        },
      },
    },
  });

  var ctx2 = document.getElementById("TEMP");
  var myLineChart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: xAxeTemp,
      datasets: [
        {
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
          data: yAxeTemp,
        },
      ],
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
        xAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 8,
              maxRotation: 0,
            
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + " °C";
          },
        },
      },
    },
  });

  var ctx3 = document.getElementById("AUDIO");
  var myLineChart3 = new Chart(ctx3, {
    type: "line",
    data: {
      labels: xAxeAudio,
      datasets: [
        {
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
          data: yAxeAudio,
        },
      ],
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
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel);
          },
        },
      },
    },
  });
  var ctx4 = document.getElementById("ACCX");
  var myLineChart4 = new Chart(ctx4, {
    type: "line",
    data: {
      labels: xAxeAccX,
      datasets: [
        {
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
        },
      ],
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
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
          },
        },
      },
    },
  });

  var ctx5 = document.getElementById("ACCY");
  var myLineChart5 = new Chart(ctx5, {
    type: "line",
    data: {
      labels: xAxeAccY,
      datasets: [
        {
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
        },
      ],
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
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
          },
        },
      },
    },
  });
  var ctx6 = document.getElementById("ACCZ");
  var myLineChart6 = new Chart(ctx6, {
    type: "line",
    data: {
      labels: xAxeAccZ,
      datasets: [
        {
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
        },
      ],
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
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
          },
        },
      },
    },
  });

  var ctx7 = document.getElementById("GYX");
  var myLineChart7 = new Chart(ctx7, {
    type: "line",
    data: {
      labels: xAxeGyX,
      datasets: [
        {
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
        },
      ],
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
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
          },
        },
      },
    },
  });

  var ctx8 = document.getElementById("GYY");
  var myLineChart8 = new Chart(ctx8, {
    type: "line",
    data: {
      labels: xAxeGyY,
      datasets: [
        {
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
        },
      ],
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
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
          },
        },
      },
    },
  });
  var ctx9 = document.getElementById("GYZ");
  var myLineChart9 = new Chart(ctx9, {
    type: "line",
    data: {
      labels: xAxeGyZ,
      datasets: [
        {
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
        },
      ],
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
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
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
          },
        ],
      },
      legend: {
        display: false,
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
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + parseFloat(tooltipItem.yLabel) + "°";
          },
        },
      },
    },
  });
}

async function getCsv(filename) {
  const data = await fetch(filename);
  const table = await data.text();
  rows = table.trim().split("\n").slice(1);
  rows.forEach((element) => {
    cols = element.split(",");
    date = cols[0];
    value = cols[2];
    if (value > 0) {
      xAxe.push(date);
      yAxe.push(value);
    }
  });
}
