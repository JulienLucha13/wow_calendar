"use client";

import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useEffect, useState } from "react";
import Erreur from "./Erreur";
import ModalSelection from "./ModalSelection";
import SelectionUtilisateur from "./SelectionUtilisateur";
import Semaine from "./semaine/Semaine";

interface User {
  name: string;
  color: string;
}

interface DayEvent {
  date: string;
  user: User;
  time?: string;
}

const users: User[] = [
  { name: "Flavio", color: "flavioColor" },
  { name: "Dagreat", color: "dagreatColor" },
  { name: "Aisen", color: "aisenColor" },
  { name: "Naarz", color: "naarzColor" },
];

// Générer les heures de 00:00 à 23:00
const generateHours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    hours.push(`${hour}:00`);
  }
  return hours;
};

export default function Calendar() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [isMobile, setIsMobile] = useState(false);
  const { events, loading, error, addEvent, removeEvent } = useCalendarEvents();

  const hours = generateHours();

  useEffect(() => {
    setIsMobile(window.innerWidth <= 640);
  }, []);

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

    const dateStr = formatDate(date);
    const dayEvents = getEventsForDate(date);
    const existingEvent = dayEvents.find(
      (event) => event.user.name === selectedUser.name
    );

    if (existingEvent) {
      // Supprimer l'événement de cet utilisateur spécifique
      console.log("🗑️ Suppression de l'événement existant");
      try {
        await removeEvent(dateStr, selectedUser.name);
      } catch (err) {
        console.error("❌ Erreur lors de la suppression de l'événement:", err);
        alert(
          `Erreur: ${err instanceof Error ? err.message : "Erreur inconnue"}`
        );
      }
    } else {
      // Ouvrir le modal pour sélectionner l'heure
      setSelectedDate(date);
      setSelectedTime("12:00");
      setShowTimeModal(true);
    }
  };

  const handleTimeConfirm = async () => {
    if (!selectedUser || !selectedDate) return;

    try {
      console.log("➕ Ajout d'un nouvel événement avec heure:", selectedTime);
      const dateStr = formatDate(selectedDate);
      await addEvent({
        date: dateStr,
        user: selectedUser,
        time: selectedTime,
      });
      setShowTimeModal(false);
      setSelectedDate(null);
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout de l'événement:", err);
      alert(
        `Erreur: ${err instanceof Error ? err.message : "Erreur inconnue"}`
      );
    }
  };

  const handleTimeCancel = () => {
    setShowTimeModal(false);
    setSelectedDate(null);
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
    return <Erreur error={error} />;
  }

  return (
    <div
      className="max-w-9xl mx-auto p-6"
      style={{
        width: isMobile ? "100%" : "80%",
      }}
    >
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Calendrier WoW
      </h1>

      <SelectionUtilisateur
        users={users}
        selectedUser={selectedUser}
        onUserSelect={setSelectedUser}
      />

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Semaine
          days={days}
          dayNames={dayNames}
          isMobile={isMobile}
          today={today}
          events={events}
          onDayClick={handleDayClick}
          getEventsForDate={getEventsForDate}
          isToday={isToday}
        />
      </div>

      {/* Statut de synchronisation */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>✅ Données synchronisées avec Neon PostgreSQL</p>
        {Array.isArray(events) && events.length === 0 && (
          <p className="mt-2 text-gray-400">
            Aucun événement enregistré - le calendrier est vide
          </p>
        )}
      </div>

      <ModalSelection
        showTimeModal={showTimeModal}
        selectedUser={selectedUser}
        selectedTime={selectedTime}
        hours={hours}
        onTimeChange={setSelectedTime}
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
      />
    </div>
  );
}
