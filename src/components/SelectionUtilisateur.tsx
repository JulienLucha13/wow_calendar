interface User {
  name: string;
  color: string;
}

interface SelectionUtilisateurProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

export default function SelectionUtilisateur({
  users,
  selectedUser,
  onUserSelect,
}: SelectionUtilisateurProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">
        Sélectionner un utilisateur :
      </h2>
      <div className="flex flex-wrap gap-4">
        {users.map((user) => (
          <label
            key={user.name}
            className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-md hover:shadow-gray-700"
            style={{
              borderColor:
                selectedUser?.name === user.name
                  ? user.color.replace("bg-", "")
                  : "#4b5563",
              backgroundColor:
                selectedUser?.name === user.name
                  ? `${user.color}20`
                  : "#374151",
            }}
          >
            <input
              type="radio"
              name="user"
              value={user.name}
              checked={selectedUser?.name === user.name}
              onChange={() => onUserSelect(user)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 ${user.color} ${
                selectedUser?.name === user.name
                  ? "ring-2 ring-offset-2 ring-gray-500"
                  : ""
              }`}
            />
            <span className="font-medium text-gray-300">{user.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
