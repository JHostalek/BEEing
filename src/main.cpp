#include "Arduino.h"
#include <WiFi.h>
#include <ThingSpeak.h>
#include "WiFiClient.h"

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


// Replace with your network credentials (STATION)
char *ssidStation = ":(";
const char *passwordStation = "soulknight";

unsigned long myChannelNumber = 829059;
const char *myWriteAPIKey = "4OL312MW06WZDDI3";

//Receiver Code

char str[4];

void setup() {
//    pinMode(2, OUTPUT);
//    digitalWrite(2, HIGH);
    Serial.begin(115200);
    Serial1.begin(115200);

//    WiFi.begin(ssidStation, passwordStation);
//    Serial.println("Connectiong to wifi...");
//    long long oldTime = millis();
//    while (WiFi.status() != WL_CONNECTED) {
//        if (millis() - oldTime > 10000) {
//            Serial.println("Connection FAILED!... RESTARTING...");
//            //ESP.restart();
//        }
//    }
    Serial.println("Setup DONE");
}

void loop() {
    if (Serial1.available()) {
        char* dp = (char*) &dataStruct;
        for (int i = 0; i < sizeof(dataStruct); i++) *dp++ = Serial1.read();
        printAll();
    }

//    unsigned long uBufSize = sizeof(dataStruct);
//    char pBuffer[uBufSize];
//
//    memcpy(pBuffer, &dataStruct, uBufSize);
//    for(int i = 0; i<uBufSize;i++) {
//        Serial.print(pBuffer[i]);
//    }
//    Serial.println();
    // if (millis() % 50000 == 0) {
//        ThingSpeak.writeField(myChannelNumber, 1, dataStruct.Tmp1, myWriteAPIKey);
//        Serial.print("send to channel 1 : ");
//        Serial.println(dataStruct.Tmp1);
//    }

}