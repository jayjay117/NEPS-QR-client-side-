// Signup JavaScript
let currentStep = 1
let formData = {}
let verificationCode = ""
let countdownTimer = null

document.addEventListener("DOMContentLoaded", () => {
    // Initialize signup functionality
    initializeSignup()
})

// Initialize signup functionality
function initializeSignup() {
    // Setup form event listeners
    document.getElementById("personalInfoForm").addEventListener("submit", handlePersonalInfoStep)
    document.getElementById("securityForm").addEventListener("submit", handleSecurityStep)
    document.getElementById("pinForm").addEventListener("submit", handlePinStep)
    document.getElementById("verificationForm").addEventListener("submit", handleVerificationStep)

    // Setup real-time validation
    setupRealTimeValidation()

    // Check if user is already logged in
    const currentUser = localStorage.getItem("nqr_current_individual")
    if (currentUser) {
        window.location.href = "individual-dashboard.html"
        return
    }
}

// Setup real-time validation
function setupRealTimeValidation() {
    // Email validation
    document.getElementById("email").addEventListener("blur", validateEmail)
    document.getElementById("email").addEventListener("input", clearFieldError)

    // Phone validation
    document.getElementById("phoneNumber").addEventListener("input", formatPhoneNumber)
    document.getElementById("phoneNumber").addEventListener("blur", validatePhoneNumber)

    // Password strength checking
    document.getElementById("password").addEventListener("input", checkPasswordStrength)
    document.getElementById("confirmPassword").addEventListener("input", validatePasswordMatch)

    // PIN formatting
    const pinInputs = ["transactionPin", "confirmPin"]
    pinInputs.forEach((inputId) => {
        const input = document.getElementById(inputId)
        input.addEventListener("input", (e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/\D/g, "")
        })
    })

    // Verification code formatting
    document.getElementById("verificationCode").addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "")
    })
}

// Handle Personal Info Step
function handlePersonalInfoStep(e) {
    e.preventDefault()

    // Clear previous errors
    clearAllErrors()

    // Validate all fields
    const fullName = document.getElementById("fullName").value.trim()
    const email = document.getElementById("email").value.trim()
    const phoneNumber = document.getElementById("phoneNumber").value.trim()
    const dateOfBirth = document.getElementById("dateOfBirth").value

    let isValid = true

    // Validate full name
    if (!fullName) {
        showFieldError("fullNameError", "Full name is required")
        isValid = false
    } else if (fullName.length < 2) {
        showFieldError("fullNameError", "Full name must be at least 2 characters")
        isValid = false
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
        showFieldError("fullNameError", "Full name can only contain letters and spaces")
        isValid = false
    }

    // Validate email
    if (!email) {
        showFieldError("emailError", "Email is required")
        isValid = false
    } else if (!isValidEmail(email)) {
        showFieldError("emailError", "Please enter a valid email address")
        isValid = false
    } else if (isEmailTaken(email)) {
        showFieldError("emailError", "This email is already registered")
        isValid = false
    }

    // Validate phone number
    if (!phoneNumber) {
        showFieldError("phoneError", "Phone number is required")
        isValid = false
    } else if (!isValidPhoneNumber(phoneNumber)) {
        showFieldError("phoneError", "Please enter a valid phone number")
        isValid = false
    }

    // Validate date of birth
    if (!dateOfBirth) {
        showFieldError("dobError", "Date of birth is required")
        isValid = false
    } else if (!isValidAge(dateOfBirth)) {
        showFieldError("dobError", "You must be at least 18 years old")
        isValid = false
    }

    if (isValid) {
        // Store form data
        formData.fullName = fullName
        formData.email = email
        formData.phoneNumber = phoneNumber
        formData.dateOfBirth = dateOfBirth

        // Go to next step
        goToNextStep()
    } else {
        // Shake the form to indicate errors
        document.getElementById("personalInfoForm").classList.add("shake")
        setTimeout(() => {
            document.getElementById("personalInfoForm").classList.remove("shake")
        }, 500)
    }
}

// Handle Security Step
function handleSecurityStep(e) {
    e.preventDefault()

    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    let isValid = true

    // Validate password strength
    const strength = getPasswordStrength(password)
    if (strength.score < 3) {
        showFieldError("confirmPasswordError", "Password is too weak. Please choose a stronger password.")
        isValid = false
    }

    // Validate password match
    if (password !== confirmPassword) {
        showFieldError("confirmPasswordError", "Passwords do not match")
        isValid = false
    }

    if (isValid) {
        // Store password
        formData.password = password

        // Go to next step
        goToNextStep()
    }
}

// Handle PIN Step
function handlePinStep(e) {
    e.preventDefault()

    const pin = document.getElementById("transactionPin").value
    const confirmPin = document.getElementById("confirmPin").value

    let isValid = true

    // Validate PIN
    if (!pin || pin.length !== 4) {
        showFieldError("pinError", "PIN must be exactly 4 digits")
        isValid = false
    } else if (!/^\d{4}$/.test(pin)) {
        showFieldError("pinError", "PIN can only contain numbers")
        isValid = false
    }

    // Validate PIN match
    if (pin !== confirmPin) {
        showFieldError("confirmPinError", "PINs do not match")
        isValid = false
    }

    // Check for weak PINs
    if (isWeakPin(pin)) {
        showFieldError("pinError", "PIN is too weak. Avoid sequences like 1234 or repeated digits like 1111")
        isValid = false
    }

    if (isValid) {
        // Store PIN
        formData.transactionPin = pin

        // Go to verification step
        goToNextStep()
        startVerificationProcess()
    }
}

// Handle Verification Step
function handleVerificationStep(e) {
    e.preventDefault()

    const enteredCode = document.getElementById("verificationCode").value

    if (!enteredCode || enteredCode.length !== 6) {
        showFieldError("verificationError", "Please enter the 6-digit verification code")
        return
    }

    if (enteredCode !== verificationCode) {
        showFieldError("verificationError", "Invalid verification code. Please try again.")
        return
    }

    // Verification successful
    completeSignup()
}

// Start verification process
function startVerificationProcess() {
    // Generate verification code
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Display email
    document.getElementById("verificationEmail").textContent = formData.email

    // In a real app, send email here
    console.log("Verification code:", verificationCode) // For demo purposes

    // Start countdown
    startCountdown(300) // 5 minutes

    // Show success message (simulate email sent)
    setTimeout(() => {
        alert(`Verification code sent to ${formData.email}\n\nFor demo purposes, the code is: ${verificationCode}`)
    }, 1000)
}

// Start countdown timer
function startCountdown(seconds) {
    let timeLeft = seconds

    countdownTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60)
        const secs = timeLeft % 60
        document.getElementById("countdown").textContent = `${minutes}:${secs.toString().padStart(2, "0")}`

        if (timeLeft <= 0) {
            clearInterval(countdownTimer)
            document.getElementById("countdown").textContent = "Expired"
            // Disable verification form
            document.getElementById("verificationCode").disabled = true
            document.getElementById("verifyBtn").disabled = true
        }

        timeLeft--
    }, 1000)
}

// Resend verification code
function resendVerificationCode() {
    // Clear existing timer
    if (countdownTimer) {
        clearInterval(countdownTimer)
    }

    // Generate new code
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Re-enable form
    document.getElementById("verificationCode").disabled = false
    document.getElementById("verifyBtn").disabled = false
    document.getElementById("verificationCode").value = ""

    // Clear errors
    hideFieldError("verificationError")

    // Restart countdown
    startCountdown(300)

    // Show new code (for demo)
    alert(`New verification code: ${verificationCode}`)
}

// Complete signup process
function completeSignup() {
    try {
        // Get existing individuals
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")

        // Create new individual record
        const newIndividual = {
            id: Date.now().toString(),
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            password: formData.password,
            transactionPin: formData.transactionPin,
            isVerified: true,
            createdAt: new Date().toISOString(),
            lastLogin: null,
        }

        // Add to individuals array
        individuals.push(newIndividual)

        // Save to localStorage
        localStorage.setItem("nqr_individuals", JSON.stringify(individuals))

        // Auto-login the user
        localStorage.setItem("nqr_current_individual", formData.email)
        localStorage.setItem("nqr_auth_token", "demo_token_" + Date.now())

        // Set session expiry (30 minutes)
        const expiryTime = Date.now() + 30 * 60 * 1000
        localStorage.setItem("nqr_session_expiry", expiryTime.toString())

        // Initialize wallet balance
        localStorage.setItem("nqr_wallet_balance", "0")

        // Show success step
        showStep("successStep")
        updateStepIndicator(5)

        // Clear form data
        formData = {}
    } catch (error) {
        console.error("Signup error:", error)
        showFieldError("verificationError", "An error occurred during signup. Please try again.")
    }
}

// Navigation functions
function goToNextStep() {
    currentStep++
    const stepNames = ["personalInfoStep", "securityStep", "pinStep", "verificationStep"]
    showStep(stepNames[currentStep - 1])
    updateStepIndicator(currentStep)
}

function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--
        const stepNames = ["personalInfoStep", "securityStep", "pinStep", "verificationStep"]
        showStep(stepNames[currentStep - 1])
        updateStepIndicator(currentStep)

        // Clear countdown if going back from verification
        if (countdownTimer) {
            clearInterval(countdownTimer)
            countdownTimer = null
        }
    }
}

function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll(".form-step").forEach((step) => {
        step.classList.remove("active")
    })

    // Show current step
    document.getElementById(stepId).classList.add("active")
}

function updateStepIndicator(step) {
    // Reset all steps
    for (let i = 1; i <= 4; i++) {
        const stepElement = document.getElementById(`step${i}`)
        const lineElement = document.getElementById(`line${i}`)

        if (i < step) {
            stepElement.className = "step completed"
            if (lineElement) lineElement.className = "step-line completed"
        } else if (i === step) {
            stepElement.className = "step active"
            if (lineElement) lineElement.className = "step-line active"
        } else {
            stepElement.className = "step inactive"
            if (lineElement) lineElement.className = "step-line"
        }
    }
}

// Validation functions
function validateEmail() {
    const email = document.getElementById("email").value.trim()
    if (email && !isValidEmail(email)) {
        showFieldError("emailError", "Please enter a valid email address")
    } else if (email && isEmailTaken(email)) {
        showFieldError("emailError", "This email is already registered")
    } else {
        hideFieldError("emailError")
    }
}

function validatePhoneNumber() {
    const phone = document.getElementById("phoneNumber").value.trim()
    if (phone && !isValidPhoneNumber(phone)) {
        showFieldError("phoneError", "Please enter a valid phone number")
    } else {
        hideFieldError("phoneError")
    }
}

function validatePasswordMatch() {
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (confirmPassword && password !== confirmPassword) {
        showFieldError("confirmPasswordError", "Passwords do not match")
    } else {
        hideFieldError("confirmPasswordError")
    }
}

// Password strength checker
function checkPasswordStrength() {
    const password = document.getElementById("password").value
    const strength = getPasswordStrength(password)

    // Update strength bar
    const strengthBar = document.getElementById("strengthBar")
    const strengthText = document.getElementById("strengthText")

    strengthBar.className = `password-strength strength-${strength.level}`
    strengthText.textContent = strength.text

    // Update requirements
    updatePasswordRequirements(password)
}

function getPasswordStrength(password) {
    let score = 0
    let level = "weak"
    let text = "Weak"

    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    if (score >= 4) {
        level = "strong"
        text = "Strong"
    } else if (score >= 3) {
        level = "good"
        text = "Good"
    } else if (score >= 2) {
        level = "fair"
        text = "Fair"
    }

    return { score, level, text }
}

function updatePasswordRequirements(password) {
    const requirements = [
        { id: "req-length", test: password.length >= 8 },
        { id: "req-uppercase", test: /[A-Z]/.test(password) },
        { id: "req-lowercase", test: /[a-z]/.test(password) },
        { id: "req-number", test: /\d/.test(password) },
        { id: "req-special", test: /[^a-zA-Z\d]/.test(password) },
    ]

    requirements.forEach((req) => {
        const element = document.getElementById(req.id)
        const icon = element.querySelector("i")

        if (req.test) {
            icon.className = "fas fa-check text-green-500"
            element.classList.remove("text-gray-500")
            element.classList.add("text-green-600")
        } else {
            icon.className = "fas fa-times text-red-500"
            element.classList.remove("text-green-600")
            element.classList.add("text-gray-500")
        }
    })
}

// Utility functions
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)
    e.target.value = value
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function isValidPhoneNumber(phone) {
    // Nigerian phone number validation
    const phoneRegex = /^(\+234|234|0)?[789]\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
}

function isValidAge(dateOfBirth) {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18
    }
    return age >= 18
}

function isEmailTaken(email) {
    const individuals = JSON.parse(localStorage.getItem("nqr_individuals") || "[]")
    return individuals.some((individual) => individual.email === email)
}

function isWeakPin(pin) {
    // Check for sequences
    const sequences = [
        "0123",
        "1234",
        "2345",
        "3456",
        "4567",
        "5678",
        "6789",
        "9876",
        "8765",
        "7654",
        "6543",
        "5432",
        "4321",
        "3210",
    ]

    // Check for repeated digits
    const repeated = /^(\d)\1{3}$/.test(pin)

    return sequences.includes(pin) || repeated
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId)
    const iconId = inputId === "password" ? "passwordToggleIcon" : "confirmPasswordToggleIcon"
    const icon = document.getElementById(iconId)

    if (input.type === "password") {
        input.type = "text"
        icon.className = "fas fa-eye"
    } else {
        input.type = "password"
        icon.className = "fas fa-eye-slash"
    }
}

// Error handling functions
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId)
    errorElement.textContent = message
    errorElement.classList.remove("hidden")

    // Add error styling to input
    const inputId = errorId.replace("Error", "")
    const input = document.getElementById(inputId)
    if (input) {
        input.classList.add("border-red-500")
        input.classList.remove("border-gray-300")
    }
}

function hideFieldError(errorId) {
    const errorElement = document.getElementById(errorId)
    errorElement.classList.add("hidden")

    // Remove error styling from input
    const inputId = errorId.replace("Error", "")
    const input = document.getElementById(inputId)
    if (input) {
        input.classList.remove("border-red-500")
        input.classList.add("border-gray-300")
    }
}

function clearFieldError(e) {
    const inputId = e.target.id
    const errorId = inputId + "Error"
    hideFieldError(errorId)
}

function clearAllErrors() {
    const errorIds = [
        "fullNameError",
        "emailError",
        "phoneError",
        "dobError",
        "confirmPasswordError",
        "pinError",
        "confirmPinError",
        "verificationError",
    ]

    errorIds.forEach((errorId) => {
        hideFieldError(errorId)
    })
}
