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
  try {
    // Initialiser la base de données si nécessaire
    await initDatabase();

    // Récupérer tous les événements depuis Neon
    const events = await getAllEvents();

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);

    // En cas d'erreur, retourner un tableau vide plutôt qu'une erreur
    // pour permettre à l'application de continuer à fonctionner
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events }: { events: DayEvent[] } = body;

    // Validation robuste des données reçues
    if (!events) {
      return NextResponse.json(
        { error: "Aucun événement fourni" },
        { status: 400 }
      );
    }

    if (!Array.isArray(events)) {
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
        return NextResponse.json(
          { error: `Événement invalide à l'index ${i}` },
          { status: 400 }
        );
      }

      if (!event.date || typeof event.date !== "string") {
        return NextResponse.json(
          { error: `Date invalide pour l'événement à l'index ${i}` },
          { status: 400 }
        );
      }

      if (!event.user || typeof event.user !== "object") {
        return NextResponse.json(
          { error: `Utilisateur invalide pour l'événement à l'index ${i}` },
          { status: 400 }
        );
      }

      if (!event.user.name || typeof event.user.name !== "string") {
        return NextResponse.json(
          {
            error: `Nom d'utilisateur invalide pour l'événement à l'index ${i}`,
          },
          { status: 400 }
        );
      }

      if (!event.user.color || typeof event.user.color !== "string") {
        return NextResponse.json(
          { error: `Couleur invalide pour l'événement à l'index ${i}` },
          { status: 400 }
        );
      }
    }

    // Initialiser la base de données si nécessaire
    await initDatabase();

    // Sauvegarder les événements dans Neon
    await saveAllEvents(events);

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
