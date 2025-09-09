interface ErreurProps {
  error: string;
}

export default function Erreur({ error }: ErreurProps) {
  return (
    <div className="max-w-9xl mx-auto p-6">
      <div className="bg-red-900 border border-red-700 rounded-lg p-4">
        <h2 className="text-red-200 font-semibold mb-2">
          Erreur de chargement
        </h2>
        <p className="text-red-300">{error}</p>
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
