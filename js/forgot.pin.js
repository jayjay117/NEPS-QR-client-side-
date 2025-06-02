// Forgot PIN JavaScript with EmailJS integration

document.addEventListener("DOMContentLoaded", () => {
    // EmailJS is already initialized in the HTML with the correct format for v4
    // No need to initialize it again here

    // Form elements
    const emailForm = document.getElementById("emailForm")
    const verificationForm = document.getElementById("verificationForm")
    const newPinForm = document.getElementById("newPinForm")
    const successMessage = document.getElementById("successMessage")

    // Buttons
    const sendCodeBtn = document.getElementById("sendCodeBtn")
    const resendCodeBtn = document.getElementById("resendCodeBtn")
    const backToEmailBtn = document.getElementById("backToEmailBtn")
    const backToVerificationBtn = document.getElementById("backToVerificationBtn")

    // Progress elements
    const resetProgress = document.getElementById("resetProgress")
    const steps = document.querySelectorAll(".step")

    // Error messages
    const resetEmailError = document.getElementById("resetEmailError")
    const verificationCodeError = document.getElementById("verificationCodeError")
    const newPinError = document.getElementById("newPinError")
    const confirmNewPinError = document.getElementById("confirmNewPinError")

    // Loading overlay
    const loadingOverlay = document.getElementById("loadingOverlay")

    // Store verification code and email
    let verificationCode = ""
    let userEmail = ""

    // Countdown elements
    const resendCountdown = document.getElementById("resendCountdown")
    const countdownTime = document.getElementById("countdownTime")
    let countdownInterval

    // Show loading overlay
    function showLoading() {
        loadingOverlay.style.display = "flex"
    }

    // Hide loading overlay
    function hideLoading() {
        loadingOverlay.style.display = "none"
    }

    // Update progress bar and steps
    function updateProgress(step) {
        resetProgress.style.width = `${step * 33.33}%`

        steps.forEach((s) => {
            const stepNum = Number.parseInt(s.getAttribute("data-step"))
            if (stepNum <= step) {
                s.classList.add("active")
            } else {
                s.classList.remove("active")
            }
        })
    }

    // Generate random verification code
    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    // Update the sendVerificationEmail function to use the v4 format:
    function sendVerificationEmail(email, code) {
        return emailjs.send(
            "service_1yxnlvw", // Your EmailJS service ID
            "template_igpap37", // Your EmailJS template ID
            {
                to_email: email,
                verification_code: code,
                to_name: email.split("@")[0], // Using part of email as name
            },
        )
    }

    // Start countdown for resend button
    function startResendCountdown() {
        let timeLeft = 60
        countdownTime.textContent = timeLeft
        resendCodeBtn.style.display = "none"
        resendCountdown.style.display = "block"

        clearInterval(countdownInterval)
        countdownInterval = setInterval(() => {
            timeLeft--
            countdownTime.textContent = timeLeft

            if (timeLeft <= 0) {
                clearInterval(countdownInterval)
                resendCodeBtn.style.display = "inline"
                resendCountdown.style.display = "none"
            }
        }, 1000)
    }

    // Check if email exists in the system
    function checkEmailExists(email) {
        // For demo purposes, we'll check localStorage
        // In a real app, this would be an API call to the backend
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals")) || []
        const businesses = JSON.parse(localStorage.getItem("nqr_businesses")) || []

        return individuals.some((user) => user.email === email) || businesses.some((user) => user.email === email)
    }

    // Update user PIN in storage
    function updateUserPin(email, newPin) {
        // For demo purposes, we'll update localStorage
        // In a real app, this would be an API call to the backend
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals")) || []
        const businesses = JSON.parse(localStorage.getItem("nqr_businesses")) || []

        // Check individuals
        const individualIndex = individuals.findIndex((user) => user.email === email)
        if (individualIndex !== -1) {
            individuals[individualIndex].transactionPin = newPin
            localStorage.setItem("nqr_individuals", JSON.stringify(individuals))
            return true
        }

        // Check businesses
        const businessIndex = businesses.findIndex((user) => user.email === email)
        if (businessIndex !== -1) {
            businesses[businessIndex].pin = newPin
            localStorage.setItem("nqr_businesses", JSON.stringify(businesses))
            return true
        }

        return false
    }

    // In the email form submission handler, add console logs for debugging:
    emailForm.addEventListener("submit", (e) => {
        e.preventDefault()

        console.log("Form submitted")

        // Reset error
        resetEmailError.textContent = ""

        // Get email
        userEmail = document.getElementById("resetEmail").value.trim()
        console.log("Email:", userEmail)

        // Validate email
        if (!userEmail) {
            resetEmailError.textContent = "Email address is required."
            return
        }

        if (!isValidEmail(userEmail)) {
            resetEmailError.textContent = "Please enter a valid email address."
            return
        }

        // Check if email exists
        if (!checkEmailExists(userEmail)) {
            resetEmailError.textContent = "Email not found in our records."
            return
        }

        // Show loading
        showLoading()

        // Generate verification code
        verificationCode = generateVerificationCode()
        console.log("Generated verification code:", verificationCode)

        // Send verification email
        console.log("Sending email...")
        sendVerificationEmail(userEmail, verificationCode)
            .then((response) => {
                console.log("Email sent successfully:", response)
                // Hide loading
                hideLoading()

                // Show verification form
                emailForm.style.display = "none"
                verificationForm.style.display = "block"

                // Update progress
                updateProgress(2)

                // Start countdown
                startResendCountdown()
            })
            .catch((error) => {
                // Hide loading
                hideLoading()

                console.error("EmailJS error:", error)
                // Show error
                resetEmailError.textContent = "Failed to send verification code. Please try again."
            })
    })

    // Resend code button
    resendCodeBtn.addEventListener("click", () => {
        // Generate new verification code
        verificationCode = generateVerificationCode()

        // Show loading
        showLoading()

        // Send verification email
        sendVerificationEmail(userEmail, verificationCode)
            .then(() => {
                // Hide loading
                hideLoading()

                // Start countdown
                startResendCountdown()

                // For demo purposes, show the verification code in console
                console.log("New verification code:", verificationCode)
            })
            .catch((error) => {
                // Hide loading
                hideLoading()

                // Show error
                verificationCodeError.textContent = "Failed to resend code. Please try again."
                console.error("EmailJS error:", error)
            })
    })

    // Verification form submission
    verificationForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Reset error
        verificationCodeError.textContent = ""

        // Get code
        const code = document.getElementById("verificationCode").value.trim()

        // Validate code
        if (!code) {
            verificationCodeError.textContent = "Verification code is required."
            return
        }

        if (code !== verificationCode) {
            verificationCodeError.textContent = "Invalid verification code. Please check and try again."
            return
        }

        // Show new PIN form
        verificationForm.style.display = "none"
        newPinForm.style.display = "block"

        // Update progress
        updateProgress(3)
    })

    // New PIN form submission
    newPinForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Reset errors
        newPinError.textContent = ""
        confirmNewPinError.textContent = ""

        // Get PINs
        const newPin = document.getElementById("newPin").value.trim()
        const confirmNewPin = document.getElementById("confirmNewPin").value.trim()

        // Validate PINs
        if (!newPin) {
            newPinError.textContent = "New PIN is required."
            return
        }

        if (!isValidPin(newPin)) {
            newPinError.textContent = "PIN must be exactly 4 digits."
            return
        }

        if (!confirmNewPin) {
            confirmNewPinError.textContent = "Please confirm your new PIN."
            return
        }

        if (newPin !== confirmNewPin) {
            confirmNewPinError.textContent = "PINs do not match."
            return
        }

        // Show loading
        showLoading()

        // Simulate API delay
        setTimeout(() => {
            // Update user PIN
            const success = updateUserPin(userEmail, newPin)

            // Hide loading
            hideLoading()

            if (success) {
                // Show success message
                newPinForm.style.display = "none"
                successMessage.style.display = "block"
            } else {
                newPinError.textContent = "Failed to update PIN. Please try again."
            }
        }, 1500)
    })

    // Back to email button
    backToEmailBtn.addEventListener("click", () => {
        verificationForm.style.display = "none"
        emailForm.style.display = "block"

        // Update progress
        updateProgress(1)

        // Clear verification code
        verificationCode = ""

        // Clear countdown
        clearInterval(countdownInterval)
        resendCodeBtn.style.display = "inline"
        resendCountdown.style.display = "none"
    })

    // Back to verification button
    backToVerificationBtn.addEventListener("click", () => {
        newPinForm.style.display = "none"
        verificationForm.style.display = "block"

        // Update progress
        updateProgress(2)
    })

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Validate PIN
    function isValidPin(pin) {
        // PIN must be exactly 4 digits
        const pinRegex = /^[0-9]{4}$/
        return pinRegex.test(pin)
    }
})
