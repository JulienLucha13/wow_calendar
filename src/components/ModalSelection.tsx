interface User {
  name: string;
  color: string;
}

interface ModalSelectionProps {
  showTimeModal: boolean;
  selectedUser: User | null;
  selectedTime: string;
  hours: string[];
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalSelection({
  showTimeModal,
  selectedUser,
  selectedTime,
  hours,
  onTimeChange,
  onConfirm,
  onCancel,
}: ModalSelectionProps) {
  if (!showTimeModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-200">
          Sélectionner une heure pour {selectedUser?.name}
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Heure :
          </label>
          <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-700"
          >
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
