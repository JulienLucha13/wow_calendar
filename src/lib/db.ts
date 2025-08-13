import { neon } from "@neondatabase/serverless";

// Interface pour les événements en base de données
export interface DbEvent {
  id?: number;
  date: string;
  user_name: string;
  user_color: string;
  time?: string; // Nouveau champ pour l'heure
  created_at?: Date;
}

// Interface pour les événements dans l'application
export interface DayEvent {
  date: string;
  user: {
    name: string;
    color: string;
  };
  time?: string; // Nouveau champ pour l'heure
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

    // Vérifier si la table existe déjà
    console.log("📝 Vérification de l'existence de la table events...");
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `;

    if (tableExists[0]?.exists) {
      console.log("✅ La table events existe déjà");
    } else {
      console.log("📝 Création de la table events...");
      await sql`
        CREATE TABLE events (
          id SERIAL PRIMARY KEY,
          date VARCHAR(10) NOT NULL,
          user_name VARCHAR(50) NOT NULL,
          user_color VARCHAR(20) NOT NULL,
          time VARCHAR(5) DEFAULT '12:00',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(date, user_name)
        )
      `;
      console.log("✅ Table events créée avec succès");
    }

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
      SELECT id, date, user_name, user_color, time, created_at
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
      time: event.time || "12:00",
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
  userColor: string,
  time: string = "12:00"
): Promise<void> {
  console.log("🔧 addEvent() appelé avec:", {
    date,
    userName,
    userColor,
    time,
  });
  try {
    const sql = getSql();
    console.log("✅ Connexion SQL obtenue");

    console.log("📝 Exécution de la requête INSERT...");
    await sql`
      INSERT INTO events (date, user_name, user_color, time)
      VALUES (${date}, ${userName}, ${userColor}, ${time})
      ON CONFLICT (date, user_name) DO UPDATE SET
        user_color = EXCLUDED.user_color,
        time = EXCLUDED.time
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

    // D'abord nettoyer les anciens événements
    await cleanupOldEvents();

    // Supprimer tous les événements existants
    console.log("📝 Suppression de tous les événements existants...");
    await sql`DELETE FROM events`;
    console.log("✅ Tous les événements supprimés");

    // Ajouter tous les nouveaux événements avec des requêtes préparées
    if (events.length > 0) {
      console.log("📝 Insertion des nouveaux événements...");

      // Utiliser des requêtes préparées pour chaque événement
      for (const event of events) {
        console.log("📝 Insertion de l'événement:", event);
        await sql`
          INSERT INTO events (date, user_name, user_color, time)
          VALUES (${event.date}, ${event.user.name}, ${event.user.color}, ${
          event.time || "12:00"
        })
        `;
      }

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

// Fonction pour supprimer les événements de plus de 2 semaines
export async function cleanupOldEvents(): Promise<void> {
  console.log("🔧 cleanupOldEvents() appelé");
  try {
    const sql = getSql();
    console.log("✅ Connexion SQL obtenue");

    // Calculer la date limite (2 semaines en arrière)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const limitDate = twoWeeksAgo.toISOString().split("T")[0];

    console.log(`📝 Suppression des événements antérieurs au ${limitDate}...`);

    const result = await sql`
      DELETE FROM events
      WHERE date < ${limitDate}
    `;

    console.log("✅ Nettoyage des anciens événements terminé");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage des anciens événements:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack trace"
    );
    throw error;
  }
}
