import { TrendingUp } from "lucide-react";

const InfoCard = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Cara Pengisian Bobot
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              Berikan nilai 1-5 untuk setiap kriteria (5 = sangat penting, 1 =
              kurang penting)
            </li>
            <li>Setiap nilai harus unik (tidak boleh ada yang sama)</li>
            <li>
              Nilai tertinggi menunjukkan kriteria yang paling penting bagi Anda
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
