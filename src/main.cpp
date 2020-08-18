#include <esp_now.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <ThingSpeak.h>
//#include <ESP32Ping.h> - used for internet debug - e.g. for ping google

/**
 * channel 1
 * fields  used 8
 * empty 0
 */
const unsigned long myChannelNumber = 829059;
/**
 * channel 2
 * only 1 field used - battery value
 * empty 7
 */
const unsigned long myChannelNumber2 = 1112090;

//1st channel's api key
const char *myWriteAPIKey = "4OL312MW06WZDDI3";
//2nd channel's api key
const char *myWriteAPIKey2 = "JVZXT5M3X80ZB87D";

/**
 * HOME WIFI SSID AND PASSWORD!!!
 */
const char *ssidStation = ":(";
const char *passwordStation = "soulknight";
//const char *ssidStation = "semtamtuk.net";
//const char *passwordStation = "PzgKCTvjC96bZw9xEw9E";

//created instance of WiFi client - used for thingspeak
WiFiClient client;

// ACCESS POINT credentials - aka ESPNow's AP
const char *ssidAP = ":)";
const char *passwordAP = "soulknight";

/**
 * WIFI CHANNEL
 * at the moment home wifi needs to be set to channel 1
 * aswell as master's AP used for ESPNow
 */

const int CHANNEL = 1;

//value is used for timing actions
long long oldTime = millis();

bool sendDataToThingspeak = false;


/**
 * DATA STRUCTURE FOR SENDING DATA
 * MUST BE SAME AS MASTERS STRUCTURE
 */
typedef struct DataStruct {
    float audio;
    float temperature;
    float battery;
    int16_t ax;
    int16_t ay;
    int16_t az;
    int16_t gx;
    int16_t gy;
    int16_t gz;
} DataStruct __attribute__((packed));
DataStruct data;

/**
 * Init ESP Now with fallback
 */
void InitESPNow() {
    if (esp_now_init() == ESP_OK) {
        Serial.println("ESPNow Init Success");
    } else {
        Serial.println("ESPNow Init Failed");
        // Retry InitESPNow, add a counte and then restart?
        // InitESPNow();
        // or Simply Restart
        ESP.restart();
    }
}

/**
 * config AP SSID
 */
void configDeviceAP() {
    bool result = WiFi.softAP(ssidAP, passwordAP, CHANNEL, 0);
    if (!result) {
        Serial.println("AP Config failed.");
    } else {
        Serial.println("AP Config Success. Broadcasting with AP: " + String(ssidAP));
    }
}

/**
 * PRINTS OUT ALL DATA STORED IN dataStructure
 */
void printAll() {
    Serial.print("ax = ");
    Serial.print(data.ax);
    Serial.print(" | ay = ");
    Serial.print(data.ay);
    Serial.print(" | az = ");
    Serial.print(data.az);
    Serial.print(" | gx = ");
    Serial.print(data.gx);
    Serial.print(" | gy = ");
    Serial.print(data.gy);
    Serial.print(" | gz = ");
    Serial.print(data.gz);
    Serial.print(" | AUDIO: ");
    Serial.print(data.audio);
    Serial.print(" | TEMP: ");
    Serial.println(data.temperature);
    Serial.print(" | BATT: ");
    Serial.println(data.battery);
}

/**
 * callback when data is recv from Master
 */
void OnDataRecv(const uint8_t *mac_addr, const uint8_t *incomingData, int data_len) {
    Serial.println("-----RECEIVED-----");
    char macStr[18];
    snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
             mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
    Serial.print("Last Packet Recv from: ");
    Serial.println(macStr);
    //Serial.print("Last Packet Recv Data: "); Serial.println(*data);
    DataStruct incdata;
    memcpy(&incdata, incomingData, sizeof(incdata));
    data.audio = incdata.audio;
    data.temperature = incdata.temperature;
    data.ax = incdata.ax;
    data.ay = incdata.ay;
    data.az = incdata.az;
    data.gx = incdata.gx;
    data.gy = incdata.gy;
    data.gz = incdata.gz;
    data.battery = incdata.battery;
    //print incoming data
    printAll();
    Serial.println("-----DONE-----");

    //unregister receiving data until thingspeak upload is successful
    esp_now_unregister_recv_cb();

    sendDataToThingspeak = true;
}

/**
 * RESETS ALL WIFI DATA
 */
void WiFiReset() {
    WiFi.persistent(false);
    WiFi.disconnect();
    WiFi.mode(WIFI_OFF);
}

void setup() {
    //Openingg serial port with PC
    Serial.begin(115200);
    Serial.println("THIS DEVICE IS SERVER - ESPNow");

    //builtin led is used for data transfer signalisation
    pinMode(BUILTIN_LED, OUTPUT);

    //not sure if this piece helps, but it works, so im happy :)
    WiFiReset();

    //AP-ESPNow STA-conects to define ssidStation above
    WiFi.mode(WIFI_AP_STA);
    WiFi.begin(ssidStation, passwordStation, CHANNEL);

    //if connection to wifi fails, restart esp
    long long oldTimeTemp = millis();
    while (WiFi.status() != WL_CONNECTED) {
        if (millis() - oldTimeTemp > 30000) {
            Serial.println("FAILED! ... RESTARTING");
            WiFi.disconnect();
            delay(500);
            ESP.restart();
        }
    }
    Serial.println(WiFi.channel());
    Serial.println("Successfully connected");

    /*
     * USED FOR TESTING INTERNET CONNECTION
     * PINGS GOOGLE.COM
     *
        IPAddress ip(8, 8, 8, 8); // The remote ip to ping
        bool ret = Ping.ping(ip);
        Serial.println(ret);
     */


    /**
     * ESPNow ESTABILISHING CONNECTION
     */
    Serial.println("Setting up ESPNow...");
    //Set device in AP mode to begin with
    // configure device AP mode
    configDeviceAP();
    // This is the mac address of the Slave in AP Mode
    Serial.print("AP MAC: ");
    Serial.println(WiFi.softAPmacAddress());
    // Init ESPNow with a fallback logic
    InitESPNow();
    // Once ESPNow is successfully Init, we will register for recv CB to
    // get recv packer info.

    ThingSpeak.begin(client);

    //registed device to receive data from slave
    esp_now_register_recv_cb(OnDataRecv);
}

void loop() {
    //once per minute try to send data to thingspeak
    if (sendDataToThingspeak) {
        //oldTime = millis();
        if (data.temperature != 0 && data.audio != 0) {
            digitalWrite(BUILTIN_LED, HIGH);
            Serial.println("Sending data to channel 1 to fields 1-8...");
            ThingSpeak.setField(1, data.temperature);
            ThingSpeak.setField(2, data.audio);
            ThingSpeak.setField(3, data.ax);
            ThingSpeak.setField(4, data.ay);
            ThingSpeak.setField(5, data.az);
            ThingSpeak.setField(6, data.gx);
            ThingSpeak.setField(7, data.gy);
            ThingSpeak.setField(8, data.gz);
            // write to the ThingSpeak channel
            int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
            if (x == 200) {
                Serial.println("Channel update successful.");
            } else {
                Serial.println("Problem updating channel. HTTP error code " + String(x));
            }

            ThingSpeak.writeField(myChannelNumber2, 1, data.battery, myWriteAPIKey2);
            Serial.println("Sending data to channel 2 to 1st field...");
            Serial.println(data.battery);
            delay(60000);
            digitalWrite(BUILTIN_LED, LOW);
            sendDataToThingspeak = false;
            esp_now_register_recv_cb(OnDataRecv);
        }

    }
}