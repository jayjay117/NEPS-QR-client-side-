// NEPS-QR Settings JavaScript
// import lucide from "lucide"
 // Declare the lucide variable

class SettingsManager {
    constructor() {
        this.apiBaseUrl = "https://api.neps-qr.com/v1" // Replace with your actual API endpoint
        this.currentUser = this.getCurrentUser()
        this.init()
    }

    init() {
        this.initializeLucideIcons()
        this.setupEventListeners()
        this.loadUserSettings()
        this.setupFormValidation()
    }

    initializeLucideIcons() {
        if (typeof lucide !== "undefined") {
            lucide.createIcons()
        }
    }

    getCurrentUser() {
        // Get user data from localStorage or session
        const userData = localStorage.getItem("neps_user_data")
        return userData ? JSON.parse(userData) : null
    }

    setupEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll("[data-tab-target]")
        tabButtons.forEach((button) => {
            button.addEventListener("click", (e) => this.switchTab(e))
        })

        // Notification toggles
        const notificationToggles = document.querySelectorAll(".notification-toggle")
        notificationToggles.forEach((toggle) => {
            toggle.addEventListener("change", (e) => this.handleNotificationToggle(e))
        })

        // Form submissions
        this.setupFormSubmissions()

        // Mobile sidebar toggle
        this.setupMobileSidebar()

        // Logo upload
        this.setupLogoUpload()
    }

    setupMobileSidebar() {
        const sidebarToggle = document.getElementById("sidebar-toggle")
        const sidebar = document.getElementById("sidebar")
        const overlay = document.getElementById("sidebar-overlay")

        if (sidebarToggle && sidebar && overlay) {
            sidebarToggle.addEventListener("click", () => {
                sidebar.classList.toggle("-translate-x-full")
                overlay.classList.toggle("hidden")
            })

            overlay.addEventListener("click", () => {
                sidebar.classList.add("-translate-x-full")
                overlay.classList.add("hidden")
            })
        }
    }

    switchTab(event) {
        const target = event.target.dataset.tabTarget

        // Hide all tab contents
        const tabContents = document.querySelectorAll("[data-tab-content]")
        tabContents.forEach((content) => {
            content.classList.add("hidden")
        })

        // Remove active class from all buttons
        const tabButtons = document.querySelectorAll("[data-tab-target]")
        tabButtons.forEach((btn) => {
            btn.classList.remove("bg-primary-100", "text-primary-700", "border-b-2", "border-primary-600")
            btn.classList.add("text-gray-600", "hover:bg-gray-100", "border-b", "border-gray-200")
        })

        // Show target tab content
        const targetContent = document.querySelector(`[data-tab-content="${target}"]`)
        if (targetContent) {
            targetContent.classList.remove("hidden")
        }

        // Add active class to clicked button
        event.target.classList.remove("text-gray-600", "hover:bg-gray-100", "border-b", "border-gray-200")
        event.target.classList.add("bg-primary-100", "text-primary-700", "border-b-2", "border-primary-600")
    }

    setupFormSubmissions() {
        // Account form
        const accountForm = document.querySelector('[data-tab-content="account"] form')
        if (accountForm) {
            accountForm.addEventListener("submit", (e) => this.handleAccountUpdate(e))
        }

        // Password change form
        const passwordForm = document.querySelector('[data-tab-content="security"] form')
        if (passwordForm) {
            passwordForm.addEventListener("submit", (e) => this.handlePasswordChange(e))
        }

        // PIN change form
        const pinForms = document.querySelectorAll('[data-tab-content="security"] form')
        if (pinForms.length > 1) {
            pinForms[1].addEventListener("submit", (e) => this.handlePinChange(e))
        }

        // Notification preferences
        const notificationForm = document.querySelector('[data-tab-content="notifications"] button[type="button"]')
        if (notificationForm) {
            notificationForm.addEventListener("click", (e) => this.saveNotificationPreferences(e))
        }

        // Banking settings
        const bankingForm = document.querySelector('[data-tab-content="banking"] button[type="button"]')
        if (bankingForm) {
            bankingForm.addEventListener("click", (e) => this.saveBankingSettings(e))
        }
    }

    async handleAccountUpdate(event) {
        event.preventDefault()

        const formData = new FormData(event.target)
        const accountData = {
            businessName: formData.get("") || document.getElementById("business-name").value,
            email: formData.get("business-email") || document.getElementById("business-email").value,
            phone: formData.get("business-phone") || document.getElementById("business-phone").value,
            registrationNumber: formData.get("business-reg") || document.getElementById("business-reg").value,
            address: formData.get("business-address") || document.getElementById("business-address").value,
            businessType: formData.get("business-type") || document.getElementById("business-type").value,
            businessCategory: formData.get("business-category") || document.getElementById("business-category").value,
        }

        try {
            this.showLoading("Updating account information...")

            const response = await this.makeApiCall("/business/profile", "PUT", accountData)

            if (response.success) {
                this.showSuccess("Account information updated successfully!")
                // Update local storage
                const userData = this.getCurrentUser()
                if (userData) {
                    Object.assign(userData, accountData)
                    localStorage.setItem("neps_user_data", JSON.stringify(userData))
                }
            } else {
                throw new Error(response.message || "Failed to update account information")
            }
        } catch (error) {
            this.showError("Failed to update account information: " + error.message)
        } finally {
            this.hideLoading()
        }
    }

    async handlePasswordChange(event) {
        event.preventDefault()

        const currentPassword = document.getElementById("current-password").value
        const newPassword = document.getElementById("new-password").value
        const confirmPassword = document.getElementById("confirm-password").value

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showError("All password fields are required")
            return
        }

        if (newPassword !== confirmPassword) {
            this.showError("New passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            this.showError("New password must be at least 8 characters long")
            return
        }

        try {
            this.showLoading("Updating password...")

            const response = await this.makeApiCall("/auth/change-password", "POST", {
                currentPassword,
                newPassword,
            })

            if (response.success) {
                this.showSuccess("Password updated successfully!")
                // Clear form
                document.getElementById("current-password").value = ""
                document.getElementById("new-password").value = ""
                document.getElementById("confirm-password").value = ""
            } else {
                throw new Error(response.message || "Failed to update password")
            }
        } catch (error) {
            this.showError("Failed to update password: " + error.message)
        } finally {
            this.hideLoading()
        }
    }

    async handlePinChange(event) {
        event.preventDefault()

        const currentPin = document.getElementById("current-pin").value
        const newPin = document.getElementById("new-pin").value
        const confirmPin = document.getElementById("confirm-pin").value

        // Validation
        if (!currentPin || !newPin || !confirmPin) {
            this.showError("All PIN fields are required")
            return
        }

        if (newPin !== confirmPin) {
            this.showError("New PINs do not match")
            return
        }

        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            this.showError("PIN must be exactly 4 digits")
            return
        }

        try {
            this.showLoading("Updating transaction PIN...")

            const response = await this.makeApiCall("/auth/change-pin", "POST", {
                currentPin,
                newPin,
            })

            if (response.success) {
                this.showSuccess("Transaction PIN updated successfully!")
                // Clear form
                document.getElementById("current-pin").value = ""
                document.getElementById("new-pin").value = ""
                document.getElementById("confirm-pin").value = ""
            } else {
                throw new Error(response.message || "Failed to update PIN")
            }
        } catch (error) {
            this.showError("Failed to update PIN: " + error.message)
        } finally {
            this.hideLoading()
        }
    }

    handleNotificationToggle(event) {
        const setting = event.target.name
        const enabled = event.target.checked

        // Store setting temporarily (will be saved when user clicks save)
        if (!this.tempNotificationSettings) {
            this.tempNotificationSettings = {}
        }
        this.tempNotificationSettings[setting] = enabled

        console.log(`Notification setting ${setting} changed to ${enabled}`)
    }

    async saveNotificationPreferences(event) {
        event.preventDefault()

        // Collect all notification settings
        const notificationSettings = {}
        const toggles = document.querySelectorAll(".notification-toggle")

        toggles.forEach((toggle) => {
            notificationSettings[toggle.name] = toggle.checked
        })

        try {
            this.showLoading("Saving notification preferences...")

            const response = await this.makeApiCall("/business/notifications", "PUT", {
                preferences: notificationSettings,
            })

            if (response.success) {
                this.showSuccess("Notification preferences saved successfully!")
                this.tempNotificationSettings = null
            } else {
                throw new Error(response.message || "Failed to save notification preferences")
            }
        } catch (error) {
            this.showError("Failed to save notification preferences: " + error.message)
        } finally {
            this.hideLoading()
        }
    }

    async saveBankingSettings(event) {
        event.preventDefault()

        const autoWithdrawal = document.getElementById("auto-withdrawal").value
        const minWithdrawal = document.getElementById("min-withdrawal").value

        try {
            this.showLoading("Saving banking settings...")

            const response = await this.makeApiCall("/business/banking-settings", "PUT", {
                autoWithdrawal,
                minWithdrawal: Number.parseFloat(minWithdrawal),
            })

            if (response.success) {
                this.showSuccess("Banking settings saved successfully!")
            } else {
                throw new Error(response.message || "Failed to save banking settings")
            }
        } catch (error) {
            this.showError("Failed to save banking settings: " + error.message)
        } finally {
            this.hideLoading()
        }
    }

    setupLogoUpload() {
        const uploadButton = document.querySelector('button[type="button"]:contains("Upload New Logo")')
        if (uploadButton) {
            uploadButton.addEventListener("click", () => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (e) => this.handleLogoUpload(e)
                input.click()
            })
        }
    }

    async handleLogoUpload(event) {
        const file = event.target.files[0]
        if (!file) return

        // Validate file
        if (file.size > 2 * 1024 * 1024) {
            // 2MB
            this.showError("File size must be less than 2MB")
            return
        }

        if (!file.type.startsWith("image/")) {
            this.showError("Please select a valid image file")
            return
        }

        try {
            this.showLoading("Uploading logo...")

            const formData = new FormData()
            formData.append("logo", file)

            const response = await fetch(`${this.apiBaseUrl}/business/logo`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.getAuthToken()}`,
                },
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                this.showSuccess("Logo uploaded successfully!")
                // Update logo display
                const logoImg = document.querySelector('img[alt="Business Logo"]')
                if (logoImg && result.logoUrl) {
                    logoImg.src = result.logoUrl
                }
            } else {
                throw new Error(result.message || "Failed to upload logo")
            }
        } catch (error) {
            this.showError("Failed to upload logo: " + error.message)
        } finally {
            this.hideLoading()
        }
    }

    async loadUserSettings() {
        try {
            const response = await this.makeApiCall("/business/profile", "GET")

            if (response.success && response.data) {
                this.populateAccountForm(response.data)
            }

            // Load notification preferences
            const notificationResponse = await this.makeApiCall("/business/notifications", "GET")
            if (notificationResponse.success && notificationResponse.data) {
                this.populateNotificationSettings(notificationResponse.data.preferences)
            }

            // Load banking settings
            const bankingResponse = await this.makeApiCall("/business/banking-settings", "GET")
            if (bankingResponse.success && bankingResponse.data) {
                this.populateBankingSettings(bankingResponse.data)
            }
        } catch (error) {
            console.error("Failed to load user settings:", error)
        }
    }

    populateAccountForm(data) {
        const fields = {
            "business-name": data.businessName,
            "business-email": data.email,
            "business-phone": data.phone,
            "business-reg": data.registrationNumber,
            "business-address": data.address,
            "business-type": data.businessType,
            "business-category": data.businessCategory,
        }

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id)
            if (element && value) {
                element.value = value
            }
        })
    }

    populateNotificationSettings(preferences) {
        Object.entries(preferences).forEach(([setting, enabled]) => {
            const toggle = document.querySelector(`input[name="${setting}"]`)
            if (toggle) {
                toggle.checked = enabled
            }
        })
    }

    populateBankingSettings(data) {
        if (data.autoWithdrawal) {
            const autoWithdrawalSelect = document.getElementById("auto-withdrawal")
            if (autoWithdrawalSelect) {
                autoWithdrawalSelect.value = data.autoWithdrawal
            }
        }

        if (data.minWithdrawal) {
            const minWithdrawalInput = document.getElementById("min-withdrawal")
            if (minWithdrawalInput) {
                minWithdrawalInput.value = data.minWithdrawal
            }
        }
    }

    setupFormValidation() {
        // Real-time validation for email
        const emailInput = document.getElementById("business-email")
        if (emailInput) {
            emailInput.addEventListener("blur", () => {
                if (emailInput.value && !this.isValidEmail(emailInput.value)) {
                    this.showFieldError(emailInput, "Please enter a valid email address")
                } else {
                    this.clearFieldError(emailInput)
                }
            })
        }

        // Real-time validation for phone
        const phoneInput = document.getElementById("business-phone")
        if (phoneInput) {
            phoneInput.addEventListener("blur", () => {
                if (phoneInput.value && !this.isValidPhone(phoneInput.value)) {
                    this.showFieldError(phoneInput, "Please enter a valid phone number")
                } else {
                    this.clearFieldError(phoneInput)
                }
            })
        }

        // PIN input restrictions
        const pinInputs = document.querySelectorAll('input[type="password"][maxlength="4"]')
        pinInputs.forEach((input) => {
            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4)
            })
        })
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    isValidPhone(phone) {
        const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
        return phoneRegex.test(phone.replace(/\s/g, ""))
    }

    showFieldError(field, message) {
        this.clearFieldError(field)

        const errorDiv = document.createElement("div")
        errorDiv.className = "field-error text-red-500 text-xs mt-1"
        errorDiv.textContent = message

        field.parentNode.appendChild(errorDiv)
        field.classList.add("border-red-500")
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector(".field-error")
        if (existingError) {
            existingError.remove()
        }
        field.classList.remove("border-red-500")
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
        // Create or update loading overlay
        let overlay = document.getElementById("loading-overlay")
        if (!overlay) {
            overlay = document.createElement("div")
            overlay.id = "loading-overlay"
            overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            overlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
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

        // Initialize icons for the notification
        if (typeof lucide !== "undefined") {
            lucide.createIcons()
        }

        // Animate in
        setTimeout(() => {
            notification.classList.remove("translate-x-full")
        }, 100)

        // Auto remove after 5 seconds
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

// Initialize settings manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new SettingsManager()
    const username = document.getElementById("username")
    console.log(username)
    const user = localStorage.getItem("businessName")
    username.innerHTML = user
})

// Export for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
    module.exports = SettingsManager
}
