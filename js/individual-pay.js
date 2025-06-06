// Pay a Business JavaScript
let currentStep = "scan"
let qrData = null
let html5QrCode = null

document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    checkAuthentication()

    // Initialize payment flow
    initializePaymentFlow()
})

// Check authentication
function checkAuthentication() {
    const currentUser = localStorage.getItem("nqr_current_individual")
    if (!currentUser) {
        window.location.href = "individual-login.html"
        return
    }
}

// Initialize payment flow
function initializePaymentFlow() {
    // Setup PIN input formatting
    const pinInput = document.getElementById("pin")
    if (pinInput) {
        pinInput.addEventListener("input", (e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/\D/g, "")
        })
    }

    // Setup amount input formatting
    const amountInput = document.getElementById("amount")
    if (amountInput) {
        amountInput.addEventListener("input", (e) => {
            // Allow only numbers and decimal point
            e.target.value = e.target.value.replace(/[^\d.]/g, "")
        })
    }
}

// Start QR scanner
async function startScanner() {
    try {
        hideError()

        // Show camera view
        document.getElementById("scanPrompt").classList.add("hidden")
        document.getElementById("cameraView").classList.remove("hidden")

        // Initialize scanner
        html5QrCode = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            false,
        )

        html5QrCode.render(onScanSuccess, onScanFailure)
    } catch (error) {
        console.error("Error starting scanner:", error)
        showError("Camera access denied or not available")
        stopScanner()
    }
}

// Stop QR scanner
function stopScanner() {
    if (html5QrCode) {
        html5QrCode.clear()
        html5QrCode = null
    }

    // Hide camera view
    document.getElementById("cameraView").classList.add("hidden")
    document.getElementById("scanPrompt").classList.remove("hidden")
}

// Handle successful QR scan
function onScanSuccess(decodedText) {
    try {
        // Parse QR data
        const data = JSON.parse(decodedText)

        // Validate NEPS-QR format
        if (data.type !== "neps-qr") {
            showError("This is not a valid NEPS-QR code.")
            return
        }

        // Store QR data
        qrData = data

        // Stop scanner
        stopScanner()

        // Pre-fill merchant info and proceed to details
        populateMerchantInfo()
        goToDetailsStep()
    } catch (error) {
        console.error("Error parsing QR code:", error)
        showError("Invalid QR code format")
    }
}

// Handle scan failure
function onScanFailure(error) {
    // Handle scan failure silently - this fires frequently during scanning
    console.log("Scan failed:", error)
}

// Populate merchant information
function populateMerchantInfo() {
    if (!qrData) return

    const merchantInfo = document.getElementById("merchantInfo")
    merchantInfo.innerHTML = `
        <h3 class="font-medium text-lg">${qrData.business_name}</h3>
        <p class="text-sm text-gray-600">${qrData.location}</p>
        <p class="text-xs text-gray-500 mt-1">Business ID: ${qrData.business_id}</p>
    `

    // Pre-fill amount and purpose if provided in QR
    if (qrData.amount) {
        document.getElementById("amount").value = qrData.amount
        document.getElementById("amount").disabled = true
    }

    if (qrData.purpose) {
        document.getElementById("purpose").value = qrData.purpose
        document.getElementById("purpose").disabled = true
    }
}

// Navigate to scan step
function goToScanStep() {
    currentStep = "scan"
    updateStepIndicator()

    document.getElementById("scanStep").classList.remove("hidden")
    document.getElementById("detailsStep").classList.add("hidden")
    document.getElementById("pinStep").classList.add("hidden")
    document.getElementById("successStep").classList.add("hidden")
}

// Navigate to details step
function goToDetailsStep() {
    currentStep = "details"
    updateStepIndicator()

    document.getElementById("scanStep").classList.add("hidden")
    document.getElementById("detailsStep").classList.remove("hidden")
    document.getElementById("pinStep").classList.add("hidden")
    document.getElementById("successStep").classList.add("hidden")

    hideDetailsError()
}

// Navigate to PIN step
function goToPinStep() {
    // Validate details
    const amount = document.getElementById("amount").value
    const purpose = document.getElementById("purpose").value.trim()

    if (!amount || Number.parseFloat(amount) <= 0) {
        showDetailsError("Please enter a valid amount")
        return
    }

    if (!purpose) {
        showDetailsError("Purpose is required")
        return
    }

    // Populate payment summary
    populatePaymentSummary()

    currentStep = "pin"
    updateStepIndicator()

    document.getElementById("scanStep").classList.add("hidden")
    document.getElementById("detailsStep").classList.add("hidden")
    document.getElementById("pinStep").classList.remove("hidden")
    document.getElementById("successStep").classList.add("hidden")

    hidePinError()

    // Focus on PIN input
    setTimeout(() => {
        document.getElementById("pin").focus()
    }, 100)
}

// Populate payment summary
function populatePaymentSummary() {
    const amount = document.getElementById("amount").value
    const purpose = document.getElementById("purpose").value

    const summary = document.getElementById("paymentSummary")
    summary.innerHTML = `
        <div class="flex justify-between">
            <span>Merchant:</span>
            <span class="font-medium">${qrData.business_name}</span>
        </div>
        <div class="flex justify-between">
            <span>Amount:</span>
            <span class="font-medium">${formatCurrency(Number.parseFloat(amount))}</span>
        </div>
        <div class="flex justify-between">
            <span>Purpose:</span>
            <span class="font-medium">${purpose}</span>
        </div>
    `
}

// Process payment
async function processPayment() {
    const pin = document.getElementById("pin").value

    // Validate PIN
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        showPinError("PIN must be exactly 4 digits")
        return
    }

    // Show loading state
    const payButton = document.getElementById("payButton")
    payButton.disabled = true
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...'

    try {
        // Verify PIN with stored user data
        const currentUser = localStorage.getItem("nqr_current_individual")
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
        const user = individuals.find((i) => i.email === currentUser)

        if (!user || user.transactionPin !== pin) {
            throw new Error("Invalid PIN")
        }

        // Check wallet balance
        const currentBalance = Number.parseFloat(localStorage.getItem("nqr_wallet_balance") || "0")
        const paymentAmount = Number.parseFloat(document.getElementById("amount").value)

        if (currentBalance < paymentAmount) {
            throw new Error("Insufficient wallet balance")
        }

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In a real app, this would be:
        // const response = await fetch('/api/transaction/pay', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         business_id: qrData.business_id,
        //         amount: paymentAmount,
        //         purpose: document.getElementById("purpose").value,
        //         pin: pin
        //     })
        // })

        // Update local balance
        const newBalance = currentBalance - paymentAmount
        localStorage.setItem("nqr_wallet_balance", newBalance.toString())

        // Add transaction to history
        const transactions = JSON.parse(localStorage.getItem("nqr_transactions") || "[]")
        transactions.unshift({
            id: Date.now().toString(),
            type: "payment",
            amount: -paymentAmount,
            description: document.getElementById("purpose").value,
            merchant: qrData.business_name,
            date: new Date().toISOString(),
            status: "completed",
        })
        localStorage.setItem("nqr_transactions", JSON.stringify(transactions))

        // Show success
        showSuccess()
    } catch (error) {
        console.error("Payment error:", error)
        showPinError(error.message || "Payment failed. Please try again.")
    } finally {
        // Reset button
        payButton.disabled = false
        payButton.innerHTML = "Pay Now"
    }
}

// Show success step
function showSuccess() {
    const amount = document.getElementById("amount").value

    document.getElementById("successAmount").textContent = formatCurrency(Number.parseFloat(amount))
    document.getElementById("successMerchant").textContent = `paid to ${qrData.business_name}`

    currentStep = "success"
    updateStepIndicator()

    document.getElementById("scanStep").classList.add("hidden")
    document.getElementById("detailsStep").classList.add("hidden")
    document.getElementById("pinStep").classList.add("hidden")
    document.getElementById("successStep").classList.remove("hidden")

    // Offer to save merchant to Quick Pay
    offerSaveToQuickPay()
}

// Update step indicator
function updateStepIndicator() {
    // Reset all steps
    const steps = ["step1", "step2", "step3"]
    const lines = ["line1", "line2"]

    steps.forEach((step) => {
        document.getElementById(step).className = "step inactive"
    })

    lines.forEach((line) => {
        document.getElementById(line).className = "step-line"
    })

    // Activate current and previous steps
    switch (currentStep) {
        case "scan":
            document.getElementById("step1").className = "step active"
            break
        case "details":
            document.getElementById("step1").className = "step active"
            document.getElementById("line1").className = "step-line active"
            document.getElementById("step2").className = "step active"
            break
        case "pin":
        case "success":
            document.getElementById("step1").className = "step active"
            document.getElementById("line1").className = "step-line active"
            document.getElementById("step2").className = "step active"
            document.getElementById("line2").className = "step-line active"
            document.getElementById("step3").className = "step active"
            break
    }
}

// Error handling functions
function showError(message) {
    document.getElementById("errorText").textContent = message
    document.getElementById("errorMessage").classList.remove("hidden")
}

function hideError() {
    document.getElementById("errorMessage").classList.add("hidden")
}

function showDetailsError(message) {
    document.getElementById("detailsErrorText").textContent = message
    document.getElementById("detailsError").classList.remove("hidden")
}

function hideDetailsError() {
    document.getElementById("detailsError").classList.add("hidden")
}

function showPinError(message) {
    document.getElementById("pinErrorText").textContent = message
    document.getElementById("pinError").classList.remove("hidden")
}

function hidePinError() {
    document.getElementById("pinError").classList.add("hidden")
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount)
}

function goBack() {
    if (currentStep === "scan") {
        window.location.href = "individual-dashboard.html"
    } else if (currentStep === "details") {
        goToScanStep()
    } else if (currentStep === "pin") {
        goToDetailsStep()
    }
}

// Function to offer saving merchant to Quick Pay
function offerSaveToQuickPay() {
    if (!qrData) return

    // Check if merchant is already saved
    const savedMerchants = JSON.parse(localStorage.getItem("nqr_saved_merchants") || "[]")
    const existingMerchant = savedMerchants.find((m) => m.business_id === qrData.business_id)

    if (!existingMerchant) {
        // Show option to save merchant
        const shouldSave = confirm(`Save ${qrData.business_name} to Quick Pay for faster payments next time?`)

        if (shouldSave) {
            const newMerchant = {
                id: `merchant_${Date.now()}`,
                business_id: qrData.business_id,
                business_name: qrData.business_name,
                location: qrData.location,
                category: qrData.category || "Business",
                lastUsed: new Date().toISOString(),
                totalPayments: 1,
                totalAmount: Number.parseFloat(document.getElementById("amount").value),
                addedDate: new Date().toISOString(),
            }

            savedMerchants.push(newMerchant)
            localStorage.setItem("nqr_saved_merchants", JSON.stringify(savedMerchants))

            // Show success message
            setTimeout(() => {
                alert(`${qrData.business_name} has been added to your Quick Pay list!`)
            }, 1000)
        }
    }
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
    if (html5QrCode) {
        html5QrCode.clear()
    }
})
