from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Dict, List
import numpy as np
import pandas as pd

app = FastAPI(title="SWARA-SAW Course Recommendation API")

# CORS middleware untuk akses dari frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DATA STATIS
ALTERNATIF = {
    'A1': 'Pembelajaran Mesin',
    'A2': 'Data Science',
    'A3': 'Pengenalan Pola',
    'A4': 'Manajemen Basis Data',
    'A5': 'Keamanan Jaringan Komputer',
    'A6': 'Animasi dan Multimedia'
}

KRITERIA_INFO = {
    'C1': {'nama': 'Prasyarat Akademik', 'tipe': 0},  # Cost
    'C2': {'nama': 'Bidang Minat / Spesialisasi', 'tipe': 1},  # Benefit
    'C3': {'nama': 'Kesinambungan Kurikulum', 'tipe': 1},  # Benefit
    'C4': {'nama': 'Relevansi terhadap Dunia Kerja dan Industri', 'tipe': 1},  # Benefit
    'C5': {'nama': 'Tingkat Kesulitan Materi', 'tipe': 0}  # Cost
}

# Matriks Keputusan (Data Rating) - Tetap
MATRIKS_X = [
    [4, 5, 5, 5, 5],  # A1: Pembelajaran Mesin
    [3, 4, 4, 5, 4],  # A2: Data Science
    [4, 4, 3, 4, 3],  # A3: Pengenalan Pola
    [2, 3, 5, 4, 2],  # A4: Manajemen Basis Data
    [3, 5, 4, 4, 3],  # A5: Keamanan Jaringan Komputer
    [1, 3, 3, 3, 2]   # A6: Animasi dan Multimedia
]

# Nilai Sj default (bisa disesuaikan)
DEFAULT_SJ = {
    'C1': 0.3,
    'C2': 0.2,
    'C3': 0.1,
    'C4': 0.0,  # Kriteria paling penting
    'C5': 0.4
}

# Pydantic Models
class KriteriaBobotInput(BaseModel):
    C1: float
    C2: float
    C3: float
    C4: float
    C5: float
    
    @validator('C1', 'C2', 'C3', 'C4', 'C5')
    def validate_range(cls, v):
        if not (1 <= v <= 5):
            raise ValueError('Nilai tj harus antara 1 dan 5')
        return v
    
    @validator('C5')
    def validate_unique(cls, v, values):
        all_values = list(values.values()) + [v]
        if len(all_values) != len(set(all_values)):
            raise ValueError('Nilai tj harus unik (tidak boleh sama)')
        return v

class RekomendasiResponse(BaseModel):
    alternatif: str
    nilai_preferensi: float
    peringkat: int

class HasilResponse(BaseModel):
    bobot_kriteria: Dict[str, float]
    urutan_kriteria: List[str]
    rekomendasi: List[RekomendasiResponse]
    kesimpulan: str


# FUNGSI PERHITUNGAN
def hitung_swara(tj_dict: Dict[str, float]) -> Dict[str, float]:
    """
    Menghitung bobot kriteria menggunakan metode SWARA
    """
    # Urutkan kriteria berdasarkan tj (tertinggi ke terendah)
    sorted_kriteria = sorted(tj_dict.items(), key=lambda x: x[1], reverse=True)
    
    # Siapkan data untuk perhitungan
    df_data = []
    for i, (kode, tj_val) in enumerate(sorted_kriteria):
        if i == 0:
            sj = 0.0  # Kriteria paling penting
        else:
            # Ambil Sj dari kode sebelumnya (atau gunakan default)
            sj = DEFAULT_SJ.get(kode, 0.1)
        
        df_data.append({
            'Kode': kode,
            'tj': tj_val,
            'Sj': sj
        })
    
    df_swara = pd.DataFrame(df_data)
    
    # Hitung Kj
    Kj = []
    for i, row in df_swara.iterrows():
        if i == 0:
            Kj.append(1.0)
        else:
            Kj.append(row['Sj'] + 1)
    df_swara['Kj'] = Kj
    
    # Hitung Qj
    Qj = []
    for i, kj_val in enumerate(df_swara['Kj']):
        if i == 0:
            Qj.append(1.0)
        else:
            Qj.append(Qj[-1] / kj_val)
    df_swara['Qj'] = Qj
    
    # Hitung Wj
    sigma_qj = sum(Qj)
    Wj = [q / sigma_qj for q in Qj]
    df_swara['Wj'] = Wj
    
    # Return bobot dalam format dict dengan urutan C1-C5
    bobot_dict = dict(zip(df_swara['Kode'], df_swara['Wj']))
    return bobot_dict, df_swara['Kode'].tolist()


def hitung_saw(bobot_dict: Dict[str, float]) -> pd.DataFrame:
    """
    Menghitung ranking menggunakan metode SAW
    """
    # Buat DataFrame Matriks X
    df_X = pd.DataFrame(MATRIKS_X, 
                        index=ALTERNATIF.values(), 
                        columns=['C1', 'C2', 'C3', 'C4', 'C5'])
    
    # Normalisasi
    df_R = df_X.copy()
    max_vals = df_X.max()
    min_vals = df_X.min()
    
    for kode in df_X.columns:
        tipe = KRITERIA_INFO[kode]['tipe']
        if tipe == 1:  # Benefit
            df_R[kode] = df_X[kode] / max_vals[kode]
        else:  # Cost
            df_R[kode] = min_vals[kode] / df_X[kode]
    
    # Hitung Nilai Preferensi
    bobot_array = np.array([bobot_dict[k] for k in ['C1', 'C2', 'C3', 'C4', 'C5']])
    V_scores = df_R.values.dot(bobot_array)
    
    # Buat DataFrame hasil
    results = pd.DataFrame({
        'Alternatif': ALTERNATIF.values(),
        'Nilai Preferensi': V_scores
    })
    
    results['Peringkat'] = results['Nilai Preferensi'].rank(ascending=False, method='min').astype(int)
    results = results.sort_values(by='Nilai Preferensi', ascending=False).reset_index(drop=True)
    
    return results


# API ENDPOINTS
@app.get("/")
def root():
    return {
        "message": "SWARA-SAW Course Recommendation API",
        "version": "1.0",
        "endpoints": {
            "/kriteria": "GET - Daftar kriteria",
            "/alternatif": "GET - Daftar mata kuliah",
            "/hitung": "POST - Hitung rekomendasi"
        }
    }

@app.get("/kriteria")
def get_kriteria():
    """Mendapatkan daftar kriteria"""
    return {
        "kriteria": [
            {
                "kode": kode,
                "nama": info["nama"],
                "tipe": "Benefit" if info["tipe"] == 1 else "Cost"
            }
            for kode, info in KRITERIA_INFO.items()
        ]
    }

@app.get("/alternatif")
def get_alternatif():
    """Mendapatkan daftar mata kuliah"""
    return {
        "alternatif": [
            {"kode": kode, "nama": nama}
            for kode, nama in ALTERNATIF.items()
        ]
    }

@app.post("/hitung", response_model=HasilResponse)
def hitung_rekomendasi(bobot: KriteriaBobotInput):
    """
    Menghitung rekomendasi mata kuliah berdasarkan bobot kriteria
    """
    try:
        # Konversi input ke dict
        tj_dict = bobot.dict()
        
        # Hitung SWARA
        bobot_kriteria, urutan_kriteria = hitung_swara(tj_dict)
        
        # Hitung SAW
        hasil_ranking = hitung_saw(bobot_kriteria)
        
        # Format response
        rekomendasi = [
            RekomendasiResponse(
                alternatif=row['Alternatif'],
                nilai_preferensi=round(row['Nilai Preferensi'], 6),
                peringkat=row['Peringkat']
            )
            for _, row in hasil_ranking.iterrows()
        ]
        
        kesimpulan = f"Mata kuliah terbaik untuk Anda adalah {hasil_ranking.iloc[0]['Alternatif']} dengan nilai preferensi {hasil_ranking.iloc[0]['Nilai Preferensi']:.4f}"
        
        return HasilResponse(
            bobot_kriteria={k: round(v, 6) for k, v in bobot_kriteria.items()},
            urutan_kriteria=urutan_kriteria,
            rekomendasi=rekomendasi,
            kesimpulan=kesimpulan
        )
         
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)