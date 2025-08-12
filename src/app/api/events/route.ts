import { getAllEvents, initDatabase, saveAllEvents } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface DayEvent {
  date: string;
  user: {
    name: string;
    color: string;
  };
}

export async function GET() {
  console.log("=== API GET /api/events ===");
  try {
    console.log("1. Initialisation de la base de données...");
    await initDatabase();
    console.log("✅ Base de données initialisée");

    console.log("2. Récupération des événements...");
    const events = await getAllEvents();
    console.log(`✅ ${events.length} événements récupérés:`, events);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des événements:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: NextRequest) {
  console.log("=== API POST /api/events ===");
  try {
    console.log("1. Parsing du body de la requête...");
    const body = await request.json();
    console.log("Body reçu:", JSON.stringify(body, null, 2));
    const { events }: { events: DayEvent[] } = body;

    console.log("2. Validation des données...");
    if (!events) {
      console.error("❌ Aucun événement fourni");
      return NextResponse.json(
        { error: "Aucun événement fourni" },
        { status: 400 }
      );
    }

    if (!Array.isArray(events)) {
      console.error("❌ Le format des événements est invalide");
      return NextResponse.json(
        {
          error:
            "Le format des événements est invalide - un tableau est attendu",
        },
        { status: 400 }
      );
    }

    // Validation de chaque événement
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (!event || typeof event !== "object") {
        console.error(`❌ Événement invalide à l'index ${i}`);
        return NextResponse.json(
          { error: `Événement invalide à l'index ${i}` },
          { status: 400 }
        );
      }

      if (!event.date || typeof event.date !== "string") {
        console.error(`❌ Date invalide pour l'événement à l'index ${i}`);
        return NextResponse.json(
          { error: `Date invalide pour l'événement à l'index ${i}` },
          { status: 400 }
        );
      }

      if (!event.user || typeof event.user !== "object") {
        console.error(
          `❌ Utilisateur invalide pour l'événement à l'index ${i}`
        );
        return NextResponse.json(
          { error: `Utilisateur invalide pour l'événement à l'index ${i}` },
          { status: 400 }
        );
      }

      if (!event.user.name || typeof event.user.name !== "string") {
        console.error(
          `❌ Nom d'utilisateur invalide pour l'événement à l'index ${i}`
        );
        return NextResponse.json(
          {
            error: `Nom d'utilisateur invalide pour l'événement à l'index ${i}`,
          },
          { status: 400 }
        );
      }

      if (!event.user.color || typeof event.user.color !== "string") {
        console.error(`❌ Couleur invalide pour l'événement à l'index ${i}`);
        return NextResponse.json(
          { error: `Couleur invalide pour l'événement à l'index ${i}` },
          { status: 400 }
        );
      }
    }
    console.log("✅ Validation des événements réussie");

    console.log("4. Initialisation de la base de données...");
    await initDatabase();
    console.log("✅ Base de données initialisée");

    console.log("5. Sauvegarde des événements dans Neon...");
    await saveAllEvents(events);
    console.log(`✅ ${events.length} événements sauvegardés avec succès`);

    const response = {
      success: true,
      message: "Événements sauvegardés avec succès",
      count: events.length,
    };
    console.log("6. Réponse envoyée:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des événements:", error);
    console.error("Type d'erreur:", typeof error);
    console.error(
      "Message d'erreur:",
      error instanceof Error ? error.message : "Pas de message"
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    return NextResponse.json(
      {
        error: "Erreur lors de la sauvegarde des événements",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
