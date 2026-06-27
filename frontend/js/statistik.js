// ======================================================
// SISTEM INFORMASI MAHASISWA
// FILE : statistik.js
// ======================================================

const API = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
};

// ======================================================
// GLOBAL VARIABLE
// ======================================================

let mahasiswaData = [];
let fakultasData = [];
let jurusanData = [];

let chartFakultas = null;
let chartJurusan = null;
let chartAngkatan = null;
let chartSemester = null;
let chartGender = null;
let chartTrend = null;

// ======================================================
// LOGOUT
// ======================================================

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ======================================================
// REFRESH
// ======================================================

function refreshData() {
    location.reload();
}

// ======================================================
// LOAD DATA
// ======================================================

async function loadData() {

    try {

        const mahasiswaRes = await fetch(
            `${API}/mahasiswa`,
            { headers }
        );

        mahasiswaData = await mahasiswaRes.json();

        const fakultasRes = await fetch(
            `${API}/fakultas`,
            { headers }
        );

        fakultasData = await fakultasRes.json();

        const jurusanRes = await fetch(
            `${API}/jurusan`,
            { headers }
        );

        jurusanData = await jurusanRes.json();

        tampilkanCard();

        // loadFilter();

        buatSemuaGrafik();

        isiTabel();

    } catch (err) {

        console.error(err);

        alert("Gagal mengambil data dari server.");

    }

}

// ======================================================
// CARD DASHBOARD
// ======================================================

function tampilkanCard() {

    document.getElementById("totalMahasiswa").innerHTML =
        mahasiswaData.length;

    document.getElementById("totalFakultas").innerHTML =
        fakultasData.length;

    document.getElementById("totalJurusan").innerHTML =
        jurusanData.length;

    let totalSemester = 0;

    mahasiswaData.forEach(m => {

        totalSemester += Number(m.semester);

    });

    const rataSemester =
        mahasiswaData.length > 0
            ? (totalSemester / mahasiswaData.length).toFixed(1)
            : 0;

    document.getElementById("rataSemester").innerHTML =
        rataSemester;

}

// ======================================================
// LOAD FILTER
// ======================================================

// function loadFilter() {

//     const fakultasSelect =
//         document.getElementById("filterFakultas");

//     const angkatanSelect =
//         document.getElementById("filterAngkatan");

//     fakultasSelect.innerHTML =
//         '<option value="">Semua Fakultas</option>';

//     angkatanSelect.innerHTML =
//         '<option value="">Semua Angkatan</option>';

//     // Fakultas

//     const daftarFakultas =
//         [...new Set(
//             mahasiswaData.map(m => m.fakultas)
//         )];

//     daftarFakultas.sort();

//     daftarFakultas.forEach(f => {

//         fakultasSelect.innerHTML += `
//             <option value="${f}">
//                 ${f}
//             </option>
//         `;

//     });

//     // Angkatan

//     const daftarAngkatan =
//         [...new Set(
//             mahasiswaData.map(m => m.angkatan)
//         )];

//     daftarAngkatan.sort();

//     daftarAngkatan.forEach(a => {

//         angkatanSelect.innerHTML += `
//             <option value="${a}">
//                 ${a}
//             </option>
//         `;

//     });

// }
// ======================================================
// MEMBUAT SEMUA GRAFIK
// ======================================================

function buatSemuaGrafik() {

    if (chartFakultas) chartFakultas.destroy();
    if (chartJurusan) chartJurusan.destroy();
    if (chartAngkatan) chartAngkatan.destroy();
    if (chartSemester) chartSemester.destroy();
    if (chartGender) chartGender.destroy();
    if (chartTrend) chartTrend.destroy();

    // ==================================================
    // DATA FAKULTAS
    // ==================================================

    const fakultasMap = {};

    mahasiswaData.forEach(m => {

        if (!fakultasMap[m.fakultas]) {

            fakultasMap[m.fakultas] = 0;

        }

        fakultasMap[m.fakultas]++;

    });

    chartFakultas = new Chart(

        document.getElementById("chartFakultas"),

        {

            type: "bar",

            data: {

                labels: Object.keys(fakultasMap),

                datasets: [{

                    label: "Mahasiswa",

                    data: Object.values(fakultasMap),

                    backgroundColor: [

                        "#4e73df",

                        "#1cc88a",

                        "#36b9cc",

                        "#f6c23e",

                        "#e74a3b",

                        "#6f42c1",

                        "#20c997"

                    ],

                    borderRadius: 10

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

    // ==================================================
    // DATA PROGRAM STUDI
    // ==================================================

    const jurusanMap = {};

    mahasiswaData.forEach(m => {

        if (!jurusanMap[m.jurusan]) {

            jurusanMap[m.jurusan] = 0;

        }

        jurusanMap[m.jurusan]++;

    });

    chartJurusan = new Chart(

        document.getElementById("chartJurusan"),

        {

            type: "doughnut",

            data: {

                labels: Object.keys(jurusanMap),

                datasets: [{

                    data: Object.values(jurusanMap),

                    backgroundColor: [

                        "#4e73df",

                        "#1cc88a",

                        "#36b9cc",

                        "#f6c23e",

                        "#e74a3b",

                        "#fd7e14",

                        "#6f42c1",

                        "#20c997",

                        "#6610f2",

                        "#198754"

                    ]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }

    );

    // ==================================================
    // DATA ANGKATAN
    // ==================================================

    const angkatanMap = {};

    mahasiswaData.forEach(m => {

        if (!angkatanMap[m.angkatan]) {

            angkatanMap[m.angkatan] = 0;

        }

        angkatanMap[m.angkatan]++;

    });

    chartAngkatan = new Chart(

        document.getElementById("chartAngkatan"),

        {

            type: "line",

            data: {

                labels: Object.keys(angkatanMap),

                datasets: [{

                    label: "Mahasiswa",

                    data: Object.values(angkatanMap),

                    borderColor: "#4e73df",

                    backgroundColor: "rgba(78,115,223,.2)",

                    fill: true,

                    tension: 0.3

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }

    );

    // ==================================================
    // DATA SEMESTER
    // ==================================================

    const semesterMap = {};

    mahasiswaData.forEach(m => {

        if (!semesterMap[m.semester]) {

            semesterMap[m.semester] = 0;

        }

        semesterMap[m.semester]++;

    });

    chartSemester = new Chart(

        document.getElementById("chartSemester"),

        {

            type: "bar",

            data: {

                labels: Object.keys(semesterMap),

                datasets: [{

                    label: "Mahasiswa",

                    data: Object.values(semesterMap),

                    backgroundColor: "#36b9cc",

                    borderRadius: 8

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

    // ==================================================
    // DATA JENIS KELAMIN
    // ==================================================

    const genderMap = {};

    mahasiswaData.forEach(m => {

        if (!genderMap[m.jenis_kelamin]) {

            genderMap[m.jenis_kelamin] = 0;

        }

        genderMap[m.jenis_kelamin]++;

    });

    chartGender = new Chart(

        document.getElementById("chartGender"),

        {

            type: "pie",

            data: {

                labels: Object.keys(genderMap),

                datasets: [{

                    data: Object.values(genderMap),

                    backgroundColor: [

                        "#4e73df",

                        "#e74a3b"

                    ]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }

    );

    // ==================================================
    // TREN SEMESTER
    // ==================================================

    chartTrend = new Chart(

        document.getElementById("chartSemesterTrend"),

        {

            type: "line",

            data: {

                labels: Object.keys(semesterMap),

                datasets: [{

                    label: "Mahasiswa",

                    data: Object.values(semesterMap),

                    borderColor: "#1cc88a",

                    backgroundColor: "rgba(28,200,138,.2)",

                    fill: true,

                    tension: 0.4

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }

    );

}
// ======================================================
// ISI TABEL STATISTIK
// ======================================================

function isiTabel() {

    const tbody = document.getElementById("tabelStatistik");

    tbody.innerHTML = "";

    const jurusanMap = {};

    mahasiswaData.forEach(m => {

        if (!jurusanMap[m.jurusan]) {

            jurusanMap[m.jurusan] = 0;

        }

        jurusanMap[m.jurusan]++;

    });

    const total = mahasiswaData.length;

    let no = 1;

    Object.keys(jurusanMap).forEach(jurusan => {

        const jumlah = jurusanMap[jurusan];

        const persen = ((jumlah / total) * 100).toFixed(1);

        tbody.innerHTML += `

            <tr>

                <td>${no++}</td>

                <td>${jurusan}</td>

                <td>${jumlah}</td>

                <td>${persen}%</td>

            </tr>

        `;

    });

}

// ======================================================
// FILTER
// ======================================================

// function terapkanFilter() {

//     const fakultas = document.getElementById("filterFakultas").value;

//     const angkatan = document.getElementById("filterAngkatan").value;

//     let hasil = [...mahasiswaData];

//     if (fakultas !== "") {

//         hasil = hasil.filter(

//             m => m.fakultas === fakultas

//         );

//     }

//     if (angkatan !== "") {

//         hasil = hasil.filter(

//             m => String(m.angkatan) === angkatan

//         );

//     }

//     mahasiswaData = hasil;

//     tampilkanCard();

//     buatSemuaGrafik();

//     isiTabel();

// }

// // ======================================================
// // RESET FILTER
// // ======================================================

// async function resetFilter(){

//     await loadData();

// }

// ======================================================
// REFRESH BUTTON
// ======================================================

async function loadStatistik(){

    await loadData();

}

// ======================================================
// WINDOW LOAD
// ======================================================

window.onload = () => {

    loadData();

};