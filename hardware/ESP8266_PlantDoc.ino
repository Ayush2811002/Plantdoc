// FINAL PlantPulse - OLED eyes + DHT11 + Soil + Relay + Firebase + Buzzer + Button
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>
#include <Firebase_ESP_Client.h>
#include "DHT.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ---------------- OLED ----------------
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#define SCREEN_ADDRESS 0x3C

// ---------------- Sensors & Pins ----------------
#define DHTPIN D4
#define DHTTYPE DHT11   // 🔁 CHANGED: DHT22 -> DHT11
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_PIN A0
#define RELAY_PIN D1
#define LED_PIN D5

// Buttons
#define WIFI_RESET_BTN D0   // Press to reset WiFi (clears WiFiManager credentials)
#define DISPLAY_BTN D7     // Press to show sensor data temporarily

// Buzzer
#define BUZZER_PIN D6      // Active buzzer (use tone/noTone)

// Firebase config (put your API_KEY & DB URL)
#define API_KEY ""
#define DATABASE_URL ""
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;

#define SOIL_THRESHOLD 30
#define MODE_STATUS_PATH "/mode_status"
#define PUMP_STATUS_PATH "/pump_status"

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// ---------------- Eye animation variables (copied from your animation) ----------------
int demo_mode = 1;
static const int max_animation_index = 8;
int current_animation_index = 0;

int ref_eye_height = 40;
int ref_eye_width = 40;
int ref_space_between_eye = 10;
int ref_corner_radius = 10;

int left_eye_height = ref_eye_height;
int left_eye_width = ref_eye_width;
int left_eye_x = 32;
int left_eye_y = 32;
int right_eye_x = 32 + ref_eye_width + ref_space_between_eye;
int right_eye_y = 32;
int right_eye_height = ref_eye_height;
int right_eye_width = ref_eye_width;

// ---------------- Forward declarations ----------------
void draw_eyes(bool update=true);
void center_eyes(bool update=true);
void blink(int speed=12);
void sleep_eyes();
void wakeup();
void happy_eye();
void saccade(int direction_x, int direction_y);
void move_big_eye(int direction);
void move_right_big_eye();
void move_left_big_eye();
void launch_animation_with_index(int animation_index);
int getSoilMoisture();
void showSensorData(float t, float h, float s, bool showPump, bool showMode);
void playHappyBirthday();
void beepShort();
void showPlantBootAnimation();  // 🌱 NEW

// ---------------- Implementation: Eye animation ----------------
void draw_eyes(bool update) {
  display.clearDisplay();
  int x = int(left_eye_x - left_eye_width/2);
  int y = int(left_eye_y - left_eye_height/2);
  display.fillRoundRect(x, y, left_eye_width, left_eye_height, ref_corner_radius, SSD1306_WHITE);
  x = int(right_eye_x - right_eye_width/2);
  y = int(right_eye_y - right_eye_height/2);
  display.fillRoundRect(x, y, right_eye_width, right_eye_height, ref_corner_radius, SSD1306_WHITE);
  if(update) display.display();
}

void center_eyes(bool update) {
  left_eye_height = ref_eye_height;
  left_eye_width = ref_eye_width;
  right_eye_height = ref_eye_height;
  right_eye_width = ref_eye_width;

  left_eye_x = SCREEN_WIDTH/2 - ref_eye_width/2 - ref_space_between_eye/2;
  left_eye_y = SCREEN_HEIGHT/2;
  right_eye_x = SCREEN_WIDTH/2 + ref_eye_width/2 + ref_space_between_eye/2;
  right_eye_y = SCREEN_HEIGHT/2;

  draw_eyes(update);
}

void blink(int speed) {
  draw_eyes();
  for(int i=0;i<3;i++){ left_eye_height -= speed; right_eye_height -= speed; draw_eyes(); delay(1); }
  for(int i=0;i<3;i++){ left_eye_height += speed; right_eye_height += speed; draw_eyes(); delay(1); }
}

void sleep_eyes() {
  left_eye_height = 2;
  right_eye_height = 2;
  draw_eyes(true);
}
void wakeup() {
  sleep_eyes();
  for(int h=0; h <= ref_eye_height; h += 2) {
    left_eye_height = h; right_eye_height = h;
    draw_eyes(true);
  }
}

void happy_eye() {
  center_eyes(false);
  int offset = ref_eye_height/2;
  for(int i=0;i<10;i++) {
    display.fillTriangle(left_eye_x-left_eye_width/2-1, left_eye_y+offset, left_eye_x+left_eye_width/2+1, left_eye_y+5+offset, left_eye_x-left_eye_width/2-1,left_eye_y+left_eye_height+offset,SSD1306_BLACK);
    display.fillTriangle(right_eye_x+right_eye_width/2+1, right_eye_y+offset, right_eye_x-left_eye_width/2-1, right_eye_y+5+offset, right_eye_x+right_eye_width/2+1,right_eye_y+right_eye_height+offset,SSD1306_BLACK);
    offset -= 2;
    display.display();
    delay(1);
  }
  display.display();
  delay(1000);
}

void saccade(int direction_x, int direction_y) {
  int direction_x_movement_amplitude = 8;
  int direction_y_movement_amplitude = 6;
  int blink_amplitude = 8;

  left_eye_x += direction_x_movement_amplitude * direction_x;
  right_eye_x += direction_x_movement_amplitude * direction_x;
  left_eye_y += direction_y_movement_amplitude * direction_y;
  right_eye_y += direction_y_movement_amplitude * direction_y;
  right_eye_height -= blink_amplitude;
  left_eye_height -= blink_amplitude;
  draw_eyes();
  delay(1);

  left_eye_x += direction_x_movement_amplitude * direction_x;
  right_eye_x += direction_x_movement_amplitude * direction_x;
  left_eye_y += direction_y_movement_amplitude * direction_y;
  right_eye_y += direction_y_movement_amplitude * direction_y;
  right_eye_height += blink_amplitude;
  left_eye_height += blink_amplitude;
  draw_eyes();
  delay(1);
}

void move_big_eye(int direction) {
  int direction_oversize = 1;
  int direction_movement_amplitude = 2;
  int blink_amplitude = 5;

  for(int i=0;i<3;i++){
    left_eye_x += direction_movement_amplitude * direction;
    right_eye_x += direction_movement_amplitude * direction;
    right_eye_height -= blink_amplitude; left_eye_height -= blink_amplitude;
    if(direction>0){ right_eye_height += direction_oversize; right_eye_width += direction_oversize; }
    else { left_eye_height += direction_oversize; left_eye_width += direction_oversize; }
    draw_eyes(); delay(1);
  }
  for(int i=0;i<3;i++){
    left_eye_x += direction_movement_amplitude * direction;
    right_eye_x += direction_movement_amplitude * direction;
    right_eye_height += blink_amplitude; left_eye_height += blink_amplitude;
    if(direction>0){ right_eye_height += direction_oversize; right_eye_width += direction_oversize; }
    else { left_eye_height += direction_oversize; left_eye_width += direction_oversize; }
    draw_eyes(); delay(1);
  }

  delay(1000);

  for(int i=0;i<3;i++){
    left_eye_x -= direction_movement_amplitude * direction;
    right_eye_x -= direction_movement_amplitude * direction;
    right_eye_height -= blink_amplitude; left_eye_height -= blink_amplitude;
    if(direction>0){ right_eye_height -= direction_oversize; right_eye_width -= direction_oversize; }
    else { left_eye_height -= direction_oversize; left_eye_width -= direction_oversize; }
    draw_eyes(); delay(1);
  }
  for(int i=0;i<3;i++){
    left_eye_x -= direction_movement_amplitude * direction;
    right_eye_x -= direction_movement_amplitude * direction;
    right_eye_height += blink_amplitude; left_eye_height += blink_amplitude;
    if(direction>0){ right_eye_height -= direction_oversize; right_eye_width -= direction_oversize; }
    else { left_eye_height -= direction_oversize; left_eye_width -= direction_oversize; }
    draw_eyes(); delay(1);
  }
  center_eyes();
}

void move_right_big_eye(){ move_big_eye(1); }
void move_left_big_eye(){ move_big_eye(-1); }

void launch_animation_with_index(int animation_index) {
  if(animation_index > max_animation_index) animation_index = 8;
  switch(animation_index) {
    case 0: wakeup(); break;
    case 1: center_eyes(true); break;
    case 2: move_right_big_eye(); break;
    case 3: move_left_big_eye(); break;
    case 4: blink(10); break;
    case 5: blink(20); break;
    case 6: happy_eye(); break;
    case 7: sleep_eyes(); break;
    case 8:
      center_eyes(true);
      for(int i=0;i<20;i++){
        int dir_x = random(-1,2);
        int dir_y = random(-1,2);
        saccade(dir_x,dir_y);
        delay(1);
        saccade(-dir_x,-dir_y);
        delay(1);
      }
      break;
  }
}

// ---------------- Utility: Soil reading averaged ----------------
int getSoilMoisture() {
  long sum = 0;
  for (int i = 0; i < 10; i++) { sum += analogRead(SOIL_PIN); delay(5); }
  return sum / 10;
}

// ---------------- Display sensor data ----------------
void showSensorData(float t, float h, float s, bool showPump=true, bool showMode=true) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(0, 0);
  display.print("Temp: ");
  display.print(t, 1);
  display.println(" C");

  display.setCursor(0, 15);
  display.print("Hum : ");
  display.print(h, 1);
  display.println(" %");

  display.setCursor(0, 30);
  display.print("Soil: ");
  display.print(s, 1);
  display.println(" %");

  // show pump state from pin if requested
  if(showPump) {
    display.setCursor(0, 45);
    display.print("Pump: ");
    display.println(digitalRead(RELAY_PIN) ? "ON" : "OFF");
  }

  display.display();
}

// ---------------- Buzzer: short beep & Happy Birthday ----------------
void beepShort() {
  tone(BUZZER_PIN, 1200, 180);
  delay(220);
  noTone(BUZZER_PIN);
}

void playHappyBirthday() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(18, 20);
  display.println("WiFi Connected!");
  display.display();

  // Beep Beep Beep
  for (int i = 0; i < 3; i++) {
    tone(BUZZER_PIN, 1200);
    delay(180);
    noTone(BUZZER_PIN);
    delay(120);
  }
}

// ---------------- 🌱 Plant boot animation ----------------
void showPlantBootAnimation() {
  display.clearDisplay();

  // Ground
  display.drawLine(0, 50, 127, 50, SSD1306_WHITE);

  // Pot
  display.drawRect(54, 40, 20, 10, SSD1306_WHITE);
  display.fillRect(56, 42, 16, 6, SSD1306_WHITE);

  // Stem
  display.drawLine(64, 40, 64, 20, SSD1306_WHITE);

  // Leaves
  display.drawCircle(58, 24, 4, SSD1306_WHITE);
  display.drawCircle(70, 24, 4, SSD1306_WHITE);

  // Text
  display.setTextSize(1);
  display.setCursor(22, 4);
  display.println("PlantPulse");
  display.setCursor(30, 14);
  display.println("is waking up...");
  display.display();
  delay(1500);
}

// ---------------- Setup ----------------
void setup() {
  Serial.begin(115200);
  Serial.println("\nPlantPulse OLED + Sensors Booting...");

  // pins
  pinMode(SOIL_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(WIFI_RESET_BTN, INPUT_PULLUP); // high normally, low when pressed
  pinMode(DISPLAY_BTN, INPUT_PULLUP);    // high normally, low when pressed
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  // initialize i2c for OLED (SDA=D2, SCL=D3)
  Wire.begin(D2, D3);
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("SSD1306 allocation failed");
    while(true) delay(1000);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  // 🌱 Cute plant boot animation
  showPlantBootAnimation();

  display.clearDisplay();
  display.setCursor(0,10);
  display.println("🌿 PlantPulse Booting...");
  display.display();
  delay(1000);

  // WiFiManager
  WiFiManager wifiManager;
  if (!wifiManager.autoConnect("PlantPulse")) {
    Serial.println("WiFiManager connect failed; restarting...");
    ESP.reset();
    delay(1000);
  }
  Serial.println("WiFi connected");
  digitalWrite(LED_PIN, HIGH);

  // Play happy birthday once on connect and show message
  playHappyBirthday();
  display.clearDisplay();
  display.setCursor(10, 20);
  display.setTextSize(1);
  display.println("PlantPulse Ready!");
  display.display();
  delay(800);

  // Firebase setup
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase sign-up OK");
    signupOK = true;
  } else {
    Serial.printf("Firebase signup failed: %s\n", config.signer.signupError.message.c_str());
  }
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  dht.begin();
  delay(2000); // let DHT11 stabilize

  // start with eyes centered and sleeping briefly
  center_eyes(true);
  sleep_eyes();
  delay(600);
}

// ---------------- Loop ----------------
void loop() {
  // small delay for loop rhythm
  delay(200);

  // WiFi reset button (long/short press both act same here)
  if (digitalRead(WIFI_RESET_BTN) == LOW) {
    Serial.println("WiFi reset button pressed: clearing WiFi & rebooting");
    for (int i=0;i<6;i++){ digitalWrite(LED_PIN, HIGH); delay(150); digitalWrite(LED_PIN, LOW); delay(150); }
    WiFiManager wifiManager;
    wifiManager.resetSettings();
    ESP.reset();
    delay(1000);
  }

  // WiFi LED indicator
  if (WiFi.status() != WL_CONNECTED) { digitalWrite(LED_PIN, LOW); }
  else { digitalWrite(LED_PIN, HIGH); }

  // Read sensors
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int soilRaw = getSoilMoisture();
  float soilPercent = map(soilRaw, 810, 330, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);

  // If display button pressed: beep + show sensor data for 5s, then return to eyes animation
  if (digitalRead(DISPLAY_BTN) == LOW) {
    Serial.println("Display button pressed -> showing sensor data");
    beepShort();
    showSensorData(temperature, humidity, soilPercent, true, true);
    delay(5000);
    // after showing, return to eyes
    center_eyes(true);
    // small pause before animation resume
    delay(200);
  } else {
    // Idle: eye animation (simple loop: call animation indexes)
    if (demo_mode == 1) {
      launch_animation_with_index(current_animation_index++);
      if (current_animation_index > max_animation_index) current_animation_index = 0;
    } else {
      // If demo_mode changed, center eyes
      center_eyes(true);
    }
  }

  // Firebase update + pump control
  if (Firebase.ready() && signupOK) {
    Firebase.RTDB.setFloat(&fbdo, "/temperature", temperature);
    Firebase.RTDB.setFloat(&fbdo, "/humidity", humidity);
    Firebase.RTDB.setFloat(&fbdo, "/soil_moisture", soilPercent);

    String mode="";
    Firebase.RTDB.getString(&fbdo, MODE_STATUS_PATH);
    mode = fbdo.stringData();

    if (mode == "Auto Mode") {
      if (soilPercent < SOIL_THRESHOLD) {
        digitalWrite(RELAY_PIN, HIGH);
        Firebase.RTDB.setString(&fbdo, PUMP_STATUS_PATH, "ON");
      } else {
        digitalWrite(RELAY_PIN, LOW);
        Firebase.RTDB.setString(&fbdo, PUMP_STATUS_PATH, "OFF");
      }
    } else {
      // Manual mode -> read pump_status path
      Firebase.RTDB.getString(&fbdo, PUMP_STATUS_PATH);
      String pumpStat = fbdo.stringData();
      digitalWrite(RELAY_PIN, (pumpStat == "ON") ? HIGH : LOW);
    }
  } // end firebase ready

  // Serial log
  Serial.printf("Temp: %.2f C | Hum: %.2f %% | Soil: %.2f %% | Pump: %s\n",
                temperature, humidity, soilPercent,
                digitalRead(RELAY_PIN) ? "ON" : "OFF");
}
