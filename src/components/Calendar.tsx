"use client";

import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useState } from "react";

interface User {
  name: string;
  color: string;
}

const users: User[] = [
  { name: "Flavio", color: "bg-blue-500" },
  { name: "Dagreat", color: "bg-yellow-500" },
  { name: "Aisen", color: "bg-pink-500" },
  { name: "Naarz", color: "bg-purple-500" },
];

export default function Calendar() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { events, loading, error, addEvent, removeEvent } = useCalendarEvents();

  // Obtenir la date actuelle
  const today = new Date();
  const currentWeekStart = new Date(today);

  // Calculer le début de la semaine (lundi = 1, dimanche = 0)
  const dayOfWeek = today.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si dimanche, reculer de 6 jours, sinon reculer de (jour - 1)
  currentWeekStart.setDate(today.getDate() - daysToSubtract);

  // Générer les jours pour la semaine actuelle et la suivante
  const generateDays = () => {
    const days = [];
    for (let week = 0; week < 2; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + week * 7 + day);
        days.push(date);
      }
    }
    return days;
  };

  const days = generateDays();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (date: Date) => {
    return formatDate(date) === formatDate(today);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    // Vérification que events est bien un tableau
    if (!Array.isArray(events)) {
      console.warn("events n'est pas un tableau:", events);
      return [];
    }
    return events.filter((event) => event.date === dateStr);
  };

  const handleDayClick = async (date: Date) => {
    if (!selectedUser) return;

    try {
      const dateStr = formatDate(date);
      const dayEvents = getEventsForDate(date);
      const existingEvent = dayEvents.find(
        (event) => event.user.name === selectedUser.name
      );

      if (existingEvent) {
        // Supprimer l'événement de cet utilisateur spécifique
        await removeEvent(dateStr, selectedUser.name);
      } else {
        // Ajouter un nouvel événement pour cet utilisateur
        await addEvent({ date: dateStr, user: selectedUser });
      }
    } catch (err) {
      console.error("Erreur lors de la manipulation de l'événement:", err);
      // L'erreur sera gérée par le hook useCalendarEvents
    }
  };

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Affichage de chargement
  if (loading) {
    return (
      <div className="max-w-9xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du calendrier...</p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="max-w-9xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">
            Erreur de chargement
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Calendrier WoW
      </h1>

      {/* Radio boutons pour sélectionner l'utilisateur */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Sélectionner un utilisateur :
        </h2>
        <div className="flex flex-wrap gap-4">
          {users.map((user) => (
            <label
              key={user.name}
              className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-md"
              style={{
                borderColor:
                  selectedUser?.name === user.name
                    ? user.color.replace("bg-", "")
                    : "#e5e7eb",
                backgroundColor:
                  selectedUser?.name === user.name
                    ? `${user.color}20`
                    : "white",
              }}
            >
              <input
                type="radio"
                name="user"
                value={user.name}
                checked={selectedUser?.name === user.name}
                onChange={() => setSelectedUser(user)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 ${user.color} ${
                  selectedUser?.name === user.name
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : ""
                }`}
              />
              <span className="font-medium text-gray-700">{user.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentDay = isToday(date);
            const isCurrentWeek = index < 7;
            const isNextWeek = index >= 7;
            const hasUserEvent =
              selectedUser &&
              dayEvents.some((event) => event.user.name === selectedUser.name);

            return (
              <div
                key={index}
                onClick={() => handleDayClick(date)}
                className={`
                  min-h-[100px] p-3 border-r border-b border-gray-200 cursor-pointer transition-all
                  hover:bg-gray-50 relative overflow-hidden
                  ${isCurrentDay ? "bg-blue-50 border-blue-300" : ""}
                  ${!selectedUser ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                {/* Numéro du jour */}
                <div className="text-sm font-medium text-gray-900 mb-2 relative z-10">
                  {date.getDate()}
                </div>

                {/* Événements divisés */}
                {dayEvents.length > 0 && (
                  <div className="absolute inset-0 flex">
                    {dayEvents.map((event, eventIndex) => {
                      const width = `${100 / dayEvents.length}%`;
                      return (
                        <div
                          key={`${event.date}-${event.user.name}`}
                          className={`${event.user.color} opacity-50 flex items-center justify-center`}
                          style={{ width }}
                        >
                          <div
                            className={`${event.user.color} text-white px-1 py-0.5 rounded text-xs font-medium`}
                          >
                            {event.user.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Indicateur de sélection */}
                {selectedUser && !hasUserEvent && (
                  <div className="text-xs text-gray-400 mt-2 relative z-10">
                    Cliquez pour ajouter {selectedUser.name}
                  </div>
                )}

                {/* Indicateur de suppression */}
                {selectedUser && hasUserEvent && (
                  <div className="text-xs text-gray-600 mt-2 relative z-10 font-medium">
                    Cliquez pour retirer {selectedUser.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statut de synchronisation */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>✅ Données synchronisées avec Vercel KV</p>
        {Array.isArray(events) && events.length === 0 && (
          <p className="mt-2 text-gray-400">
            Aucun événement enregistré - le calendrier est vide
          </p>
        )}
      </div>
    </div>
  );
}
