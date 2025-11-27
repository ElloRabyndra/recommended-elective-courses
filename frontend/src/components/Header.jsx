import { GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-yellow-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sistem Rekomendasi Mata Kuliah Pilihan Semester 5
            </h1>
            <p className="text-sm text-gray-600">
              Metode SWARA untuk Pemilihan Mata Kuliah Pilihan Semester 5
              Fakultas Ilmu Komputer - Teknik Informatika
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
