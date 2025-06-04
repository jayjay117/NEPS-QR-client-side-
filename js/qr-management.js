// QR Management JavaScript for NEPS-QR Business Dashboard

// Import or declare lucide and QRCode variables here
const lucide = window.lucide // Assuming lucide is available globally
const QRCode = window.QRCode // Assuming QRCode is available globally

class QRManager {
    constructor() {
        this.apiBaseUrl = "https://api.neps-qr.com/v1" // Replace with your actual API endpoint
        this.businessInfo = this.getBusinessInfo()
        this.qrCodes = []
        this.currentQRInstance = null
        this.init()
    }

    init() {
        this.initializeLucideIcons()
        this.loadQRCodes()
    }

    initializeLucideIcons() {
        if (typeof lucide !== "undefined") {
            lucide.createIcons()
        }
    }

    getBusinessInfo() {
        // Get business data from localStorage or session
        const userData = localStorage.getItem("neps_user_data")
        return userData
            ? JSON.parse(userData)
            : {
                businessName: "Adebayo Stores",
                category: "Food & Beverage",
                registrationNumber: "BN-293847",
                businessId: "biz_12345",
            }
    }

    /**
     * Backend API Guidance:
     *
     * POST /qr-codes/generate
     * Request Body: {
     *   type: "static" | "dynamic",
     *   label: string,
     *   amount?: number (only for dynamic),
     *   description?: string,
     *   expiry?: ISO date string (only for dynamic),
     *   businessId: string
     * }
     *
     * Response: {
     *   success: boolean,
     *   data: {
     *     id: string,
     *     qrData: string, // The actual QR code data to encode
     *     type: "static" | "dynamic",
     *     label: string,
     *     amount?: number,
     *     status: "active" | "expired" | "used" | "inactive",
     *     scanCount: number,
     *     createdAt: ISO date string,
     *     expiresAt?: ISO date string
     *   },
     *   message?: string
     * }
     *
     * QR Code Data Format:
     * {
     *   version: "1.0",
     *   type: "neps_payment",
     *   businessId: "biz_12345",
     *   businessName: "Adebayo Stores",
     *   category: "Food & Beverage",
     *   registrationNumber: "BN-293847",
     *   qrId: "qr_67890",
     *   amount?: number (only for dynamic),
     *   timestamp: ISO date string
     * }
     */
    async generateQRCode(formData) {
        try {
            this.showLoading("Generating QR code...")

            // Prepare request payload
            const payload = {
                type: formData.type,
                label: formData.label || `${formData.type} QR Code`,
                businessId: this.businessInfo.businessId,
                description: formData.description,
            }

            // Add amount and expiry for dynamic QR codes
            if (formData.type === "dynamic") {
                if (formData.amount) {
                    payload.amount = Number.parseFloat(formData.amount)
                }
                if (formData.expiry) {
                    payload.expiry = formData.expiry
                }
            }

            const response = await this.makeApiCall("/qr-codes/generate", "POST", payload)

            if (response.success) {
                const qrData = response.data

                // Generate the actual QR code image
                await this.renderQRCode(qrData.qrData, "qr-preview")

                // Add to local list
                this.qrCodes.unshift(qrData)

                this.showSuccess("QR code generated successfully!")
                return qrData
            } else {
                throw new Error(response.message || "Failed to generate QR code")
            }
        } catch (error) {
            this.showError("Failed to generate QR code: " + error.message)
            throw error
        } finally {
            this.hideLoading()
        }
    }

    /**
     * Backend API Guidance:
     *
     * GET /qr-codes?businessId={businessId}&limit={limit}&offset={offset}&filter={filter}
     *
     * Response: {
     *   success: boolean,
     *   data: {
     *     qrCodes: Array<QRCode>,
     *     total: number,
     *     hasMore: boolean
     *   }
     * }
     */
    async loadQRCodes(filter = "all") {
        try {
            const params = new URLSearchParams({
                businessId: this.businessInfo.businessId,
                limit: "50",
                offset: "0",
            })

            if (filter !== "all") {
                params.append("filter", filter)
            }

            const response = await this.makeApiCall(`/qr-codes?${params}`, "GET")

            if (response.success) {
                this.qrCodes = response.data.qrCodes || []
                return this.qrCodes
            } else {
                throw new Error(response.message || "Failed to load QR codes")
            }
        } catch (error) {
            this.showError("Failed to load QR codes: " + error.message)
            return []
        }
    }

    /**
     * Backend API Guidance:
     *
     * PUT /qr-codes/{qrId}/deactivate
     *
     * Response: {
     *   success: boolean,
     *   message: string
     * }
     */
    async deactivateQRCode(qrId) {
        try {
            this.showLoading("Deactivating QR code...")

            const response = await this.makeApiCall(`/qr-codes/${qrId}/deactivate`, "PUT")

            if (response.success) {
                // Update local data
                const qrIndex = this.qrCodes.findIndex((qr) => qr.id === qrId)
                if (qrIndex !== -1) {
                    this.qrCodes[qrIndex].status = "inactive"
                }

                this.showSuccess("QR code deactivated successfully!")
                return true
            } else {
                throw new Error(response.message || "Failed to deactivate QR code")
            }
        } catch (error) {
            this.showError("Failed to deactivate QR code: " + error.message)
            return false
        } finally {
            this.hideLoading()
        }
    }

    /**
     * Backend API Guidance:
     *
     * GET /qr-codes/{qrId}/analytics
     *
     * Response: {
     *   success: boolean,
     *   data: {
     *     scanCount: number,
     *     lastScanned: ISO date string,
     *     totalAmount: number,
     *     successfulTransactions: number,
     *     failedTransactions: number,
     *     scanHistory: Array<{
     *       timestamp: ISO date string,
     *       userId?: string,
     *       amount?: number,
     *       status: "success" | "failed" | "pending"
     *     }>
     *   }
     * }
     */
    async getQRAnalytics(qrId) {
        try {
            const response = await this.makeApiCall(`/qr-codes/${qrId}/analytics`, "GET")
            return response.success ? response.data : null
        } catch (error) {
            console.error("Failed to load QR analytics:", error)
            return null
        }
    }

    async renderQRCode(qrData, containerId) {
        const container = document.getElementById(containerId)
        if (!container) return

        // Clear previous QR code
        container.innerHTML = ""

        try {
            // Create QR code instance
            const qr = new QRCode(container, {
                text: JSON.stringify(qrData),
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
            })

            // Store reference for potential reuse
            this.currentQRInstance = qr

            // Add fade-in animation
            setTimeout(() => {
                const canvas = container.querySelector("canvas")
                if (canvas) {
                    canvas.classList.add("qr-fade-in")
                }
            }, 100)
        } catch (error) {
            console.error("Failed to render QR code:", error)
            container.innerHTML = `
                <div class="text-center text-red-500">
                    <i data-lucide="alert-circle" class="h-8 w-8 mx-auto mb-2"></i>
                    <p class="text-sm">Failed to generate QR code</p>
                </div>
            `
        }
    }

    downloadQRCode(qrData, filename) {
        try {
            // Create a temporary container for QR generation
            const tempContainer = document.createElement("div")
            tempContainer.style.position = "absolute"
            tempContainer.style.left = "-9999px"
            document.body.appendChild(tempContainer)

            // Generate QR code in temp container
            const qr = new QRCode(tempContainer, {
                text: JSON.stringify(qrData),
                width: 512,
                height: 512,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
            })

            // Wait for QR code generation
            setTimeout(() => {
                const canvas = tempContainer.querySelector("canvas")
                if (canvas) {
                    // Create download link
                    const link = document.createElement("a")
                    link.download = filename || `qr-code-${Date.now()}.png`
                    link.href = canvas.toDataURL("image/png")
                    link.click()
                }

                // Cleanup
                document.body.removeChild(tempContainer)
            }, 100)
        } catch (error) {
            this.showError("Failed to download QR code: " + error.message)
        }
    }

    async shareQRCode(qrData) {
        try {
            if (navigator.share) {
                // Use native sharing if available
                await navigator.share({
                    title: `${qrData.label} - NEPS-QR`,
                    text: `Scan this QR code to pay ${this.businessInfo.businessName}`,
                    url: window.location.href,
                })
            } else {
                // Fallback: copy to clipboard
                const shareText = `Pay ${this.businessInfo.businessName} using NEPS-QR\nQR Code: ${qrData.label}`
                await navigator.clipboard.writeText(shareText)
                this.showSuccess("QR code details copied to clipboard!")
            }
        } catch (error) {
            this.showError("Failed to share QR code: " + error.message)
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    getStatusClass(status) {
        const statusClasses = {
            active: "status-active",
            expired: "status-expired",
            used: "status-used",
            inactive: "status-inactive",
        }
        return statusClasses[status] || "status-inactive"
    }

    async makeApiCall(endpoint, method = "GET", data = null) {
        const url = `${this.apiBaseUrl}${endpoint}`
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        }

        if (data && method !== "GET") {
            options.body = JSON.stringify(data)
        }

        const response = await fetch(url, options)

        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - redirect to login
                window.location.href = "../business-login.html"
                return
            }
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    }

    getAuthToken() {
        return localStorage.getItem("neps_auth_token") || sessionStorage.getItem("neps_auth_token")
    }

    showLoading(message = "Loading...") {
        let overlay = document.getElementById("loading-overlay")
        if (!overlay) {
            overlay = document.createElement("div")
            overlay.id = "loading-overlay"
            overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
            overlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div class="loading-spinner rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span class="text-gray-700">${message}</span>
                </div>
            `
            document.body.appendChild(overlay)
        } else {
            overlay.querySelector("span").textContent = message
            overlay.classList.remove("hidden")
        }
    }

    hideLoading() {
        const overlay = document.getElementById("loading-overlay")
        if (overlay) {
            overlay.classList.add("hidden")
        }
    }

    showSuccess(message) {
        this.showNotification(message, "success")
    }

    showError(message) {
        this.showNotification(message, "error")
    }

    showNotification(message, type = "info") {
        const notification = document.createElement("div")
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`

        const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
        notification.classList.add(bgColor, "text-white")

        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="${type === "success" ? "check-circle" : type === "error" ? "x-circle" : "info"}" class="h-5 w-5"></i>
                <span>${message}</span>
                <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
        `

        document.body.appendChild(notification)

        // Initialize icons
        if (typeof lucide !== "undefined") {
            lucide.createIcons()
        }

        // Animate in
        setTimeout(() => {
            notification.classList.remove("translate-x-full")
        }, 100)

        // Auto remove
        setTimeout(() => {
            notification.classList.add("translate-x-full")
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove()
                }
            }, 300)
        }, 5000)
    }
}

// Alpine.js QR Management App
function qrManagementApp() {
    return {
        sidebarOpen: false,
        showModal: false, // Modal is hidden by default
        qrManager: null,
        qrForm: {
            type: "static",
            label: "",
            amount: "",
            description: "",
            expiry: "",
        },
        currentQR: null,
        qrCodes: [],
        filteredQRCodes: [],
        filter: "all",
        isGenerating: false,
        selectedQR: null,

        init() {
            this.sidebarOpen = window.innerWidth >= 1024
            this.qrManager = new QRManager()
            this.loadQRCodes()

            // Handle window resize
            window.addEventListener("resize", () => {
                if (window.innerWidth >= 1024) {
                    this.sidebarOpen = true
                }
            })
        },

        async generateQRCode() {
            if (!this.qrForm.label.trim()) {
                this.qrManager.showError("Please enter a label for your QR code")
                return
            }

            if (this.qrForm.type === "dynamic" && this.qrForm.amount && Number.parseFloat(this.qrForm.amount) <= 0) {
                this.qrManager.showError("Please enter a valid amount")
                return
            }

            this.isGenerating = true

            try {
                const qrData = await this.qrManager.generateQRCode(this.qrForm)
                this.currentQR = qrData
                this.qrCodes = [qrData, ...this.qrCodes]
                this.filterQRCodes()

                // Reset form for next use
                this.resetForm()
            } catch (error) {
                console.error("QR generation failed:", error)
            } finally {
                this.isGenerating = false
            }
        },

        resetForm() {
            this.qrForm = {
                type: "static",
                label: "",
                amount: "",
                description: "",
                expiry: "",
            }
            this.currentQR = null

            // Clear preview
            const preview = document.getElementById("qr-preview")
            if (preview) {
                preview.innerHTML = `
                    <div class="text-center text-gray-500">
                        <i data-lucide="qr-code" class="h-12 w-12 mx-auto mb-2 text-gray-400"></i>
                        <p class="text-sm">QR code will appear here</p>
                    </div>
                `
                if (typeof lucide !== "undefined") {
                    lucide.createIcons()
                }
            }
        },

        async loadQRCodes() {
            try {
                this.qrCodes = await this.qrManager.loadQRCodes()
                this.filterQRCodes()
            } catch (error) {
                console.error("Failed to load QR codes:", error)
            }
        },

        filterQRCodes() {
            if (this.filter === "all") {
                this.filteredQRCodes = this.qrCodes
            } else {
                this.filteredQRCodes = this.qrCodes.filter((qr) => {
                    switch (this.filter) {
                        case "static":
                            return qr.type === "static"
                        case "dynamic":
                            return qr.type === "dynamic"
                        case "active":
                            return qr.status === "active"
                        case "expired":
                            return qr.status === "expired"
                        default:
                            return true
                    }
                })
            }
        },

        async viewQR(qr) {
            this.selectedQR = qr
            this.showModal = true

            // Render QR code in modal
            setTimeout(async () => {
                await this.qrManager.renderQRCode(qr.qrData, "modal-qr-code")
            }, 100)
        },

        closeModal() {
            this.showModal = false
            this.selectedQR = null
            const modalQR = document.getElementById("modal-qr-code")
            if (modalQR) modalQR.innerHTML = ""

            // Add this to remove any existing QR code instances
            if (this.qrManager && this.qrManager.currentQRInstance) {
                this.qrManager.currentQRInstance.clear();
                this.qrManager.currentQRInstance = null;
            }
        },

        downloadQR() {
            if (this.currentQR) {
                this.qrManager.downloadQRCode(this.currentQR.qrData, `${this.currentQR.label}-qr-code.png`)
            }
        },

        shareQR() {
            if (this.currentQR) {
                this.qrManager.shareQRCode(this.currentQR)
            }
        },

        downloadQRCode(qr) {
            this.qrManager.downloadQRCode(qr.qrData, `${qr.label}-qr-code.png`)
        },

        shareQRCode(qr) {
            this.qrManager.shareQRCode(qr)
        },

        async deactivateQR(qr) {
            if (confirm(`Are you sure you want to deactivate "${qr.label}"?`)) {
                const success = await this.qrManager.deactivateQRCode(qr.id)
                if (success) {
                    this.filterQRCodes()
                }
            }
        },

        getStatusClass(status) {
            return this.qrManager.getStatusClass(status)
        },

        formatDate(dateString) {
            return this.qrManager.formatDate(dateString)
        },
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") {
        lucide.createIcons()
    }
})
