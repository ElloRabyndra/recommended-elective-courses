import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Award,
  BarChart3,
} from "lucide-react";
import { getKriteria, getAlternatif, hitungRekomendasi } from "../service/api";
import Header from "../components/Header";
import Progress from "../components/Progress";
import InfoCard from "../components/InfoCard";
import AlternatifPreview from "../components/AlternatifPreview";
import InputBobot from "../components/InputBobot";
import Rekomendasi from "../components/Rekomendasi";
import Footer from "../components/Footer";

function Home() {
  const [kriteria, setKriteria] = useState([]);
  const [alternatif, setAlternatif] = useState([]);
  const [bobot, setBobot] = useState({});
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [kriteriaData, alternatifData] = await Promise.all([
        getKriteria(),
        getAlternatif(),
      ]);

      setKriteria(kriteriaData.kriteria);
      setAlternatif(alternatifData.alternatif);

      // Initialize bobot dengan nilai default
      const initialBobot = {};
      kriteriaData.kriteria.forEach((k, index) => {
        initialBobot[k.kode] = 5 - index;
      });
      setBobot(initialBobot);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBobotChange = (kode, value) => {
    const numValue = parseFloat(value);
    if (numValue >= 1 && numValue <= 5) {
      setBobot((prev) => ({ ...prev, [kode]: numValue }));
      setError(null);
    }
  };

  const validateBobot = () => {
    const values = Object.values(bobot);
    const uniqueValues = new Set(values);

    if (uniqueValues.size !== values.length) {
      setError("Nilai bobot harus unik (tidak boleh ada yang sama)");
      return false;
    }

    if (values.some((v) => v < 1 || v > 5)) {
      setError("Nilai bobot harus antara 1 sampai 5");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateBobot()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await hitungRekomendasi(bobot);
      setHasil(result);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setHasil(null);
    setError(null);
    fetchInitialData();
  };

  const getRankColor = (peringkat) => {
    if (peringkat === 1) return "bg-yellow-500";
    if (peringkat === 2) return "bg-yellow-400";
    if (peringkat === 3) return "bg-yellow-300";
    return "bg-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      {/* Header */}
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <Progress step={step} />

        {/* Error Alert */}
        {error && <Error error={error} />}

        {/* Step 1: Input Bobot */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Info Card */}
            <InfoCard />

            {/* Alternatif Preview */}
            <AlternatifPreview alternatif={alternatif} />

            {/* Input Bobot */}
            <InputBobot
              kriteria={kriteria}
              bobot={bobot}
              loading={loading}
              handleSubmit={handleSubmit}
              handleBobotChange={handleBobotChange}
            />
          </div>
        )}

        {/* Step 2: Hasil Rekomendasi */}
        {step === 2 && hasil && (
          <Rekomendasi
            hasil={hasil}
            getRankColor={getRankColor}
            handleReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
