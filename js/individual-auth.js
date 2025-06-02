// Individual Authentication JavaScript

document.addEventListener("DOMContentLoaded", () => {
    // Form Progress Handling
    const formProgress = document.getElementById("formProgress")
    const nextButtons = document.querySelectorAll(".next-btn")
    const prevButtons = document.querySelectorAll(".prev-btn")
    const steps = document.querySelectorAll(".step")

    // Toggle Password Visibility
    const togglePasswordButtons = document.querySelectorAll(".toggle-password")

    // Form Validation
    const individualSignupForm = document.getElementById("individualSignupForm")
    const passwordLoginForm = document.getElementById("passwordLoginForm")
    const pinLoginForm = document.getElementById("pinLoginForm")
    const passwordMethodBtn = document.getElementById("passwordMethodBtn")
    const pinMethodBtn = document.getElementById("pinMethodBtn")

    // Password Strength Meter
    const passwordInput = document.getElementById("password")
    const passwordStrength = document.getElementById("passwordStrength")
    const strengthText = document.getElementById("strengthText")

    // Geolocation
    const detectLocationBtn = document.getElementById("detectLocationBtn")
    const locationStatus = document.getElementById("locationStatus")
    const addressInput = document.getElementById("address")
    const cityInput = document.getElementById("city")
    const stateSelect = document.getElementById("state")

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

    // Geolocation
    if (detectLocationBtn && locationStatus) {
        detectLocationBtn.addEventListener("click", () => {
            locationStatus.textContent = "Detecting your location..."
            locationStatus.style.color = "#666"

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Get location coordinates
                        const latitude = position.coords.latitude
                        const longitude = position.coords.longitude

                        // Use reverse geocoding to get address details
                        fetchAddressFromCoordinates(latitude, longitude)
                    },
                    (error) => {
                        console.error("Geolocation error:", error)
                        locationStatus.textContent = "Could not detect your location. Please enter manually."
                        locationStatus.style.color = "#e53935"
                    },
                )
            } else {
                locationStatus.textContent = "Geolocation is not supported by your browser. Please enter manually."
                locationStatus.style.color = "#e53935"
            }
        })
    }

    // Toggle between Password and PIN login
    if (passwordMethodBtn && pinMethodBtn) {
        passwordMethodBtn.addEventListener("click", () => {
            // Update active state
            passwordMethodBtn.classList.add("active")
            pinMethodBtn.classList.remove("active")

            // Show password form, hide PIN form
            document.getElementById("passwordLoginForm").style.display = "block"
            document.getElementById("pinLoginForm").style.display = "none"
        })

        pinMethodBtn.addEventListener("click", () => {
            // Update active state
            pinMethodBtn.classList.add("active")
            passwordMethodBtn.classList.remove("active")

            // Show PIN form, hide password form
            document.getElementById("pinLoginForm").style.display = "block"
            document.getElementById("passwordLoginForm").style.display = "none"
        })
    }

    // Individual Signup Form Submission
    if (individualSignupForm) {
        individualSignupForm.addEventListener("submit", (e) => {
            e.preventDefault()

            // Validate all steps
            if (validateStep(1) && validateStep(2) && validateStep(3)) {
                // Collect all form data
                const formData = {
                    fullName: document.getElementById("fullName").value,
                    bvn: document.getElementById("bvn").value,
                    phoneNumber: document.getElementById("phoneNumber").value,
                    email: document.getElementById("email").value,
                    address: document.getElementById("address").value,
                    state: document.getElementById("state").value,
                    city: document.getElementById("city").value,
                    referralSource: document.getElementById("referralSource").value,
                    password: document.getElementById("password").value,
                    transactionPin: document.getElementById("transactionPin").value,
                    registrationDate: new Date().toISOString(),
                }

                // Save to local storage
                saveIndividualToLocalStorage(formData)

                // Show success message and redirect
                alert("Registration successful! You will be redirected to the login page.")
                window.location.href = "individual-login.html"

                /* 
                // For future backend integration
                // This code is commented out until backend is available
                fetch('api/individuals/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData)
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then(data => {
                  alert("Registration successful! You will be redirected to the login page.");
                  window.location.href = "individual-login.html";
                })
                .catch(error => {
                  console.error('Error:', error);
                  alert("There was an error during registration. Please try again.");
                });
                */
            }
        })
    }

    // Password Login Form Submission
    if (passwordLoginForm) {
        passwordLoginForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const email = document.getElementById("loginEmail").value
            const password = document.getElementById("loginPassword").value

            // Reset error messages
            document.getElementById("loginEmailError").textContent = ""
            document.getElementById("loginPasswordError").textContent = ""

            // Validate inputs
            let isValid = true

            if (!email.trim()) {
                document.getElementById("loginEmailError").textContent = "Email address is required."
                isValid = false
            } else if (!isValidEmail(email)) {
                document.getElementById("loginEmailError").textContent = "Please enter a valid email address."
                isValid = false
            }

            if (!password) {
                document.getElementById("loginPasswordError").textContent = "Password is required."
                isValid = false
            }

            if (isValid) {
                // Validate login credentials
                if (validateLogin(email, password)) {
                    // Login successful, redirect to dashboard
                    alert("Login successful! You will be redirected to your dashboard.")
                    // Store logged in user info
                    localStorage.setItem("nqr_current_individual", email)
                    window.location.href = "individual-dashboard.html"
                } else {
                    // Show error message
                    document.getElementById("loginEmailError").textContent = "Invalid email or password."
                }

                /* 
                // For future backend integration
                // This code is commented out until backend is available
                fetch('api/individuals/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password })
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Invalid credentials');
                  }
                  return response.json();
                })
                .then(data => {
                  // Store token or user info
                  localStorage.setItem("nqr_auth_token", data.token);
                  localStorage.setItem("nqr_current_individual", email);
                  
                  // Redirect to dashboard
                  window.location.href = "individual-dashboard.html";
                })
                .catch(error => {
                  document.getElementById("loginEmailError").textContent = "Invalid email or password.";
                });
                */
            }
        })
    }

    // PIN Login Form Submission
    if (pinLoginForm) {
        pinLoginForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const email = document.getElementById("pinLoginEmail").value
            const pin = document.getElementById("loginPin").value

            // Reset error messages
            document.getElementById("pinLoginEmailError").textContent = ""
            document.getElementById("loginPinError").textContent = ""

            // Validate inputs
            let isValid = true

            if (!email.trim()) {
                document.getElementById("pinLoginEmailError").textContent = "Email address is required."
                isValid = false
            } else if (!isValidEmail(email)) {
                document.getElementById("pinLoginEmailError").textContent = "Please enter a valid email address."
                isValid = false
            }

            if (!pin.trim()) {
                document.getElementById("loginPinError").textContent = "PIN is required."
                isValid = false
            } else if (!isValidPin(pin)) {
                document.getElementById("loginPinError").textContent = "PIN must be exactly 4 digits."
                isValid = false
            }

            if (isValid) {
                // Validate PIN login
                if (validatePinLogin(email, pin)) {
                    // Login successful, redirect to dashboard
                    alert("Login successful! You will be redirected to your dashboard.")
                    // Store logged in user info
                    localStorage.setItem("nqr_current_individual", email)
                    window.location.href = "individual-dashboard.html"
                } else {
                    // Show error message
                    document.getElementById("loginPinError").textContent = "Invalid email or PIN."
                }

                /* 
                // For future backend integration
                // This code is commented out until backend is available
                fetch('api/individuals/login-pin', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, pin })
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Invalid credentials');
                  }
                  return response.json();
                })
                .then(data => {
                  // Store token or user info
                  localStorage.setItem("nqr_auth_token", data.token);
                  localStorage.setItem("nqr_current_individual", email);
                  
                  // Redirect to dashboard
                  window.location.href = "individual-dashboard.html";
                })
                .catch(error => {
                  document.getElementById("loginPinError").textContent = "Invalid email or PIN.";
                });
                */
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
                const bvn = document.getElementById("bvn")
                const phoneNumber = document.getElementById("phoneNumber")
                const email = document.getElementById("email")

                // Reset error messages
                document.getElementById("fullNameError").textContent = ""
                document.getElementById("bvnError").textContent = ""
                document.getElementById("phoneNumberError").textContent = ""
                document.getElementById("emailError").textContent = ""

                // Validate full name
                if (!fullName.value.trim()) {
                    document.getElementById("fullNameError").textContent = "Full name is required."
                    isValid = false
                }

                // Validate BVN
                if (!bvn.value.trim()) {
                    document.getElementById("bvnError").textContent = "BVN is required."
                    isValid = false
                } else if (!isValidBVN(bvn.value)) {
                    document.getElementById("bvnError").textContent = "BVN must be exactly 11 digits."
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

                break

            case 2:
                // Validate address & location
                const address = document.getElementById("address")
                const state = document.getElementById("state")
                const city = document.getElementById("city")
                const referralSource = document.getElementById("referralSource")

                // Reset error messages
                document.getElementById("addressError").textContent = ""
                document.getElementById("stateError").textContent = ""
                document.getElementById("cityError").textContent = ""
                document.getElementById("referralSourceError").textContent = ""

                // Validate address
                if (!address.value.trim()) {
                    document.getElementById("addressError").textContent = "Address is required."
                    isValid = false
                }

                // Validate state
                if (!state.value) {
                    document.getElementById("stateError").textContent = "Please select a state."
                    isValid = false
                }

                // Validate city
                if (!city.value.trim()) {
                    document.getElementById("cityError").textContent = "City is required."
                    isValid = false
                }

                // Validate referral source
                if (!referralSource.value) {
                    document.getElementById("referralSourceError").textContent = "Please select how you heard about us."
                    isValid = false
                }

                break

            case 3:
                // Validate security information
                const password = document.getElementById("password")
                const confirmPassword = document.getElementById("confirmPassword")
                const transactionPin = document.getElementById("transactionPin")
                const confirmPin = document.getElementById("confirmPin")
                const termsAgreement = document.getElementById("termsAgreement")

                // Reset error messages
                document.getElementById("passwordError").textContent = ""
                document.getElementById("confirmPasswordError").textContent = ""
                document.getElementById("transactionPinError").textContent = ""
                document.getElementById("confirmPinError").textContent = ""
                document.getElementById("termsAgreementError").textContent = ""

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

                // Validate transaction PIN
                if (!transactionPin.value.trim()) {
                    document.getElementById("transactionPinError").textContent = "Transaction PIN is required."
                    isValid = false
                } else if (!isValidPin(transactionPin.value)) {
                    document.getElementById("transactionPinError").textContent = "PIN must be exactly 4 digits."
                    isValid = false
                }

                // Validate confirm PIN
                if (!confirmPin.value.trim()) {
                    document.getElementById("confirmPinError").textContent = "Please confirm your PIN."
                    isValid = false
                } else if (transactionPin.value !== confirmPin.value) {
                    document.getElementById("confirmPinError").textContent = "PINs do not match."
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
        // Get individuals from local storage
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals")) || []

        // Find individual with matching email and password
        const individual = individuals.find((i) => i.email === email && i.password === password)

        return !!individual
    }

    // Validate PIN login
    function validatePinLogin(email, pin) {
        // Get individuals from local storage
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals")) || []

        // Find individual with matching email and PIN
        const individual = individuals.find((i) => i.email === email && i.transactionPin === pin)

        return !!individual
    }

    // Save individual data to local storage
    function saveIndividualToLocalStorage(individualData) {
        // Get existing individuals
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals")) || []

        // Add new individual
        individuals.push(individualData)

        // Save back to local storage
        localStorage.setItem("nqr_individuals", JSON.stringify(individuals))
    }

    // Check if email is already taken
    function isEmailTaken(email) {
        const individuals = JSON.parse(localStorage.getItem("nqr_individuals")) || []
        return individuals.some((individual) => individual.email === email)
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

    // Validate BVN
    function isValidBVN(bvn) {
        // BVN is exactly 11 digits
        const bvnRegex = /^[0-9]{11}$/
        return bvnRegex.test(bvn)
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

    // Fetch address from coordinates using reverse geocoding
    function fetchAddressFromCoordinates(latitude, longitude) {
        // Using OpenStreetMap Nominatim API for reverse geocoding
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.address) {
                    // Extract address components
                    const road = data.address.road || ""
                    const suburb = data.address.suburb || ""
                    const city = data.address.city || data.address.town || data.address.village || ""
                    const state = data.address.state || ""
                    const country = data.address.country || ""

                    // Construct address string
                    const addressStr = `${road}${road ? ", " : ""}${suburb}${suburb ? ", " : ""}${city}`

                    // Update form fields
                    if (addressInput) addressInput.value = addressStr
                    if (cityInput) cityInput.value = city

                    // Try to select the state in the dropdown
                    if (stateSelect && state) {
                        const stateOptions = Array.from(stateSelect.options)
                        const stateOption = stateOptions.find((option) => option.text.toLowerCase() === state.toLowerCase())
                        if (stateOption) {
                            stateSelect.value = stateOption.value
                        }
                    }

                    locationStatus.textContent = "Location detected successfully!"
                    locationStatus.style.color = "#4caf50"
                } else {
                    throw new Error("Could not parse address data")
                }
            })
            .catch((error) => {
                console.error("Error fetching address:", error)
                locationStatus.textContent = "Could not retrieve address. Please enter manually."
                locationStatus.style.color = "#e53935"
            })
    }
})
  