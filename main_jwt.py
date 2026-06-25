from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

import requests
import os

from dotenv import load_dotenv

appjwt = FastAPI(
    title="Sistem Informasi Mahasiswa",
    version="1.0"
)

security = HTTPBearer()

appjwt.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
TABLE = os.getenv("TABLE")

BASE_URL = f"{SUPABASE_URL}/rest/v1/{TABLE}"

FAKULTAS_URL = f"{SUPABASE_URL}/rest/v1/fakultas"

JURUSAN_URL = f"{SUPABASE_URL}/rest/v1/jurusan"

class LoginRequest(BaseModel):

    email: str

    password: str

class Fakultas(BaseModel):

    kode: str

    nama_fakultas: str

class Jurusan(BaseModel):

    kode: str

    nama_jurusan: str

    fakultas_id: int

class Mahasiswa(BaseModel):

    nim: str

    nama: str

    email: str

    no_hp: str

    jenis_kelamin: str

    tempat_lahir: str

    tanggal_lahir: str

    alamat: str

    fakultas_id: int

    jurusan_id: int

    angkatan: int

    semester: int

def safe_json(response):

    try:

        if response.text:

            return response.json()

        return {
            "message": "success"
        }

    except:

        return {
            "raw": response.text
        }
    
@appjwt.post("/login")
def login(data: LoginRequest):

    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"

    headers = {

        "apikey": SUPABASE_KEY,

        "Content-Type": "application/json"

    }

    r = requests.post(

        url,

        headers=headers,

        json=data.dict()

    )

    if r.status_code != 200:

        raise HTTPException(

            status_code=401,

            detail=r.text

        )

    return r.json()

def verify_token(

    credentials: HTTPAuthorizationCredentials = Depends(security)

):

    token = credentials.credentials

    r = requests.get(

        f"{SUPABASE_URL}/auth/v1/user",

        headers={

            "apikey": SUPABASE_KEY,

            "Authorization": f"Bearer {token}"

        }

    )

    if r.status_code != 200:

        raise HTTPException(

            status_code=401,

            detail="Token tidak valid"

        )

    return token

def get_headers(token):

    return {

        "apikey": SUPABASE_KEY,

        "Authorization": f"Bearer {token}"

    }

@appjwt.get("/dashboard")
def dashboard(token=Depends(verify_token)):

    headers = get_headers(token)

    mahasiswa = requests.get(
        BASE_URL,
        headers=headers
    ).json()

    jurusan = requests.get(
        JURUSAN_URL,
        headers=headers
    ).json()

    fakultas = requests.get(
        FAKULTAS_URL,
        headers=headers
    ).json()

    total_mahasiswa = len(mahasiswa)
    total_jurusan = len(jurusan)
    total_fakultas = len(fakultas)

    if total_mahasiswa > 0:
        angkatan_terbaru = max(
            m["angkatan"] for m in mahasiswa
        )
    else:
        angkatan_terbaru = "-"

    return {

        "total_mahasiswa": total_mahasiswa,

        "total_jurusan": total_jurusan,

        "total_fakultas": total_fakultas,

        "angkatan_terbaru": angkatan_terbaru

    }

@appjwt.get("/fakultas")
def get_fakultas(token=Depends(verify_token)):

    headers = get_headers(token)

    r = requests.get(

        FAKULTAS_URL,

        headers=headers

    )

    return safe_json(r)

@appjwt.get("/jurusan")
def get_jurusan(token=Depends(verify_token)):

    headers = get_headers(token)

    r = requests.get(

        JURUSAN_URL,

        headers=headers

    )

    return safe_json(r)

@appjwt.get("/mahasiswa/{id}")
def detail_mahasiswa(

    id: int,

    token=Depends(verify_token)

):

    headers = get_headers(token)

    url = f"{BASE_URL}?id=eq.{id}"

    r = requests.get(

        url,

        headers=headers

    )

    data = r.json()

    if len(data) == 0:

        raise HTTPException(

            status_code=404,

            detail="Mahasiswa tidak ditemukan"

        )

    return data[0]

@appjwt.get("/mahasiswa")
def get_mahasiswa(token=Depends(verify_token)):

    headers = get_headers(token)

    mahasiswa = requests.get(
        BASE_URL,
        headers=headers
    ).json()

    jurusan = requests.get(
        JURUSAN_URL,
        headers=headers
    ).json()

    fakultas = requests.get(
        FAKULTAS_URL,
        headers=headers
    ).json()

    # =============================
    # Membuat dictionary jurusan
    # =============================

    jurusan_dict = {}

    for j in jurusan:

        jurusan_dict[j["id"]] = j

    # =============================
    # Membuat dictionary fakultas
    # =============================

    fakultas_dict = {}

    for f in fakultas:

        fakultas_dict[f["id"]] = f

    hasil = []

    for m in mahasiswa:

        data_jurusan = jurusan_dict.get(
            m["jurusan_id"]
        )

        if data_jurusan:

            data_fakultas = fakultas_dict.get(
                data_jurusan["fakultas_id"]
            )

            nama_jurusan = data_jurusan["nama_jurusan"]

            nama_fakultas = data_fakultas["nama_fakultas"]

        else:

            nama_jurusan = "-"

            nama_fakultas = "-"

        hasil.append({

            "id": m["id"],

            "nim": m["nim"],

            "nama": m["nama"],

            "email": m["email"],

            "no_hp": m["no_hp"],

            "jenis_kelamin": m["jenis_kelamin"],

            "tempat_lahir": m["tempat_lahir"],

            "tanggal_lahir": m["tanggal_lahir"],

            "alamat": m["alamat"],

            "semester": m["semester"],

            "angkatan": m["angkatan"],

            "jurusan": nama_jurusan,

            "fakultas": nama_fakultas

        })

    return hasil

@appjwt.get("/statistik")
def statistik(token=Depends(verify_token)):

    headers = get_headers(token)

    mahasiswa = requests.get(
        BASE_URL,
        headers=headers
    ).json()

    jurusan = requests.get(
        JURUSAN_URL,
        headers=headers
    ).json()

    fakultas = requests.get(
        FAKULTAS_URL,
        headers=headers
    ).json()

    # ===============================
    # Dictionary Fakultas
    # ===============================

    fakultas_dict = {}

    for f in fakultas:

        fakultas_dict[f["id"]] = f["nama_fakultas"]

    # ===============================
    # Dictionary Jurusan
    # ===============================

    jurusan_dict = {}

    for j in jurusan:

        jurusan_dict[j["id"]] = j

    # ===============================
    # Hitung Jurusan
    # ===============================

    jumlah_jurusan = {}

    # ===============================
    # Hitung Fakultas
    # ===============================

    jumlah_fakultas = {}

    for m in mahasiswa:

        data_jurusan = jurusan_dict.get(
            m["jurusan_id"]
        )

        if not data_jurusan:
            continue

        nama_jurusan = data_jurusan["nama_jurusan"]

        nama_fakultas = fakultas_dict.get(
            data_jurusan["fakultas_id"],
            "-"
        )

        jumlah_jurusan[nama_jurusan] = (
            jumlah_jurusan.get(nama_jurusan, 0) + 1
        )

        jumlah_fakultas[nama_fakultas] = (
            jumlah_fakultas.get(nama_fakultas, 0) + 1
        )

    per_jurusan = []

    for nama, jumlah in jumlah_jurusan.items():

        per_jurusan.append({

            "nama": nama,

            "jumlah": jumlah

        })

    per_fakultas = []

    for nama, jumlah in jumlah_fakultas.items():

        per_fakultas.append({

            "nama": nama,

            "jumlah": jumlah

        })

    return {

        "per_fakultas": per_fakultas,

        "per_jurusan": per_jurusan

    }
@appjwt.post("/mahasiswa")
def tambah_mahasiswa(mahasiswa: Mahasiswa, token=Depends(verify_token)):
    headers = get_headers(token)
    r = requests.post(BASE_URL, headers=headers, json=mahasiswa.dict())
    if r.status_code != 201:
        raise HTTPException(status_code=r.status_code, detail="Gagal menambahkan mahasiswa")
    return safe_json(r)

@appjwt.delete("/mahasiswa/{id}")
def delete_mahasiswa(id: int, token=Depends(verify_token)):
    headers = get_headers(token)
    url = f"{BASE_URL}?id=eq.{id}"
    r = requests.delete(url, headers=headers)
    if r.status_code != 204:
        raise HTTPException(status_code=r.status_code, detail="Gagal menghapus mahasiswa")
    return {"message": "Mahasiswa berhasil dihapus"}
@appjwt.put("/mahasiswa/{id}")
def update_mahasiswa(id: int, mahasiswa: Mahasiswa, token=Depends(verify_token)):

    headers = get_headers(token)

    headers["Content-Type"] = "application/json"

    headers["Prefer"] = "return=representation"

    url = f"{BASE_URL}?id=eq.{id}"

    r = requests.patch(          # gunakan PATCH
        url,
        headers=headers,
        json=mahasiswa.dict()
    )

    print("STATUS :", r.status_code)
    print("RESPONSE :", r.text)

    if r.status_code not in [200, 204]:

        raise HTTPException(
            status_code=r.status_code,
            detail=r.text
        )

    return safe_json(r)


    