// Quick Pay JavaScript
let savedMerchants = []
let currentMerchant = null

document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    checkAuthentication()

    // Initialize Quick Pay
    initializeQuickPay()

    // Load saved merchants
    loadSavedMerchants()

    // Setup search functionality
    setupSearch()
})

// Check authentication
function checkAuthentication() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    if (!currentUser) {
        window.location.href = "individual-login.html"
        return
    }
}

// Initialize Quick Pay functionality
function initializeQuickPay() {
    // Setup form event listeners
    document.getElementById("quickPaymentForm").addEventListener("submit", handleQuickPayment)

    // Setup PIN input formatting
    const pinInput = document.getElementById("paymentPin")
    pinInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "")
    })

    // Setup amount input formatting
    const amountInput = document.getElementById("paymentAmount")
    amountInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^\d.]/g, "")
    })

    // Close modals when clicking outside
    document.getElementById("paymentModal").addEventListener("click", (e) => {
        if (e.target.id === "paymentModal") {
            closePaymentModal()
        }
    })

    document.getElementById("addMerchantModal").addEventListener("click", (e) => {
        if (e.target.id === "addMerchantModal") {
            closeAddMerchantModal()
        }
    })
}

// Load saved merchants
function loadSavedMerchants() {
    try {
        // Get saved merchants from localStorage
        savedMerchants = JSON.parse(localStorage.getItem("nqr_saved_merchants") || "[]")

        // If no merchants, create sample data for demo
        if (savedMerchants.length === 0) {
            generateSampleMerchants()
        }

        // Update stats
        updateStats()

        // Display merchants
        displayMerchants()
    } catch (error) {
        console.error("Error loading saved merchants:", error)
        showEmptyState()
    }
}

// Generate sample merchants for demo
function generateSampleMerchants() {
    const sampleMerchants = [
        {
            id: "merchant_1",
            business_id: "BIZ001",
            business_name: "ShopRite Ikeja",
            location: "Ikeja City Mall, Lagos",
            category: "Grocery",
            lastUsed: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            totalPayments: 5,
            totalAmount: 25000,
            addedDate: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        },
        {
            id: "merchant_2",
            business_id: "BIZ002",
            business_name: "Cafe Neo",
            location: "Victoria Island, Lagos",
            category: "Restaurant",
            lastUsed: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            totalPayments: 8,
            totalAmount: 12000,
            addedDate: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
        },
        {
            id: "merchant_3",
            business_id: "BIZ003",
            business_name: "Total Gas Station",
            location: "Lekki Phase 1, Lagos",
            category: "Fuel",
            lastUsed: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            totalPayments: 3,
            totalAmount: 15000,
            addedDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        },
        {
            id: "merchant_4",
            business_id: "BIZ004",
            business_name: "Uber",
            location: "Lagos",
            category: "Transport",
            lastUsed: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            totalPayments: 12,
            totalAmount: 18000,
            addedDate: new Date(Date.now() - 1814400000).toISOString(), // 3 weeks ago
        },
    ]

    savedMerchants = sampleMerchants
    localStorage.setItem("nqr_saved_merchants", JSON.stringify(savedMerchants))
}

// Update stats
function updateStats() {
    document.getElementById("totalMerchants").textContent = savedMerchants.length.toString()

    const totalQuickPayments = savedMerchants.reduce((sum, merchant) => sum + merchant.totalPayments, 0)
    document.getElementById("quickPayments").textContent = totalQuickPayments.toString()
}

// Display merchants
function displayMerchants() {
    if (savedMerchants.length === 0) {
        showEmptyState()
        return
    }

    // Hide empty state
    document.getElementById("emptyState").classList.add("hidden")

    // Sort merchants by last used (most recent first)
    const sortedMerchants = [...savedMerchants].sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))

    // Display recent merchants (last 3)
    const recentMerchants = sortedMerchants.slice(0, 3)
    displayMerchantList("recentMerchants", recentMerchants)

    // Display all merchants
    displayMerchantList("savedMerchants", sortedMerchants)
}

// Display merchant list
function displayMerchantList(containerId, merchants) {
    const container = document.getElementById(containerId)

    if (merchants.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No merchants found</p>'
        return
    }

    container.innerHTML = merchants
        .map(
            (merchant) => `
        <div class="merchant-card bg-white border rounded-lg p-4 mb-3 cursor-pointer" onclick="openPaymentModal('${merchant.id}')">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <i class="fas ${getCategoryIcon(merchant.category)} text-orange-600"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 truncate">${merchant.business_name}</h4>
                        <p class="text-sm text-gray-500 truncate">${merchant.location}</p>
                        <div class="flex items-center gap-4 mt-1">
                            <span class="text-xs text-gray-400">Last used: ${formatDate(merchant.lastUsed)}</span>
                            <span class="text-xs text-gray-400">${merchant.totalPayments} payments</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">${merchant.category}</span>
                    <button onclick="event.stopPropagation(); removeMerchant('${merchant.id}')" class="p-1 hover:bg-red-100 rounded text-red-500">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
        )
        .join("")
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        Grocery: "fa-shopping-cart",
        Restaurant: "fa-utensils",
        Fuel: "fa-gas-pump",
        Transport: "fa-car",
        Shopping: "fa-shopping-bag",
        Entertainment: "fa-film",
        Health: "fa-heartbeat",
        Education: "fa-graduation-cap",
        default: "fa-store",
    }
    return icons[category] || icons.default
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim()

        if (query === "") {
            displayMerchants()
            return
        }

        // Filter merchants based on search query
        const filteredMerchants = savedMerchants.filter(
            (merchant) =>
                merchant.business_name.toLowerCase().includes(query) ||
                merchant.location.toLowerCase().includes(query) ||
                merchant.category.toLowerCase().includes(query),
        )

        // Display filtered results
        displayMerchantList("recentMerchants", [])
        displayMerchantList("savedMerchants", filteredMerchants)

        // Update section headers
        if (filteredMerchants.length === 0) {
            document.getElementById("savedMerchants").innerHTML =
                '<p class="text-gray-500 text-center py-4">No merchants found matching your search</p>'
        }
    })
}

// Open payment modal
function openPaymentModal(merchantId) {
    currentMerchant = savedMerchants.find((m) => m.id === merchantId)
    if (!currentMerchant) return

    // Populate merchant info
    document.getElementById("modalMerchantInfo").innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i class="fas ${getCategoryIcon(currentMerchant.category)} text-orange-600"></i>
            </div>
            <div>
                <h4 class="font-medium">${currentMerchant.business_name}</h4>
                <p class="text-sm text-gray-600">${currentMerchant.location}</p>
                <p class="text-xs text-gray-500">Business ID: ${currentMerchant.business_id}</p>
            </div>
        </div>
    `

    // Clear form
    document.getElementById("quickPaymentForm").reset()
    hidePaymentError()

    // Show modal
    document.getElementById("paymentModal").classList.remove("hidden")
    document.body.style.overflow = "hidden"

    // Focus on amount input
    setTimeout(() => {
        document.getElementById("paymentAmount").focus()
    }, 300)
}

// Close payment modal
function closePaymentModal() {
    document.getElementById("paymentModal").classList.add("hidden")
    document.body.style.overflow = "auto"
    currentMerchant = null
}

// Handle quick payment
async function handleQuickPayment(e) {
    e.preventDefault()

    const amount = document.getElementById("paymentAmount").value
    const purpose = document.getElementById("paymentPurpose").value.trim()
    const pin = document.getElementById("paymentPin").value

    // Validate inputs
    if (!amount || Number.parseFloat(amount) <= 0) {
        showPaymentError("Please enter a valid amount")
        return
    }

    if (!purpose) {
        showPaymentError("Purpose is required")
        return
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        showPaymentError("PIN must be exactly 4 digits")
        return
    }

    // Show loading state
    const payButton = document.getElementById("payButton")
    payButton.disabled = true
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...'

    try {
        // Verify PIN
        const currentUser = localStorage.getItem("nqr_current_individual")
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const user = individuals.find((i) => i.email === currentUser)

        if (!user || user.transactionPin !== pin) {
            throw new Error("Invalid PIN")
        }

        // Check wallet balance
        const currentBalance = Number.parseFloat(localStorage.getItem("nqr_wallet_balance") || "0")
        const paymentAmount = Number.parseFloat(amount)

        if (currentBalance < paymentAmount) {
            throw new Error("Insufficient wallet balance")
        }

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Update wallet balance
        const newBalance = currentBalance - paymentAmount
        localStorage.setItem("nqr_wallet_balance", newBalance.toString())

        // Add transaction to history
        const transactions = JSON.parse(localStorage.getItem("nqr_transactions") || "[]")
        transactions.unshift({
            id: Date.now().toString(),
            type: "payment",
            amount: -paymentAmount,
            description: purpose,
            merchant: currentMerchant.business_name,
            date: new Date().toISOString(),
            status: "completed",
        })
        localStorage.setItem("nqr_transactions", JSON.stringify(transactions))

        // Update merchant stats
        updateMerchantStats(currentMerchant.id, paymentAmount)

        // Close payment modal
        closePaymentModal()

        // Show success modal
        showSuccessModal(paymentAmount, currentMerchant.business_name)
    } catch (error) {
        console.error("Payment error:", error)
        showPaymentError(error.message || "Payment failed. Please try again.")
    } finally {
        // Reset button
        payButton.disabled = false
        payButton.innerHTML = "Pay Now"
    }
}

// Update merchant stats
function updateMerchantStats(merchantId, amount) {
    const merchantIndex = savedMerchants.findIndex((m) => m.id === merchantId)
    if (merchantIndex !== -1) {
        savedMerchants[merchantIndex].lastUsed = new Date().toISOString()
        savedMerchants[merchantIndex].totalPayments += 1
        savedMerchants[merchantIndex].totalAmount += amount

        // Save updated merchants
        localStorage.setItem("nqr_saved_merchants", JSON.stringify(savedMerchants))

        // Refresh display
        loadSavedMerchants()
    }
}

// Show success modal
function showSuccessModal(amount, merchantName) {
    document.getElementById("successAmount").textContent = formatCurrency(amount)
    document.getElementById("successMerchant").textContent = `paid to ${merchantName}`
    document.getElementById("successModal").classList.remove("hidden")
}

// Close success modal
function closeSuccessModal() {
    document.getElementById("successModal").classList.add("hidden")
}

// Show/hide add merchant modal
function showAddMerchantModal() {
    document.getElementById("addMerchantModal").classList.remove("hidden")
    document.body.style.overflow = "hidden"
}

function closeAddMerchantModal() {
    document.getElementById("addMerchantModal").classList.add("hidden")
    document.body.style.overflow = "auto"
}

// Remove merchant
function removeMerchant(merchantId) {
    if (confirm("Are you sure you want to remove this merchant from Quick Pay?")) {
        savedMerchants = savedMerchants.filter((m) => m.id !== merchantId)
        localStorage.setItem("nqr_saved_merchants", JSON.stringify(savedMerchants))
        loadSavedMerchants()
    }
}

// Show empty state
function showEmptyState() {
    document.getElementById("emptyState").classList.remove("hidden")
    document.getElementById("recentMerchants").innerHTML = ""
    document.getElementById("savedMerchants").innerHTML = ""
}

// Error handling
function showPaymentError(message) {
    document.getElementById("paymentErrorText").textContent = message
    document.getElementById("paymentError").classList.remove("hidden")
}

function hidePaymentError() {
    document.getElementById("paymentError").classList.add("hidden")
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount)
}

function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`

    return date.toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
    })
}

// Function to add merchant from payment flow (called from pay.js)
window.addMerchantToQuickPay = (qrData) => {
    const newMerchant = {
        id: `merchant_${Date.now()}`,
        business_id: qrData.business_id,
        business_name: qrData.business_name,
        location: qrData.location,
        category: qrData.category || "Business",
        lastUsed: new Date().toISOString(),
        totalPayments: 1,
        totalAmount: 0,
        addedDate: new Date().toISOString(),
    }

    // Check if merchant already exists
    const existingMerchant = savedMerchants.find((m) => m.business_id === qrData.business_id)
    if (!existingMerchant) {
        savedMerchants.push(newMerchant)
        localStorage.setItem("nqr_saved_merchants", JSON.stringify(savedMerchants))
        return true
    }
    return false
}
