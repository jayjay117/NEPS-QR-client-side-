// Settings JavaScript with full functionality and API integration
document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    checkAuthentication()

    // Initialize settings page
    initializeSettingsPage()

    // Load user data
    loadUserData()

    // Setup form event listeners
    setupEventListeners()

    // Load saved preferences
    loadSavedPreferences()
})

// API Configuration
const API_BASE_URL = "https://api.neps-qr.com/v1" // Replace with actual API URL
const API_ENDPOINTS = {
    user: "/user",
    updateProfile: "/user/profile",
    changePassword: "/user/change-password",
    changePin: "/user/change-pin",
    transactions: "/transactions",
    exportTransactions: "/transactions/export",
    support: "/support/contact",
    preferences: "/user/preferences",
}

// Current view state
let currentView = "main"

// Check authentication
function checkAuthentication() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    if (!currentUser) {
        window.location.href = "individual-login.html"
        return
    }
}

// Initialize settings page
function initializeSettingsPage() {
    // Add click listeners for responsive sidebar
    window.toggleSidebar = () => {
        document.body.classList.toggle("sidebar-open")
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (window.innerWidth < 1024 && !e.target.closest(".sidebar") && !e.target.closest("button")) {
            document.body.classList.remove("sidebar-open")
        }
    })

    // Setup view navigation functions
    setupViewNavigation()
}

// Setup view navigation
function setupViewNavigation() {
    window.showPersonalInfoView = () => switchView("personalInfo", "Personal Information")
    window.showLanguageView = () => switchView("language", "Language")
    window.showCurrencyView = () => switchView("currency", "Currency")
    window.showTransactionHistoryView = () => switchView("transactionHistory", "Transaction History")
    window.showHelpSupportView = () => switchView("helpSupport", "Help & Support")
    window.showTermsView = () => switchView("terms", "Terms & Conditions")
    window.showPrivacyView = () => switchView("privacy", "Privacy Policy")
    window.showAboutView = () => switchView("about", "About NEPS-QR")
    window.goBackToSettings = () => switchView("main", "Settings")

    // Modal functions
    window.showChangePasswordModal = showChangePasswordModal
    window.closeChangePasswordModal = closeChangePasswordModal
    window.showChangePinModal = showChangePinModal
    window.closeChangePinModal = closeChangePinModal
    window.showLogoutModal = showLogoutModal
    window.closeLogoutModal = closeLogoutModal
    window.showDeleteAccountModal = showDeleteAccountModal
    window.closeDeleteAccountModal = closeDeleteAccountModal
    window.confirmLogout = confirmLogout
    window.confirmDeleteAccount = confirmDeleteAccount
    window.toggleUserMenu = toggleUserMenu
    window.toggleFAQ = toggleFAQ
    window.filterTransactions = filterTransactions
    window.exportTransactions = exportTransactions
    window.saveLanguage = saveLanguage
    window.saveCurrency = saveCurrency
}

// Switch between views
function switchView(viewName, title) {
    // Hide all views
    const views = [
        "mainSettingsView",
        "personalInfoView",
        "languageView",
        "currencyView",
        "transactionHistoryView",
        "helpSupportView",
        "termsView",
        "privacyView",
        "aboutView",
    ]

    views.forEach((view) => {
        const element = document.getElementById(view)
        if (element) element.classList.add("hidden")
    })

    // Show selected view
    if (viewName === "main") {
        const mainView = document.getElementById("mainSettingsView")
        const backButton = document.getElementById("backButton")
        if (mainView) mainView.classList.remove("hidden")
        if (backButton) backButton.classList.add("hidden")
    } else {
        const targetView = document.getElementById(`${viewName}View`)
        const backButton = document.getElementById("backButton")
        if (targetView) targetView.classList.remove("hidden")
        if (backButton) backButton.classList.remove("hidden")
    }

    // Update page title
    const pageTitle = document.getElementById("pageTitle")
    if (pageTitle) pageTitle.textContent = title
    currentView = viewName

    // Load view-specific data
    loadViewData(viewName)
}

// Load view-specific data
function loadViewData(viewName) {
    switch (viewName) {
        case "personalInfo":
            loadPersonalInfo()
            break
        case "transactionHistory":
            loadTransactionHistory()
            break
        case "language":
            loadLanguagePreferences()
            break
        case "currency":
            loadCurrencyPreferences()
            break
    }
}

// Load user data
function loadUserData() {
    try {
        const currentUser = localStorage.getItem("nqr_current_individual")
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const user = individuals.find((i) => i.email === currentUser)

        if (user) {
            updateUserDisplay(user)
        }
    } catch (error) {
        console.error("Error loading user data:", error)
    }
}

// Update user display
function updateUserDisplay(user) {
    const userName = document.getElementById("userName")
    const userEmail = document.getElementById("userEmail")
    const userInitials = document.getElementById("userInitials")

    if (userName) userName.textContent = user.fullName || user.firstName + " " + user.lastName || "User"
    if (userEmail) userEmail.textContent = user.email || "user@example.com"

    // Update user initials
    if (userInitials) {
        const initials =
            user.fullName || user.firstName
                ? (user.fullName || user.firstName + " " + user.lastName)
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"
        userInitials.textContent = initials
    }
}

// Load personal information
function loadPersonalInfo() {
    try {
        const currentUser = localStorage.getItem("nqr_current_individual")
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const user = individuals.find((i) => i.email === currentUser)

        if (user) {
            populatePersonalInfoForm(user)
        }
    } catch (error) {
        console.error("Error loading personal info:", error)
    }
}

// Populate personal info form
function populatePersonalInfoForm(user) {
    const fullName = user.fullName || ""
    const nameParts = fullName.split(" ")

    const firstName = document.getElementById("firstName")
    const lastName = document.getElementById("lastName")
    const email = document.getElementById("email")
    const phone = document.getElementById("phone")
    const dateOfBirth = document.getElementById("dateOfBirth")

    if (firstName) firstName.value = user.firstName || nameParts[0] || ""
    if (lastName) lastName.value = user.lastName || nameParts.slice(1).join(" ") || ""
    if (email) email.value = user.email || ""
    if (phone) phone.value = user.phone || ""
    if (dateOfBirth) dateOfBirth.value = user.dateOfBirth || ""
}

// Load saved preferences
function loadSavedPreferences() {
    // Load toggle states
    const biometricEnabled = localStorage.getItem("nqr_biometric_enabled") === "true"
    const notificationsEnabled = localStorage.getItem("nqr_notifications_enabled") !== "false"
    const darkModeEnabled = localStorage.getItem("nqr_dark_mode_enabled") === "true"

    // Set toggle states
    const biometricToggle = document.getElementById("biometricToggle")
    const notificationToggle = document.getElementById("notificationToggle")
    const darkModeToggle = document.getElementById("darkModeToggle")

    if (biometricToggle) biometricToggle.checked = biometricEnabled
    if (notificationToggle) notificationToggle.checked = notificationsEnabled
    if (darkModeToggle) darkModeToggle.checked = darkModeEnabled

    // Load language and currency preferences
    const savedLanguage = localStorage.getItem("nqr_language") || "en-US"
    const savedCurrency = localStorage.getItem("nqr_currency") || "NGN"

    updateLanguageDisplay(savedLanguage)
    updateCurrencyDisplay(savedCurrency)
}

// Update language display
function updateLanguageDisplay(languageCode) {
    const languageMap = {
        "en-US": "English (US)",
        "en-GB": "English (UK)",
        fr: "Français",
        es: "Español",
        yo: "Yorùbá",
        ig: "Igbo",
        ha: "Hausa",
    }

    const currentLanguage = document.getElementById("currentLanguage")
    if (currentLanguage) {
        currentLanguage.textContent = languageMap[languageCode] || "English (US)"
    }
}

// Update currency display
function updateCurrencyDisplay(currencyCode) {
    const currencyMap = {
        NGN: "Nigerian Naira (₦)",
        USD: "US Dollar ($)",
        EUR: "Euro (€)",
        GBP: "British Pound (£)",
        CAD: "Canadian Dollar (C$)",
    }

    const currentCurrency = document.getElementById("currentCurrency")
    if (currentCurrency) {
        currentCurrency.textContent = currencyMap[currencyCode] || "Nigerian Naira (₦)"
    }
}

// Setup event listeners
function setupEventListeners() {
    // Personal info form
    const personalInfoForm = document.getElementById("personalInfoForm")
    if (personalInfoForm) {
        personalInfoForm.addEventListener("submit", handlePersonalInfoUpdate)
    }

    // Change password form
    const changePasswordForm = document.getElementById("changePasswordForm")
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", handleChangePassword)
    }

    // Change PIN form
    const changePinForm = document.getElementById("changePinForm")
    if (changePinForm) {
        changePinForm.addEventListener("submit", handleChangePin)
    }

    // Support form
    const supportForm = document.getElementById("supportForm")
    if (supportForm) {
        supportForm.addEventListener("submit", handleSupportSubmission)
    }

    // PIN input formatting
    const pinInputs = ["currentPin", "newPin", "confirmNewPin"]
    pinInputs.forEach((inputId) => {
        const input = document.getElementById(inputId)
        if (input) {
            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/\D/g, "")
            })
        }
    })

    // Delete confirmation input
    const deleteConfirmationInput = document.getElementById("deleteConfirmation")
    if (deleteConfirmationInput) {
        deleteConfirmationInput.addEventListener("input", (e) => {
            const deleteButton = document.getElementById("deleteAccountButton")
            if (deleteButton) {
                deleteButton.disabled = e.target.value !== "DELETE"
            }
        })
    }

    // Toggle switches
    setupToggleSwitches()
}

// Setup toggle switches
function setupToggleSwitches() {
    // Biometric toggle
    const biometricToggle = document.getElementById("biometricToggle")
    if (biometricToggle) {
        biometricToggle.addEventListener("change", (e) => {
            localStorage.setItem("nqr_biometric_enabled", e.target.checked.toString())
            if (e.target.checked) {
                showNotification(
                    "Biometric authentication enabled. You can now use fingerprint or face ID to login.",
                    "success",
                )
            }
        })
    }

    // Notification toggle
    const notificationToggle = document.getElementById("notificationToggle")
    if (notificationToggle) {
        notificationToggle.addEventListener("change", (e) => {
            localStorage.setItem("nqr_notifications_enabled", e.target.checked.toString())
            showNotification(`Push notifications ${e.target.checked ? "enabled" : "disabled"}.`, "info")
        })
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById("darkModeToggle")
    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", (e) => {
            localStorage.setItem("nqr_dark_mode_enabled", e.target.checked.toString())
            if (e.target.checked) {
                showNotification("Dark mode will be applied on next app restart.", "info")
            }
        })
    }
}

// Language and currency functions
function saveLanguage() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked')
    if (selectedLanguage) {
        localStorage.setItem("nqr_language", selectedLanguage.value)
        updateLanguageDisplay(selectedLanguage.value)
        showNotification("Language preference saved successfully!", "success")
        setTimeout(() => switchView("main", "Settings"), 1500)
    }
}

function saveCurrency() {
    const selectedCurrency = document.querySelector('input[name="currency"]:checked')
    if (selectedCurrency) {
        localStorage.setItem("nqr_currency", selectedCurrency.value)
        updateCurrencyDisplay(selectedCurrency.value)
        showNotification("Currency preference saved successfully!", "success")
        setTimeout(() => switchView("main", "Settings"), 1500)
    }
}

// Load language preferences
function loadLanguagePreferences() {
    const savedLanguage = localStorage.getItem("nqr_language") || "en-US"
    const languageRadio = document.querySelector(`input[name="language"][value="${savedLanguage}"]`)
    if (languageRadio) {
        languageRadio.checked = true
    }
}

// Load currency preferences
function loadCurrencyPreferences() {
    const savedCurrency = localStorage.getItem("nqr_currency") || "NGN"
    const currencyRadio = document.querySelector(`input[name="currency"][value="${savedCurrency}"]`)
    if (currencyRadio) {
        currencyRadio.checked = true
    }
}

// Handle personal info update
function handlePersonalInfoUpdate(e) {
    e.preventDefault()

    const formData = {
        firstName: document.getElementById("firstName")?.value || "",
        lastName: document.getElementById("lastName")?.value || "",
        email: document.getElementById("email")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        dateOfBirth: document.getElementById("dateOfBirth")?.value || "",
    }

    // Validate inputs
    if (!formData.firstName || !formData.lastName || !formData.email) {
        showPersonalInfoError("Please fill in all required fields")
        return
    }

    if (!isValidEmail(formData.email)) {
        showPersonalInfoError("Please enter a valid email address")
        return
    }

    // Show loading state
    const saveButton = document.getElementById("savePersonalInfoButton")
    if (saveButton) {
        saveButton.disabled = true
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...'
    }

    try {
        // Update local storage
        const currentUser = localStorage.getItem("nqr_current_individual")
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const userIndex = individuals.findIndex((i) => i.email === currentUser)

        if (userIndex !== -1) {
            individuals[userIndex] = { ...individuals[userIndex], ...formData }
            individuals[userIndex].fullName = `${formData.firstName} ${formData.lastName}`
            localStorage.setItem("nqr_individuals", JSON.stringify(individuals))
        }

        // Update display
        loadUserData()
        showPersonalInfoSuccess()
    } catch (error) {
        console.error("Error updating personal info:", error)
        showPersonalInfoError("Failed to update personal information. Please try again.")
    } finally {
        // Reset button
        if (saveButton) {
            saveButton.disabled = false
            saveButton.innerHTML = "Save Changes"
        }
    }
}

// Handle change password
function handleChangePassword(e) {
    e.preventDefault()

    const currentPassword = document.getElementById("currentPassword")?.value || ""
    const newPassword = document.getElementById("newPassword")?.value || ""
    const confirmNewPassword = document.getElementById("confirmNewPassword")?.value || ""

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showPasswordChangeError("Please fill in all fields")
        return
    }

    if (newPassword !== confirmNewPassword) {
        showPasswordChangeError("New passwords do not match")
        return
    }

    if (newPassword.length < 6) {
        showPasswordChangeError("New password must be at least 6 characters long")
        return
    }

    // Show loading state
    const changePasswordButton = document.getElementById("changePasswordButton")
    if (changePasswordButton) {
        changePasswordButton.disabled = true
        changePasswordButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Changing...'
    }

    try {
        // Update local storage
        const currentUser = localStorage.getItem("nqr_current_individual")
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const userIndex = individuals.findIndex((i) => i.email === currentUser)

        if (userIndex === -1 || individuals[userIndex].password !== currentPassword) {
            throw new Error("Current password is incorrect")
        }

        individuals[userIndex].password = newPassword
        localStorage.setItem("nqr_individuals", JSON.stringify(individuals))

        // Close modal and show success
        closeChangePasswordModal()
        showNotification("Password changed successfully!", "success")
    } catch (error) {
        console.error("Error changing password:", error)
        showPasswordChangeError(error.message)
    } finally {
        // Reset button
        if (changePasswordButton) {
            changePasswordButton.disabled = false
            changePasswordButton.innerHTML = "Change Password"
        }
    }
}

// Handle change PIN
function handleChangePin(e) {
    e.preventDefault()

    const currentPin = document.getElementById("currentPin")?.value || ""
    const newPin = document.getElementById("newPin")?.value || ""
    const confirmNewPin = document.getElementById("confirmNewPin")?.value || ""

    // Validate inputs
    if (!currentPin || !newPin || !confirmNewPin) {
        showPinChangeError("Please fill in all fields")
        return
    }

    if (currentPin.length !== 4 || newPin.length !== 4 || confirmNewPin.length !== 4) {
        showPinChangeError("PIN must be exactly 4 digits")
        return
    }

    if (newPin !== confirmNewPin) {
        showPinChangeError("New PINs do not match")
        return
    }

    if (!/^\d{4}$/.test(newPin)) {
        showPinChangeError("PIN must contain only numbers")
        return
    }

    // Show loading state
    const changePinButton = document.getElementById("changePinButton")
    if (changePinButton) {
        changePinButton.disabled = true
        changePinButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Changing...'
    }

    try {
        // Update local storage
        const currentUser = localStorage.getItem("nqr_current_individual")
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const userIndex = individuals.findIndex((i) => i.email === currentUser)

        if (userIndex === -1 || individuals[userIndex].transactionPin !== currentPin) {
            throw new Error("Current PIN is incorrect")
        }

        individuals[userIndex].transactionPin = newPin
        localStorage.setItem("nqr_individuals", JSON.stringify(individuals))

        // Close modal and show success
        closeChangePinModal()
        showNotification("Transaction PIN changed successfully!", "success")
    } catch (error) {
        console.error("Error changing PIN:", error)
        showPinChangeError(error.message)
    } finally {
        // Reset button
        if (changePinButton) {
            changePinButton.disabled = false
            changePinButton.innerHTML = "Change PIN"
        }
    }
}

// Load transaction history
function loadTransactionHistory() {
    try {
        const transactionsList = document.getElementById("transactionsList")
        if (!transactionsList) return

        // Show loading
        transactionsList.innerHTML =
            '<div class="text-center py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Loading transactions...</div>'

        // Get transactions from local storage
        const transactions = JSON.parse(localStorage.getItem("nqr_transactions") || "[]").slice(0, 10)

        // Display transactions
        if (transactions.length === 0) {
            transactionsList.innerHTML = '<div class="text-center py-8 text-gray-500">No transactions found</div>'
            return
        }

        transactionsList.innerHTML = transactions
            .map(
                (transaction) => `
      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-${transaction.type === "payment" ? "red" : "green"}-100 rounded-full flex items-center justify-center">
            <i class="fas fa-${transaction.type === "payment" ? "arrow-up" : "arrow-down"} text-${transaction.type === "payment" ? "red" : "green"}-600"></i>
          </div>
          <div>
            <div class="font-medium">${transaction.merchant || transaction.description || "Transaction"}</div>
            <div class="text-sm text-gray-600">${formatDate(transaction.date || transaction.timestamp)}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-medium ${transaction.type === "payment" ? "text-red-600" : "text-green-600"}">
            ${transaction.type === "payment" ? "-" : "+"}₦${formatAmount(transaction.amount)}
          </div>
          <div class="text-sm text-gray-600">${transaction.status || "Completed"}</div>
        </div>
      </div>
    `,
            )
            .join("")
    } catch (error) {
        console.error("Error loading transactions:", error)
        const transactionsList = document.getElementById("transactionsList")
        if (transactionsList) {
            transactionsList.innerHTML = '<div class="text-center py-4 text-red-600">Error loading transactions</div>'
        }
    }
}

// Filter transactions
function filterTransactions() {
    const dateFrom = document.getElementById("dateFrom")?.value
    const dateTo = document.getElementById("dateTo")?.value

    if (!dateFrom || !dateTo) {
        showNotification("Please select both start and end dates", "error")
        return
    }

    try {
        const transactionsList = document.getElementById("transactionsList")
        if (!transactionsList) return

        // Show loading
        transactionsList.innerHTML =
            '<div class="text-center py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Filtering transactions...</div>'

        // Filter transactions locally
        const allTransactions = JSON.parse(localStorage.getItem("nqr_transactions") || "[]")
        const transactions = allTransactions.filter((t) => {
            const transactionDate = new Date(t.date || t.timestamp)
            return transactionDate >= new Date(dateFrom) && transactionDate <= new Date(dateTo)
        })

        // Display filtered results
        if (transactions.length === 0) {
            transactionsList.innerHTML =
                '<div class="text-center py-8 text-gray-500">No transactions found for the selected date range</div>'
            return
        }

        transactionsList.innerHTML = transactions
            .map(
                (transaction) => `
      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-${transaction.type === "payment" ? "red" : "green"}-100 rounded-full flex items-center justify-center">
            <i class="fas fa-${transaction.type === "payment" ? "arrow-up" : "arrow-down"} text-${transaction.type === "payment" ? "red" : "green"}-600"></i>
          </div>
          <div>
            <div class="font-medium">${transaction.merchant || transaction.description || "Transaction"}</div>
            <div class="text-sm text-gray-600">${formatDate(transaction.date || transaction.timestamp)}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-medium ${transaction.type === "payment" ? "text-red-600" : "text-green-600"}">
            ${transaction.type === "payment" ? "-" : "+"}₦${formatAmount(transaction.amount)}
          </div>
          <div class="text-sm text-gray-600">${transaction.status || "Completed"}</div>
        </div>
      </div>
    `,
            )
            .join("")
    } catch (error) {
        console.error("Error filtering transactions:", error)
        const transactionsList = document.getElementById("transactionsList")
        if (transactionsList) {
            transactionsList.innerHTML = '<div class="text-center py-4 text-red-600">Error filtering transactions</div>'
        }
    }
}

// Export transactions
function exportTransactions(format) {
    try {
        const dateFrom = document.getElementById("dateFrom")?.value
        const dateTo = document.getElementById("dateTo")?.value

        // Get transactions from local storage
        const transactions = JSON.parse(localStorage.getItem("nqr_transactions") || "[]")
        let filteredTransactions = transactions

        if (dateFrom && dateTo) {
            filteredTransactions = transactions.filter((t) => {
                const transactionDate = new Date(t.date || t.timestamp)
                return transactionDate >= new Date(dateFrom) && transactionDate <= new Date(dateTo)
            })
        }

        if (format === "csv") {
            exportToCSV(filteredTransactions)
        } else if (format === "pdf") {
            exportToPDF(filteredTransactions)
        }
    } catch (error) {
        console.error("Error exporting transactions:", error)
        showNotification("Error exporting transactions", "error")
    }
}

// Export to CSV
function exportToCSV(transactions) {
    const headers = ["Date", "Merchant", "Amount", "Type", "Status"]
    const csvContent = [
        headers.join(","),
        ...transactions.map((t) =>
            [
                formatDate(t.date || t.timestamp),
                `"${t.merchant || t.description || "Transaction"}"`,
                t.amount,
                t.type || "payment",
                t.status || "completed",
            ].join(","),
        ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    showNotification("Transactions exported as CSV", "success")
}

// Export to PDF (simplified version)
function exportToPDF(transactions) {
    const content = `
NEPS-QR Transaction History
Generated: ${new Date().toLocaleDateString()}

${transactions
            .map(
                (t) => `
Date: ${formatDate(t.date || t.timestamp)}
Merchant: ${t.merchant || t.description || "Transaction"}
Amount: ₦${formatAmount(t.amount)}
Type: ${t.type || "payment"}
Status: ${t.status || "completed"}
---
`,
            )
            .join("")}
  `

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    showNotification("Transactions exported as text file", "success")
}

// Handle support form submission
function handleSupportSubmission(e) {
    e.preventDefault()

    const subject = document.getElementById("supportSubject")?.value
    const message = document.getElementById("supportMessage")?.value

    if (!subject || !message) {
        showNotification("Please fill in all fields", "error")
        return
    }

    const submitButton = e.target.querySelector('button[type="submit"]')
    if (submitButton) {
        submitButton.disabled = true
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...'
    }

    try {
        const currentUser = localStorage.getItem("nqr_current_individual")

        // Save support ticket locally
        const supportTickets = JSON.parse(localStorage.getItem("nqr_support_tickets") || "[]")
        supportTickets.push({
            id: Date.now(),
            subject,
            message,
            userEmail: currentUser,
            timestamp: new Date().toISOString(),
            status: "pending",
        })
        localStorage.setItem("nqr_support_tickets", JSON.stringify(supportTickets))

        showNotification("Support message saved. We'll contact you via email soon.", "success")
        const supportForm = document.getElementById("supportForm")
        if (supportForm) supportForm.reset()
    } catch (error) {
        console.error("Error submitting support request:", error)
        showNotification("Error sending support message. Please try again.", "error")
    } finally {
        if (submitButton) {
            submitButton.disabled = false
            submitButton.innerHTML = "Send Message"
        }
    }
}

// FAQ toggle functionality
function toggleFAQ(faqId) {
    const faqContent = document.getElementById(faqId)
    const faqIcon = document.getElementById(`${faqId}-icon`)

    if (faqContent && faqIcon) {
        if (faqContent.classList.contains("hidden")) {
            faqContent.classList.remove("hidden")
            faqIcon.style.transform = "rotate(180deg)"
        } else {
            faqContent.classList.add("hidden")
            faqIcon.style.transform = "rotate(0deg)"
        }
    }
}

// Modal functions
function showChangePasswordModal() {
    const modal = document.getElementById("changePasswordModal")
    const form = document.getElementById("changePasswordForm")
    if (modal) {
        modal.classList.remove("hidden")
        document.body.style.overflow = "hidden"
    }
    if (form) form.reset()
    hidePasswordChangeError()
}

function closeChangePasswordModal() {
    const modal = document.getElementById("changePasswordModal")
    if (modal) {
        modal.classList.add("hidden")
        document.body.style.overflow = "auto"
    }
}

function showChangePinModal() {
    const modal = document.getElementById("changePinModal")
    const form = document.getElementById("changePinForm")
    if (modal) {
        modal.classList.remove("hidden")
        document.body.style.overflow = "hidden"
    }
    if (form) form.reset()
    hidePinChangeError()
}

function closeChangePinModal() {
    const modal = document.getElementById("changePinModal")
    if (modal) {
        modal.classList.add("hidden")
        document.body.style.overflow = "auto"
    }
}

function showLogoutModal() {
    const modal = document.getElementById("logoutModal")
    if (modal) {
        modal.classList.remove("hidden")
        document.body.style.overflow = "hidden"
    }
}

function closeLogoutModal() {
    const modal = document.getElementById("logoutModal")
    if (modal) {
        modal.classList.add("hidden")
        document.body.style.overflow = "auto"
    }
}

function showDeleteAccountModal() {
    const modal = document.getElementById("deleteAccountModal")
    const input = document.getElementById("deleteConfirmation")
    const button = document.getElementById("deleteAccountButton")

    if (modal) {
        modal.classList.remove("hidden")
        document.body.style.overflow = "hidden"
    }
    if (input) input.value = ""
    if (button) button.disabled = true
}

function closeDeleteAccountModal() {
    const modal = document.getElementById("deleteAccountModal")
    if (modal) {
        modal.classList.add("hidden")
        document.body.style.overflow = "auto"
    }
}

// Confirm logout
function confirmLogout() {
    // Clear all user data
    localStorage.removeItem("nqr_current_individual")
    localStorage.removeItem("nqr_auth_token")
    localStorage.removeItem("nqr_session_expiry")

    // Redirect to login
    window.location.href = "individual-login.html"
}

// Confirm delete account
function confirmDeleteAccount() {
    const confirmation = document.getElementById("deleteConfirmation")?.value

    if (confirmation !== "DELETE") {
        showNotification("Please type 'DELETE' to confirm account deletion", "error")
        return
    }

    // Show loading state
    const deleteButton = document.getElementById("deleteAccountButton")
    if (deleteButton) {
        deleteButton.disabled = true
        deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Deleting...'
    }

    try {
        const currentUser = localStorage.getItem("nqr_current_individual")

        // Remove user from individuals array
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const updatedIndividuals = individuals.filter((i) => i.email !== currentUser)
        localStorage.setItem("nqr_individuals", JSON.stringify(updatedIndividuals))

        clearAllUserData()
        showNotification("Your account has been successfully deleted.", "success")
        setTimeout(() => (window.location.href = "individual-login.html"), 2000)
    } catch (error) {
        console.error("Error deleting account:", error)
        showNotification("An error occurred while deleting your account. Please try again.", "error")

        // Reset button
        if (deleteButton) {
            deleteButton.disabled = false
            deleteButton.innerHTML = "Delete Account"
        }
    }
}

// Clear all user data
function clearAllUserData() {
    const keysToRemove = [
        "nqr_current_individual",
        "nqr_auth_token",
        "nqr_session_expiry",
        "nqr_wallet_balance",
        "nqr_transactions",
        "nqr_user_cards",
        "nqr_saved_merchants",
        "nqr_biometric_enabled",
        "nqr_notifications_enabled",
        "nqr_dark_mode_enabled",
        "nqr_language",
        "nqr_currency",
        "nqr_support_tickets",
    ]

    keysToRemove.forEach((key) => localStorage.removeItem(key))
}

// Toggle user menu
function toggleUserMenu() {
    const userMenu = document.getElementById("userMenu")
    if (userMenu) {
        userMenu.classList.toggle("hidden")
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

function formatAmount(amount) {
    return Number.parseFloat(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

// Notification system
function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationClasses(type)}`

    notification.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span class="flex-1">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="text-current opacity-70 hover:opacity-100">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

    document.body.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove()
        }
    }, 5000)
}

function getNotificationClasses(type) {
    const classes = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
        info: "bg-blue-500 text-white",
    }
    return classes[type] || classes.info
}

function getNotificationIcon(type) {
    const icons = {
        success: "check-circle",
        error: "exclamation-circle",
        warning: "exclamation-triangle",
        info: "info-circle",
    }
    return icons[type] || icons.info
}

// Error handling functions
function showPersonalInfoError(message) {
    const errorElement = document.getElementById("personalInfoError")
    const errorText = document.getElementById("personalInfoErrorText")
    const successElement = document.getElementById("personalInfoSuccess")

    if (errorText) errorText.textContent = message
    if (errorElement) errorElement.classList.remove("hidden")
    if (successElement) successElement.classList.add("hidden")
}

function showPersonalInfoSuccess() {
    const successElement = document.getElementById("personalInfoSuccess")
    const errorElement = document.getElementById("personalInfoError")

    if (successElement) successElement.classList.remove("hidden")
    if (errorElement) errorElement.classList.add("hidden")

    setTimeout(() => {
        if (successElement) successElement.classList.add("hidden")
    }, 3000)
}

function showPasswordChangeError(message) {
    const errorElement = document.getElementById("passwordChangeError")
    const errorText = document.getElementById("passwordChangeErrorText")

    if (errorText) errorText.textContent = message
    if (errorElement) errorElement.classList.remove("hidden")
}

function hidePasswordChangeError() {
    const errorElement = document.getElementById("passwordChangeError")
    if (errorElement) errorElement.classList.add("hidden")
}

function showPinChangeError(message) {
    const errorElement = document.getElementById("pinChangeError")
    const errorText = document.getElementById("pinChangeErrorText")

    if (errorText) errorText.textContent = message
    if (errorElement) errorElement.classList.remove("hidden")
}

function hidePinChangeError() {
    const errorElement = document.getElementById("pinChangeError")
    if (errorElement) errorElement.classList.add("hidden")
}
