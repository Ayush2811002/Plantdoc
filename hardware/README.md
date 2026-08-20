# ESP8266 Hardware Firmware

This folder contains the Arduino firmware for PlantDoc+.

## Components

- ESP8266 NodeMCU
- DHT11 Temperature & Humidity Sensor
- Soil Moisture Sensor
- SSD1306 OLED (128×64)
- Relay Module
- Active Buzzer
- Push Buttons

## Pin Configuration

| Component         | ESP8266 Pin |
| ----------------- | ----------- |
| DHT11             | D4          |
| Relay             | D1          |
| OLED SDA          | D2          |
| OLED SCL          | D3          |
| Buzzer            | D6          |
| Display Button    | D7          |
| WiFi Reset Button | D0          |
| Soil Sensor       | A0          |

## Upload

1. Install required libraries.
2. Add your Firebase credentials.
3. Select **NodeMCU 1.0 (ESP-12E Module)**.
4. Upload `ESP8266_PlantDoc.ino`.
