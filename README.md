# 🌿 PlantDoc+ | AI Plant Monitoring & Disease Identification

PlantDoc+ is an open-source AI + IoT platform that combines **real-time plant monitoring** with **AI-powered plant disease identification**.

Using ESP8266 sensors, Firebase Realtime Database, and the Plant.id API, PlantDoc+ continuously monitors environmental conditions and helps users identify plant diseases from leaf images with treatment recommendations.

> Smart Agriculture • IoT • Artificial Intelligence • Open Source

---

## ✨ Key Features

### 🌡️ IoT Smart Monitoring

- Real-time Temperature Monitoring
- Soil Moisture Detection
- Humidity Monitoring
- Water Pump ON/OFF Control
- Custom Threshold Configuration
- Automatic Threshold Alerts (15-second interval)
- Live Sensor History Graphs
- Firebase Realtime Synchronization

### 🌿 AI Disease Identification

- Plant Species Recognition
- Leaf Disease Detection
- Disease Confidence Score
- AI Treatment Suggestions
- Plant Health Analysis
- Powered by **Plant.id API Kit**

---

## 🖥️ System Architecture

```text
        Leaf Image
             │
             ▼
      Plant.id API
             │
 Disease + Treatment
             │
             ▼
        Next.js Dashboard

ESP8266 ──► Firebase RTDB ──► Live Monitoring Dashboard
  │
  ├── Temperature
  ├── Humidity
  ├── Soil Moisture
  └── Pump Status
```

---

## 🛠️ Tech Stack

| Technology           | Purpose                    |
| -------------------- | -------------------------- |
| Next.js 15           | Frontend                   |
| TypeScript           | Development                |
| Tailwind CSS         | UI/UX                      |
| Firebase RTDB        | Real-time Database         |
| ESP8266 NodeMCU      | IoT Controller             |
| Chart.js             | Live Sensor Graphs         |
| **Plant.id API Kit** | AI Plant Disease Detection |

---

## 🌿 AI Disease Detection Workflow

1. Upload a leaf image.
2. Image is securely sent to the **Plant.id API**.
3. AI identifies the plant species.
4. Disease is detected with confidence score.
5. Treatment and care recommendations are displayed.
6. Results are shown instantly in the dashboard.

---

## 📂 Project Structure

```text
PlantDoc+
│
├── app/
│   ├── monitor/          # Live IoT Dashboard
│   ├── detection/        # AI Disease Detection
│   ├── dashboard/
│   └── about/
│
├── components/
├── lib/
├── firebase/
├── esp8266/
├── public/
└── README.md
```

---

## ⚙️ Hardware Components

- ESP8266 NodeMCU
- DHT11 Temperature & Humidity Sensor
- Soil Moisture Sensor
- SSD1306 OLED Display (128×64)
- Relay Module
- Active Buzzer
- Water Pump
- Push Buttons
- 5V Power Supply

---

## 📶 First-Time ESP8266 WiFi Setup

After uploading the firmware, the ESP8266 creates its own WiFi hotspot using **WiFiManager**.

### Steps

1. Upload the firmware to the ESP8266 NodeMCU.
2. Power on the device.
3. Open WiFi settings on your phone or laptop.
4. Connect to the hotspot named **PlantDoc**.
5. If the configuration page doesn't open automatically, visit **192.168.4.1**.
6. Select your home WiFi network.
7. Enter the WiFi password.
8. Click **Save & Connect**.
9. The device will restart and begin sending live data to Firebase.

> **Important:** ESP8266 supports **2.4 GHz WiFi only**. 5 GHz networks are not supported.

---

## 🚀 Installation

```bash
git clone https://github.com/yourusername/PlantDoc.git
cd PlantDoc
npm install
npm run dev
```

Create `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY
NEXT_PUBLIC_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL

PLANT_ID_API_KEY=YOUR_PLANT_ID_API_KEY
```

---

## 🔥 Firebase Database

```json
{
  "temperature": 28.5,
  "humidity": 71,
  "soil_moisture": 40,
  "pump_status": "OFF",
  "temperature_threshold": {
    "min": 18,
    "max": 28
  }
}
```

---

## 🗺️ Roadmap

- [x] ESP8266 Live Monitoring
- [x] Firebase Realtime Dashboard
- [x] AI Plant Disease Identification
- [x] Smart Irrigation Control
- [ ] Push Notifications
- [ ] Multiple Plant Profiles
- [ ] Weather Forecast Integration
- [ ] AI Growth Prediction

---

## 🤝 Contributing

We welcome contributions from developers, IoT enthusiasts, and AI researchers.

1. Fork this repository
2. Create your feature branch
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

- 📶 Automatic WiFi provisioning using WiFiManager
- ☁️ Firebase Realtime Database integration
- 🌡️ Real-time temperature & humidity monitoring
- 🌱 Soil moisture monitoring with smart irrigation
- 🔔 Configurable temperature alerts with buzzer
- 🖥️ OLED display for live sensor data
- 🔍 AI Plant Disease Identification using Plant.id API Kit

## 👨‍💻 Author

**Ayush Srivastava**
If you like this project, don't forget to ⭐ star the repository!
