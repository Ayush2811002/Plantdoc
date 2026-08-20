"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { loadFull } from "tsparticles";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  ImageIcon,
} from "lucide-react";

export default function DetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isAnalyzing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 8); // progress increases randomly for realism
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const [result, setResult] = useState<any>(null);
  // disease detection state
  const [diseaseResult, setDiseaseResult] = useState<any>(null);
  const [isDetectingDisease, setIsDetectingDisease] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setDiseaseResult(null); // 🔥 added line to clear previous disease result
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // const handleAnalyze = async () => {
  //   if (!selectedFile) return;

  //   setIsAnalyzing(true);
  //   setResult(null);

  //   try {
  //     const API_KEY = "2b10fjQmv5nZP7WPeCJ6deKysu"; // 🔒 Your PlantNet API key
  //     const PROJECT = "all"; // or a specific flora like "weurope"
  //     const apiEndpoint = `https://my-api.plantnet.org/v2/identify/${PROJECT}?api-key=${API_KEY}`;

  //     const formData = new FormData();
  //     formData.append("images", selectedFile);
  //     formData.append("organs", "leaf"); // can be "flower", "fruit", etc.

  //     const response = await fetch(apiEndpoint, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const json = await response.json();
  //     console.log("PlantNet response:", json);

  //     if (json.results && json.results.length > 0) {
  //       const top = json.results[0];
  //       const species = top.species;

  //       // ✅ Prefer common name if available
  //       const displayName =
  //         species.commonNames && species.commonNames.length > 0
  //           ? species.commonNames[0]
  //           : species.scientificNameWithoutAuthor || "Unknown plant";

  //       // ✅ Build a readable description
  //       const descriptionParts = [
  //         `Detected plant: ${species.scientificNameWithoutAuthor}`,
  //       ];
  //       if (species.commonNames && species.commonNames.length > 0) {
  //         descriptionParts.push(
  //           `(Common names: ${species.commonNames.join(", ")})`
  //         );
  //       }

  //       setResult({
  //         disease: displayName, // showing common name
  //         confidence: (top.score * 100).toFixed(2),
  //         severity: "N/A",
  //         description: descriptionParts.join(" "),
  //         symptoms:
  //           species.commonNames?.length > 0
  //             ? species.commonNames
  //             : ["No common names available."],
  //         treatment: [
  //           "Consult expert for specific disease detection.",
  //           "Monitor plant health and leaf color.",
  //         ],
  //         prevention: [
  //           "Maintain good watering and sunlight balance.",
  //           "Check for pests regularly.",
  //         ],
  //       });
  //     } else {
  //       setResult({
  //         disease: "No plant identified",
  //         confidence: 0,
  //         severity: "N/A",
  //         description: "The API could not identify the plant from this image.",
  //         symptoms: [],
  //         treatment: [],
  //         prevention: [],
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error during detection:", err);
  //     setResult({
  //       disease: "Error",
  //       confidence: 0,
  //       severity: "N/A",
  //       description: "Failed to connect to PlantNet API.",
  //       symptoms: [],
  //       treatment: [],
  //       prevention: [],
  //     });
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      //credential in .env file
      const API_KEY = process.env.NEXT_PUBLIC_PLANTNET_API_KEY;
      const PROJECT = process.env.NEXT_PUBLIC_PLANTNET_PROJECT;

      const apiEndpoint = `https://my-api.plantnet.org/v2/identify/${PROJECT}?api-key=${API_KEY}`;

      const formData = new FormData();
      formData.append("images", selectedFile);
      formData.append("organs", "leaf");

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("PlantNet response:", json);

      if (json.results && json.results.length > 0) {
        const top = json.results[0];
        const species = top.species;

        const displayName =
          species.commonNames && species.commonNames.length > 0
            ? species.commonNames[0]
            : species.scientificNameWithoutAuthor || "Unknown plant";

        const descriptionParts = [
          `Detected plant: ${species.scientificNameWithoutAuthor || ""}`,
        ];
        if (species.commonNames && species.commonNames.length > 0) {
          descriptionParts.push(
            `(Common names: ${species.commonNames.join(", ")})`,
          );
        }

        // CALL server route to get category
        const catRes = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: displayName }),
        });
        const catJson = await catRes.json();
        const category = catJson?.category || "common";

        // Map category -> ui
        const categoryMap: Record<
          string,
          { type: string; color: string; icon: string }
        > = {
          medicinal: {
            type: "Medicinal Plant",
            color: "bg-green-200 text-green-800",
            icon: "🌿",
          },
          fruit: {
            type: "Fruit Plant",
            color: "bg-orange-200 text-orange-800",
            icon: "🍎",
          },
          vegetable: {
            type: "Vegetable Plant",
            color: "bg-yellow-200 text-yellow-800",
            icon: "🥕",
          },
          common: {
            type: "Common Plant",
            color: "bg-gray-200 text-gray-800",
            icon: "🌱",
          },
        };

        const categoryData = categoryMap[category] || categoryMap.common;

        // setResult({
        //   disease: displayName,
        //   confidence: (top.score * 100).toFixed(2),
        //   severity: categoryData.type,
        //   color: categoryData.color,
        //   icon: categoryData.icon,
        //   description: descriptionParts.join(" "),
        //   symptoms:
        //     species.commonNames?.length > 0
        //       ? species.commonNames
        //       : ["No common names available."],
        //   treatment: [
        //     "Consult expert for specific disease detection.",
        //     "Monitor plant health and leaf color.",
        //   ],
        //   prevention: [
        //     "Maintain good watering and sunlight balance.",
        //     "Check for pests regularly.",
        //   ],
        // });

        // 🔸 Convert file to base64 for Plant.id API
        const fileReader = new FileReader();
        fileReader.readAsDataURL(selectedFile);
        fileReader.onloadend = async () => {
          const base64 = fileReader.result;

          // 🔸 Call your /api/disease backend route
          const diseaseRes = await fetch("/api/disease", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64 }),
          });
          const diseaseJson = await diseaseRes.json();

          // 🔸 Merge both results (PlantNet + Plant.id)
          setResult({
            disease: displayName,
            confidence: (top.score * 100).toFixed(2),
            severity: categoryData.type,
            color: categoryData.color,
            icon: categoryData.icon,
            description: descriptionParts.join(" "),
            symptoms:
              species.commonNames?.length > 0
                ? species.commonNames
                : ["No common names available."],

            // Plant.id health data
            diseaseDetected: diseaseJson.name,
            diseaseConfidence: diseaseJson.probability,
            diseaseDescription: diseaseJson.description,
            treatment: diseaseJson.treatment?.length
              ? diseaseJson.treatment
              : ["No treatment suggestions found."],
            prevention: diseaseJson.prevention?.length
              ? diseaseJson.prevention
              : ["No prevention data available."],
          });
        };
      } else {
        setResult({
          disease: "No plant identified",
          confidence: 0,
          severity: "N/A",
          description: "The API could not identify the plant from this image.",
          symptoms: [],
          treatment: [],
          prevention: [],
        });
      }
    } catch (err) {
      console.error("Error during detection:", err);
      setResult({
        disease: "Error",
        confidence: 0,
        severity: "N/A",
        description: "Failed to connect to PlantNet or classification API.",
        symptoms: [],
        treatment: [],
        prevention: [],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  //disease detection function ends
  const handleDiseaseDetect = async () => {
    if (!selectedFile) return;

    setIsDetectingDisease(true);
    setDiseaseResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64 = reader.result;

        const res = await fetch("/api/disease", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const json = await res.json();

        setDiseaseResult({
          diseaseDetected: json.name || "Unknown",
          diseaseConfidence: json.probability || 0,
          diseaseDescription: json.description || "",
          treatment: Array.isArray(json.treatment) ? json.treatment : [],
          prevention: Array.isArray(json.prevention) ? json.prevention : [],
          healthy: json.healthy ?? false,
        });

        setIsDetectingDisease(false);
      };
    } catch (err) {
      console.error("handleDiseaseDetect error:", err);
      setIsDetectingDisease(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Plant Disease Detection
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Upload a clear image of your plant to detect diseases and get
              treatment recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Upload Plant Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                          setResult(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG or JPEG (max. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Select Image
                        </label>
                      </Button>
                    </>
                  )}
                </div>

                {selectedFile && !isAnalyzing && !result && (
                  <Button onClick={handleAnalyze} className="w-full" size="lg">
                    <Leaf className="mr-2 w-4 h-4" />
                    Analyze Plant
                  </Button>
                )}

                {isAnalyzing && (
                  <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-primary/10 text-primary">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Analyzing image...</span>
                  </div>
                )}

                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">
                    Tips for best results:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Take photos in good lighting conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Focus on affected areas of the plant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Ensure the image is clear and not blurry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Include the entire leaf or affected part</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Detection Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result && !isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium mb-1">
                        No results yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upload an image and click analyze to see results
                      </p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    {/* Detection Summary */}
                    {/* <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-3"> */}
                    <div
                      className={`p-4 rounded-lg border space-y-3 ${
                        result.severity === "Medicinal Plant"
                          ? "bg-green-100 border-green-300"
                          : result.severity === "Fruit Plant"
                            ? "bg-orange-100 border-orange-300"
                            : result.severity === "Vegetable Plant"
                              ? "bg-yellow-100 border-yellow-300"
                              : result.severity === "Common Plant"
                                ? "bg-gray-100 border-gray-300"
                                : "bg-red-100 border-red-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" /> */}
                        <AlertTriangle
                          className={`w-5 h-5 mt-0.5 ${
                            result.severity === "Medicinal Plant"
                              ? "text-green-700"
                              : result.severity === "Fruit Plant"
                                ? "text-orange-700"
                                : result.severity === "Vegetable Plant"
                                  ? "text-yellow-700"
                                  : result.severity === "Common Plant"
                                    ? "text-gray-700"
                                    : "text-red-700"
                          }`}
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {result.disease}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Confidence
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {result.confidence}%
                          </p>
                        </div>
                        {/* Replace the old severity text */}
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Severity
                          </p>
                          <div>
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                result.color || "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {result.icon && <span>{result.icon}</span>}
                              {result.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Common Names
                      </h4>
                      <ul className="space-y-2">
                        {result.symptoms.map(
                          (symptom: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              <span>{symptom}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Treatment */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Treatment Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {result.treatment.map((step: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <h4 className="font-semibold text-foreground">
                        Prevention Tips
                      </h4>
                      <ul className="space-y-2">
                        {result.prevention.map((tip: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                        setResult(null);
                        setDiseaseResult(null); // ✅ Clear disease detection results too
                      }}
                    >
                      Analyze Another Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Disease Detection Card */}
          <Card className="border-2 mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">
                Disease Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!diseaseResult && (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Click the button to analyze this image for disease.
                  </p>
                  <Button
                    onClick={handleDiseaseDetect}
                    disabled={!selectedFile || isDetectingDisease}
                  >
                    {isDetectingDisease ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      "Detect Disease"
                    )}
                  </Button>
                </div>
              )}

              {diseaseResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    diseaseResult.healthy
                      ? "bg-green-100 border-green-300"
                      : diseaseResult.diseaseConfidence > 80
                        ? "bg-red-100 border-red-300"
                        : diseaseResult.diseaseConfidence > 50
                          ? "bg-yellow-100 border-yellow-300"
                          : "bg-orange-100 border-orange-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`w-5 h-5 mt-0.5 ${
                        diseaseResult.healthy
                          ? "text-green-700"
                          : diseaseResult.diseaseConfidence > 80
                            ? "text-red-700"
                            : diseaseResult.diseaseConfidence > 50
                              ? "text-yellow-700"
                              : "text-orange-700"
                      }`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {diseaseResult.diseaseDetected}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confidence: {diseaseResult.diseaseConfidence}%
                      </p>
                      <p className="text-sm mt-2">
                        {diseaseResult.diseaseDescription}
                      </p>
                    </div>
                  </div>

                  {diseaseResult.treatment?.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-border">
                      <h4 className="font-semibold text-sm">Treatment</h4>
                      <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                        {diseaseResult.treatment.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {diseaseResult.prevention?.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-border">
                      <h4 className="font-semibold text-sm">Prevention</h4>
                      <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                        {diseaseResult.prevention.map(
                          (p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">50+ Diseases</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our AI model can detect over 50 different plant diseases with
                  high accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">95% Accuracy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Trained on thousands of images for reliable and accurate
                  disease detection.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Expert Advice</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get detailed treatment recommendations from agricultural
                  experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-200 to-green-300 backdrop-blur-sm z-50 overflow-hidden"
          >
            {/* Soft glowing particles */}
            <Particles
              id="tsparticles"
              init={async (engine) => {
                await loadSlim(engine);
              }}
              options={{
                fullScreen: false,
                background: { color: "transparent" },
                particles: {
                  number: { value: 20 },
                  color: { value: "#22c55e" },
                  opacity: { value: 0.3 },
                  size: { value: 3 },
                  move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                  },
                },
              }}
              className="absolute inset-0"
            />

            {/* Glowing rotating leaf */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="p-6 rounded-full bg-white/70 shadow-2xl flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                }}
              >
                <Leaf className="w-14 h-14 text-green-600" />
              </motion.div>
            </motion.div>

            {/* Progress and text */}
            <motion.h2
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-8 text-green-800 font-semibold text-2xl tracking-wide"
            >
              Analyzing your plant...
            </motion.h2>

            {/* Progress bar with % */}
            <div className="mt-6 w-80 bg-green-200 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full bg-green-600"
              />
            </div>
            <p className="mt-3 text-green-700 font-medium">{progress}%</p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
