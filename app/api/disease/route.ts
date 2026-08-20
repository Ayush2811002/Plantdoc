import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    const apiKey = "Yk4NoxCCe9tXZNKxB5H2XCoE3fQz0vQMmGkWyQ6Y21dhoChKj0"; // your Plant.id API key

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const res = await fetch("https://api.plant.id/v3/health_assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
      body: JSON.stringify({
        images: [imageBase64],
        similar_images: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Plant.id API Error:", errText);
      return NextResponse.json(
        { error: "Plant.id request failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log("🪴 Plant.id API Raw Response:", JSON.stringify(data, null, 2));

    const isHealthyProb = data?.result?.is_healthy?.probability || 0;
    const diseaseSuggestions = data?.result?.disease?.suggestions || [];

    // Choose top disease suggestion (highest probability)
    const topDisease =
      diseaseSuggestions.length > 0 ? diseaseSuggestions[0] : null;
    const diseaseProb = topDisease ? topDisease.probability * 100 : 0;

    // Decide health status
    const isHealthy = isHealthyProb > 0.8 && diseaseProb < 20; // High healthy prob + low disease = healthy

    if (isHealthy) {
      return NextResponse.json({
        name: "Healthy Plant",
        probability: isHealthyProb * 100,
        description: "No disease detected.",
        treatment: ["No treatment needed."],
        prevention: ["Maintain good watering and sunlight conditions."],
        healthy: true,
      });
    }

    // Return disease details
    return NextResponse.json({
      name: topDisease?.name || "Unknown Disease",
      probability: diseaseProb.toFixed(2),
      description:
        topDisease?.details?.description ||
        "No detailed description available.",
      treatment: ["Use fungicide or appropriate treatment."],
      prevention: [
        "Ensure proper ventilation.",
        "Avoid waterlogging.",
        "Remove infected leaves.",
      ],
      healthy: false,
    });
  } catch (err) {
    console.error("Disease detection route error:", err);
    return NextResponse.json(
      { error: "Disease detection failed" },
      { status: 500 }
    );
  }
}
