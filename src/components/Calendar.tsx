"use client";

import { useState } from "react";

interface User {
  name: string;
  color: string;
}

interface DayEvent {
  date: string;
  user: User;
}

const users: User[] = [
  { name: "Flavio", color: "bg-blue-500" },
  { name: "Dagreat", color: "bg-yellow-500" },
  { name: "Aisen", color: "bg-pink-500" },
  { name: "Naarz", color: "bg-purple-500" },
];

export default function Calendar() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [events, setEvents] = useState<DayEvent[]>([]);

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
    return events.filter((event) => event.date === dateStr);
  };

  const handleDayClick = (date: Date) => {
    if (!selectedUser) return;

    const dateStr = formatDate(date);
    const existingEventIndex = events.findIndex(
      (event) => event.date === dateStr && event.user.name === selectedUser.name
    );

    if (existingEventIndex >= 0) {
      // Supprimer l'événement de cet utilisateur spécifique
      setEvents(events.filter((_, index) => index !== existingEventIndex));
    } else {
      // Ajouter un nouvel événement pour cet utilisateur
      setEvents([...events, { date: dateStr, user: selectedUser }]);
    }
  };

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    // max-w-4xl : définit une largeur maximale de 4xl (environ 56rem)
    // mx-auto  : centre horizontalement le div (marges automatiques à gauche et à droite)
    // p-6      : ajoute un padding (marge intérieure) de 1.5rem sur tous les côtés
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
