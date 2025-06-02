// Main JavaScript for NEPS-QR PWA

// Variables
let deferredPrompt
const installPrompt = document.getElementById("installPrompt")
const installBtn = document.getElementById("installBtn")
const dismissBtn = document.getElementById("dismissBtn")

// Header scroll effect
window.addEventListener("scroll", () => {
    const header = document.querySelector("header")
    if (window.scrollY > 50) {
        header.classList.add("scrolled")
    } else {
        header.classList.remove("scrolled")
    }
})

// PWA Install Prompt
window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e
    // Show the install prompt
    setTimeout(() => {
        if (deferredPrompt) {
            installPrompt.style.display = "block"
        }
    }, 3000)
})

// Install button click handler
installBtn.addEventListener("click", () => {
    // Hide the app provided install promotion
    installPrompt.style.display = "none"
    // Show the install prompt
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt")
        } else {
            console.log("User dismissed the install prompt")
        }
        // Clear the deferredPrompt variable
        deferredPrompt = null
    })
})

// Dismiss button click handler
dismissBtn.addEventListener("click", () => {
    installPrompt.style.display = "none"
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault()

        const targetId = this.getAttribute("href")
        if (targetId === "#") return

        const targetElement = document.querySelector(targetId)
        if (targetElement) {
            // Close mobile menu if open
            if (window.innerWidth < 768) {
                document.getElementById("navLinks").style.right = "-200px"
            }

            // Scroll to target
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    })
})

// Preload images for better performance
function preloadImages() {
    const imagesToPreload = [
        "images/hero-image.png",
        "images/about-image.png",
        "images/business-image.png",
        "images/individual-image.png",
        "images/testimonial-1.jpg",
        "images/testimonial-2.jpg",
        "images/testimonial-3.jpg",
    ]

    imagesToPreload.forEach((src) => {
        const img = new Image()
        img.src = src
    })
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    preloadImages()

    // Check if user is online/offline
    function updateOnlineStatus() {
        const statusDisplay = document.createElement("div")
        statusDisplay.className = navigator.onLine ? "online-status online" : "online-status offline"
        statusDisplay.textContent = navigator.onLine ? "You are back online" : "You are currently offline"

        document.body.appendChild(statusDisplay)

        setTimeout(() => {
            statusDisplay.classList.add("fade-out")
            setTimeout(() => {
                document.body.removeChild(statusDisplay)
            }, 500)
        }, 3000)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
})
