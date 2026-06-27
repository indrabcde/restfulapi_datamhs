// ======================================================
// KONFIGURASI
// ======================================================

const API = "http://127.0.0.1:8000";   // ganti sesuai alamat backend kamu
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const headers = {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
};

// ======================================================
// LOAD FAKULTAS & JURUSAN
// ======================================================

async function loadOptions(){
  try {
    const fakultasRes = await fetch(`${API}/fakultas`, { headers });
    const fakultas = await fakultasRes.json();
    const jurusanRes = await fetch(`${API}/jurusan`, { headers });
    const jurusan = await jurusanRes.json();

    const fakultasSelect = document.getElementById("fakultas_id");
    fakultasSelect.innerHTML = "<option value=''>Pilih Fakultas</option>";
    fakultas.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.id;
      opt.textContent = f.nama_fakultas;
      fakultasSelect.appendChild(opt);
    });

    const jurusanSelect = document.getElementById("jurusan_id");
    jurusanSelect.innerHTML = "<option value=''>Pilih Program Studi</option>";
    jurusan.forEach(j => {
      const opt = document.createElement("option");
      opt.value = j.id;
      opt.textContent = j.nama_jurusan;
      jurusanSelect.appendChild(opt);
    });
  } catch(err){
    alert("Gagal memuat data fakultas/jurusan");
  }
}

// ======================================================
// SUBMIT FORM
// ======================================================

document.getElementById("formMahasiswa").addEventListener("submit", async function(e){
  e.preventDefault();

  const data = {
    nim: document.getElementById("nim").value,
    nama: document.getElementById("nama").value,
    email: document.getElementById("email").value,
    no_hp: document.getElementById("no_hp").value,
    jenis_kelamin: document.getElementById("jenis_kelamin").value,
    tempat_lahir: document.getElementById("tempat_lahir").value,
    tanggal_lahir: document.getElementById("tanggal_lahir").value,
    alamat: document.getElementById("alamat").value,
    semester: parseInt(document.getElementById("semester").value),
    angkatan: parseInt(document.getElementById("angkatan").value),
    fakultas_id: parseInt(document.getElementById("fakultas_id").value),
    jurusan_id: parseInt(document.getElementById("jurusan_id").value)
  };

  try {
    const response = await fetch(`${API}/mahasiswa`, {
      method: "POST",   // pastikan backend punya route POST /mahasiswa
      headers,
      body: JSON.stringify(data)
    });

    if(!response.ok){
      const errText = await response.text();
      throw new Error("Gagal menambahkan mahasiswa: " + errText);
    }

    alert("Mahasiswa berhasil ditambahkan");
    window.location.href = "mahasiswa.html";
  } catch(err){
    alert(err.message);
  }
});

// ======================================================
// NAVIGASI
// ======================================================

function kembali(){
  window.location.href="mahasiswa.html";
}

function logout(){
  localStorage.removeItem("token");
  window.location.href="login.html";
}

// ======================================================
// LOAD HALAMAN
// ======================================================

window.onload = loadOptions;
