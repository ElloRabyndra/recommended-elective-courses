import { Award } from "lucide-react";

const Rekomendasi = ({ hasil, getRankColor, handleReset }) => {
  return (
    <div className="space-y-6">
      {/* Kesimpulan */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <Award className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-xl mb-2">Rekomendasi Terbaik</h3>
            <p className="text-yellow-50">{hasil.kesimpulan}</p>
          </div>
        </div>
      </div>

      {/* Ranking Mata Kuliah */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Ranking Mata Kuliah
        </h3>
        <div className="space-y-3">
          {hasil.rekomendasi.map((rek) => (
            <div
              key={rek.alternatif}
              className={`p-4 rounded-lg border-2 ${
                rek.peringkat === 1
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${getRankColor(
                    rek.peringkat
                  )} rounded-full flex items-center justify-center font-bold text-lg ${
                    rek.peringkat <= 3 ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {rek.peringkat}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {rek.alternatif}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Nilai Preferensi:{" "}
                    <span className="font-semibold text-gray-900">
                      {rek.nilai_preferensi.toFixed(4)}
                    </span>
                  </p>
                </div>
                {rek.peringkat === 1 && (
                  <Award className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="flex-1 bg-white border-2 border-yellow-500 text-yellow-600 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-50 transition-colors"
        >
          Hitung Ulang dengan Bobot Baru
        </button>
      </div>
    </div>
  );
};

export default Rekomendasi;
