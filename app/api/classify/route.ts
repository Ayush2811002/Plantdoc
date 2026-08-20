// app/api/classify/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body?.name;
    if (!name) {
      return NextResponse.json({ category: "common" }, { status: 400 });
    }

    const token = process.env.NEXT_PUBLIC_TOKEN;
    if (!token) {
      console.error("TREFLE_TOKEN not set");
      return NextResponse.json({ category: "common" }, { status: 500 });
    }

    const url = `https://trefle.io/api/v1/species/search?token=${token}&q=${encodeURIComponent(
      name,
    )}&limit=1`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error("Trefle returned non-ok:", res.status);
      return NextResponse.json({ category: "common" });
    }

    const data = await res.json();
    const info = data?.data?.[0];
    if (!info) {
      return NextResponse.json({ category: "common" });
    }

    const text = `${info.common_name || ""} ${info.family_common_name || ""} ${
      info.scientific_name || ""
    }`.toLowerCase();

    // Basic keyword matching (fallback)
    let category = "common";
    if (
      /herb|herbal|medicinal|basil|tulsi|neem|aloe|turmeric|mint/.test(text)
    ) {
      category = "medicinal";
    } else if (
      /vegetable|root|leaf vegetable|tomato|potato|onion|carrot|spinach|okra|eggplant|brinjal|aubergine/.test(
        text,
      )
    ) {
      category = "vegetable";
    } else if (
      /fruit|berry|mango|banana|apple|pear|citrus|grape|papaya|pineapple|cherry/.test(
        text,
      )
    ) {
      category = "fruit";
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error in /api/classify:", error);
    return NextResponse.json({ category: "common" });
  }
}
