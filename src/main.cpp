#include "Adafruit_BMP280.h"
#include <Arduino.h>
#include <Wire.h>
#include "arduinoFFT.h"
#include "WiFi.h"
#include "esp_now.h"
#include "MPU6050.h"

#include <driver/adc.h>
#include <esp_wifi.h>

/**
 * MPU is GYROSKOPE and ACCELEROMETER device
 */
MPU6050 mpu;


// Global copy of slave
esp_now_peer_info_t slave;
#define CHANNEL 1

//if true, prints wifi scan results - aka ssids of near networks
#define PRINTSCANRESULTS 1
//if true, deletes last used peer
#define DELETEBEFOREPAIR 1

#define MICROPHONE_PIN 34

#define us_TO_min_FACTOR 60000000 // ONE MINUTE
#define TIME_TO_SLEEP 1 // in MINUTES

//how many times should values be read - used for approximation
#define AUDIO_READ_ITERATIONS 1
#define TEMPERATURE_READ_ITERATIONS 10

//same data structure as masters's - used for ESPNow data transfer
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
 * TEMPERATURE sensor
 */
Adafruit_BMP280 bmp;  // I2C

/**
 * AUDIO VARIABLES
 */
arduinoFFT FFT = arduinoFFT();
#define SAMPLES 512               // Must be a power of 2
#define SAMPLING_FREQUENCY 40000  // Hz, must be 40000 or less due to ADC conversion time. Determines \
                                  // maximum frequency that can be analysed by the FFT Fmax=sampleF/2.
#define amplitude 200             // Depending on your audio source level, you may need to increase this \
                                  // value
unsigned int sampling_period_us;
unsigned long microseconds;
byte peak[] = {0, 0, 0, 0, 0, 0, 0};
double vReal[SAMPLES];
double vImag[SAMPLES];
unsigned long audioNewTime = 0;
unsigned long audioOldTime = 0;
float audioSum = 0;
int audioSamples = 1;
int audioPartialSum = 0;

/**
 * print out wakeup reason (from deepsleep)
 */
void print_wakeup_reason() {
    esp_sleep_wakeup_cause_t wakeup_reason;

    wakeup_reason = esp_sleep_get_wakeup_cause();

    switch (wakeup_reason) {
        case ESP_SLEEP_WAKEUP_EXT0 :
            Serial.println("Wakeup caused by external signal using RTC_IO");
            break;
        case ESP_SLEEP_WAKEUP_EXT1 :
            Serial.println("Wakeup caused by external signal using RTC_CNTL");
            break;
        case ESP_SLEEP_WAKEUP_TIMER :
            Serial.println("Wakeup caused by timer");
            break;
        case ESP_SLEEP_WAKEUP_TOUCHPAD :
            Serial.println("Wakeup caused by touchpad");
            break;
        case ESP_SLEEP_WAKEUP_ULP :
            Serial.println("Wakeup caused by ULP program");
            break;
        default :
            Serial.printf("Wakeup was not caused by deep sleep: %d\n", wakeup_reason);
            break;
    }
}

/**
 * Init ESP Now with fallback
 */
void InitESPNow() {
    //WiFi.disconnect();
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
 * Scan for slaves in AP mode
 */
void ScanForSlave() {
    int8_t scanResults = WiFi.scanNetworks();
    // reset on each scan
    bool slaveFound = 0;
    memset(&slave, 0, sizeof(slave));

    Serial.println("");
    if (scanResults == 0) {
        Serial.println("No WiFi devices in AP Mode found");
    } else {
        Serial.print("Found ");
        Serial.print(scanResults);
        Serial.println(" devices ");
        for (int i = 0; i < scanResults; ++i) {
            // Print SSID and RSSI for each device found
            String SSID = WiFi.SSID(i);
            int32_t RSSI = WiFi.RSSI(i);
            String BSSIDstr = WiFi.BSSIDstr(i);

            if (PRINTSCANRESULTS) {
                Serial.print(i + 1);
                Serial.print(": ");
                Serial.print(SSID);
                Serial.print(" (");
                Serial.print(RSSI);
                Serial.print(")");
                Serial.println("");
            }
            delay(10);
            // Check if the current device starts with `Slave`
            if (SSID.indexOf(":)") == 0) {
                // SSID of interest
                Serial.println("Found a Slave.");
                Serial.print(i + 1);
                Serial.print(": ");
                Serial.print(SSID);
                Serial.print(" [");
                Serial.print(BSSIDstr);
                Serial.print("]");
                Serial.print(" (");
                Serial.print(RSSI);
                Serial.print(")");
                Serial.println("");
                // Get BSSID => Mac Address of the Slave
                int mac[6];
                if (6 == sscanf(BSSIDstr.c_str(), "%x:%x:%x:%x:%x:%x", &mac[0], &mac[1], &mac[2], &mac[3], &mac[4], &mac[5])) {
                    for (int ii = 0; ii < 6; ++ii) {
                        slave.peer_addr[ii] = (uint8_t) mac[ii];
                    }
                }

                slave.channel = CHANNEL; // pick a channel
                slave.encrypt = 0; // no encryption

                slaveFound = 1;
                // we are planning to have only one slave in this example;
                // Hence, break after we find one, to be a bit efficient
                break;
            }
        }
    }

    if (slaveFound) {
        Serial.println("Slave Found, processing..");
    } else {
        Serial.println("Slave Not Found, trying again.");
    }

    // clean up ram
    WiFi.scanDelete();
}

/**
 * deletes last peer
 */
void deletePeer() {
    esp_err_t delStatus = esp_now_del_peer(slave.peer_addr);
    Serial.print("Slave Delete Status: ");
    if (delStatus == ESP_OK) {
        // Delete success
        Serial.println("Success");
    } else if (delStatus == ESP_ERR_ESPNOW_NOT_INIT) {
        // How did we get so far!!
        Serial.println("ESPNOW Not Init");
    } else if (delStatus == ESP_ERR_ESPNOW_ARG) {
        Serial.println("Invalid Argument");
    } else if (delStatus == ESP_ERR_ESPNOW_NOT_FOUND) {
        Serial.println("Peer not found.");
    } else {
        Serial.println("Not sure what happened");
    }
}

/**
 * Check if the slave is already paired with the master.
 * If not, pair the slave with master
 * @return TRUE if successful
 */
bool manageSlave() {
    if (slave.channel == CHANNEL) {
        if (DELETEBEFOREPAIR) {
            deletePeer();
        }
        Serial.print("Slave Status: ");
        // check if the peer exists
        bool exists = esp_now_is_peer_exist(slave.peer_addr);
        if (exists) {
            // Slave already paired.
            Serial.println("Already Paired");
            return true;
        } else {
            // Slave not paired, attempt pair
            esp_err_t addStatus = esp_now_add_peer(&slave);
            if (addStatus == ESP_OK) {
                // Pair success
                Serial.println("Pair success");
                return true;
            } else if (addStatus == ESP_ERR_ESPNOW_NOT_INIT) {
                // How did we get so far!!
                Serial.println("ESPNOW Not Init");
                return false;
            } else if (addStatus == ESP_ERR_ESPNOW_ARG) {
                Serial.println("Invalid Argument");
                return false;
            } else if (addStatus == ESP_ERR_ESPNOW_FULL) {
                Serial.println("Peer list full");
                return false;
            } else if (addStatus == ESP_ERR_ESPNOW_NO_MEM) {
                Serial.println("Out of memory");
                return false;
            } else if (addStatus == ESP_ERR_ESPNOW_EXIST) {
                Serial.println("Peer Exists");
                return true;
            } else {
                Serial.println("Not sure what happened");
                return false;
            }
        }
    } else {
        // No slave found to process
        Serial.println("No Slave found to process");
        return false;
    }
}

// send data
void sendData() {
    const uint8_t *peer_addr = slave.peer_addr;
    Serial.print("Sending: ");
    esp_err_t result = esp_now_send(peer_addr, (uint8_t *) &data, sizeof(data));
    Serial.print("Send Status: ");
    if (result == ESP_OK) {
        Serial.println("Success");
    } else if (result == ESP_ERR_ESPNOW_NOT_INIT) {
        // How did we get so far!!
        Serial.println("ESPNOW not Init.");
    } else if (result == ESP_ERR_ESPNOW_ARG) {
        Serial.println("Invalid Argument");
    } else if (result == ESP_ERR_ESPNOW_INTERNAL) {
        Serial.println("Internal Error");
    } else if (result == ESP_ERR_ESPNOW_NO_MEM) {
        Serial.println("ESP_ERR_ESPNOW_NO_MEM");
    } else if (result == ESP_ERR_ESPNOW_NOT_FOUND) {
        Serial.println("Peer not found.");
    } else {
        Serial.println("Not sure what happened");
    }
}

// callback when data is sent from Master to Slave
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
    char macStr[18];
    snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
             mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
    Serial.print("Last Packet Sent to: ");
    Serial.println(macStr);
    Serial.print("Last Packet Send Status: ");
    Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}


/**
 * reads audio level from pin specified above
 */
void readAudio() {
    for (byte iterations = 0; iterations < AUDIO_READ_ITERATIONS; iterations++) {
        for (int i = 0; i < SAMPLES; i++) {
            audioNewTime = micros() - audioOldTime;
            audioOldTime = audioNewTime;
            vReal[i] = analogRead(MICROPHONE_PIN);
            vImag[i] = 0;
            while (micros() < (audioNewTime + sampling_period_us)) {
            }
        }
        FFT.Windowing(vReal, SAMPLES, FFT_WIN_TYP_HAMMING, FFT_FORWARD);
        FFT.Compute(vReal, vImag, SAMPLES, FFT_FORWARD);
        FFT.ComplexToMagnitude(vReal, vImag, SAMPLES);

        for (int i = 2; i < (SAMPLES / 2); i++) {
            if (vReal[i] > 2000) {
                //Serial.println((int) vReal[i] / amplitude);  // 125Hz
                audioPartialSum += (int) vReal[i] / amplitude;
                audioSamples++;
            }
        }
        data.audio = (float) audioPartialSum / (float) audioSamples;
        audioSamples = 1;
        audioPartialSum = 0;
    }
//    data.audio = audioSum / AUDIO_READ_ITERATIONS;
//    audioSum = 0;

}


void readTemperature() {
    float tempSum = 0;
    for (byte i = 0; i < TEMPERATURE_READ_ITERATIONS; i++) {
        tempSum += bmp.readTemperature();
        Serial.print("READING TEMPERATURE ");
        Serial.print(i);
        Serial.println(" iteration...");
        delay(1000);
    }
    data.temperature = tempSum / TEMPERATURE_READ_ITERATIONS;
}

/**
 * reading only immediate value is ok
 */
void readGyro() {
    mpu.getMotion6(&data.ax, &data.ay, &data.az, &data.gx, &data.gy, &data.gz);
    data.ax = map(data.ax, -18000, 18000, 63, 0);
    data.ay = map(data.ay, -18000, 18000, 127, 0);
    data.az = map(data.az, -18000, 18000, 0, 180);
    data.gx = map(data.gx, -18000, 18000, 0, 180);
    data.gy = map(data.gy, -18000, 18000, 0, 180);
    data.gz = map(data.gz, -18000, 18000, 0, 180);
}

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
    Serial.print(" | TEMPERATURE: ");
    Serial.println(data.temperature);
    Serial.print(" | BATTERY: ");
    Serial.println(data.battery);
}

float readBattery() {
    //2.75
    //3.01
    //read battery voltage per %
    long sum = 0;                  // sum of samples taken
    float voltage = 0.0;           // calculated voltage
    float output = 0.0;            //output value
    const float battery_max = 3.2; //maximum voltage of battery
    const float battery_min = 2.5; //minimum voltage of battery before shutdown

    float R1 = 10000.0; // resistance of R1 (100K)
    float R2 = 100000.0;  // resistance of R2 (10K)

    for (int i = 0; i < 500; i++) {
        sum += adc1_get_voltage(ADC1_CHANNEL_7);
        delayMicroseconds(1000);
    }
    // calculate the voltage
    voltage = sum / (float) 500;
    voltage = (voltage * (float) 3.0) / (float) 4096.0; //for internal 1.1v reference
    // use if added divider circuit
    voltage = voltage / (R2 / (R1 + R2));
    //round value by two precision
    voltage = roundf(voltage * 100) / 100;
    return (float) voltage;
}

void prepareDataToSend() {
    readAudio();
    readTemperature();
    readGyro();
    readBattery();
}

void setupAudio() {
    sampling_period_us = round(1000000 * (1.0 / SAMPLING_FREQUENCY));
}

void setupBMP() {
    if (!bmp.begin()) {
        Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
        delay(5000);
        ESP.restart();
    }
}

void setupGyro() {
    Wire.begin();
    Serial.println("Initialize MPU");
    mpu.initialize();
    Serial.println(mpu.testConnection() ? "Connected" : "Connection failed");
}

void setup() {
    Serial.begin(115200);

    print_wakeup_reason();
    esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * us_TO_min_FACTOR);
    Serial.println("Setup ESP32 to sleep for every " + String(TIME_TO_SLEEP) +
                   " Minutes");

    setupBMP();
    setupAudio();
    setupGyro();

    uint8_t primaryChan = CHANNEL;
    wifi_second_chan_t secondChan = WIFI_SECOND_CHAN_NONE;
    esp_wifi_set_channel(primaryChan, secondChan);


    //Set device in STA mode to begin with
    WiFi.mode(WIFI_STA);
    Serial.println("ESPNow/Basic/Master Example");
    // This is the mac address of the Master in Station Mode
    Serial.print("STA MAC: ");
    Serial.println(WiFi.macAddress());
    // Init ESPNow with a fallback logic
    InitESPNow();
//  Once ESPNow is successfully Init, we will register for Send CB to
//  get the status of Trasnmitted packet
    esp_now_register_send_cb(OnDataSent);
    adc1_config_width(ADC_WIDTH_12Bit);
    adc1_config_channel_atten(ADC1_CHANNEL_7, ADC_ATTEN_DB_11); //set reference voltage to internal
}

void loop() {
    readAudio();
    Serial.println(data.audio);
//    prepareDataToSend();
//    printAll();
//    ScanForSlave();
//    // If Slave is found, it would be populate in `slave` variable
//    // We will check if `slave` is defined and then we proceed further
//    if (slave.channel == CHANNEL) { // check if slave channel is defined
//        // `slave` is defined
//        // Add slave as peer if it has not been added already
//        bool isPaired = manageSlave();
//        if (isPaired) {
//            // pair success or already paired
//            // Send data to device
//            sendData();
//        } else {
//            // slave pair failed
//            Serial.println("Slave pair failed!");
//        }
//    } else {
//        // No slave found to process
//    }
//
//    Serial.println("Going to sleep now...");
//    delay(1000);
//
//    Serial.flush();
//
//    esp_deep_sleep_start();
}