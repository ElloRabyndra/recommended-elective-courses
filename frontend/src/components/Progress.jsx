const Progress = ({ step }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4">
        <div
          className={`flex items-center gap-2 ${
            step === 1 ? "text-yellow-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step === 1 ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className="font-medium">Input Bobot</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300"></div>
        <div
          className={`flex items-center gap-2 ${
            step === 2 ? "text-yellow-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step === 2 ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className="font-medium">Hasil Rekomendasi</span>
        </div>
      </div>
    </div>
  );
};

export default Progress;
