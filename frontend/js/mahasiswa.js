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
// GLOBAL VARIABLE
// ======================================================

let mahasiswa = [];

let fakultas = [];

let jurusan = [];

let deleteId = null;

// ======================================================
// LOGOUT
// ======================================================

function showLogoutModal(){

    const modal = new bootstrap.Modal(

        document.getElementById("logoutModal")

    );

    modal.show();

}

function logout(){

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

// ======================================================
// FORMAT TANGGAL
// ======================================================

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString(

        "id-ID",

        {

            day:"2-digit",

            month:"long",

            year:"numeric"

        }

    );

}

// ======================================================
// LOAD DASHBOARD CARD
// ======================================================

async function loadDashboard(){

    try{

        const res = await fetch(

            `${API}/dashboard`,

            {

                headers

            }

        );

        const data = await res.json();

        document.getElementById("totalMahasiswa").textContent =

            data.total_mahasiswa ?? 0;

        document.getElementById("totalFakultas").textContent =

            data.total_fakultas ?? 0;

        document.getElementById("totalJurusan").textContent =

            data.total_jurusan ?? 0;

    }

    catch(err){

        console.error(err);

    }

}

// ======================================================
// LOAD FAKULTAS
// ======================================================

async function loadFakultas(){

    try{

        const res = await fetch(

            `${API}/fakultas`,

            {

                headers

            }

        );

        fakultas = await res.json();

    }

    catch(err){

        console.error(err);

    }

}

// ======================================================
// LOAD JURUSAN
// ======================================================

async function loadJurusan(){

    try{

        const res = await fetch(

            `${API}/jurusan`,

            {

                headers

            }

        );

        jurusan = await res.json();

    }

    catch(err){

        console.error(err);

    }

}

// ======================================================
// LOAD MAHASISWA
// ======================================================

async function loadMahasiswa(){

    try{

        const res = await fetch(

            `${API}/mahasiswa`,

            {

                headers

            }

        );

        mahasiswa = await res.json();

        renderTable(mahasiswa);

    }

    catch(err){

        console.error(err);

    }

}
// ======================================================
// RENDER TABEL
// ======================================================

function renderTable(data){

    const tbody = document.getElementById("tableMahasiswa");

    tbody.innerHTML = "";

    document.getElementById("jumlahData").textContent =
        `${data.length} Data`;

    if(data.length===0){

        tbody.innerHTML=`

        <tr>

            <td colspan="8">

                <div class="empty-state">

                    <i class="bi bi-database-fill-x"></i>

                    <h5>Data mahasiswa belum tersedia</h5>

                    <p>Silakan tambahkan data mahasiswa terlebih dahulu.</p>

                </div>

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((mhs,index)=>{

const idFakultas = mhs.fakultas || "-";
const idJurusan = mhs.jurusan || "-";

        tbody.innerHTML += `

        <tr>

            <td data-label="No">${index+1}</td>

            <td data-label="NIM">${mhs.nim}</td>

            <td data-label="Nama">${mhs.nama}</td>

            <td data-label="Fakultas">

                <span class="badge bg-success">

                    ${idFakultas}

                </span>

            </td>

            <td data-label="Program Studi">

                ${idJurusan}

            </td>

            <td data-label="Semester">

                <span class="badge bg-primary">

                    Semester ${mhs.semester}

                </span>

            </td>

            <td data-label="Email">

                ${mhs.email ?? "-"}

            </td>

            <td data-label="Aksi">
<button class="btn btn-info btn-sm"
onclick="detailMahasiswa(${mhs.id})">

<i class="bi bi-eye"></i>

</button>

                <button

                    class="btn-action btn-edit"

                    onclick="editMahasiswa(${mhs.id})">

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button

                    class="btn-action btn-delete"

                    onclick="showDelete(${mhs.id})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

// ======================================================
// SEARCH
// ======================================================

document

.getElementById("searchInput")

.addEventListener("keyup",function(){

    const keyword=this.value.toLowerCase();

    const hasil=mahasiswa.filter(m=>

        m.nama.toLowerCase().includes(keyword)

        ||

        m.nim.toLowerCase().includes(keyword)

    );

    renderTable(hasil);

});

// ======================================================
// DETAIL MAHASISWA
// ======================================================

function showDetail(id){

    const mhs=mahasiswa.find(m=>m.id==id);

    if(!mhs) return;

    document.getElementById("detailNim").textContent=mhs.nim;

    document.getElementById("detailNama").textContent=mhs.nama;

    document.getElementById("detailEmail").textContent=mhs.email||"-";

    document.getElementById("detailHp").textContent=mhs.no_hp||"-";

    document.getElementById("detailSemester").textContent=mhs.semester;

    document.getElementById("detailAngkatan").textContent=mhs.angkatan;

    document.getElementById("detailAlamat").textContent=mhs.alamat||"-";

document.getElementById("detailFakultas").textContent = mhs.fakultas || "-";
document.getElementById("detailJurusan").textContent = mhs.jurusan || "-";


    new bootstrap.Modal(

        document.getElementById("detailModal")

    ).show();

}
// ======================================================
// MODAL HAPUS
// ======================================================

function showDelete(id){

    deleteId = id;

    const modal = new bootstrap.Modal(

        document.getElementById("hapusModal")

    );

    modal.show();

}

// ======================================================
// DELETE MAHASISWA
// ======================================================

document

.getElementById("btnDelete")

.addEventListener("click", deleteMahasiswa);

async function deleteMahasiswa(){

    if(deleteId==null) return;

    try{

        const res = await fetch(

            `${API}/mahasiswa/${deleteId}`,

            {

                method:"DELETE",

                headers

            }

        );

        if(!res.ok){

            throw new Error("Gagal menghapus data");

        }

        bootstrap.Modal.getInstance(

            document.getElementById("hapusModal")

        ).hide();

        deleteId = null;

        await loadDashboard();

        await loadMahasiswa();

    }

    catch(err){

        alert(err.message);

    }

}

// ======================================================
// EDIT MAHASISWA
// ======================================================

function editMahasiswa(id){

    window.location.href = `edit_mahasiswa.html?id=${id}`;

}

// ======================================================
// REFRESH
// ======================================================

function refreshData(){

    loadDashboard();

    loadMahasiswa();

}

// ======================================================
// LOAD SEMUA DATA
// ======================================================

async function init(){

    try{

        await loadFakultas();

        await loadJurusan();

        await loadDashboard();

        await loadMahasiswa();

    }

    catch(err){

        console.error(err);

    }

}

// ======================================================
// AUTO LOAD
// ======================================================

window.addEventListener(

    "load",

    init

);

// ======================================================
// DETAIL MAHASISWA
// ======================================================

function detailMahasiswa(id){

    window.location.href =
        `detail-mahasiswa.html?id=${id}`;

}