import EventDivider from "./EventDivider";
import ColonneSemaine from "./colonneSemaine";

interface User {
  name: string;
  color: string;
}

interface DayEvent {
  date: string;
  user: User;
  time?: string;
}

interface SemaineProps {
  days: Date[];
  dayNames: string[];
  isMobile: boolean;
  today: Date;
  events: DayEvent[];
  onDayClick: (date: Date) => void;
  getEventsForDate: (date: Date) => DayEvent[];
  isToday: (date: Date) => boolean;
}

export default function Semaine({
  days,
  dayNames,
  isMobile,
  today,
  events,
  onDayClick,
  getEventsForDate,
  isToday,
}: SemaineProps) {
  if (isMobile) {
    // Affichage mobile : 3 colonnes (jours, semaine actuelle, semaine suivante)
    return (
      <div className="grid grid-cols-[30px_1fr_1fr]">
        {/* Colonne 1 : Jours de la semaine */}
        <div className="bg-gray-700">
          {dayNames.map((dayName, index) => {
            // Vérifier si ce jour correspond au jour actuel
            const currentDayIndex = today.getDay();
            const adjustedDayIndex =
              currentDayIndex === 0 ? 6 : currentDayIndex - 1; // Lundi = 0, Dimanche = 6
            const isCurrentDayOfWeek = index === adjustedDayIndex;

            return (
              <div
                key={dayName}
                className={`p-2 text-center font-medium text-gray-300 border-b-2 border-gray-600 min-h-[100px] flex items-center justify-center text-sm  ${
                  isCurrentDayOfWeek ? "bg-blue-800" : ""
                }`}
              >
                {dayName}
              </div>
            );
          })}
        </div>

        {/* Colonne 2 : Semaine actuelle */}
        <ColonneSemaine
          days={days}
          startIndex={0}
          endIndex={7}
          isMobile={isMobile}
          onDayClick={onDayClick}
          getEventsForDate={getEventsForDate}
          isToday={isToday}
        />

        {/* Colonne 3 : Semaine suivante */}
        <ColonneSemaine
          days={days}
          startIndex={7}
          endIndex={14}
          isMobile={isMobile}
          onDayClick={onDayClick}
          getEventsForDate={getEventsForDate}
          isToday={isToday}
        />
      </div>
    );
  }

  // Affichage desktop : grille classique 7 colonnes
  return (
    <>
      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 bg-gray-700">
        {dayNames.map((dayName, index) => {
          // Vérifier si ce jour correspond au jour actuel
          const currentDayIndex = today.getDay();
          const adjustedDayIndex =
            currentDayIndex === 0 ? 6 : currentDayIndex - 1; // Lundi = 0, Dimanche = 6
          const isCurrentDayOfWeek = index === adjustedDayIndex;

          return (
            <div
              key={dayName}
              className={`p-4 text-center font-semibold text-gray-300 border-r-2 border-gray-600 last:border-r-0 ${
                isCurrentDayOfWeek ? "bg-blue-800" : ""
              }`}
            >
              {dayName}
            </div>
          );
        })}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={index}
              onClick={() => onDayClick(date)}
              className={`
                 min-h-[100px] p-3 border-r-2 border-b-2 border-gray-600 cursor-pointer transition-all
                 hover:bg-gray-700 relative overflow-hidden
                 ${isCurrentDay ? "bg-blue-900 border-blue-600" : ""}
               `}
            >
              {/* Numéro du jour */}
              <div
                className={`text-sm text-gray-100 mb-2 relative z-10 ${
                  isCurrentDay ? "font-bold underline" : "font-medium"
                }`}
              >
                {date.getDate()}
              </div>

              {/* Événements divisés */}
              <EventDivider events={dayEvents} isMobile={isMobile} />
            </div>
          );
        })}
      </div>
    </>
  );
}
