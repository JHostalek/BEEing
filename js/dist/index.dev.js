"use strict";

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

var map = function map(value, x1, y1, x2, y2) {
  return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
};

function updateMother() {
  var audioArray, _i, color, text, audio;

  return regeneratorRuntime.async(function updateMother$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          audioArray = [];
          api_url = "https://api.thingspeak.com/channels/829059/fields/2.json?api_key=WAPRJ7PQ2NN58XPO&timezone=Europe%2FPrague";
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(api_url));

        case 4:
          data = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(data.json());

        case 7:
          table = _context.sent;

          for (_i = 0; _i < table.feeds.length; _i++) {
            if (!isNaN(parseFloat(table.feeds[_i].field2))) {
              audioArray.push(parseFloat(table.feeds[_i].field2));
            }
          }

          color = document.getElementById("motherPresence");
          text = document.getElementById("motherPresenceText");
          audio = audioArray[audioArray.length - 1];
          console.log(audio);

          if (audio > 50) {
            color.className = "card bg-danger text-center text-white shadow";
            text.innerHTML = "MATKA NEPŘÍTOMNA ❌";
          } else if (audio > 40) {
            color.className = "card bg-secondary text-center text-white shadow";
            text.innerHTML = "PŘÍTOMNOST MATKY JE NEJISTÁ";
          } else {
            color.className = "card bg-primary text-center text-white shadow";
            text.innerHTML = "MATKA PŘÍTOMNA ✓";
          }

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
}

function updateBattery() {
  var voltageArray, api_url, data, table, _i2, elem, voltage;

  return regeneratorRuntime.async(function updateBattery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          voltageArray = [];
          api_url = "https://api.thingspeak.com/channels/1112090/fields/1.json?api_key=JVM954R6BIE3P1PE&timezone=Europe%2FPrague";
          _context2.next = 4;
          return regeneratorRuntime.awrap(fetch(api_url));

        case 4:
          data = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(data.json());

        case 7:
          table = _context2.sent;

          for (_i2 = 0; _i2 < table.feeds.length; _i2++) {
            if (!isNaN(parseFloat(table.feeds[_i2].field1))) {
              voltageArray.push(parseFloat(table.feeds[_i2].field1));
            }
          }

          elem = document.getElementById("myBar");
          voltage = voltageArray[voltageArray.length - 1];
          voltage = map(voltage, 2.32, 3, 0, 100);
          document.getElementById("batteryLevel").innerHTML = Math.round(voltage) + "%"; //console.log(voltage);

          elem.style.width = voltage + "%";
          updateColor();

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}

var text = String();

function updatePosition() {
  var xAxeAccX, yAxeAccX, xAxeAccY, yAxeAccY, xAxeAccZ, yAxeAccZ, api_urlX, api_urlY, api_urlZ, data, table, _i3, _i4, _i5, difference, _i6, _i7, _i8;

  return regeneratorRuntime.async(function updatePosition$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          xAxeAccX = [];
          yAxeAccX = [];
          xAxeAccY = [];
          yAxeAccY = [];
          xAxeAccZ = [];
          yAxeAccZ = [];
          api_urlX = "https://api.thingspeak.com/channels/829059/fields/3.json?api_key=WAPRJ7PQ2NN58XPO&results=8000&timezone=Europe%2FPrague";
          api_urlY = "https://api.thingspeak.com/channels/829059/fields/4.json?api_key=WAPRJ7PQ2NN58XPO&results=8000&timezone=Europe%2FPrague";
          api_urlZ = "https://api.thingspeak.com/channels/829059/fields/5.json?api_key=WAPRJ7PQ2NN58XPO&results=8000&timezone=Europe%2FPrague";
          _context3.next = 11;
          return regeneratorRuntime.awrap(fetch(api_urlX));

        case 11:
          data = _context3.sent;
          _context3.next = 14;
          return regeneratorRuntime.awrap(data.json());

        case 14:
          table = _context3.sent;

          for (_i3 = 0; _i3 < table.feeds.length; _i3++) {
            if (!isNaN(parseFloat(table.feeds[_i3].field3))) {
              xAxeAccX.push(String(table.feeds[_i3].created_at));
              yAxeAccX.push(parseFloat(table.feeds[_i3].field3));
            }
          }

          _context3.next = 18;
          return regeneratorRuntime.awrap(fetch(api_urlY));

        case 18:
          data = _context3.sent;
          _context3.next = 21;
          return regeneratorRuntime.awrap(data.json());

        case 21:
          table = _context3.sent;

          for (_i4 = 0; _i4 < table.feeds.length; _i4++) {
            if (!isNaN(parseFloat(table.feeds[_i4].field4))) {
              xAxeAccY.push(String(table.feeds[_i4].created_at));
              yAxeAccY.push(parseFloat(table.feeds[_i4].field4));
            }
          }

          _context3.next = 25;
          return regeneratorRuntime.awrap(fetch(api_urlZ));

        case 25:
          data = _context3.sent;
          _context3.next = 28;
          return regeneratorRuntime.awrap(data.json());

        case 28:
          table = _context3.sent;

          for (_i5 = 0; _i5 < table.feeds.length; _i5++) {
            if (!isNaN(parseFloat(table.feeds[_i5].field5))) {
              xAxeAccZ.push(String(table.feeds[_i5].created_at));
              yAxeAccZ.push(parseFloat(table.feeds[_i5].field5));
            }
          }

          difference = [];

          for (_i6 = -1; _i6 < yAxeAccX.length; _i6++) {
            if (yAxeAccX[_i6] > yAxeAccX[_i6 - 1] + ACCELEROMETER_THRESHOLED || yAxeAccX[_i6] < yAxeAccX[_i6 - 1] - ACCELEROMETER_THRESHOLED) {
              difference.push(xAxeAccX[_i6]);
            }
          }

          updateMovementWarning(difference, "X");
          difference = [];

          for (_i7 = -1; _i7 < yAxeAccY.length; _i7++) {
            if (yAxeAccY[_i7] > yAxeAccY[_i7 - 1] + ACCELEROMETER_THRESHOLED || yAxeAccY[_i7] < yAxeAccY[_i7 - 1] - ACCELEROMETER_THRESHOLED) {
              difference.push(xAxeAccX[_i7]);
            }
          }

          updateMovementWarning(difference, "Y");
          difference = [];

          for (_i8 = -1; _i8 < yAxeAccZ.length; _i8++) {
            if (yAxeAccZ[_i8] > yAxeAccZ[_i8 - 1] + ACCELEROMETER_THRESHOLED || yAxeAccZ[_i8] < yAxeAccZ[_i8 - 1] - ACCELEROMETER_THRESHOLED) {
              difference.push(xAxeAccX[_i8]);
            }
          }

          updateMovementWarning(difference, "Z");
          difference = [];
          text = "";

        case 41:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function updateMovementWarning(difference, axe) {
  var elem, card;
  return regeneratorRuntime.async(function updateMovementWarning$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          elem = document.getElementById("movement");

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

          card = document.getElementById("movementCard"); //let mText = document.getElementById("movementText");

          if (difference.length > 0) {
            card.className = "card border-left-danger shadow h-100 py-2"; //mText.className = "h3 mb-0 font-weight-bold text-danger";
          } else {
            card.className = "card border-left-success shadow h-100 py-2"; //mText.className = "h3 mb-0 font-weight-bold text-success";
          }

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function updateTemp() {
  var xAxeTemp, yAxeTemp, _i9, valueElem, temperature, bar1, bar2;

  return regeneratorRuntime.async(function updateTemp$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          xAxeTemp = [];
          yAxeTemp = [];
          api_url = "https://api.thingspeak.com/channels/829059/fields/1.json?api_key=WAPRJ7PQ2NN58XPO&timezone=Europe%2FPrague";
          _context5.next = 5;
          return regeneratorRuntime.awrap(fetch(api_url));

        case 5:
          data = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(data.json());

        case 8:
          table = _context5.sent;

          for (_i9 = 0; _i9 < table.feeds.length; _i9++) {
            if (!isNaN(parseFloat(table.feeds[_i9].field1))) {
              xAxeTemp.push(String(table.feeds[_i9].created_at).substr(11, 5));
              yAxeTemp.push(parseFloat(table.feeds[_i9].field1));
            }
          }

          console.log(yAxeTemp);
          valueElem = document.getElementById("tempValue");
          temperature = yAxeTemp[yAxeTemp.length - 1].toFixed(1);
          valueElem.innerHTML = '<p style="font-size:55px">' + parseFloat(temperature) + "°C" + "</p>";
          bar1 = document.getElementById("tempBar1");
          bar2 = document.getElementById("tempBar2");

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

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  });
}

updateMother();
updateBattery();
updatePosition();
updateTemp();
setInterval(updateTemp, 60000);
setInterval(updatePosition, 60000);
setInterval(updateBattery, 60000);
setInterval(updateMother, 60000);

function chargebattery() {
  var a;
  return regeneratorRuntime.async(function chargebattery$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          a = document.getElementById("charging");
          a.innerHTML = "&#xf240;";
          setTimeout(function () {
            a.innerHTML = "&#xf241;";
          }, 5000);
          setTimeout(function () {
            a.innerHTML = "&#xf242;";
          }, 10000);
          setTimeout(function () {
            a.innerHTML = "&#xf243;";
          }, 15000);
          setTimeout(function () {
            a.innerHTML = "&#xf244;";
          }, 20000);

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
}

chargebattery();
setInterval(chargebattery, 25000);
$(function () {
  $(".myprogress").each(function () {
    var value = $(this).attr("data-value");
    var left = $(this).find(".myprogress-left .myprogress-bar");
    var right = $(this).find(".myprogress-right .myprogress-bar");

    if (value > 0) {
      if (value <= 50) {
        right.css("transform", "rotate(" + percentageToDegrees(value) + "deg)");
      } else {
        right.css("transform", "rotate(180deg)");
        left.css("transform", "rotate(" + percentageToDegrees(value - 50) + "deg)");
      }
    }
  });

  function percentageToDegrees(percentage) {
    return percentage / 100 * 360;
  }
}); // function minus() {
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