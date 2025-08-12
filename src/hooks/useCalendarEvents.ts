import { useCallback, useEffect, useState } from "react";

interface User {
  name: string;
  color: string;
}

interface DayEvent {
  date: string;
  user: User;
  time?: string;
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<DayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les événements depuis l'API
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Chargement des événements depuis l'API...");
      const response = await fetch("/api/events");
      console.log(
        "📡 Réponse API reçue:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur API:", response.status, errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📦 Données reçues:", data);

      // Vérification robuste des données reçues
      if (data && Array.isArray(data.events)) {
        console.log(`✅ ${data.events.length} événements chargés`);
        setEvents(data.events);
      } else if (data && !data.events) {
        // Cas où l'API retourne une réponse valide mais sans événements
        console.log("ℹ️ Aucun événement trouvé");
        setEvents([]);
      } else {
        // Cas où la réponse est inattendue
        console.warn("⚠️ Format de réponse inattendu:", data);
        setEvents([]);
      }
    } catch (err) {
      console.error("❌ Erreur lors du chargement des événements:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      // En cas d'erreur, on initialise avec un tableau vide
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter un événement
  const addEvent = useCallback(
    async (event: DayEvent) => {
      // Vérification de l'événement
      if (!event || !event.date || !event.user || !event.user.name) {
        console.error("❌ Événement invalide:", event);
        return;
      }

      try {
        console.log("➕ Ajout de l'événement:", event);

        // Ajouter l'événement via l'API REST
        const newEvents = [...events, event];
        console.log("📤 Envoi de", newEvents.length, "événements à l'API...");

        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events: newEvents }),
        });

        console.log(
          "📡 Réponse API reçue:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Erreur API:", response.status, errorText);
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        console.log("✅ Réponse API:", responseData);

        // Mettre à jour l'état local
        setEvents(newEvents);
        console.log("✅ État local mis à jour");
      } catch (err) {
        console.error("❌ Erreur lors de l'ajout de l'événement:", err);
        setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
        throw err; // Re-lancer l'erreur pour que le composant puisse la gérer
      }
    },
    [events]
  );

  // Supprimer un événement
  const removeEvent = useCallback(
    async (date: string, userName: string) => {
      // Vérification des paramètres
      if (!date || !userName) {
        console.error("❌ Paramètres invalides pour removeEvent:", {
          date,
          userName,
        });
        return;
      }

      try {
        console.log("➖ Suppression de l'événement:", { date, userName });

        // Supprimer l'événement via l'API REST
        const newEvents = events.filter(
          (event) => !(event.date === date && event.user.name === userName)
        );

        console.log("📤 Envoi de", newEvents.length, "événements à l'API...");

        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events: newEvents }),
        });

        console.log(
          "📡 Réponse API reçue:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Erreur API:", response.status, errorText);
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        console.log("✅ Réponse API:", responseData);

        // Mettre à jour l'état local
        setEvents(newEvents);
        console.log("✅ État local mis à jour");
      } catch (err) {
        console.error("❌ Erreur lors de la suppression de l'événement:", err);
        setError(
          err instanceof Error ? err.message : "Erreur lors de la suppression"
        );
        throw err; // Re-lancer l'erreur pour que le composant puisse la gérer
      }
    },
    [events]
  );

  // Charger les événements au montage du composant
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    addEvent,
    removeEvent,
    loadEvents,
  };
}
