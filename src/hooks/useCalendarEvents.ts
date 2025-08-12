import { useCallback, useEffect, useState } from "react";

interface User {
  name: string;
  color: string;
}

interface DayEvent {
  date: string;
  user: User;
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

      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const data = await response.json();

      // Vérification robuste des données reçues
      if (data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else if (data && !data.events) {
        // Cas où l'API retourne une réponse valide mais sans événements
        setEvents([]);
      } else {
        // Cas où la réponse est inattendue
        console.warn("Format de réponse inattendu:", data);
        setEvents([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
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
        console.error("Événement invalide:", event);
        return;
      }

      try {
        // Ajouter l'événement via l'API REST
        const newEvents = [...events, event];
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events: newEvents }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'événement");
        }

        // Mettre à jour l'état local
        setEvents(newEvents);
      } catch (err) {
        console.error("Erreur lors de l'ajout de l'événement:", err);
        setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
      }
    },
    [events]
  );

  // Supprimer un événement
  const removeEvent = useCallback(
    async (date: string, userName: string) => {
      // Vérification des paramètres
      if (!date || !userName) {
        console.error("Paramètres invalides pour removeEvent:", {
          date,
          userName,
        });
        return;
      }

      try {
        // Supprimer l'événement via l'API REST
        const newEvents = events.filter(
          (event) => !(event.date === date && event.user.name === userName)
        );

        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events: newEvents }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'événement");
        }

        // Mettre à jour l'état local
        setEvents(newEvents);
      } catch (err) {
        console.error("Erreur lors de la suppression de l'événement:", err);
        setError(
          err instanceof Error ? err.message : "Erreur lors de la suppression"
        );
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
