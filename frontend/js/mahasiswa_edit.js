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
// AMBIL ID MAHASASISWA
// contoh:
// mahasiswa_edit.html?id=5
// ======================================================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

if (!id) {

    alert("ID Mahasiswa tidak ditemukan.");

    window.location.href = "mahasiswa.html";

}

// ======================================================
// LOAD FAKULTAS
// ======================================================

async function loadFakultas() {

    try {

        const response = await fetch(

            `${API}/fakultas`,

            {

                headers

            }

        );

        if (!response.ok) {

            throw new Error("Gagal memuat data fakultas");

        }

        const data = await response.json();

        const select = document.getElementById("fakultas_id");

        select.innerHTML =

            `<option value="">Pilih Fakultas</option>`;

        data.forEach(f => {

            select.innerHTML += `

                <option value="${f.id}">

                    ${f.nama_fakultas}

                </option>

            `;

        });

    }

    catch (err) {

        alert(err.message);

    }

}

// ======================================================
// LOAD JURUSAN
// ======================================================

async function loadJurusan() {

    try {

        const response = await fetch(

            `${API}/jurusan`,

            {

                headers

            }

        );

        if (!response.ok) {

            throw new Error("Gagal memuat data jurusan");

        }

        const data = await response.json();

        const select = document.getElementById("jurusan_id");

        select.innerHTML =

            `<option value="">Pilih Program Studi</option>`;

        data.forEach(j => {

            select.innerHTML += `

                <option value="${j.id}">

                    ${j.nama_jurusan}

                </option>

            `;

        });

    }

    catch (err) {

        alert(err.message);

    }

}

// ======================================================
// LOAD DATA MAHASISWA
// ======================================================

async function loadMahasiswa() {

    try {

        const response = await fetch(

            `${API}/mahasiswa/${id}`,

            {

                headers

            }

        );

        if (!response.ok) {

            throw new Error("Gagal memuat data mahasiswa");

        }

        const m = await response.json();

        // ===============================
        // IDENTITAS
        // ===============================

        document.getElementById("nim").value =
            m.nim || "";

        document.getElementById("nama").value =
            m.nama || "";

        document.getElementById("email").value =
            m.email || "";

        document.getElementById("no_hp").value =
            m.no_hp || "";

        // ===============================
        // BIODATA
        // ===============================

        document.getElementById("jenis_kelamin").value =
            m.jenis_kelamin || "";

        document.getElementById("tempat_lahir").value =
            m.tempat_lahir || "";

        document.getElementById("tanggal_lahir").value =
            m.tanggal_lahir || "";

        document.getElementById("alamat").value =
            m.alamat || "";

        // ===============================
        // AKADEMIK
        // ===============================

        document.getElementById("angkatan").value =
            m.angkatan || "";

        document.getElementById("semester").value =
            m.semester || "";

        // ===============================
        // DROPDOWN
        // ===============================

        if (m.fakultas_id) {

            document.getElementById("fakultas_id").value =
                m.fakultas_id;

        }

        if (m.jurusan_id) {

            document.getElementById("jurusan_id").value =
                m.jurusan_id;

        }

    }

    catch (err) {

        console.error(err);

        alert(err.message);

        window.location.href = "mahasiswa.html";

    }

}
// ======================================================
// UPDATE DATA MAHASISWA
// ======================================================

document.getElementById("formMahasiswa").addEventListener("submit", async function(e){

    e.preventDefault();

    const data = {

        nim: document.getElementById("nim").value.trim(),

        nama: document.getElementById("nama").value.trim(),

        email: document.getElementById("email").value.trim(),

        no_hp: document.getElementById("no_hp").value.trim(),

        jenis_kelamin: document.getElementById("jenis_kelamin").value,

        tempat_lahir: document.getElementById("tempat_lahir").value.trim(),

        tanggal_lahir: document.getElementById("tanggal_lahir").value,

        alamat: document.getElementById("alamat").value.trim(),

        fakultas_id: parseInt(document.getElementById("fakultas_id").value),

        jurusan_id: parseInt(document.getElementById("jurusan_id").value),

        angkatan: parseInt(document.getElementById("angkatan").value),

        semester: parseInt(document.getElementById("semester").value)

    };

    // ==========================
    // VALIDASI
    // ==========================

    if(

        !data.nim ||

        !data.nama ||

        isNaN(data.fakultas_id) ||

        isNaN(data.jurusan_id)

    ){

        alert("NIM, Nama, Fakultas, dan Program Studi wajib diisi.");

        return;

    }

    try{

        const response = await fetch(

            `${API}/mahasiswa/${id}`,

            {

                method:"PUT",

                headers,

                body:JSON.stringify(data)

            }

        );

        if(!response.ok){

            const err = await response.text();

            throw new Error(err);

        }

        alert("Data mahasiswa berhasil diperbarui.");

        window.location.href = `detail-mahasiswa.html?id=${id}`;

    }

    catch(err){

        console.error(err);

        alert("Gagal mengupdate mahasiswa.\n\n" + err.message);

    }

});

// ======================================================
// TOMBOL KEMBALI
// ======================================================

function kembali(){

    window.location.href = `detail-mahasiswa.html?id=${id}`;

}

// ======================================================
// LOGOUT
// ======================================================

function logout(){

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

// ======================================================
// INIT
// ======================================================

window.onload = async function(){

    try{

        await loadFakultas();

        await loadJurusan();

        await loadMahasiswa();

    }

    catch(err){

        console.error(err);

        alert("Gagal memuat halaman.");

    }

};