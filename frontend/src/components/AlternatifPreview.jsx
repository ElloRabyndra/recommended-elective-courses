import { BarChart3 } from "lucide-react";

const AlternatifPreview = ({ alternatif }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-yellow-600" />
        Daftar Mata Kuliah Pilihan
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        {alternatif.map((alt) => (
          <div
            key={alt.kode}
            className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-900">{alt.nama}</p>
            <p className="text-xs text-gray-500 mt-1">{alt.kode}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlternatifPreview;
