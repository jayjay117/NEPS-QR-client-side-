// Business Login JavaScript

document.addEventListener("DOMContentLoaded", () =>{
    // Auth Method Selection
    const passwordMethodBtn = document.getElementById("passwordMethodBtn")
    const pinMethodBtn = document.getElementById("pinMethodBtn")
    const passwordLoginForm = document.getElementById("passwordLoginForm")
    const pinLoginForm = document.getElementById("pinLoginForm")

    // Toggle Password Visibility
    const togglePasswordButtons = document.querySelectorAll(".toggle-password")

    // Form Validation
    const passwordLoginFormEl = document.getElementById("passwordLoginForm")
    const pinLoginFormEl = document.getElementById("pinLoginForm")

    // Auth Method Selection
    if (passwordMethodBtn && pinMethodBtn) {
        passwordMethodBtn.addEventListener("click", () => {
            // Update active state
            passwordMethodBtn.classList.add("active")
            pinMethodBtn.classList.remove("active")

            // Show password form, hide PIN form
            passwordLoginForm.style.display = "block"
            pinLoginForm.style.display = "none"
        })

        pinMethodBtn.addEventListener("click", () => {
            // Update active state
            pinMethodBtn.classList.add("active")
            passwordMethodBtn.classList.remove("active")

            // Show PIN form, hide password form
            pinLoginForm.style.display = "block"
            passwordLoginForm.style.display = "none"
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

    // Password Login Form Submission
    if (passwordLoginFormEl) {
        passwordLoginFormEl.addEventListener("submit",async (e) => {
            e.preventDefault()

            const email = document.getElementById("loginEmail").value
            const password = document.getElementById("loginPassword").value

            // Reset error messages
            document.getElementById("loginEmailError").textContent = ""
            document.getElementById("loginPasswordError").textContent = ""

            // Validate inputs
            try {
                const url = 'https://neps-qr-client-side-backend.onrender.com/api/Login'
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                })
                const data = await response.json()
                if (response.ok) {
                    // Login successful, redirect to dashboard
                    alert("Login successful! You will be redirected to your dashboard.")
                    // Store logged in user info
                    localStorage.setItem("nqr_current_business", email)
                    localStorage.setItem("BusinessName", data.businessName)
                    localStorage.setItem("token", data.token)
                    window.location.href = "business-dashboard.html"
                } else {
                    // Show error message
                    document.getElementById("loginPasswordError").textContent = data.message || "Invalid email or password."
                }
            } catch (error) {
                
            }
        })
    }

    // PIN Login Form Submission
    if (pinLoginFormEl) {
        pinLoginFormEl.addEventListener("submit", (e) => {
            e.preventDefault()

            const email = document.getElementById("pinLoginEmail").value
            const pin = document.getElementById("loginPin").value

            // Reset error messages
            document.getElementById("pinLoginEmailError").textContent = ""
            document.getElementById("loginPinError").textContent = ""

            try {
                const url = 'https://neps-qr-client-side-backend.onrender.com/api/PINlogin'
                const response = fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, pin })
                }).then(async (response) => {
                    const data = await response.json()
                    if (response.ok) {
                        // Login successful, redirect to dashboard
                        alert("Login successful! You will be redirected to your dashboard.")
                        // Store logged in user info
                        localStorage.setItem("nqr_current_business", email)
                        localStorage.setItem("BusinessName", data.businessName)
                        localStorage.setItem("token", data.token)
                        window.location.href = "business-dashboard.html"
                    } else {
                        // Show error message
                        document.getElementById("loginPinError").textContent = data.message || "Invalid email or PIN."
                    }
                })
            } catch (error) {
                
            }
        })
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
  