// ==========================================
// KONFIGURASI
// ==========================================

const API = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

const headers = {

    "Authorization": `Bearer ${token}`,

    "Content-Type": "application/json"

};

// ==========================================
// VARIABEL GLOBAL
// ==========================================

let daftarFakultas = [];

let daftarJurusan = [];

// ==========================================
// AMBIL DATA FAKULTAS
// ==========================================

async function getFakultas() {

    const response = await fetch(

        `${API}/fakultas`,

        { headers }

    );

    if (!response.ok) {

        throw new Error("Gagal mengambil data fakultas");

    }

    daftarFakultas = await response.json();

}

// ==========================================
// AMBIL DATA JURUSAN
// ==========================================

async function getJurusan() {

    const response = await fetch(

        `${API}/jurusan`,

        { headers }

    );

    if (!response.ok) {

        throw new Error("Gagal mengambil data jurusan");

    }

    daftarJurusan = await response.json();

}

// ==========================================
// LOAD DATA
// ==========================================

async function loadData() {

    try {

        await getFakultas();

        await getJurusan();

        tampilkanTabel();

        isiStatistik();

    }

    catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Error",

            text: "Gagal mengambil data dari server."

        });

    }

}

// ==========================================
// TAMPILKAN TABEL
// ==========================================

function tampilkanTabel() {

    const tbody = document.getElementById("dataFakultas");

    tbody.innerHTML = "";

    daftarFakultas.forEach((fakultas, index) => {

        // Hitung jumlah program studi

        const jumlahProdi = daftarJurusan.filter(

            jurusan => jurusan.fakultas_id == fakultas.id

        ).length;

        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${fakultas.kode}</td>

                <td>${fakultas.nama_fakultas}</td>

                <td>

                    <span class="badge-prodi">

                        ${jumlahProdi} Program Studi

                    </span>

                </td>

                <td class="text-center">

                    <button

                        class="btn-action btn-edit"

                        onclick="editFakultas(${fakultas.id})">

                        <i class="bi bi-pencil-square"></i>

                    </button>

                    <button

                        class="btn-action btn-delete"

                        onclick="hapusFakultas(${fakultas.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

    document.getElementById("jumlahData").innerHTML =

        `Menampilkan ${daftarFakultas.length} Fakultas`;

}

// ==========================================
// CARD STATISTIK
// ==========================================

function isiStatistik() {

    document.getElementById("totalFakultas").innerHTML =

        daftarFakultas.length;

    document.getElementById("totalJurusan").innerHTML =

        daftarJurusan.length;

    let rata = 0;

    if (daftarFakultas.length > 0) {

        rata = (

            daftarJurusan.length /

            daftarFakultas.length

        ).toFixed(1);

    }

    document.getElementById("rataProdi").innerHTML = rata;

}
// ==========================================
// SEARCH
// ==========================================

function cariFakultas() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(
        "#dataFakultas tr"
    );

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        row.style.display = text.includes(keyword)
            ? ""
            : "none";

    });

}

// ==========================================
// TAMBAH FAKULTAS
// ==========================================

document
.getElementById("formTambahFakultas")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const data = {

        kode: document
            .getElementById("kodeTambah")
            .value,

        nama_fakultas: document
            .getElementById("namaTambah")
            .value

    };

    const response = await fetch(

        `${API}/fakultas`,

        {

            method:"POST",

            headers,

            body:JSON.stringify(data)

        }

    );

    if(response.ok){

        bootstrap.Modal
        .getInstance(
            document.getElementById("modalTambah")
        )
        .hide();

        Swal.fire({

            icon:"success",

            title:"Berhasil",

            text:"Fakultas berhasil ditambahkan"

        });

        document
        .getElementById("formTambahFakultas")
        .reset();

        loadData();

    }else{

        Swal.fire({

            icon:"error",

            title:"Gagal",

            text:"Data gagal disimpan"

        });

    }

});

// ==========================================
// BUKA MODAL EDIT
// ==========================================

function editFakultas(id){

    const data = daftarFakultas.find(

        f => f.id == id

    );

    document.getElementById("editId").value = data.id;

    document.getElementById("editKode").value = data.kode;

    document.getElementById("editNama").value = data.nama_fakultas;

    new bootstrap.Modal(

        document.getElementById("modalEdit")

    ).show();

}

// ==========================================
// SIMPAN EDIT
// ==========================================

document
.getElementById("formEditFakultas")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const id = document
        .getElementById("editId")
        .value;

    const data = {

        kode: document
            .getElementById("editKode")
            .value,

        nama_fakultas: document
            .getElementById("editNama")
            .value

    };

    const response = await fetch(

        `${API}/fakultas/${id}`,

        {

            method:"PUT",

            headers,

            body:JSON.stringify(data)

        }

    );

    if(response.ok){

        bootstrap.Modal
        .getInstance(
            document.getElementById("modalEdit")
        )
        .hide();

        Swal.fire({

            icon:"success",

            title:"Berhasil",

            text:"Data berhasil diperbarui"

        });

        loadData();

    }else{

        Swal.fire({

            icon:"error",

            title:"Gagal",

            text:"Data gagal diperbarui"

        });

    }

});
// ==========================================
// HAPUS FAKULTAS
// ==========================================

async function hapusFakultas(id){

    const konfirmasi = await Swal.fire({

        title: "Hapus Fakultas?",

        text: "Data yang dihapus tidak dapat dikembalikan.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#dc3545",

        cancelButtonColor: "#6c757d",

        confirmButtonText: "Ya, Hapus",

        cancelButtonText: "Batal"

    });

    if(!konfirmasi.isConfirmed){

        return;

    }

    try{

        const response = await fetch(

            `${API}/fakultas/${id}`,

            {

                method: "DELETE",

                headers

            }

        );

        if(response.ok){

            Swal.fire({

                icon: "success",

                title: "Berhasil",

                text: "Fakultas berhasil dihapus",

                timer: 1500,

                showConfirmButton: false

            });

            loadData();

        }else{

            const err = await response.json();

            Swal.fire({

                icon: "error",

                title: "Gagal",

                text: err.detail || "Data tidak dapat dihapus"

            });

        }

    }

    catch(error){

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Error",

            text: "Terjadi kesalahan pada server."

        });

    }

}

// ==========================================
// REFRESH
// ==========================================

function refreshData(){

    loadData();

}

// ==========================================
// LOGOUT
// ==========================================

function logout(){

    Swal.fire({

        title:"Logout?",

        text:"Yakin ingin keluar?",

        icon:"question",

        showCancelButton:true,

        confirmButtonText:"Logout",

        cancelButtonText:"Batal"

    }).then((result)=>{

        if(result.isConfirmed){

            localStorage.removeItem("token");

            window.location.href="login.html";

        }

    });

}

// ==========================================
// INIT
// ==========================================

window.onload = function(){

    loadData();

};