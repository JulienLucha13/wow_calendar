import { DayEvent } from "@/lib/db";

// Composant pour afficher les événements divisés
interface EventDividerProps {
  events: DayEvent[];
  isMobile: boolean;
}

export default function EventDivider({ events, isMobile }: EventDividerProps) {
  if (events.length === 0) return null;

  return (
    <div
      className={`absolute inset-0 flex ${isMobile ? "flex-col" : "flex-row"}`}
    >
      {events.map((event, eventIndex) => {
        const dimension = isMobile ? "height" : "width";
        const size = `${100 / events.length}%`;
        return (
          <div
            key={`${event.date}-${event.user.name}`}
            className={`${event.user.color}  flex flex-col items-center justify-center`}
            style={{ [dimension]: size }}
          >
            {!isMobile && (
              <div
                className={`${event.user.color} text-white px-1 py-0.5 rounded text-xs font-medium`}
              >
                {event.user.name}
              </div>
            )}
            {event.time && (
              <div className="text-white text-xs font-bold mt-1">
                {event.time}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
