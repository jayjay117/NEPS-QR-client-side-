// Login JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Initialize login functionality
    initializeLogin()
})

// Initialize login functionality
function initializeLogin() {
    // Setup form event listeners
    document.getElementById("passwordLoginForm").addEventListener("submit", handlePasswordLogin)
    document.getElementById("pinLoginForm").addEventListener("submit", handlePinLogin)

    // Setup PIN input formatting
    const pinInput = document.getElementById("pin")
    pinInput.addEventListener("input", (e) => {
        // Only allow digits
        e.target.value = e.target.value.replace(/\D/g, "")
    })

    // Check if user is already logged in
    // const currentUser = localStorage.getItem("nqr_current_individual")
    // if (currentUser) {
    //     // Check if session is still valid
    //     const sessionExpiry = localStorage.getItem("nqr_session_expiry")
    //     if (!sessionExpiry || Date.now() < Number.parseInt(sessionExpiry)) {
    //         // Redirect to dashboard
    //         window.location.href = "individual-dashboard.html"
    //         return
    //     }
    // }
}

// Switch login method
function switchLoginMethod(method) {
    const passwordTab = document.getElementById("passwordTab")
    const pinTab = document.getElementById("pinTab")
    const passwordForm = document.getElementById("passwordLoginForm")
    const pinForm = document.getElementById("pinLoginForm")

    // Clear any error messages
    hidePasswordError()
    hidePinError()

    if (method === "password") {
        // Update tabs
        passwordTab.className = "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors bg-white shadow-sm"
        pinTab.className = "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors text-gray-500"

        // Show/hide forms
        passwordForm.classList.remove("hidden")
        pinForm.classList.add("hidden")
    } else {
        // Update tabs
        passwordTab.className = "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors text-gray-500"
        pinTab.className = "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors bg-white shadow-sm"

        // Show/hide forms
        passwordForm.classList.add("hidden")
        pinForm.classList.remove("hidden")
    }
}

// Handle password login
async function handlePasswordLogin(e) {
    e.preventDefault()

    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value
    const loginBtn = document.getElementById("passwordLoginBtn")

    // Clear previous errors
    hidePasswordError()

    // Validate inputs
    if (!email || !password) {
        showPasswordError("Please fill in all fields")
        return
    }

    if (!isValidEmail(email)) {
        showPasswordError("Please enter a valid email address")
        return
    }

    // Show loading state
    // loginBtn.disabled = true
    // loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...'

            try {
                const url = 'https://neps-qr-client-side-backend.onrender.com/api/UserLogin'
                const response = fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }).then(async (response) => {
                    const data = await response.json()
                    if (response.ok) {
                        // Login successful, redirect to dashboard
                        alert("Login successful! You will be redirected to your dashboard.")
                        // Store logged in user info
                        localStorage.setItem("fullname",data.fullname)
                        localStorage.setItem("token",data.token)
                        localStorage.setItem("email",data.email)
                        window.location.href = '/individual-dashboard.html'
                    } else {
                        // Show error message
                        // document.getElementById("loginPinError").textContent = data.message || "Invalid email or PIN."
                        alert(`${data.message}`)
                    }
                })
            } catch (error) {
                alert(`${data.message}`)
            }
    //     finally {
    //     // Reset button
    //     loginBtn.disabled = false
    //     loginBtn.innerHTML = "Sign In"
    // }
}

// Handle PIN login
async function handlePinLogin(e) {
    e.preventDefault()
    // alert(`you clicked`)

    const email = document.getElementById("pinEmail").value.trim()
    const pin = document.getElementById("pin").value
    const loginBtn = document.getElementById("pinLoginBtn")

    // Clear previous errors
    hidePinError()

    // Validate inputs
    if (!email || !pin) {
        showPinError("Please fill in all fields")
        return
    }

    if (!isValidEmail(email)) {
        showPinError("Please enter a valid email address")
        return
    }

    if (pin.length !== 4) {
        showPinError("PIN must be exactly 4 digits")
        return
    }

    // Show loading state
    // loginBtn.disabled = true
    // loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...'


    try {
        const url = 'https://neps-qr-client-side-backend.onrender.com/api/UserPinLogin'
        const response = await fetch(url,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({email,pin})
        })
        const data = await response.json()
        if(!response.ok){
            alert(`${data.message}`)
        }
        localStorage.setItem('token',data.token)
        localStorage.setItem('fullname',data.fullname)
        localStorage.setItem('email',data.email)
        alert(`login successful!`)
        window.location.href = '/individual-dashboard.html'
    } catch (error) {
        
    }
    // finally {
    //     // Reset button
    //     loginBtn.disabled = false
    //     loginBtn.innerHTML = "Sign In with PIN"
    // }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId)
    const icon = document.getElementById("passwordToggleIcon")

    if (input.type === "password") {
        input.type = "text"
        icon.className = "fas fa-eye"
    } else {
        input.type = "password"
        icon.className = "fas fa-eye-slash"
    }
}

// Error display functions
function showPasswordError(message) {
    document.getElementById("passwordErrorText").textContent = message
    document.getElementById("passwordError").classList.remove("hidden")
}

function hidePasswordError() {
    document.getElementById("passwordError").classList.add("hidden")
}

function showPinError(message) {
    document.getElementById("pinErrorText").textContent = message
    document.getElementById("pinError").classList.remove("hidden")
}

function hidePinError() {
    document.getElementById("pinError").classList.add("hidden")
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}
  