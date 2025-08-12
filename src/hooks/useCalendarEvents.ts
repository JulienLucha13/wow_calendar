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
      setEvents(data.events || []);
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder les événements vers l'API
  const saveEvents = useCallback(async (newEvents: DayEvent[]) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events: newEvents }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde des événements");
      }

      const data = await response.json();
      console.log("Événements sauvegardés:", data);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des événements:", err);
      setError(
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde"
      );
    }
  }, []);

  // Ajouter un événement
  const addEvent = useCallback(
    async (event: DayEvent) => {
      const newEvents = [...events, event];
      setEvents(newEvents);
      await saveEvents(newEvents);
    },
    [events, saveEvents]
  );

  // Supprimer un événement
  const removeEvent = useCallback(
    async (date: string, userName: string) => {
      const newEvents = events.filter(
        (event) => !(event.date === date && event.user.name === userName)
      );
      setEvents(newEvents);
      await saveEvents(newEvents);
    },
    [events, saveEvents]
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
