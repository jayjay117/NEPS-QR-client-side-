// Cards JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    checkAuthentication()

    // Initialize cards page
    initializeCardsPage()

    // Load user data
    loadUserData()

    // Load cards
    loadCards()
})

// Check authentication
function checkAuthentication() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    if (!currentUser) {
        window.location.href = "individual-login.html"
        return
    }
}

// Initialize cards page functionality
function initializeCardsPage() {
    // Add click listeners for responsive sidebar
    window.toggleSidebar = () => {
        document.body.classList.toggle("sidebar-open")
    }

    // Setup form event listeners
    document.getElementById("addCardForm").addEventListener("submit", handleAddCard)
    document.getElementById("fundWalletForm").addEventListener("submit", handleFundWallet)

    // Setup card number formatting
    const cardNumberInput = document.getElementById("cardNumber")
    cardNumberInput.addEventListener("input", (e) => {
        // Format card number with spaces
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 16) value = value.slice(0, 16)

        // Add spaces every 4 digits
        let formattedValue = ""
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += " "
            }
            formattedValue += value[i]
        }

        e.target.value = formattedValue

        // Detect card brand
        detectCardBrand(value)
    })

    // Setup expiry date formatting
    const expiryDateInput = document.getElementById("expiryDate")
    expiryDateInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 4) value = value.slice(0, 4)

        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2)
        }

        e.target.value = value
    })

    // Setup CVV formatting
    const cvvInput = document.getElementById("cvv")
    cvvInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4)
    })

    // Setup fund amount formatting
    const fundAmountInput = document.getElementById("fundAmount")
    fundAmountInput.addEventListener("input", (e) => {
        // Only allow numbers
        e.target.value = e.target.value.replace(/[^\d.]/g, "")
    })
}

// Load user data
function loadUserData() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
    const user = individuals.find((i) => i.email === currentUser)

    if (user) {
        // Update user display
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

        // Update virtual account details
        document.getElementById("virtualAccountNumber").textContent =
            user.virtualAccountNumber || generateVirtualAccountNumber()
        document.getElementById("virtualAccountName").textContent = user.fullName || "User"
    }
}

// Load cards
function loadCards() {
    try {
        // Get cards from localStorage
        const cards = JSON.parse(localStorage.getItem("nqr_user_cards") || "[]")

        // If no cards, create sample data for demo
        if (cards.length === 0) {
            // Don't generate sample cards, show empty state
            showEmptyCardsState()
            return
        }

        // Hide empty state
        document.getElementById("emptyCardsState").classList.add("hidden")

        // Display cards
        displayCards(cards)
    } catch (error) {
        console.error("Error loading cards:", error)
        showEmptyCardsState()
    }
}

// Display cards
function displayCards(cards) {
    const cardsList = document.getElementById("cardsList")

    cardsList.innerHTML = cards
        .map(
            (card, index) => `
          <div class="card-item bg-white border rounded-lg p-4 mb-3">
              <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-${getCardBrandColor(card.brand)} bg-opacity-10 rounded-full flex items-center justify-center">
                          <i class="fab fa-${getCardBrandIcon(card.brand)} text-${getCardBrandColor(card.brand)}-500 text-lg"></i>
                      </div>
                      <div>
                          <div class="flex items-center gap-2">
                              <h4 class="font-medium">${card.brand}</h4>
                              <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Default</span>
                          </div>
                          <p class="text-sm text-gray-600">•••• •••• •••• ${card.lastFour}</p>
                          <p class="text-xs text-gray-500">Expires ${card.expiry}</p>
                      </div>
                  </div>
                  <div class="flex items-center gap-2">
                      <button onclick="showFundWalletModal('${card.id}')" class="p-2 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition-colors">
                          <i class="fas fa-wallet"></i>
                      </button>
                      <button onclick="removeCard('${card.id}')" class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                          <i class="fas fa-trash"></i>
                      </button>
                  </div>
              </div>
          </div>
      `,
        )
        .join("")
}

// Show empty cards state
function showEmptyCardsState() {
    document.getElementById("cardsList").innerHTML = ""
    document.getElementById("emptyCardsState").classList.remove("hidden")
}

// Handle add card
function handleAddCard(e) {
    e.preventDefault()

    // Get form values
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "")
    const expiryDate = document.getElementById("expiryDate").value
    const cvv = document.getElementById("cvv").value
    const cardholderName = document.getElementById("cardholderName").value.trim()
    const saveCard = document.getElementById("saveCard").checked

    // Validate inputs
    if (!cardNumber || cardNumber.length < 15) {
        showCardError("Please enter a valid card number")
        return
    }

    if (!expiryDate || !expiryDate.includes("/")) {
        showCardError("Please enter a valid expiry date (MM/YY)")
        return
    }

    if (!cvv || cvv.length < 3) {
        showCardError("Please enter a valid CVV")
        return
    }

    if (!cardholderName) {
        showCardError("Please enter the cardholder name")
        return
    }

    // Show loading state
    const addCardButton = document.getElementById("addCardButton")
    addCardButton.disabled = true
    addCardButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...'

    // Simulate API call delay
    setTimeout(() => {
        try {
            // In a real app, this would be an API call to a payment processor
            // For demo, we'll just save the card details (except CVV) to localStorage

            // Get card brand
            const brand = detectCardBrandName(cardNumber)

            // Create card object
            const newCard = {
                id: `card_${Date.now()}`,
                brand: brand,
                lastFour: cardNumber.slice(-4),
                expiry: expiryDate,
                name: cardholderName,
                isDefault: true,
                dateAdded: new Date().toISOString(),
            }

            // Get existing cards
            const cards = JSON.parse(localStorage.getItem("nqr_user_cards") || "[]")

            // If this is the first card, make it default
            if (cards.length === 0) {
                newCard.isDefault = true
            }

            // Add new card
            cards.push(newCard)

            // Save to localStorage
            localStorage.setItem("nqr_user_cards", JSON.stringify(cards))

            // Close modal
            closeAddCardModal()

            // Reload cards
            loadCards()

            // Show success message
            alert("Card added successfully!")
        } catch (error) {
            console.error("Error adding card:", error)
            showCardError("An error occurred while adding your card. Please try again.")
        } finally {
            // Reset button
            addCardButton.disabled = false
            addCardButton.innerHTML = "Add Card"
        }
    }, 2000)
}

// Handle fund wallet
function handleFundWallet(e) {
    e.preventDefault()

    // Get amount
    const amount = document.getElementById("fundAmount").value

    // Validate amount
    if (!amount || Number.parseFloat(amount) < 100) {
        showFundError("Please enter an amount of at least ₦100")
        return
    }

    // Show loading state
    const fundButton = document.getElementById("fundWalletButton")
    fundButton.disabled = true
    fundButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...'

    // Simulate API call delay
    setTimeout(() => {
        try {
            // In a real app, this would be an API call to a payment processor
            // For demo, we'll just update the wallet balance

            // Get current balance
            const currentBalance = Number.parseFloat(localStorage.getItem("nqr_wallet_balance") || "0")

            // Add amount
            const newBalance = currentBalance + Number.parseFloat(amount)

            // Save to localStorage
            localStorage.setItem("nqr_wallet_balance", newBalance.toString())

            // Add transaction to history
            const transactions = JSON.parse(localStorage.getItem("nqr_transactions") || "[]")
            transactions.unshift({
                id: Date.now().toString(),
                type: "funding",
                amount: Number.parseFloat(amount),
                description: "Wallet Top-up via Card",
                date: new Date().toISOString(),
                status: "completed",
            })
            localStorage.setItem("nqr_transactions", JSON.stringify(transactions))

            // Close modal
            closeFundWalletModal()

            // Show success message
            alert(`Your wallet has been funded with ₦${amount}`)
        } catch (error) {
            console.error("Error funding wallet:", error)
            showFundError("An error occurred while processing your payment. Please try again.")
        } finally {
            // Reset button
            fundButton.disabled = false
            fundButton.innerHTML = "Fund Wallet"
        }
    }, 2000)
}

// Remove card
function removeCard(cardId) {
    if (confirm("Are you sure you want to remove this card?")) {
        // Get cards
        let cards = JSON.parse(localStorage.getItem("nqr_user_cards") || "[]")

        // Remove card
        cards = cards.filter((card) => card.id !== cardId)

        // Save to localStorage
        localStorage.setItem("nqr_user_cards", JSON.stringify(cards))

        // Reload cards
        loadCards()
    }
}

// Show/hide add card modal
function showAddCardModal() {
    document.getElementById("addCardModal").classList.remove("hidden")
    document.body.style.overflow = "hidden"

    // Reset form
    document.getElementById("addCardForm").reset()
    document.getElementById("cardBrand").innerHTML = ""
    hideCardError()
}

function closeAddCardModal() {
    document.getElementById("addCardModal").classList.add("hidden")
    document.body.style.overflow = "auto"
}

// Show/hide fund wallet modal
function showFundWalletModal(cardId) {
    document.getElementById("fundWalletModal").classList.remove("hidden")
    document.body.style.overflow = "hidden"

    // Reset form
    document.getElementById("fundWalletForm").reset()
    hideFundError()
}

function closeFundWalletModal() {
    document.getElementById("fundWalletModal").classList.add("hidden")
    document.body.style.overflow = "auto"
}

// Set amount for quick selection
function setAmount(amount) {
    document.getElementById("fundAmount").value = amount
}

// Detect card brand
function detectCardBrand(cardNumber) {
    const brandElement = document.getElementById("cardBrand")

    if (!cardNumber) {
        brandElement.innerHTML = ""
        return
    }

    const brand = detectCardBrandName(cardNumber)

    if (brand === "Visa") {
        brandElement.innerHTML = '<i class="fab fa-cc-visa text-blue-600 text-xl"></i>'
    } else if (brand === "Mastercard") {
        brandElement.innerHTML = '<i class="fab fa-cc-mastercard text-red-600 text-xl"></i>'
    } else if (brand === "Verve") {
        brandElement.innerHTML = '<i class="fas fa-credit-card text-green-600 text-xl"></i>'
    } else {
        brandElement.innerHTML = '<i class="fas fa-credit-card text-gray-600 text-xl"></i>'
    }
}

// Detect card brand name
function detectCardBrandName(cardNumber) {
    // Visa: Starts with 4
    if (/^4/.test(cardNumber)) {
        return "Visa"
    }

    // Mastercard: Starts with 51-55 or 2221-2720
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cardNumber)) {
        return "Mastercard"
    }

    // Verve: Starts with 506099-506198, 650002-650027, or 507865-507964
    if (
        /^(506099|506[1-9][0-9][0-9]|5061[0-8][0-9]|50619[0-8]|6500[0-2][0-9]|65002[0-7]|507865|507[8-9][0-9][0-9]|5079[0-5][0-9]|50796[0-4])/.test(
            cardNumber,
        )
    ) {
        return "Verve"
    }

    return "Unknown"
}

// Get card brand icon
function getCardBrandIcon(brand) {
    switch (brand) {
        case "Visa":
            return "cc-visa"
        case "Mastercard":
            return "cc-mastercard"
        case "Verve":
            return "credit-card"
        default:
            return "credit-card"
    }
}

// Get card brand color
function getCardBrandColor(brand) {
    switch (brand) {
        case "Visa":
            return "blue"
        case "Mastercard":
            return "red"
        case "Verve":
            return "green"
        default:
            return "gray"
    }
}

// Generate virtual account number
function generateVirtualAccountNumber() {
    // In a real app, this would be generated by the bank
    // For demo, we'll generate a random 10-digit number
    const accountNumber = Math.floor(8000000000 + Math.random() * 1000000000).toString()

    // Save to user data
    const currentUser = localStorage.getItem("nqr_current_individual")
    const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
    const userIndex = individuals.findIndex((i) => i.email === currentUser)

    if (userIndex !== -1) {
        individuals[userIndex].virtualAccountNumber = accountNumber
        localStorage.setItem("nqr_individuals", JSON.stringify(individuals))
    }

    return accountNumber
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent
    navigator.clipboard
        .writeText(text)
        .then(() => {
            alert("Copied to clipboard!")
        })
        .catch((err) => {
            console.error("Failed to copy: ", err)
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

// Error handling
function showCardError(message) {
    document.getElementById("cardErrorText").textContent = message
    document.getElementById("cardError").classList.remove("hidden")
}

function hideCardError() {
    document.getElementById("cardError").classList.add("hidden")
}

function showFundError(message) {
    document.getElementById("fundErrorText").textContent = message
    document.getElementById("fundError").classList.remove("hidden")
}

function hideFundError() {
    document.getElementById("fundError").classList.add("hidden")
}
  