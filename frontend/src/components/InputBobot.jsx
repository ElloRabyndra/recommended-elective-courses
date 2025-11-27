import { CheckCircle2, Loader2 } from "lucide-react";

const InputBobot = ({
  kriteria,
  bobot,
  loading,
  handleSubmit,
  handleBobotChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-5">
        Tentukan Tingkat Kepentingan Kriteria
      </h3>
      <div className="space-y-4">
        {kriteria.map((k) => (
          <div
            key={k.kode}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-1">
              <label className="font-medium text-gray-900 block mb-1">
                {k.nama}
              </label>
              <p className="text-xs text-gray-500">
                Tipe:{" "}
                <span
                  className={
                    k.tipe === "Benefit" ? "text-green-600" : "text-blue-600"
                  }
                >
                  {k.tipe}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={bobot[k.kode] || 3}
                onChange={(e) => handleBobotChange(k.kode, e.target.value)}
                className="w-32 accent-yellow-500"
              />
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={bobot[k.kode] || 3}
                onChange={(e) => handleBobotChange(k.kode, e.target.value)}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Menghitung Rekomendasi...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Hitung Rekomendasi
          </>
        )}
      </button>
    </div>
  );
};

export default InputBobot;
