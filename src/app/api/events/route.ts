import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

interface DayEvent {
  date: string;
  user: {
    name: string;
    color: string;
  };
}

export async function GET() {
  try {
    // Récupérer tous les événements depuis KV
    const events = (await kv.get<DayEvent[]>("calendar_events")) || [];

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des événements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events }: { events: DayEvent[] } = body;

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: "Le format des événements est invalide" },
        { status: 400 }
      );
    }

    // Sauvegarder les événements dans KV
    await kv.set("calendar_events", events);

    return NextResponse.json({
      success: true,
      message: "Événements sauvegardés avec succès",
      count: events.length,
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des événements:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde des événements" },
      { status: 500 }
    );
  }
}
