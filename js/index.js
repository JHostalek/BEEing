var ACCELEROMETER_THRESHOLED = 25;

function updateColor() {
    var elem = document.getElementById("myBar");
    var width = parseInt(elem.style.width);
    if (width < 10) {
        elem.className = "progress-bar bg-danger";
    } else if (width < 40) {
        elem.className = "progress-bar bg-warning";
    } else {
        elem.className = "progress-bar bg-success";
    }
}

const map = (value, x1, y1, x2, y2) =>
    ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

async function updateMother() {
    var audioArray = [];
    api_url =
        "https://api.thingspeak.com/channels/829059/fields/2.json?api_key=WAPRJ7PQ2NN58XPO&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field2))) {
            audioArray.push(parseFloat(table.feeds[i].field2));
        }
    }
    var color = document.getElementById("motherPresence");
    var text = document.getElementById("motherPresenceText");
    var audio = 10 //audioArray[audioArray.length - 1];

    if (audio > 50) {
        color.className = "card bg-danger text-center text-white shadow";
        text.innerHTML = "MATKA NEPŘÍTOMNA ✗";
    } else if (audio > 40) {
        color.className = "card bg-secondary text-center text-white shadow";
        text.innerHTML = "PŘÍTOMNOST MATKY JE NEJISTÁ";
    } else {
        color.className = "card bg-success text-center text-white shadow";
        text.innerHTML = "MATKA PŘÍTOMNA ✓";
    }
}

async function updateBattery() {
    let voltageArray = [];

    let api_url =
        "https://api.thingspeak.com/channels/1112090/fields/1.json?api_key=JVM954R6BIE3P1PE&timezone=Europe%2FPrague";
    let data = await fetch(api_url);
    let table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field1))) {
            voltageArray.push(parseFloat(table.feeds[i].field1));
        }
    }

    let elem = document.getElementById("myBar");
    let voltage = voltageArray[voltageArray.length - 1];
    if (voltage < 2) {

        document.getElementById("batteryLevel").innerHTML = "!!! BATERIE NENÍ PŘIPOJENA !!!";
        //console.log(voltage);
        elem.style.width = voltage + "%";
        updateColor();
    } else {
        voltage = map(voltage, 2.32, 3, 0, 100);
        document.getElementById("batteryLevel").innerHTML = Math.round(voltage) + "%";
        //console.log(voltage);
        elem.style.width = voltage + "%";
        updateColor();
    }

}

var text = String();
async function updatePosition() {
    let xAxeAccX = [];
    let yAxeAccX = [];

    let xAxeAccY = [];
    let yAxeAccY = [];

    let xAxeAccZ = [];
    let yAxeAccZ = [];

    let api_urlX =
        "https://api.thingspeak.com/channels/829059/fields/3.json?api_key=WAPRJ7PQ2NN58XPO&results=8000&timezone=Europe%2FPrague";
    let api_urlY =
        "https://api.thingspeak.com/channels/829059/fields/4.json?api_key=WAPRJ7PQ2NN58XPO&results=8000&timezone=Europe%2FPrague";
    let api_urlZ =
        "https://api.thingspeak.com/channels/829059/fields/5.json?api_key=WAPRJ7PQ2NN58XPO&results=8000&timezone=Europe%2FPrague";

    let data = await fetch(api_urlX);
    let table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field3))) {
            xAxeAccX.push(String(table.feeds[i].created_at));
            yAxeAccX.push(parseFloat(table.feeds[i].field3));
        }
    }

    data = await fetch(api_urlY);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field4))) {
            xAxeAccY.push(String(table.feeds[i].created_at));
            yAxeAccY.push(parseFloat(table.feeds[i].field4));
        }
    }

    data = await fetch(api_urlZ);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field5))) {
            xAxeAccZ.push(String(table.feeds[i].created_at));
            yAxeAccZ.push(parseFloat(table.feeds[i].field5));
        }
    }

    let difference = [];

    for (let i = -1; i < yAxeAccX.length; i++) {
        if (
            yAxeAccX[i] > yAxeAccX[i - 1] + ACCELEROMETER_THRESHOLED ||
            yAxeAccX[i] < yAxeAccX[i - 1] - ACCELEROMETER_THRESHOLED
        ) {
            difference.push(xAxeAccX[i]);
        }
    }
    updateMovementWarning(difference, "X");
    difference = [];

    for (let i = -1; i < yAxeAccY.length; i++) {
        if (
            yAxeAccY[i] > yAxeAccY[i - 1] + ACCELEROMETER_THRESHOLED ||
            yAxeAccY[i] < yAxeAccY[i - 1] - ACCELEROMETER_THRESHOLED
        ) {
            difference.push(xAxeAccX[i]);
        }
    }
    updateMovementWarning(difference, "Y");
    difference = [];

    for (let i = -1; i < yAxeAccZ.length; i++) {
        if (
            yAxeAccZ[i] > yAxeAccZ[i - 1] + ACCELEROMETER_THRESHOLED ||
            yAxeAccZ[i] < yAxeAccZ[i - 1] - ACCELEROMETER_THRESHOLED
        ) {
            difference.push(xAxeAccX[i]);
        }
    }
    updateMovementWarning(difference, "Z");
    difference = [];
    text = "";
}

async function updateMovementWarning(difference, axe) {
    let elem = document.getElementById("movement");
    if (difference.length != 0) {
        text += "<br>";
        text += "osa - " + axe;

        for (i = 0; i < difference.length; i++) {
            text += "<br>";
            text += String(difference[i]).substr(11, 5) + " ";
            text += String(difference[i]).substr(8, 2) + "/";
            text += String(difference[i]).substr(5, 2) + "/";
            text += String(difference[i]).substr(0, 4);
        }
        text += "<br>";

        elem.innerHTML = text;
    }

    let card = document.getElementById("movementCard");
    //let mText = document.getElementById("movementText");
    if (difference.length > 0) {
        card.className = "card border-left-danger shadow h-100 py-2";
        //mText.className = "h3 mb-0 font-weight-bold text-danger";
    } else {
        card.className = "card border-left-success shadow h-100 py-2";
        //mText.className = "h3 mb-0 font-weight-bold text-success";
    }
}

async function updateTemp() {
    let xAxeTemp = [];
    let yAxeTemp = [];
    api_url =
        "https://api.thingspeak.com/channels/829059/fields/1.json?api_key=WAPRJ7PQ2NN58XPO&timezone=Europe%2FPrague";
    data = await fetch(api_url);
    table = await data.json();
    for (let i = 0; i < table.feeds.length; i++) {
        if (!isNaN(parseFloat(table.feeds[i].field1))) {
            xAxeTemp.push(String(table.feeds[i].created_at).substr(11, 5));
            yAxeTemp.push(parseFloat(table.feeds[i].field1));
        }
    }

    let valueElem = document.getElementById("tempValue");
    let temperature = yAxeTemp[yAxeTemp.length - 1].toFixed(1);
    valueElem.innerHTML =
        '<p style="font-size:55px">' + parseFloat(temperature) + "°C" + "</p>";
    let bar1 = document.getElementById("tempBar1");
    let bar2 = document.getElementById("tempBar2");
    if (temperature < 10) {
        bar1.className = "myprogress-bar border-primary";
        bar2.className = "myprogress-bar border-primary";
        valueElem.className = "font-weight-bold text-primary";
    } else if (temperature < 25) {
        bar1.className = "myprogress-bar border-success";
        bar2.className = "myprogress-bar border-success";
        valueElem.className = "font-weight-bold text-success";
    } else {
        bar1.className = "myprogress-bar border-danger";
        bar2.className = "myprogress-bar border-danger";
        valueElem.className = "font-weight-bold text-danger";
    }
}

updateMother();
updateBattery();
updatePosition();
updateTemp();
setInterval(updateTemp, 60000);
setInterval(updatePosition, 60000);
setInterval(updateBattery, 60000);
setInterval(updateMother, 60000);

async function chargebattery() {
    var a;
    a = document.getElementById("charging");
    a.innerHTML = "&#xf240;";

    setTimeout(function() {
        a.innerHTML = "&#xf241;";
    }, 5000);
    setTimeout(function() {
        a.innerHTML = "&#xf242;";
    }, 10000);
    setTimeout(function() {
        a.innerHTML = "&#xf243;";
    }, 15000);
    setTimeout(function() {
        a.innerHTML = "&#xf244;";
    }, 20000);
}

chargebattery();
setInterval(chargebattery, 25000);

$(function() {
    $(".myprogress").each(function() {
        var value = $(this).attr("data-value");
        var left = $(this).find(".myprogress-left .myprogress-bar");
        var right = $(this).find(".myprogress-right .myprogress-bar");

        if (value > 0) {
            if (value <= 50) {
                right.css("transform", "rotate(" + percentageToDegrees(value) + "deg)");
            } else {
                right.css("transform", "rotate(180deg)");
                left.css(
                    "transform",
                    "rotate(" + percentageToDegrees(value - 50) + "deg)"
                );
            }
        }
    });

    function percentageToDegrees(percentage) {
        return (percentage / 100) * 360;
    }
});

// function minus() {
//     var elem = document.getElementById("myBar");
//     var width = parseInt(elem.style.width);
//     console.log(width)
//     if (width > 0) {
//         width--;
//         elem.style.width = width + '%';
//     }
//     updateColor();
// }

// function plus() {
//     var elem = document.getElementById("myBar");
//     var width = parseInt(elem.style.width);
//     console.log(width)
//     if (width < 100) {
//         width++;
//         elem.style.width = width + '%';
//     }
//     updateColor();

//     if (width < 100) {
//         width++;
//         elem.style.width = width + '%';
//     }
//     updateColor();
// }// }