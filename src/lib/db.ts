import { neon } from "@neondatabase/serverless";

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

// Fonction pour obtenir la connexion SQL
function getSql() {
  console.log("🔧 getSql() appelé");
  console.log("DATABASE_URL défini:", !!process.env.DATABASE_URL);

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL n'est pas défini");
    throw new Error(
      "DATABASE_URL n'est pas défini dans les variables d'environnement"
    );
  }

  console.log("✅ Connexion SQL créée");
  return neon(process.env.DATABASE_URL);
}

// Initialisation de la base de données
export async function initDatabase() {
  console.log("🔧 initDatabase() appelé");
  try {
    const sql = getSql();
    console.log("✅ Connexion SQL obtenue");

    // Créer la table events si elle n'existe pas
    console.log("📝 Création de la table events...");
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

    console.log("✅ Base de données initialisée avec succès");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation de la base de données:",
      error
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    throw error;
  }
}

// Fonctions pour manipuler les événements
export async function getAllEvents(): Promise<DayEvent[]> {
  console.log("🔧 getAllEvents() appelé");
  try {
    const sql = getSql();
    console.log("✅ Connexion SQL obtenue");

    console.log("📝 Exécution de la requête SELECT...");
    const events = (await sql`
      SELECT id, date, user_name, user_color, created_at
      FROM events
      ORDER BY date ASC, created_at ASC
    `) as DbEvent[];

    console.log(
      `✅ ${events.length} événements récupérés de la base de données:`,
      events
    );

    const mappedEvents = events.map((event) => ({
      date: event.date,
      user: {
        name: event.user_name,
        color: event.user_color,
      },
    }));

    console.log("✅ Événements mappés:", mappedEvents);
    return mappedEvents;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des événements:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    throw error;
  }
}

export async function addEvent(
  date: string,
  userName: string,
  userColor: string
): Promise<void> {
  console.log("🔧 addEvent() appelé avec:", { date, userName, userColor });
  try {
    const sql = getSql();
    console.log("✅ Connexion SQL obtenue");

    console.log("📝 Exécution de la requête INSERT...");
    await sql`
      INSERT INTO events (date, user_name, user_color)
      VALUES (${date}, ${userName}, ${userColor})
      ON CONFLICT (date, user_name) DO NOTHING
    `;
    console.log("✅ Événement ajouté avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de l'événement:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    throw error;
  }
}

export async function removeEvent(
  date: string,
  userName: string
): Promise<void> {
  console.log("🔧 removeEvent() appelé avec:", { date, userName });
  try {
    const sql = getSql();
    console.log("✅ Connexion SQL obtenue");

    console.log("📝 Exécution de la requête DELETE...");
    await sql`
      DELETE FROM events
      WHERE date = ${date} AND user_name = ${userName}
    `;
    console.log("✅ Événement supprimé avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'événement:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    throw error;
  }
}

export async function saveAllEvents(events: DayEvent[]): Promise<void> {
  console.log("🔧 saveAllEvents() appelé avec:", events);
  try {
    const sql = getSql();
    console.log("✅ Connexion SQL obtenue");

    // Supprimer tous les événements existants
    console.log("📝 Suppression de tous les événements existants...");
    await sql`DELETE FROM events`;
    console.log("✅ Tous les événements supprimés");

    // Ajouter tous les nouveaux événements
    if (events.length > 0) {
      console.log("📝 Insertion des nouveaux événements...");
      const values = events
        .map(
          (event) => `(${event.date}, ${event.user.name}, ${event.user.color})`
        )
        .join(", ");

      console.log("Valeurs à insérer:", values);
      await sql`INSERT INTO events (date, user_name, user_color) VALUES ${sql.unsafe(
        values
      )}`;
      console.log(`✅ ${events.length} événements insérés avec succès`);
    } else {
      console.log("ℹ️ Aucun événement à insérer");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des événements:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    throw error;
  }
}
