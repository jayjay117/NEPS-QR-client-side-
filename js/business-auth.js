// Business Authentication JavaScript

document.addEventListener("DOMContentLoaded", () => {
    // Form Progress Handling
    const formProgress = document.getElementById("formProgress")
    const nextButtons = document.querySelectorAll(".next-btn")
    const prevButtons = document.querySelectorAll(".prev-btn")
    const steps = document.querySelectorAll(".step")

    // Toggle Password Visibility
    const togglePasswordButtons = document.querySelectorAll(".toggle-password")

    // Form Validation
    const businessSignupForm = document.getElementById("businessSignupForm")
    const businessLoginForm = document.getElementById("businessLoginForm")
    const pinLoginForm = document.getElementById("pinLoginForm")
    const loginWithPinBtn = document.getElementById("loginWithPinBtn")
    const backToPasswordLogin = document.getElementById("backToPasswordLogin")

    // Password Strength Meter
    const passwordInput = document.getElementById("password")
    const passwordStrength = document.getElementById("passwordStrength")
    const strengthText = document.getElementById("strengthText")

    // Multi-step Form Navigation
    if (nextButtons) {
        nextButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const currentStep = Number.parseInt(this.getAttribute("data-next")) - 1
                const nextStep = Number.parseInt(this.getAttribute("data-next"))

                // Validate current step before proceeding
                if (validateStep(currentStep)) {
                    document.getElementById(`step${currentStep}`).style.display = "none"
                    document.getElementById(`step${nextStep}`).style.display = "block"

                    // Update progress bar and steps
                    formProgress.style.width = `${nextStep * 33.33}%`

                    // Update step indicators
                    steps.forEach((step) => {
                        const stepNum = Number.parseInt(step.getAttribute("data-step"))
                        if (stepNum <= nextStep) {
                            step.classList.add("active")
                        } else {
                            step.classList.remove("active")
                        }
                    })

                    // Scroll to top of form
                    document.querySelector(".auth-container").scrollIntoView({ behavior: "smooth" })
                }
            })
        })
    }

    if (prevButtons) {
        prevButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const currentStep = Number.parseInt(this.getAttribute("data-prev")) + 1
                const prevStep = Number.parseInt(this.getAttribute("data-prev"))

                document.getElementById(`step${currentStep}`).style.display = "none"
                document.getElementById(`step${prevStep}`).style.display = "block"

                // Update progress bar and steps
                formProgress.style.width = `${prevStep * 33.33}%`

                // Update step indicators
                steps.forEach((step) => {
                    const stepNum = Number.parseInt(step.getAttribute("data-step"))
                    if (stepNum <= prevStep) {
                        step.classList.add("active")
                    } else {
                        step.classList.remove("active")
                    }
                })

                // Scroll to top of form
                document.querySelector(".auth-container").scrollIntoView({ behavior: "smooth" })
            })
        })
    }

    // Toggle Password Visibility
    if (togglePasswordButtons) {
        togglePasswordButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const targetId = this.getAttribute("data-target")
                const passwordField = document.getElementById(targetId)

                if (passwordField.type === "password") {
                    passwordField.type = "text"
                    this.classList.remove("fa-eye")
                    this.classList.add("fa-eye-slash")
                } else {
                    passwordField.type = "password"
                    this.classList.remove("fa-eye-slash")
                    this.classList.add("fa-eye")
                }
            })
        })
    }

    // Password Strength Meter
    if (passwordInput && passwordStrength && strengthText) {
        passwordInput.addEventListener("input", function () {
            const password = this.value
            const strength = calculatePasswordStrength(password)

            // Update strength indicator
            passwordStrength.style.width = `${strength.score * 25}%`

            // Update color based on strength
            if (strength.score === 0) {
                passwordStrength.style.backgroundColor = "#e53935" // Red
                strengthText.textContent = "Very Weak"
                strengthText.style.color = "#e53935"
            } else if (strength.score === 1) {
                passwordStrength.style.backgroundColor = "#ff9800" // Orange
                strengthText.textContent = "Weak"
                strengthText.style.color = "#ff9800"
            } else if (strength.score === 2) {
                passwordStrength.style.backgroundColor = "#ffc107" // Yellow
                strengthText.textContent = "Fair"
                strengthText.style.color = "#ffc107"
            } else if (strength.score === 3) {
                passwordStrength.style.backgroundColor = "#4caf50" // Green
                strengthText.textContent = "Good"
                strengthText.style.color = "#4caf50"
            } else {
                passwordStrength.style.backgroundColor = "#2e7d32" // Dark Green
                strengthText.textContent = "Strong"
                strengthText.style.color = "#2e7d32"
            }
        })
    }

    // Toggle between Password and PIN login
    if (loginWithPinBtn && backToPasswordLogin) {
        loginWithPinBtn.addEventListener("click", () => {
            document.getElementById("businessLoginForm").style.display = "none"
            document.getElementById("pinLoginForm").style.display = "block"
        })

        backToPasswordLogin.addEventListener("click", (e) => {
            e.preventDefault()
            document.getElementById("businessLoginForm").style.display = "block"
            document.getElementById("pinLoginForm").style.display = "none"
        })
    }

    // Business Signup Form Submission
    if (businessSignupForm) {
        businessSignupForm.addEventListener("submit", (e) => {
            e.preventDefault()

            // Validate all steps
            if (validateStep(1) && validateStep(2) && validateStep(3)) {
                // Collect all form data
                const formData = {
                    fullName: document.getElementById("fullName").value,
                    email: document.getElementById("email").value,
                    phoneNumber: document.getElementById("phoneNumber").value,
                    businessName: document.getElementById("businessName").value,
                    businessCategory: document.getElementById("businessCategory").value,
                    businessLocation: document.getElementById("businessLocation").value,
                    tinNumber: document.getElementById("tinNumber").value || null,
                    bankName: document.getElementById("bankName").value,
                    accountNumber: document.getElementById("accountNumber").value,
                    pin: document.getElementById("pin").value,
                    password: document.getElementById("password").value,
                    registrationDate: new Date().toISOString(),
                }

                // Save to local storage
                saveBusinessToLocalStorage(formData)

                // Show success message and redirect
                alert("Registration successful! You will be redirected to the login page.")
                window.location.href = "business-login.html"
            }
        })
    }

    // Business Login Form Submission
    if (businessLoginForm) {
        businessLoginForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const email = document.getElementById("loginEmail").value
            const password = document.getElementById("loginPassword").value

            // Validate login credentials
            if (validateLogin(email, password)) {
                // Login successful, redirect to dashboard
                alert("Login successful! You will be redirected to your dashboard.")
                // Store logged in user info
                localStorage.setItem("nqr_current_business", email)
                window.location.href = "business-dashboard.html"
            } else {
                // Show error message
                document.getElementById("loginEmailError").textContent = "Invalid email or password."
            }
        })
    }

    // PIN Login Form Submission
    if (pinLoginForm) {
        pinLoginForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const email = document.getElementById("pinLoginEmail").value
            const pin = document.getElementById("loginPin").value

            // Validate PIN login
            if (validatePinLogin(email, pin)) {
                // Login successful, redirect to dashboard
                alert("Login successful! You will be redirected to your dashboard.")
                // Store logged in user info
                localStorage.setItem("nqr_current_business", email)
                window.location.href = "business-dashboard.html"
            } else {
                // Show error message
                document.getElementById("loginPinError").textContent = "Invalid email or PIN."
            }
        })
    }

    // Validate each step of the form
    function validateStep(stepNumber) {
        let isValid = true

        switch (stepNumber) {
            case 1:
                // Validate personal information
                const fullName = document.getElementById("fullName")
                const email = document.getElementById("email")
                const phoneNumber = document.getElementById("phoneNumber")

                // Reset error messages
                document.getElementById("fullNameError").textContent = ""
                document.getElementById("emailError").textContent = ""
                document.getElementById("phoneNumberError").textContent = ""

                // Validate full name
                if (!fullName.value.trim()) {
                    document.getElementById("fullNameError").textContent = "Full name is required."
                    isValid = false
                }

                // Validate email
                if (!email.value.trim()) {
                    document.getElementById("emailError").textContent = "Email address is required."
                    isValid = false
                } else if (!isValidEmail(email.value)) {
                    document.getElementById("emailError").textContent = "Please enter a valid email address."
                    isValid = false
                } else if (isEmailTaken(email.value)) {
                    document.getElementById("emailError").textContent = "This email is already registered."
                    isValid = false
                }

                // Validate phone number
                if (!phoneNumber.value.trim()) {
                    document.getElementById("phoneNumberError").textContent = "Phone number is required."
                    isValid = false
                } else if (!isValidPhoneNumber(phoneNumber.value)) {
                    document.getElementById("phoneNumberError").textContent = "Please enter a valid Nigerian phone number."
                    isValid = false
                }

                break

            case 2:
                // Validate business information
                const businessName = document.getElementById("businessName")
                const businessCategory = document.getElementById("businessCategory")
                const businessLocation = document.getElementById("businessLocation")

                // Reset error messages
                document.getElementById("businessNameError").textContent = ""
                document.getElementById("businessCategoryError").textContent = ""
                document.getElementById("businessLocationError").textContent = ""

                // Validate business name
                if (!businessName.value.trim()) {
                    document.getElementById("businessNameError").textContent = "Business name is required."
                    isValid = false
                }

                // Validate business category
                if (!businessCategory.value) {
                    document.getElementById("businessCategoryError").textContent = "Please select a business category."
                    isValid = false
                }

                // Validate business location
                if (!businessLocation.value) {
                    document.getElementById("businessLocationError").textContent = "Please select a business location."
                    isValid = false
                }

                break

            case 3:
                // Validate banking & security information
                const bankName = document.getElementById("bankName")
                const accountNumber = document.getElementById("accountNumber")
                const pin = document.getElementById("pin")
                const password = document.getElementById("password")
                const confirmPassword = document.getElementById("confirmPassword")
                const termsAgreement = document.getElementById("termsAgreement")

                // Reset error messages
                document.getElementById("bankNameError").textContent = ""
                document.getElementById("accountNumberError").textContent = ""
                document.getElementById("pinError").textContent = ""
                document.getElementById("passwordError").textContent = ""
                document.getElementById("confirmPasswordError").textContent = ""
                document.getElementById("termsAgreementError").textContent = ""

                // Validate bank name
                if (!bankName.value) {
                    document.getElementById("bankNameError").textContent = "Please select a bank."
                    isValid = false
                }

                // Validate account number
                if (!accountNumber.value.trim()) {
                    document.getElementById("accountNumberError").textContent = "Account number is required."
                    isValid = false
                } else if (!isValidAccountNumber(accountNumber.value)) {
                    document.getElementById("accountNumberError").textContent = "Please enter a valid 10-digit account number."
                    isValid = false
                }

                // Validate PIN
                if (!pin.value.trim()) {
                    document.getElementById("pinError").textContent = "PIN is required."
                    isValid = false
                } else if (!isValidPin(pin.value)) {
                    document.getElementById("pinError").textContent = "PIN must be exactly 4 digits."
                    isValid = false
                }

                // Validate password
                if (!password.value) {
                    document.getElementById("passwordError").textContent = "Password is required."
                    isValid = false
                } else if (password.value.length < 8) {
                    document.getElementById("passwordError").textContent = "Password must be at least 8 characters long."
                    isValid = false
                }

                // Validate confirm password
                if (!confirmPassword.value) {
                    document.getElementById("confirmPasswordError").textContent = "Please confirm your password."
                    isValid = false
                } else if (password.value !== confirmPassword.value) {
                    document.getElementById("confirmPasswordError").textContent = "Passwords do not match."
                    isValid = false
                }

                // Validate terms agreement
                if (!termsAgreement.checked) {
                    document.getElementById("termsAgreementError").textContent =
                        "You must agree to the Terms of Service and Privacy Policy."
                    isValid = false
                }

                break
        }

        return isValid
    }

    // Validate login credentials
    function validateLogin(email, password) {
        // Get businesses from local storage
        const businesses = JSON.parse(localStorage.getItem("nqr_businesses")) || []

        // Find business with matching email and password
        const business = businesses.find((b) => b.email === email && b.password === password)

        return !!business
    }

    // Validate PIN login
    function validatePinLogin(email, pin) {
        // Get businesses from local storage
        const businesses = JSON.parse(localStorage.getItem("nqr_businesses")) || []

        // Find business with matching email and PIN
        const business = businesses.find((b) => b.email === email && b.pin === pin)

        return !!business
    }

    // Save business data to local storage
    function saveBusinessToLocalStorage(businessData) {
        // Get existing businesses
        const businesses = JSON.parse(localStorage.getItem("nqr_businesses")) || []

        // Add new business
        businesses.push(businessData)

        // Save back to local storage
        localStorage.setItem("nqr_businesses", JSON.stringify(businesses))
    }

    // Check if email is already taken
    function isEmailTaken(email) {
        const businesses = JSON.parse(localStorage.getItem("nqr_businesses")) || []
        return businesses.some((business) => business.email === email)
    }

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Validate Nigerian phone number
    function isValidPhoneNumber(phoneNumber) {
        // Nigerian phone numbers are typically 11 digits and start with 0
        // Or they can be 13 digits with +234 prefix
        const phoneRegex = /^(0|\+234)[0-9]{10}$/
        return phoneRegex.test(phoneNumber)
    }

    // Validate account number
    function isValidAccountNumber(accountNumber) {
        // Nigerian bank account numbers are 10 digits
        const accountRegex = /^[0-9]{10}$/
        return accountRegex.test(accountNumber)
    }

    // Validate PIN
    function isValidPin(pin) {
        // PIN must be exactly 4 digits
        const pinRegex = /^[0-9]{4}$/
        return pinRegex.test(pin)
    }

    // Calculate password strength
    function calculatePasswordStrength(password) {
        let score = 0

        // Length check
        if (password.length >= 8) score++
        if (password.length >= 12) score++

        // Complexity checks
        if (/[A-Z]/.test(password)) score++ // Has uppercase
        if (/[a-z]/.test(password)) score++ // Has lowercase
        if (/[0-9]/.test(password)) score++ // Has number
        if (/[^A-Za-z0-9]/.test(password)) score++ // Has special char

        // Normalize score to 0-4 range
        score = Math.min(4, Math.floor(score / 1.5))

        return {
            score: score,
            isStrong: score >= 3,
        }
    }
})
  