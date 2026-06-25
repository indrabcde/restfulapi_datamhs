// ======================================================
// KONFIGURASI
// ======================================================

const BASE_URL = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");

if (!token) {

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}

// ======================================================
// HEADER
// ======================================================

const headers = {

    "Authorization": "Bearer " + token

};

// ======================================================
// DISPLAY WELCOME DATE
// ======================================================

function displayWelcomeDate() {

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', options);
    const element = document.getElementById("welcomeDate");
    if (element) {
        element.textContent = today;
    }

}

// ======================================================
// LOAD DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const response = await fetch(
            BASE_URL + "/dashboard",
            {
                headers: headers
            }
        );

        if (response.status === 401) {

            logout();

            return;

        }

        const data = await response.json();

        document.getElementById("totalMahasiswa").innerHTML =
            data.total_mahasiswa;

        document.getElementById("totalJurusan").innerHTML =
            data.total_jurusan;

        document.getElementById("totalFakultas").innerHTML =
            data.total_fakultas;

        const mahasiswaResponse = await fetch(BASE_URL + "/mahasiswa", { headers });
        const mahasiswaData = await mahasiswaResponse.json();

        if (mahasiswaData.length > 0) {
            const totalSemester = mahasiswaData.reduce((sum, m) => sum + (m.semester || 0), 0);
            const avgSemester = (totalSemester / mahasiswaData.length).toFixed(1);
            document.getElementById("avgSemester").innerHTML = avgSemester + " sem";
        } else {
            document.getElementById("avgSemester").innerHTML = "-";
        }

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================================
// LOAD MAHASISWA TERBARU
// ======================================================

async function loadMahasiswaTerbaru() {

    try {

        const response = await fetch(

            BASE_URL + "/mahasiswa",

            {

                headers: headers

            }

        );

        const data = await response.json();

        let html = "";

        const terbaru = data.slice(-5).reverse();

        terbaru.forEach(mhs => {

            html += `

            <tr>

                <td>${mhs.nim}</td>

                <td>${mhs.nama}</td>

                <td>${mhs.fakultas ?? "-"}</td>

                <td>${mhs.jurusan ?? "-"}</td>

                <td>${mhs.semester}</td>

            </tr>

            `;

        });

        document.getElementById("mahasiswaTerbaru").innerHTML =
            html;

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================================
// LOAD STATISTIK
// ======================================================

async function loadStatistik() {

    try {

        const response = await fetch(

            BASE_URL + "/statistik",

            {

                headers: headers

            }

        );

        const data = await response.json();

        buatChartFakultas(data.per_fakultas);

        buatChartJurusan(data.per_program_studi);

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================================
// CHART FAKULTAS
// ======================================================

function buatChartFakultas(data) {

    new Chart(

        document.getElementById("chartFakultas"),

        {

            type: "bar",

            data: {

                labels: data.map(item => item.nama),

                datasets: [

                    {

                        label: "Jumlah Mahasiswa",

                        data: data.map(item => item.jumlah),

                        backgroundColor: [

                            "#0d6efd",

                            "#4f46e5",

                            "#20c997",

                            "#0dcaf0",

                            "#ffc107"

                        ],

                        borderRadius: 12,

                        maxBarThickness: 40

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                layout: {

                    padding: 12

                },

                scales: {

                    x: {

                        grid: {

                            display: false

                        },

                        ticks: {

                            color: "#495057"

                        }

                    },

                    y: {

                        beginAtZero: true,

                        grid: {

                            color: "rgba(13, 110, 253, 0.08)"

                        },

                        ticks: {

                            color: "#495057",

                            precision: 0

                        }

                    }

                },

                plugins: {

                    legend: {

                        display: false

                    },

                    tooltip: {

                        backgroundColor: "rgba(33, 37, 41, 0.95)",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff",

                        borderColor: "rgba(255,255,255,0.12)",

                        borderWidth: 1,

                        padding: 10,

                        displayColors: false

                    }

                }

            }

        }

    );

}

// ======================================================
// CHART JURUSAN
// ======================================================

function buatChartJurusan(data) {

    new Chart(

        document.getElementById("chartJurusan"),

        {

            type: "doughnut",

            data: {

                labels: data.map(item => item.nama),

                datasets: [

                    {

                        data: data.map(item => item.jumlah),

                        backgroundColor: [

                            "#0d6efd",

                            "#6610f2",

                            "#198754",

                            "#ffc107",

                            "#dc3545",

                            "#20c997",

                            "#6f42c1",

                            "#fd7e14"

                        ],

                        borderColor: "#ffffff",

                        borderWidth: 3,

                        hoverOffset: 8

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                layout: {

                    padding: 12

                },

                cutout: "65%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            color: "#495057",

                            boxWidth: 12,

                            padding: 16

                        }

                    },

                    tooltip: {

                        backgroundColor: "rgba(33, 37, 41, 0.95)",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff",

                        borderColor: "rgba(255,255,255,0.12)",

                        borderWidth: 1,

                        padding: 10

                    }

                }

            }

        }

    );

}

// ======================================================
// LOGOUT
// ======================================================

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ======================================================
// LOAD SEMUA
// ======================================================

displayWelcomeDate();

loadDashboard();

loadMahasiswaTerbaru();

loadStatistik();