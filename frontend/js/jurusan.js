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

let daftarJurusan = [];

let daftarFakultas = [];

// ==========================================
// AMBIL DATA PROGRAM STUDI
// ==========================================

async function getJurusan() {

    const response = await fetch(

        `${API}/jurusan`,

        { headers }

    );

    if (!response.ok) {

        throw new Error("Gagal mengambil data Program Studi");

    }

    daftarJurusan = await response.json();

}

// ==========================================
// AMBIL DATA FAKULTAS
// ==========================================

async function getFakultas() {

    const response = await fetch(

        `${API}/fakultas`,

        { headers }

    );

    if (!response.ok) {

        throw new Error("Gagal mengambil data Fakultas");

    }

    daftarFakultas = await response.json();

}

// ==========================================
// ISI DROPDOWN FAKULTAS
// ==========================================

function isiDropdownFakultas() {

    const tambah = document.getElementById("fakultasTambah");

    const edit = document.getElementById("editFakultas");

    tambah.innerHTML =
        `<option value="">-- Pilih Fakultas --</option>`;

    edit.innerHTML =
        `<option value="">-- Pilih Fakultas --</option>`;

    daftarFakultas.forEach(f => {

        tambah.innerHTML += `

            <option value="${f.id}">

                ${f.nama_fakultas}

            </option>

        `;

        edit.innerHTML += `

            <option value="${f.id}">

                ${f.nama_fakultas}

            </option>

        `;

    });

}
// ==========================================
// LOAD DATA
// ==========================================

async function loadData() {

    try {

        await getJurusan();

        await getFakultas();

        isiDropdownFakultas();

        tampilkanTabel();

        isiStatistik();

    }

    catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Error",

            text: error.message

        });

    }

}

// ==========================================
// TAMPILKAN TABEL
// ==========================================

function tampilkanTabel() {

    const tbody = document.getElementById("dataJurusan");

    tbody.innerHTML = "";

    daftarJurusan.forEach((jurusan, index) => {

        const fakultas = daftarFakultas.find(

            f => f.id == jurusan.fakultas_id

        );

        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${jurusan.kode}</td>

                <td>${jurusan.nama_jurusan}</td>

                <td>${fakultas ? fakultas.nama_fakultas : "-"}</td>

                <td class="text-center">

                    <button
                        class="btn-action btn-edit"
                        onclick="editJurusan(${jurusan.id})">

                        <i class="bi bi-pencil-square"></i>

                    </button>

                    <button
                        class="btn-action btn-delete"
                        onclick="hapusJurusan(${jurusan.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

    document.getElementById("jumlahData").innerHTML =

        `Menampilkan ${daftarJurusan.length} Program Studi`;

}

// ==========================================
// STATISTIK
// ==========================================

function isiStatistik() {

    document.getElementById("totalJurusan").innerHTML =

        daftarJurusan.length;

    document.getElementById("totalFakultas").innerHTML =

        daftarFakultas.length;

    let namaFakultas = "-";

    let jumlahTerbanyak = 0;

    daftarFakultas.forEach(fakultas => {

        const jumlah = daftarJurusan.filter(

            jurusan => jurusan.fakultas_id == fakultas.id

        ).length;

        if (jumlah > jumlahTerbanyak) {

            jumlahTerbanyak = jumlah;

            namaFakultas = fakultas.nama_fakultas;

        }

    });

    document.getElementById("fakultasTerbanyak").innerHTML =

        namaFakultas;

    document.getElementById("jumlahProdiTerbanyak").innerHTML =

        jumlahTerbanyak + " Program Studi";

}
// ==========================================
// SEARCH PROGRAM STUDI
// ==========================================

function cariJurusan() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const hasil = daftarJurusan.filter(j =>

        j.kode.toLowerCase().includes(keyword) ||

        j.nama_jurusan.toLowerCase().includes(keyword)

    );

    const tbody = document.getElementById("dataJurusan");

    tbody.innerHTML = "";

    hasil.forEach((jurusan, index) => {

        const fakultas = daftarFakultas.find(

            f => f.id == jurusan.fakultas_id

        );

        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${jurusan.kode}</td>

                <td>${jurusan.nama_jurusan}</td>

                <td>${fakultas ? fakultas.nama_fakultas : "-"}</td>

                <td class="text-center">

                    <button
                        class="btn-action btn-edit"
                        onclick="editJurusan(${jurusan.id})">

                        <i class="bi bi-pencil-square"></i>

                    </button>

                    <button
                        class="btn-action btn-delete"
                        onclick="hapusJurusan(${jurusan.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}

// ==========================================
// TAMBAH PROGRAM STUDI
// ==========================================

document.getElementById("formTambahJurusan")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const data = {

        kode: document.getElementById("kodeTambah").value,

        nama_jurusan: document.getElementById("namaTambah").value,

        fakultas_id: parseInt(

            document.getElementById("fakultasTambah").value

        )

    };

    const response = await fetch(

        `${API}/jurusan`,

        {

            method: "POST",

            headers,

            body: JSON.stringify(data)

        }

    );

    if(response.ok){

        bootstrap.Modal
        .getInstance(
            document.getElementById("modalTambah")
        ).hide();

        Swal.fire({

            icon:"success",

            title:"Berhasil",

            text:"Program Studi berhasil ditambahkan",

            timer:1500,

            showConfirmButton:false

        });

        document
            .getElementById("formTambahJurusan")
            .reset();

        loadData();

    }else{

        Swal.fire({

            icon:"error",

            title:"Gagal",

            text:"Program Studi gagal ditambahkan."

        });

    }

});

// ==========================================
// EDIT PROGRAM STUDI
// ==========================================

function editJurusan(id){

    const jurusan = daftarJurusan.find(

        j => j.id == id

    );

    document.getElementById("editId").value = jurusan.id;

    document.getElementById("editKode").value = jurusan.kode;

    document.getElementById("editNama").value = jurusan.nama_jurusan;

    document.getElementById("editFakultas").value =
        jurusan.fakultas_id;

    new bootstrap.Modal(

        document.getElementById("modalEdit")

    ).show();

}

// ==========================================
// SIMPAN EDIT
// ==========================================

document.getElementById("formEditJurusan")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const id = document.getElementById("editId").value;

    const data = {

        kode: document.getElementById("editKode").value,

        nama_jurusan: document.getElementById("editNama").value,

        fakultas_id: parseInt(

            document.getElementById("editFakultas").value

        )

    };

    const response = await fetch(

        `${API}/jurusan/${id}`,

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
        ).hide();

        Swal.fire({

            icon:"success",

            title:"Berhasil",

            text:"Program Studi berhasil diperbarui",

            timer:1500,

            showConfirmButton:false

        });

        loadData();

    }else{

        Swal.fire({

            icon:"error",

            title:"Gagal",

            text:"Program Studi gagal diperbarui."

        });

    }

});
// ==========================================
// HAPUS PROGRAM STUDI
// ==========================================

async function hapusJurusan(id){

    const konfirmasi = await Swal.fire({

        title:"Hapus Program Studi?",

        text:"Data yang dihapus tidak dapat dikembalikan.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonColor:"#dc3545",

        cancelButtonColor:"#6c757d",

        confirmButtonText:"Ya, Hapus",

        cancelButtonText:"Batal"

    });

    if(!konfirmasi.isConfirmed){

        return;

    }

    try{

        const response = await fetch(

            `${API}/jurusan/${id}`,

            {

                method:"DELETE",

                headers

            }

        );

        if(response.ok){

            Swal.fire({

                icon:"success",

                title:"Berhasil",

                text:"Program Studi berhasil dihapus",

                timer:1500,

                showConfirmButton:false

            });

            loadData();

        }

        else{

            const err = await response.json();

            Swal.fire({

                icon:"error",

                title:"Gagal",

                text:err.detail || "Program Studi gagal dihapus"

            });

        }

    }

    catch(error){

        console.error(error);

        Swal.fire({

            icon:"error",

            title:"Error",

            text:"Terjadi kesalahan pada server."

        });

    }

}

// ==========================================
// REFRESH DATA
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