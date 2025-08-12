import { neon } from "@neondatabase/serverless";

// Configuration de la base de données Neon
if (!process.env.DATABASE_URL_CUSTOM) {
  throw new Error(
    "DATABASE_URL n'est pas défini dans les variables d'environnement"
  );
}
const sql = neon(process.env.DATABASE_URL_CUSTOM);

// Interface pour les événements en base de données
export interface DbEvent {
  id?: number;
  date: string;
  user_name: string;
  user_color: string;
  created_at?: Date;
}

// Interface pour les événements dans l'application
export interface DayEvent {
  date: string;
  user: {
    name: string;
    color: string;
  };
}

// Initialisation de la base de données
export async function initDatabase() {
  try {
    // Créer la table events si elle n'existe pas
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        date VARCHAR(10) NOT NULL,
        user_name VARCHAR(50) NOT NULL,
        user_color VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, user_name)
      )
    `;

    console.log("Base de données initialisée avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error
    );
    throw error;
  }
}

// Fonctions pour manipuler les événements
export async function getAllEvents(): Promise<DayEvent[]> {
  try {
    const events = (await sql`
      SELECT id, date, user_name, user_color, created_at
      FROM events
      ORDER BY date ASC, created_at ASC
    `) as DbEvent[];

    return events.map((event) => ({
      date: event.date,
      user: {
        name: event.user_name,
        color: event.user_color,
      },
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    throw error;
  }
}

export async function addEvent(
  date: string,
  userName: string,
  userColor: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO events (date, user_name, user_color)
      VALUES (${date}, ${userName}, ${userColor})
      ON CONFLICT (date, user_name) DO NOTHING
    `;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'événement:", error);
    throw error;
  }
}

export async function removeEvent(
  date: string,
  userName: string
): Promise<void> {
  try {
    await sql`
      DELETE FROM events
      WHERE date = ${date} AND user_name = ${userName}
    `;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    throw error;
  }
}

export async function saveAllEvents(events: DayEvent[]): Promise<void> {
  try {
    // Supprimer tous les événements existants
    await sql`DELETE FROM events`;

    // Ajouter tous les nouveaux événements
    if (events.length > 0) {
      const values = events
        .map(
          (event) => `(${event.date}, ${event.user.name}, ${event.user.color})`
        )
        .join(", ");

      await sql`INSERT INTO events (date, user_name, user_color) VALUES ${sql.unsafe(
        values
      )}`;
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des événements:", error);
    throw error;
  }
}

export { sql };
