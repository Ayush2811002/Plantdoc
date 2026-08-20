"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, useRef } from "react";

import Swal from "sweetalert2";

import {
  Thermometer,
  Droplets,
  Sprout,
  Power,
  Activity,
  Bell,
  Settings,
  Search,
  ChevronDown,
  Save,
  Loader2,
} from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Chart.js imports
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// Plant list with thresholds
const plantList = [
  "Tulsi (Holy Basil)",
  "Money Plant",
  "Aloe Vera",
  "Snake Plant",
  "Peace Lily",
  "Areca Palm",
  "Lucky Bamboo",
  "Spider Plant",
  "Jade Plant",
  "Rubber Plant",
  "Croton",
  "Bonsai",
  "Hibiscus",
  "Rose",
  "Jasmine",
  "Marigold",
  "Chrysanthemum",
  "Bougainvillea",
  "Mogra",
  "Neem",
  "Curry Leaf Plant",
  "Lemongrass",
  "Mint",
  "Coriander",
  "Fenugreek",
  "Tomato Plant",
  "Chili Plant",
  "Brinjal Plant",
  "Okra Plant",
  "Spinach",
];

const plantThresholds: Record<
  string,
  {
    moisture: number;
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
  }
> = {
  "Tulsi (Holy Basil)": {
    moisture: 40,
    temperature: { min: 20, max: 30 },
    humidity: { min: 40, max: 60 },
  },
  "Money Plant": {
    moisture: 30,
    temperature: { min: 18, max: 28 },
    humidity: { min: 40, max: 70 },
  },
  "Aloe Vera": {
    moisture: 17,
    temperature: { min: 18, max: 27 },
    humidity: { min: 30, max: 50 },
  },
  "Snake Plant": {
    moisture: 30,
    temperature: { min: 16, max: 27 },
    humidity: { min: 40, max: 60 },
  },
  "Peace Lily": {
    moisture: 45,
    temperature: { min: 20, max: 28 },
    humidity: { min: 50, max: 70 },
  },
  "Areca Palm": {
    moisture: 40,
    temperature: { min: 20, max: 30 },
    humidity: { min: 50, max: 70 },
  },
  "Lucky Bamboo": {
    moisture: 50,
    temperature: { min: 18, max: 28 },
    humidity: { min: 50, max: 70 },
  },
  "Spider Plant": {
    moisture: 35,
    temperature: { min: 18, max: 28 },
    humidity: { min: 40, max: 60 },
  },
  "Jade Plant": {
    moisture: 30,
    temperature: { min: 18, max: 27 },
    humidity: { min: 30, max: 50 },
  },
  "Rubber Plant": {
    moisture: 35,
    temperature: { min: 18, max: 28 },
    humidity: { min: 40, max: 60 },
  },
};

// Firebase config

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function MonitorPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [soilMoisture, setSoilMoisture] = useState("--");
  const [pumpStatus, setPumpStatus] = useState("--");
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [moistureThreshold, setMoistureThreshold] = useState(30);
  const [tempMin, setTempMin] = useState(18);
  const [tempMax, setTempMax] = useState(28);
  const [humidityMin, setHumidityMin] = useState(40);
  const [humidityMax, setHumidityMax] = useState(60);
  const [selectedPlant, setSelectedPlant] = useState("Select your plant");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [pumpAlerts, setPumpAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const dbRef = useRef<any>(null);
  // Keep latest temperature thresholds available to Firebase listeners
  const tempMinRef = useRef(tempMin);
  const tempMaxRef = useRef(tempMax);

  // Prevent repeated alerts for the same condition
  // const temperatureAlertStateRef = useRef<"normal" | "low" | "high">("normal");

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    dbRef.current = db;

    // Set up Firebase listeners
    const humidityRef = ref(db, "/humidity");
    const temperatureRef = ref(db, "/temperature");
    const soilMoistureRef = ref(db, "/soil_moisture");
    const pumpStatusRef = ref(db, "/pump_status");
    const modeStatusRef = ref(db, "/mode_status");
    const thresholdRef = ref(db, "/soil_moisture_threshold");
    const tempThresholdRef = ref(db, "/temperature_threshold");

    // onValue(tempThresholdRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data) {
    //     setTempMin(data.min);
    //     setTempMax(data.max);
    //   }
    // });
    onValue(tempThresholdRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const min = Number(data.min);
        const max = Number(data.max);

        setTempMin(min);
        setTempMax(max);

        // Update refs with latest Firebase values
        tempMinRef.current = min;
        tempMaxRef.current = max;
      }
    });

    onValue(humidityRef, (snapshot) => {
      const v = snapshot.val();
      if (v !== null && !isNaN(v)) {
        setHumidity(`${v}`);
        setIsConnected(true);
        updateChart("humidity", v);
      }
    });

    // onValue(temperatureRef, (snapshot) => {
    //   const v = snapshot.val();
    //   if (v !== null && !isNaN(v)) {
    //     setTemperature(`${v}`);
    //     setIsConnected(true);
    //     updateChart("temperature", v);
    //   }
    // });
    onValue(temperatureRef, (snapshot) => {
      const v = snapshot.val();
      if (v !== null && !isNaN(v)) {
        const tempValue = Number(v);
        setTemperature(`${tempValue}`);
        setIsConnected(true);
        updateChart("temperature", tempValue);

        // 🔥 Temperature Alert Logic
        // if (tempValue < tempMin) {
        //   Swal.fire({
        //     icon: "warning",
        //     title: "Temperature Too Low!",
        //     text: `Current temperature (${tempValue}°C) is below your minimum threshold (${tempMin}°C).`,
        //     confirmButtonColor: "#16a34a",
        //   });
        // } else if (tempValue > tempMax) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Temperature Too High!",
        //     text: `Current temperature (${tempValue}°C) exceeds your maximum threshold (${tempMax}°C).`,
        //     confirmButtonColor: "#dc2626",
        //   });
        // }

        // 🔥 Temperature Alert Logic
        // 🔥 Temperature Alert Logic
        const currentMin = tempMinRef.current;
        const currentMax = tempMaxRef.current;

        // Show alert EVERY TIME temperature updates
        if (tempValue < currentMin) {
          Swal.fire({
            icon: "warning",
            title: "Temperature Too Low!",
            text: `Current temperature (${tempValue}°C) is below your minimum threshold (${currentMin}°C).`,
            confirmButtonColor: "#16a34a",
          });
        } else if (tempValue > currentMax) {
          Swal.fire({
            icon: "error",
            title: "Temperature Too High!",
            text: `Current temperature (${tempValue}°C) exceeds your maximum threshold (${currentMax}°C).`,
            confirmButtonColor: "#dc2626",
          });
        }
      }
    });

    onValue(soilMoistureRef, (snapshot) => {
      const v = snapshot.val();
      if (v !== null && !isNaN(v)) {
        setSoilMoisture(`${v}`);
        setIsConnected(true);
        updateChart("soil-moisture", v);
      }
    });

    onValue(pumpStatusRef, (snapshot) => {
      const v = snapshot.val();
      if (v === "ON" || v === "OFF") {
        setPumpStatus(v);
        setIsConnected(true);
      }
    });

    onValue(modeStatusRef, (snapshot) => {
      const mode = snapshot.val();
      if (mode) {
        setIsAutoMode(mode === "Auto Mode");
        setIsConnected(true);
      }
    });

    onValue(thresholdRef, (snapshot) => {
      const v = snapshot.val();
      if (v !== null && !isNaN(v)) {
        setMoistureThreshold(v);
      }
    });

    // Initialize Chart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "Soil Moisture %",
                data: [],
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Humidity %",
                data: [],
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Temperature °C",
                data: [],
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { min: 0, max: 100 },
            },
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const updateChart = (type: string, val: number) => {
    if (!chartInstance.current) return;

    const chart = chartInstance.current;
    const t = new Date().toLocaleTimeString();

    if (chart.data.labels && chart.data.labels.length >= 20) {
      chart.data.labels.shift();
      chart.data.datasets.forEach((ds) => ds.data.shift());
    }

    chart.data.labels?.push(t);

    chart.data.datasets.forEach((ds, idx) => {
      let shouldPush;
      if (type === "soil-moisture" && idx === 0) shouldPush = val;
      else if (type === "humidity" && idx === 1) shouldPush = val;
      else if (type === "temperature" && idx === 2) shouldPush = val;
      else {
        shouldPush = ds.data.length > 0 ? ds.data[ds.data.length - 1] : null;
      }
      ds.data.push(shouldPush as number);
    });

    chart.update();
  };

  const togglePump = (state: "ON" | "OFF") => {
    if (!dbRef.current) return;
    const pumpStatusRef = ref(dbRef.current, "/pump_status");
    set(pumpStatusRef, state);
  };

  const handleModeToggle = (checked: boolean) => {
    setIsAutoMode(checked);
    if (!dbRef.current) return;
    const modeStatusRef = ref(dbRef.current, "/mode_status");
    set(modeStatusRef, checked ? "Auto Mode" : "Manual Mode");
  };

  const saveMoistureThreshold = async () => {
    if (!dbRef.current) return;

    try {
      const thresholdRef = ref(dbRef.current, "/soil_moisture_threshold");

      await set(thresholdRef, moistureThreshold);

      Swal.fire({
        icon: "success",
        title: "Moisture Threshold Updated!",
        html: `
        Moisture threshold is now
        <strong>${moistureThreshold}%</strong>
      `,
        confirmButtonColor: "#16a34a",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to save moisture threshold:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not save the moisture threshold. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const saveTempThreshold = async () => {
    if (!dbRef.current) return;

    try {
      const tempThresholdRef = ref(dbRef.current, "/temperature_threshold");

      await set(tempThresholdRef, {
        min: tempMin,
        max: tempMax,
      });

      // Update refs immediately
      tempMinRef.current = tempMin;
      tempMaxRef.current = tempMax;

      // // Reset alert state so the new threshold is evaluated fresh
      // temperatureAlertStateRef.current = "normal";
      const saveTempThreshold = async () => {
        if (!dbRef.current) return;

        try {
          const tempThresholdRef = ref(dbRef.current, "/temperature_threshold");

          await set(tempThresholdRef, {
            min: tempMin,
            max: tempMax,
          });

          // Update refs immediately
          tempMinRef.current = tempMin;
          tempMaxRef.current = tempMax;

          Swal.fire({
            icon: "success",
            title: "Temperature Threshold Updated!",
            html: `
        Minimum: <strong>${tempMin}°C</strong><br/>
        Maximum: <strong>${tempMax}°C</strong>
      `,
            confirmButtonColor: "#16a34a",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Failed to save temperature threshold:", error);

          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Could not save the temperature threshold. Please try again.",
            confirmButtonColor: "#dc2626",
          });
        }
      };

      Swal.fire({
        icon: "success",
        title: "Temperature Threshold Updated!",
        html: `
        Minimum: <strong>${tempMin}°C</strong><br/>
        Maximum: <strong>${tempMax}°C</strong>
      `,
        confirmButtonColor: "#16a34a",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to save temperature threshold:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not save the temperature threshold. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };
  const saveHumidityThreshold = async () => {
    if (!dbRef.current) return;

    try {
      const humidityThresholdRef = ref(dbRef.current, "/humidity_threshold");

      await set(humidityThresholdRef, {
        min: humidityMin,
        max: humidityMax,
      });

      Swal.fire({
        icon: "success",
        title: "Humidity Threshold Updated!",
        html: `
        Minimum: <strong>${humidityMin}%</strong><br/>
        Maximum: <strong>${humidityMax}%</strong>
      `,
        confirmButtonColor: "#16a34a",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to save humidity threshold:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not save the humidity threshold. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };
  const handlePlantSelect = async (plant: string) => {
    setSelectedPlant(plant);
    setIsDropdownOpen(false);

    // Get thresholds specifically for the selected plant
    const threshold = plantThresholds[plant] || {
      moisture: 35,
      temperature: {
        min: 18,
        max: 28,
      },
      humidity: {
        min: 40,
        max: 60,
      },
    };

    // Update UI with this plant's values
    setMoistureThreshold(threshold.moisture);

    setTempMin(threshold.temperature.min);
    setTempMax(threshold.temperature.max);

    setHumidityMin(threshold.humidity.min);
    setHumidityMax(threshold.humidity.max);

    // Update refs immediately so alerts use the new values
    tempMinRef.current = threshold.temperature.min;
    tempMaxRef.current = threshold.temperature.max;

    if (!dbRef.current) return;

    try {
      // Firebase references
      const selectedPlantRef = ref(dbRef.current, "/selected_plant");

      const moistureThresholdRef = ref(
        dbRef.current,
        "/soil_moisture_threshold",
      );

      const temperatureThresholdRef = ref(
        dbRef.current,
        "/temperature_threshold",
      );

      const humidityThresholdRef = ref(dbRef.current, "/humidity_threshold");

      // Save the selected plant + its specific thresholds
      await Promise.all([
        set(selectedPlantRef, plant),

        set(moistureThresholdRef, threshold.moisture),

        set(temperatureThresholdRef, {
          min: threshold.temperature.min,
          max: threshold.temperature.max,
        }),

        set(humidityThresholdRef, {
          min: threshold.humidity.min,
          max: threshold.humidity.max,
        }),
      ]);

      // Success message
      Swal.fire({
        icon: "success",
        title: `${plant} Selected!`,
        html: `
        <div style="text-align: left;">
          <p>🌱 <strong>Moisture:</strong> ${threshold.moisture}%</p>

          <p>🌡️ <strong>Temperature:</strong>
            ${threshold.temperature.min}°C -
            ${threshold.temperature.max}°C
          </p>

          <p>💧 <strong>Humidity:</strong>
            ${threshold.humidity.min}% -
            ${threshold.humidity.max}%
          </p>
        </div>
      `,
        confirmButtonColor: "#16a34a",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to save plant thresholds:", error);

      Swal.fire({
        icon: "error",
        title: "Plant Update Failed",
        text: "Could not save the selected plant and its thresholds.",
        confirmButtonColor: "#dc2626",
      });
    }
  };
  const saveNotificationSettings = () => {
    setIsSaving(true);
    if (!dbRef.current) return;

    const phoneNumberRef = ref(dbRef.current, "/phone_number");
    const notificationSettingsRef = ref(
      dbRef.current,
      "/notification_settings",
    );

    const settings = {
      criticalAlerts,
      pumpAlerts,
      lastUpdated: new Date().toISOString(),
    };

    Promise.all([
      set(phoneNumberRef, email),
      set(notificationSettingsRef, settings),
    ]).then(() => {
      setTimeout(() => setIsSaving(false), 1000);
    });
  };

  const filteredPlants = plantList.filter((plant) =>
    plant.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Live Plant Monitor
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time data from your connected plant sensors
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-primary" : "bg-destructive"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Temperature
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{temperature}°C</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current Temperature
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{humidity}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current Humidity
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Soil Moisture
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{soilMoisture}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current Soil Moisture
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pump Status
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Power className="w-5 h-5 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pumpStatus}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Water Pump Status
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-2 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Sensor History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <canvas ref={chartRef} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Power className="w-5 h-5" />
                  Pump Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mode-toggle" className="text-sm">
                    {isAutoMode ? "Auto Mode" : "Manual Mode"}
                  </Label>
                  <Switch
                    id="mode-toggle"
                    checked={isAutoMode}
                    onCheckedChange={handleModeToggle}
                  />
                </div>

                {!isAutoMode && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => togglePump("ON")}
                      className="w-full"
                      variant="default"
                    >
                      <Power className="w-4 h-4 mr-2" />
                      Turn Pump On
                    </Button>
                    <Button
                      onClick={() => togglePump("OFF")}
                      className="w-full"
                      variant="destructive"
                    >
                      <Power className="w-4 h-4 mr-2" />
                      Turn Pump Off
                    </Button>
                  </div>
                )}

                {isAutoMode && (
                  <div className="p-4 rounded-lg bg-primary/10 text-sm">
                    Pump will activate automatically when soil moisture drops
                    below threshold
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Thresholds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="w-4 h-4" />
                  Moisture Threshold
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Threshold: {moistureThreshold}%</span>
                  </div>
                  <Slider
                    value={[moistureThreshold]}
                    onValueChange={(v) => setMoistureThreshold(v[0])}
                    max={100}
                    step={1}
                  />
                </div>
                <Button
                  onClick={saveMoistureThreshold}
                  className="w-full"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Thermometer className="w-4 h-4" />
                  Temperature Range
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Min (°C)</Label>
                    <Input
                      type="number"
                      value={tempMin}
                      onChange={(e) => setTempMin(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Max (°C)</Label>
                    <Input
                      type="number"
                      value={tempMax}
                      onChange={(e) => setTempMax(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>
                <Button
                  onClick={saveTempThreshold}
                  className="w-full"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplets className="w-4 h-4" />
                  Humidity Range
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Min (%)</Label>
                    <Input
                      type="number"
                      value={humidityMin}
                      onChange={(e) => setHumidityMin(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Max (%)</Label>
                    <Input
                      type="number"
                      value={humidityMax}
                      onChange={(e) => setHumidityMax(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>
                <Button
                  onClick={saveHumidityThreshold}
                  className="w-full"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Plant Selection and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-2 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Plant Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-primary transition-colors"
                  >
                    <span>{selectedPlant}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-background border rounded-lg shadow-lg z-10">
                      {filteredPlants.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No plants found
                        </div>
                      ) : (
                        filteredPlants.map((plant) => (
                          <button
                            key={plant}
                            onClick={() => handlePlantSelect(plant)}
                            className="w-full p-3 text-left hover:bg-secondary transition-colors"
                          >
                            {plant}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Phone number</Label>
                  <Input
                    id="email"
                    type="number"
                    placeholder="98XXXXXX"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="critical"
                      checked={criticalAlerts}
                      onCheckedChange={(checked) =>
                        setCriticalAlerts(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="critical"
                      className="text-sm cursor-pointer"
                    >
                      Critical water level alerts
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pump"
                      checked={pumpAlerts}
                      onCheckedChange={(checked) =>
                        setPumpAlerts(checked as boolean)
                      }
                    />
                    <label htmlFor="pump" className="text-sm cursor-pointer">
                      Pump status notifications
                    </label>
                  </div>
                </div>

                <Button
                  onClick={saveNotificationSettings}
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
