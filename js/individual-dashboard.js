// Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    checkAuthentication()

    // Initialize dashboard
    initializeDashboard()

    // Load user data
    loadUserData()

    // Load wallet balance
    loadWalletBalance()

    // Load transactions
    loadTransactions()

    // Load activity
    loadActivity()

    // Setup session management
    setupSessionManagement()
})

// Check if user is authenticated
function checkAuthentication() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    const sessionExpiry = localStorage.getItem("nqr_session_expiry")

    if (!currentUser) {
        window.location.href = "individual-login.html"
        return
    }

    // Check session expiry
    if (sessionExpiry && Date.now() > Number.parseInt(sessionExpiry)) {
        // Session expired, redirect to login
        localStorage.removeItem("nqr_current_individual")
        localStorage.removeItem("nqr_auth_token")
        localStorage.removeItem("nqr_session_expiry")
        alert("Your session has expired. Please log in again.")
        window.location.href = "individual-login.html"
        return
    }
}

// Initialize dashboard functionality
function initializeDashboard() {
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

    // Handle window resize
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
            document.body.classList.remove("sidebar-open")
        }
    })
}

// Load user data
function loadUserData() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
    const user = individuals.find((i) => i.email === currentUser)

    if (user) {
        // Update user display
        const firstName = user.fullName ? user.fullName.split(" ")[0] : "User"
        document.getElementById("welcomeName").textContent = firstName
        document.getElementById("userName").textContent = user.fullName || "User"
        document.getElementById("userEmail").textContent = user.email || "user@example.com"

        // Update user initials
        const initials = user.fullName
            ? user.fullName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "U"
        document.getElementById("userInitials").textContent = initials
    }
}

// Balance visibility state
let balanceVisible = true

// Toggle balance visibility
function toggleBalanceVisibility() {
    balanceVisible = !balanceVisible
    const balanceElement = document.getElementById("walletBalance")
    const iconElement = document.getElementById("balanceToggleIcon")

    if (balanceVisible) {
        balanceElement.classList.remove("balance-hidden")
        iconElement.className = "fas fa-eye-slash text-orange-600"
    } else {
        balanceElement.classList.add("balance-hidden")
        iconElement.className = "fas fa-eye text-orange-600"
    }
}

// Load wallet balance
function loadWalletBalance() {
    try {
        // In a real app: const response = await fetch('/api/wallet/balance')
        let balance = localStorage.getItem("nqr_wallet_balance")

        if (!balance) {
            // Generate initial balance for demo
            balance = (Math.floor(Math.random() * 50000) + 10000).toString()
            localStorage.setItem("nqr_wallet_balance", balance)
        }

        const formattedBalance = formatCurrency(Number.parseFloat(balance))
        document.getElementById("walletBalance").textContent = formattedBalance
    } catch (error) {
        console.error("Error loading wallet balance:", error)
        document.getElementById("walletBalance").textContent = "₦0.00"
    }
}

// Load transactions
function loadTransactions() {
    try {
        // Get transactions from localStorage or generate sample data
        let transactions = JSON.parse(localStorage.getItem("nqr_transactions") || "[]")

        if (transactions.length === 0) {
            // Generate sample transactions
            transactions = [
                {
                    id: "1",
                    type: "payment",
                    amount: -2500,
                    description: "Grocery Shopping",
                    merchant: "ShopRite Ikeja",
                    date: new Date().toISOString(),
                    status: "completed",
                },
                {
                    id: "2",
                    type: "received",
                    amount: 15000,
                    description: "Money from John",
                    date: new Date(Date.now() - 86400000).toISOString(),
                    status: "completed",
                },
                {
                    id: "3",
                    type: "payment",
                    amount: -4200,
                    description: "Restaurant Bill",
                    merchant: "Tiki Republic",
                    date: new Date(Date.now() - 172800000).toISOString(),
                    status: "completed",
                },
                {
                    id: "4",
                    type: "funding",
                    amount: 25000,
                    description: "Wallet Top-up",
                    date: new Date(Date.now() - 259200000).toISOString(),
                    status: "completed",
                },
                {
                    id: "5",
                    type: "payment",
                    amount: -1800,
                    description: "Transport Fare",
                    merchant: "Uber",
                    date: new Date(Date.now() - 345600000).toISOString(),
                    status: "completed",
                },
            ]
            localStorage.setItem("nqr_transactions", JSON.stringify(transactions))
        }

        // Display recent transactions (last 5)
        const recentTransactions = transactions.slice(0, 5)
        const transactionsList = document.getElementById("transactionsList")

        if (recentTransactions.length === 0) {
            transactionsList.innerHTML = '<p class="text-gray-500 text-center py-4">No transactions yet</p>'
            return
        }

        transactionsList.innerHTML = recentTransactions
            .map(
                (transaction) => `
              <div class="transaction-item flex items-center justify-between p-3 rounded-lg cursor-pointer">
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          ${getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                          <div class="font-medium text-sm">${transaction.description}</div>
                          <div class="text-xs text-gray-500">
                              ${transaction.merchant ? transaction.merchant + " • " : ""}
                              ${formatDate(transaction.date)}
                          </div>
                      </div>
                  </div>
                  <div class="flex items-center gap-3">
                      <div class="text-right">
                          <div class="font-medium text-sm ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}">
                              ${transaction.amount > 0 ? "+" : ""}${formatCurrency(Math.abs(transaction.amount))}
                          </div>
                          ${getStatusBadge(transaction.status)}
                      </div>
                      <button class="p-1 hover:bg-gray-100 rounded">
                          <i class="fas fa-ellipsis-h text-gray-400"></i>
                      </button>
                  </div>
              </div>
          `,
            )
            .join("")
    } catch (error) {
        console.error("Error loading transactions:", error)
        document.getElementById("transactionsList").innerHTML =
            '<p class="text-red-500 text-center py-4">Error loading transactions</p>'
    }
}

// Load activity feed
function loadActivity() {
    const activities = [
        {
            id: "1",
            type: "security",
            title: "Login from new device",
            description: "iPhone 14 Pro",
            time: "2 hours ago",
            icon: "fas fa-mobile-alt",
            color: "text-blue-500",
        },
        {
            id: "2",
            type: "payment",
            title: "Card added successfully",
            description: "Visa ending in 4532",
            time: "1 day ago",
            icon: "fas fa-credit-card",
            color: "text-green-500",
        },
        {
            id: "3",
            type: "security",
            title: "PIN changed",
            description: "Transaction PIN updated",
            time: "3 days ago",
            icon: "fas fa-shield-alt",
            color: "text-orange-500",
        },
        {
            id: "4",
            type: "notification",
            title: "Payment reminder",
            description: "Electricity bill due",
            time: "5 days ago",
            icon: "fas fa-bell",
            color: "text-purple-500",
        },
    ]

    const activityList = document.getElementById("activityList")
    activityList.innerHTML = activities
        .map(
            (activity) => `
          <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="p-2 rounded-full bg-gray-100 ${activity.color}">
                  <i class="${activity.icon}"></i>
              </div>
              <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm">${activity.title}</div>
                  <div class="text-xs text-gray-500 truncate">${activity.description}</div>
                  <div class="text-xs text-gray-500 mt-1">${activity.time}</div>
              </div>
              ${activity.type === "security" ? '<span class="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">Security</span>' : ""}
          </div>
      `,
        )
        .join("")
}

// Get transaction icon
function getTransactionIcon(type) {
    switch (type) {
        case "payment":
            return '<i class="fas fa-arrow-up-right text-red-500"></i>'
        case "received":
        case "funding":
            return '<i class="fas fa-arrow-down-left text-green-500"></i>'
        default:
            return '<i class="fas fa-arrow-up-right text-gray-500"></i>'
    }
}

// Get status badge
function getStatusBadge(status) {
    switch (status) {
        case "completed":
            return '<span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Completed</span>'
        case "pending":
            return '<span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Pending</span>'
        case "failed":
            return '<span class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Failed</span>'
        default:
            return ""
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount)
}

// Format date
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
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
}

// Toggle user menu
function toggleUserMenu() {
    const userMenu = document.getElementById("userMenu")
    userMenu.classList.toggle("hidden")
}

// Handle logout
function handleLogout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("nqr_current_individual")
        localStorage.removeItem("nqr_auth_token")
        localStorage.removeItem("nqr_session_expiry")
        window.location.href = "individual-login.html"
    }
}

// Setup session management
function setupSessionManagement() {
    // Update session expiry on user activity
    const updateSession = () => {
        const expiryTime = Date.now() + 30 * 60 * 1000 // 30 minutes
        localStorage.setItem("nqr_session_expiry", expiryTime.toString())
    }

    // Listen for user activity
    const activityEvents = ["click", "keypress", "scroll", "mousemove"]
    activityEvents.forEach((event) => {
        document.addEventListener(event, updateSession, { passive: true })
    })

    // Check session expiry every minute
    setInterval(() => {
        const sessionExpiry = localStorage.getItem("nqr_session_expiry")
        if (sessionExpiry && Date.now() > Number.parseInt(sessionExpiry)) {
            alert("Your session has expired. Please log in again.")
            handleLogout()
        }
    }, 60000) // Check every minute
}


