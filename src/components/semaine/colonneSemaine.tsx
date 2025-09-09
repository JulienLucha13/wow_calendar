import EventDivider from "./EventDivider";

interface User {
  name: string;
  color: string;
}

interface DayEvent {
  date: string;
  user: User;
  time?: string;
}

interface ColonneSemaineProps {
  days: Date[];
  startIndex: number;
  endIndex: number;
  isMobile: boolean;
  onDayClick: (date: Date) => void;
  getEventsForDate: (date: Date) => DayEvent[];
  isToday: (date: Date) => boolean;
}

export default function ColonneSemaine({
  days,
  startIndex,
  endIndex,
  isMobile,
  onDayClick,
  getEventsForDate,
  isToday,
}: ColonneSemaineProps) {
  return (
    <div>
      {days.slice(startIndex, endIndex).map((date, index) => {
        const dayEvents = getEventsForDate(date);
        const isCurrentDay = isToday(date);

        return (
          <div
            key={startIndex + index}
            onClick={() => onDayClick(date)}
            className={`
               min-h-[100px] p-3 border-b-2 border-gray-600 cursor-pointer transition-all
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
  );
}
