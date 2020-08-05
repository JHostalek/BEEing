#include <esp_now.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <ThingSpeak.h>

unsigned long myChannelNumber = 829059;
const char* myWriteAPIKey = "4OL312MW06WZDDI3";
//const char* ssid = ":("; // the ssid/name of the wifi, the esp will be connected to
//const char* password = "soulknight"; // the password of that wifi
//WiFiClient client;

// Replace with your network credentials (STATION)
const char* ssidStation = ":(";
const char* passwordStation = "soulknight";

// ACCESS POINT credentials
const char* ssidAP = ":)";
const char* passwordAP = "soulknight";

#define CHANNEL 1

long long oldTime = millis();

//#define CHANNEL 1

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

// Init ESP Now with fallback
void InitESPNow() {
    WiFi.disconnect();
    if (esp_now_init() == ESP_OK) {
        Serial.println("ESPNow Init Success");
    }
    else {
        Serial.println("ESPNow Init Failed");
        // Retry InitESPNow, add a counte and then restart?
        // InitESPNow();
        // or Simply Restart
        ESP.restart();
    }
}

// config AP SSID
void configDeviceAP() {
    const char *SSID = ":)";
    bool result = WiFi.softAP(SSID, "soulknight", CHANNEL, 0);
    if (!result) {
        Serial.println("AP Config failed.");
    } else {
        Serial.println("AP Config Success. Broadcasting with AP: " + String(SSID));
    }
}

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
// callback when data is recv from Master
void OnDataRecv(const uint8_t *mac_addr, const uint8_t *data, int data_len) {
    char macStr[18];
    snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
             mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
    Serial.print("Last Packet Recv from: "); Serial.println(macStr);
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
    printAll();
    Serial.println("");
    if (Serial2.available()){
        Serial.println("Sending data via serial...");
        const char* dp = (const char*) &dataStruct;
        for (int i = 0; i < sizeof(dataStruct); i++) Serial2.write(*dp++);
    }
    Serial.println("-----DONE-----");
}


void setup() {


//    WiFi.begin(ssid, password);
//    long long oldTime = millis();
//    Serial.println("Connecting to wifi...");
//    while (WiFi.status() != WL_CONNECTED) {
//        if(millis()-oldTime > 10000){\
//            Serial.println("Connecting FAILED!... RESTARTING");
//            ESP.restart();
//        }
//    }
//    Serial.println("WiFi connected");
//    Serial.println("IP address: ");
//    Serial.println(WiFi.localIP());
//
//    //ThingSpeak.begin(client);

    Serial.begin(115200);
    Serial2.begin(115200);
    Serial.println("THIS DEVICE IS SERVER - ESPNow");
    //Set device in AP mode to begin with
    WiFi.mode(WIFI_AP);
    // configure device AP mode
    configDeviceAP();
    // This is the mac address of the Slave in AP Mode
    Serial.print("AP MAC: "); Serial.println(WiFi.softAPmacAddress());
    // Init ESPNow with a fallback logic
    InitESPNow();
    // Once ESPNow is successfully Init, we will register for recv CB to
    // get recv packer info.
    esp_now_register_recv_cb(OnDataRecv);


}

void loop() {

}