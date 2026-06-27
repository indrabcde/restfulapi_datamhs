// ======================================================
// KONFIGURASI
// ======================================================

const API = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};

// ======================================================
// AMBIL ID DARI URL
// ======================================================

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// ======================================================
// FORMAT TANGGAL
// ======================================================

function formatTanggal(tanggal){
    if(!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID", {
        day:"2-digit",
        month:"long",
        year:"numeric"
    });
}

// ======================================================
// SAFE SET TEXT
// ======================================================

function safeSet(id, value){
    const el = document.getElementById(id);
    if(el) el.textContent = value;
}

// ======================================================
// LOAD DETAIL MAHASISWA
// ======================================================

async function loadMahasiswa(){
    try{
        const response = await fetch(`${API}/mahasiswa/${id}`, { headers });
        if(!response.ok){
            throw new Error("Data mahasiswa tidak ditemukan");
        }
        const mhs = await response.json();

        // ambil jurusan & fakultas jika belum ada
        if(!mhs.jurusan || !mhs.fakultas){
            const jurusanRes = await fetch(`${API}/jurusan`, { headers });
            const jurusan = await jurusanRes.json();

            const fakultasRes = await fetch(`${API}/fakultas`, { headers });
            const fakultas = await fakultasRes.json();

            mhs.jurusan = jurusan.find(j => j.id == mhs.jurusan_id)?.nama_jurusan || "-";
            mhs.fakultas = fakultas.find(f => f.id == mhs.fakultas_id)?.nama_fakultas || "-";
        }

        tampilkanData(mhs);
    }
    catch(err){
        alert(err.message);
        window.location.href="mahasiswa.html";
    }
}

// ======================================================
// TAMPILKAN DATA
// ======================================================

function tampilkanData(mhs){
    safeSet("namaMahasiswa", mhs.nama);
    safeSet("nimMahasiswa", mhs.nim);
    safeSet("semester", mhs.semester);
    safeSet("angkatan", mhs.angkatan);
    safeSet("semesterCard", mhs.semester);
    safeSet("angkatanCard", mhs.angkatan);
    safeSet("email", mhs.email || "-");
    safeSet("hp", mhs.no_hp || "-");
    safeSet("jk", mhs.jenis_kelamin || "-");
    safeSet("tempatLahir", mhs.tempat_lahir || "-");
    safeSet("tglLahir", formatTanggal(mhs.tanggal_lahir));
    safeSet("alamat", mhs.alamat || "-");

    // Fakultas & Jurusan
    safeSet("fakultas", mhs.fakultas || mhs.fakultas_id || "-");
    safeSet("jurusan", mhs.jurusan || mhs.jurusan_id || "-");
    safeSet("fakultasCard", mhs.fakultas || mhs.fakultas_id || "-");
    safeSet("jurusanCard", mhs.jurusan || mhs.jurusan_id || "-");
}

// ======================================================
// EDIT
// ======================================================

function editMahasiswa(){
    window.location.href = `edit_mahasiswa.html?id=${id}`;
}

// ======================================================
// HAPUS
// ======================================================

async function hapusMahasiswa(){
    const konfirmasi = confirm("Yakin ingin menghapus mahasiswa ini?");
    if(!konfirmasi) return;

    try{
        const response = await fetch(`${API}/mahasiswa/${id}`, {
            method:"DELETE",
            headers
        });
        if(!response.ok){
            throw new Error("Gagal menghapus mahasiswa");
        }
        alert("Data berhasil dihapus");
        window.location.href="mahasiswa.html";
    }
    catch(err){
        alert(err.message);
    }
}

// ======================================================
// KEMBALI
// ======================================================

function kembali(){
    window.location.href="mahasiswa.html";
}

// ======================================================
// LOGOUT
// ======================================================

function logout(){
    localStorage.removeItem("token");
    window.location.href="login.html";
}

// ======================================================
// LOAD HALAMAN
// ======================================================

window.onload = function(){
    loadMahasiswa();
};


// ======================================================
// EDIT MAHASISWA
// ======================================================

// ======================================================
// EDIT MAHASISWA
// ======================================================

function editMahasiswa(){
    // Ambil id mahasiswa dari URL detail
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if(!id){
        alert("ID mahasiswa tidak ditemukan di URL");
        return;
    }

    // Redirect ke halaman edit dengan id mahasiswa
    window.location.href = `mahasiswa_edit.html?id=${id}`;
}

