// Wallet JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    checkAuthentication()

    // Initialize wallet page
    initializeWalletPage()

    // Load user data
    loadUserData()

    // Load wallet balance
    loadWalletBalance()

    // Load recent transactions
    loadRecentTransactions()
})

// Check authentication
function checkAuthentication() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    if (!currentUser) {
        window.location.href = "individual-login.html"
        return
    }
}

// Initialize wallet page
function initializeWalletPage() {
    // Implementation for initializing the wallet page
}

// Load user data
function loadUserData() {
    // Implementation for loading user data
}

// Load wallet balance
function loadWalletBalance() {
    // Implementation for loading wallet balance
}

// Load recent transactions
function loadRecentTransactions() {
    // Implementation for loading recent transactions
}
  