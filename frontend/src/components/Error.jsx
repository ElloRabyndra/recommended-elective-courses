import { AlertCircle } from "lucide-react";

const Error = ({ error }) => {
  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-red-800 font-medium">Terjadi Kesalahan</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    </div>
  );
};

export default Error;
