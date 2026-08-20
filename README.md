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

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Frontend |
| TypeScript | Development |
| Tailwind CSS | UI/UX |
| Firebase RTDB | Real-time Database |
| ESP8266 NodeMCU | IoT Controller |
| Chart.js | Live Sensor Graphs |
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
- DHT11/DHT22 Sensor
- Soil Moisture Sensor
- Relay Module
- Water Pump
- Power Supply

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

## 👨‍💻 Author

**Ayush Srivastava**
If you like this project, don't forget to ⭐ star the repository!
