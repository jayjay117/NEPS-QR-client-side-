// import { Chart } from "@/components/ui/chart"
// // Import necessary libraries (assuming they are available globally or via a module bundler)
// import * as lucide from "lucide" // Or however you import lucide
// import Litepicker from "litepicker" // Or however you import Litepicker
// import QRCode from "qrcode" // Or however you import qrcodejs
// import Alpine from "alpinejs" // Or however you import Alpine
// i commented out the imports because they are not available in this environment.


// Initialize Lucide icons
   const token = localStorage.getItem("token")
if (!token) { 
    window.location.href = "business-login.html"
}
document.addEventListener("DOMContentLoaded", () => {
    // fetch username function

    const username = document.querySelector("#username")
    const user = localStorage.getItem("BusinessName")
    username.textContent = user ? user : "Adebayo Stores"
    // logout function
    const logout = document.getElementById("logout")
    logout.addEventListener("click", () => {
        localStorage.removeItem("BusinessName")
        localStorage.removeItem("BusinessEmail")
        localStorage.removeItem("BusinessPhone")
        localStorage.removeItem("BusinessAddress")
        window.location.href = "/login.html"
    })
    lucide.createIcons()

    // Initialize date picker
    if (document.getElementById("date-range-picker")) {
        new Litepicker({
            element: document.getElementById("date-range-picker"),
            singleMode: false,
            numberOfMonths: 2,
            numberOfColumns: 2,
            startDate: new Date().setDate(new Date().getDate() - 7),
            endDate: new Date(),
            format: "MMM D, YYYY",
            tooltipText: {
                one: "day",
                other: "days",
            },
            tooltipNumber: (totalDays) => {
                return totalDays
            },
        })
    }

    // Initialize QR Code
    if (document.getElementById("primary-qr-code")) {
        new QRCode(document.getElementById("primary-qr-code"), {
            text: "https://neps-qr.com/pay/adebayo-stores",
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
        })
    }

    // Initialize Charts
    initCharts()
})

// Alpine.js Dashboard Component
window.dashboard = () => ({
    sidebarOpen: false,
    chartPeriod: "monthly",
    revenueChart: null,
    transactionChart: null,

    init() {
        this.sidebarOpen = window.innerWidth >= 1024

        // Handle window resize
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 1024) {
                this.sidebarOpen = true
            }
        })
    },

    setChartPeriod(period) {
        this.chartPeriod = period
        this.updateRevenueChart()
    },

    updateRevenueChart() {
        if (!this.revenueChart) return

        let labels, data

        if (this.chartPeriod === "weekly") {
            labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            data = [12500, 18200, 14800, 22300, 19700, 25400, 17600]
        } else if (this.chartPeriod === "monthly") {
            labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            data = [65400, 72300, 58900, 83200, 95700, 88400, 92100, 105400, 112800, 125400, 0, 0]
        } else {
            labels = ["2020", "2021", "2022", "2023", "2024"]
            data = [458000, 687000, 892000, 1125000, 950000]
        }

        this.revenueChart.data.labels = labels
        this.revenueChart.data.datasets[0].data = data
        this.revenueChart.update()
    },
})

// Initialize Charts
function initCharts() {
    // Revenue Chart
    const revenueChartEl = document.getElementById("revenueChart")
    if (revenueChartEl) {
        const revenueChart = new Chart(revenueChartEl, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: "Revenue (₦)",
                        data: [65400, 72300, 58900, 83200, 95700, 88400, 92100, 105400, 112800, 125400, 0, 0],
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderColor: "rgba(59, 130, 246, 1)",
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: "rgba(59, 130, 246, 1)",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || ""
                                if (label) {
                                    label += ": "
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat("en-NG", {
                                        style: "currency",
                                        currency: "NGN",
                                        minimumFractionDigits: 0,
                                    }).format(context.parsed.y)
                                }
                                return label
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => "₦" + value.toLocaleString(),
                        },
                    },
                },
            },
        })

        // Store chart instance in Alpine component
        const dashboardComponent = Alpine.store("dashboard")
        if (dashboardComponent) {
            dashboardComponent.revenueChart = revenueChart
        }
    }

    // Transaction Chart
    const transactionChartEl = document.getElementById("transactionChart")
    if (transactionChartEl) {
        const transactionChart = new Chart(transactionChartEl, {
            type: "doughnut",
            data: {
                labels: ["QR Payments", "Bank Transfers", "Cash Payments"],
                datasets: [
                    {
                        data: [65, 25, 10],
                        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(139, 92, 246, 0.8)", "rgba(16, 185, 129, 0.8)"],
                        borderColor: ["rgba(59, 130, 246, 1)", "rgba(139, 92, 246, 1)", "rgba(16, 185, 129, 1)"],
                        borderWidth: 1,
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || ""
                                const value = context.parsed || 0
                                const total = context.dataset.data.reduce((acc, data) => acc + data, 0)
                                const percentage = Math.round((value / total) * 100)
                                return `${label}: ${percentage}% (${value} transactions)`
                            },
                        },
                    },
                },
            },
        })

        // Store chart instance in Alpine component
        const dashboardComponent = Alpine.store("dashboard")
        if (dashboardComponent) {
            dashboardComponent.transactionChart = transactionChart
        }
    }
}
