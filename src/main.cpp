#include <esp_now.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <ThingSpeak.h>
#include <ESP32Ping.h>

/**
 * channel 1
 * fields  used 8
 * empty 0
 */
unsigned long myChannelNumber = 829059;
/**
 * channel 2
 * only 1 field used - battery value
 * empty 7
 */
unsigned long myChannelNumber2 = 1112090;

//1st channel's api key
const char *myWriteAPIKey = "4OL312MW06WZDDI3";
//2nd channel's api key
const char *myWriteAPIKey2 = "JVZXT5M3X80ZB87D";

/**
 * HOME WIFI SSID AND PASSWORD!!!
 */
const char *ssidStation = "semtamtuk.net";
const char *passwordStation = "PzgKCTvjC96bZw9xEw9E";

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

int CHANNEL = 1;

//value is used for timing actions
long long oldTime = millis();


/**
 * DATA STRUCTURE FOR SENDING DATA
 * MUST BE SAME AS MASTERS STRUCTURE
 */
typedef struct DataStruct {
    float Audio;
    float Tmp1;
    float batt;
    int16_t ax;
    int16_t ay;
    int16_t az;
    int16_t gx;
    int16_t gy;
    int16_t gz;
} DataStruct __attribute__((packed));
DataStruct dataStruct;

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
    Serial.print(dataStruct.ax);
    Serial.print(" | ay = ");
    Serial.print(dataStruct.ay);
    Serial.print(" | az = ");
    Serial.print(dataStruct.az);
    Serial.print(" | gx = ");
    Serial.print(dataStruct.gx);
    Serial.print(" | gy = ");
    Serial.print(dataStruct.gy);
    Serial.print(" | gz = ");
    Serial.print(dataStruct.gz);
    Serial.print(" | AUDIO: ");
    Serial.print(dataStruct.Audio);
    Serial.print(" | TEMPERATURE: ");
    Serial.println(dataStruct.Tmp1);
    Serial.print(" | BATTERY: ");
    Serial.println(dataStruct.batt);
}

/**
 * callback when data is recv from Master
 */
void OnDataRecv(const uint8_t *mac_addr, const uint8_t *data, int data_len) {
    char macStr[18];
    snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
             mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
    Serial.print("Last Packet Recv from: ");
    Serial.println(macStr);
    //Serial.print("Last Packet Recv Data: "); Serial.println(*data);
    DataStruct incdata;
    memcpy(&incdata, data, sizeof(incdata));
    dataStruct.Audio = incdata.Audio;
    dataStruct.Tmp1 = incdata.Tmp1;
    dataStruct.ax = incdata.ax;
    dataStruct.ay = incdata.ay;
    dataStruct.az = incdata.az;
    dataStruct.gx = incdata.gx;
    dataStruct.gy = incdata.gy;
    dataStruct.gz = incdata.gz;
    dataStruct.batt = incdata.batt;
    //print incoming data
    printAll();
    Serial.println("-----DONE-----");

    //unregister receiving data until thingspeak upload is successful
    esp_now_unregister_recv_cb();
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

    //registed device to receive data from slave
    esp_now_register_recv_cb(OnDataRecv);
}

void loop() {
    //once per minute try to send data to thingspeak
    if (millis() - oldTime > 60000) {
        oldTime = millis();
        if (dataStruct.Tmp1 != 0 && dataStruct.Audio != 0) {
            digitalWrite(BUILTIN_LED, HIGH);
            ThingSpeak.writeField(myChannelNumber, 1, dataStruct.Tmp1, myWriteAPIKey);
            Serial.print("send to ch1 f1: ");
            Serial.println(dataStruct.Tmp1);
            delay(60000);
            digitalWrite(BUILTIN_LED, LOW);
            ThingSpeak.writeField(myChannelNumber, 2, dataStruct.Audio, myWriteAPIKey);
            Serial.print("send to ch1 f2: ");
            Serial.println(dataStruct.Audio);
            delay(60000);
            digitalWrite(BUILTIN_LED, HIGH);
            ThingSpeak.writeField(myChannelNumber, 3, dataStruct.ax, myWriteAPIKey);
            Serial.print("send to ch1 f3: ");
            Serial.println(dataStruct.ax);
            delay(60000);
            digitalWrite(BUILTIN_LED, LOW);
            ThingSpeak.writeField(myChannelNumber, 4, dataStruct.ay, myWriteAPIKey);
            Serial.print("send to ch1 f4: ");
            Serial.println(dataStruct.ay);
            delay(60000);
            digitalWrite(BUILTIN_LED, HIGH);
            ThingSpeak.writeField(myChannelNumber, 5, dataStruct.az, myWriteAPIKey);
            Serial.print("send to ch1 f5: ");
            Serial.println(dataStruct.az);
            delay(60000);
            digitalWrite(BUILTIN_LED, LOW);
            ThingSpeak.writeField(myChannelNumber, 6, dataStruct.gx, myWriteAPIKey);
            Serial.print("send to ch1 f6: ");
            Serial.println(dataStruct.gx);
            delay(60000);
            digitalWrite(BUILTIN_LED, HIGH);
            ThingSpeak.writeField(myChannelNumber, 7, dataStruct.gy, myWriteAPIKey);
            Serial.print("send to ch1 f7: ");
            Serial.println(dataStruct.gy);
            delay(60000);
            digitalWrite(BUILTIN_LED, LOW);
            ThingSpeak.writeField(myChannelNumber, 8, dataStruct.gz, myWriteAPIKey);
            Serial.print("send to ch1 f8: ");
            Serial.println(dataStruct.gz);
            delay(60000);
            digitalWrite(BUILTIN_LED, HIGH);
            ThingSpeak.writeField(myChannelNumber2, 1, dataStruct.batt, myWriteAPIKey2);
            Serial.print("send to ch1 f8: ");
            Serial.println(dataStruct.batt);
            delay(60000);
            digitalWrite(BUILTIN_LED, LOW);
            esp_now_register_recv_cb(OnDataRecv);
        }

    }
}