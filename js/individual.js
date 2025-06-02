"use client"

import React from "react"

// Individual Page React Components

// Hero Animation Component
const HeroAnimation = () => {
    const [isAnimating, setIsAnimating] = React.useState(false)

    React.useEffect(() => {
        setIsAnimating(true)

        // Reset animation periodically
        const interval = setInterval(() => {
            setIsAnimating(false)
            setTimeout(() => setIsAnimating(true), 100)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="hero-animation-container">
            <div className={`phone-mockup ${isAnimating ? "animate" : ""}`}>
                <div className="phone-frame">
                    <div className="phone-screen">
                        <div className="app-interface">
                            <div className="app-header">
                                <div className="app-logo"></div>
                                <div className="app-title">NEPS-QR</div>
                            </div>
                            <div className="app-balance">
                                <div className="balance-label">Wallet Balance</div>
                                <div className="balance-amount">₦24,500.00</div>
                            </div>
                            <div className="app-actions">
                                <div className="action-button">
                                    <i className="fa-solid fa-qrcode"></i>
                                    <span>Scan</span>
                                </div>
                                <div className="action-button">
                                    <i className="fa-solid fa-wallet"></i>
                                    <span>Fund</span>
                                </div>
                                <div className="action-button">
                                    <i className="fa-solid fa-history"></i>
                                    <span>History</span>
                                </div>
                            </div>
                            <div className="app-transactions">
                                <div className="transaction-item">
                                    <div className="transaction-icon">
                                        <i className="fa-solid fa-shopping-bag"></i>
                                    </div>
                                    <div className="transaction-details">
                                        <div className="transaction-name">Grocery Store</div>
                                        <div className="transaction-date">Today, 2:30 PM</div>
                                    </div>
                                    <div className="transaction-amount">-₦2,500</div>
                                </div>
                                <div className="transaction-item">
                                    <div className="transaction-icon">
                                        <i className="fa-solid fa-utensils"></i>
                                    </div>
                                    <div className="transaction-details">
                                        <div className="transaction-name">Restaurant</div>
                                        <div className="transaction-date">Yesterday</div>
                                    </div>
                                    <div className="transaction-amount">-₦4,200</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="qr-code-floating">
                    <div className="qr-code-frame"></div>
                </div>
            </div>
            <style jsx>{`
        .hero-animation-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        
        .phone-mockup {
          position: relative;
          width: 280px;
          height: 560px;
        }
        
        .phone-frame {
          width: 100%;
          height: 100%;
          background-color: #222;
          border-radius: 36px;
          padding: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }
        
        .phone-screen {
          width: 100%;
          height: 100%;
          background-color: white;
          border-radius: 24px;
          overflow: hidden;
        }
        
        .app-interface {
          width: 100%;
          height: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        
        .app-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .app-logo {
          width: 32px;
          height: 32px;
          background-color: #ff6b00;
          border-radius: 8px;
          margin-right: 10px;
        }
        
        .app-title {
          font-weight: bold;
          font-size: 18px;
          color: #333;
        }
        
        .app-balance {
          background: linear-gradient(135deg, #ff6b00 0%, #ff5500 100%);
          padding: 20px;
          border-radius: 16px;
          color: white;
          margin-bottom: 20px;
        }
        
        .balance-label {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        
        .balance-amount {
          font-size: 24px;
          font-weight: bold;
        }
        
        .app-actions {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 12px;
          width: 30%;
        }
        
        .action-button i {
          font-size: 20px;
          color: #ff6b00;
          margin-bottom: 5px;
        }
        
        .action-button span {
          font-size: 12px;
          color: #333;
        }
        
        .app-transactions {
          flex: 1;
          overflow-y: auto;
        }
        
        .transaction-item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        
        .transaction-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 107, 0, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }
        
        .transaction-icon i {
          color: #ff6b00;
        }
        
        .transaction-details {
          flex: 1;
        }
        
        .transaction-name {
          font-weight: 500;
          font-size: 14px;
          color: #333;
        }
        
        .transaction-date {
          font-size: 12px;
          color: #999;
        }
        
        .transaction-amount {
          font-weight: 500;
          color: #e53935;
        }
        
        .qr-code-floating {
          position: absolute;
          top: 50%;
          right: -80px;
          width: 120px;
          height: 120px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          opacity: 0;
        }
        
        .qr-code-frame {
          width: 80%;
          height: 80%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23000' d='M0,0 L40,0 L40,40 L0,40 Z M10,10 L10,30 L30,30 L30,10 Z M15,15 L25,15 L25,25 L15,25 Z'/%3E%3Cpath fill='%23000' d='M60,0 L100,0 L100,40 L60,40 Z M70,10 L70,30 L90,30 L90,10 Z M75,15 L85,15 L85,25 L75,25 Z'/%3E%3Cpath fill='%23000' d='M0,60 L40,60 L40,100 L0,100 Z M10,70 L10,90 L30,90 L30,70 Z M15,75 L25,75 L25,85 L15,85 Z'/%3E%3Cpath fill='%23000' d='M60,60 L70,60 L70,70 L60,70 Z M80,60 L100,60 L100,70 L90,70 L90,80 L100,80 L100,100 L80,100 L80,90 L70,90 L70,100 L60,100 L60,80 L70,80 L70,90 L80,90 L80,80 L60,80 Z M80,70 L90,70 L90,80 L80,80 Z'/%3E%3Cpath fill='%23000' d='M50,0 L50,20 L40,20 L40,30 L50,30 L50,50 L40,50 L40,40 L30,40 L30,50 L20,50 L20,60 L50,60 L50,50 L60,50 L60,60 L70,60 L70,50 L60,50 L60,40 L50,40 L50,30 L60,30 L60,20 L50,20 L50,10 L60,10 L60,0 Z'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        
        .phone-mockup.animate .qr-code-floating {
          animation: floatQR 3s ease-in-out forwards;
        }
        
        @keyframes floatQR {
          0% {
            opacity: 0;
            transform: translate(50px, -50%);
          }
          20% {
            opacity: 1;
            transform: translate(0, -50%);
          }
          80% {
            opacity: 1;
            transform: translate(0, -50%);
          }
          100% {
            opacity: 0;
            transform: translate(-50px, -50%);
          }
        }
      `}</style>
        </div>
    )
}

// Features Grid Component
const FeaturesGrid = () => {
    const features = [
        {
            icon: "fa-qrcode",
            title: "Scan & Pay",
            description: "Simply scan any merchant's QR code and complete your payment in seconds.",
        },
        {
            icon: "fa-wallet",
            title: "Digital Wallet",
            description: "Store funds securely in your digital wallet for quick and easy payments.",
        },
        {
            icon: "fa-clock",
            title: "Instant Transactions",
            description: "No waiting for bank transfers to clear. Payments are processed instantly.",
        },
        {
            icon: "fa-chart-simple",
            title: "Expense Tracking",
            description: "Monitor your spending habits with detailed transaction history and reports.",
        },
        {
            icon: "fa-bell",
            title: "Instant Notifications",
            description: "Receive real-time alerts for all transactions to stay informed.",
        },
        {
            icon: "fa-wifi-slash",
            title: "Offline Mode",
            description: "Make payments even without internet connection with our offline mode.",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <div key={index} className="feature-card" data-aos="fade-up" data-aos-delay={100 + index * 100}>
                    <div>
                        <div className="feature-icon">
                            <i className={`fa-solid ${feature.icon}`}></i>
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Steps Component
const StepsContainer = () => {
    const steps = [
        {
            number: 1,
            icon: "fa-user-plus",
            title: "Create Account",
            description: "Sign up with your basic information and create a secure PIN for transactions.",
        },
        {
            number: 2,
            icon: "fa-wallet",
            title: "Fund Your Wallet",
            description: "Add money to your wallet using bank transfers, cards, or other payment methods.",
        },
        {
            number: 3,
            icon: "fa-qrcode",
            title: "Scan & Pay",
            description: "Scan any merchant's QR code, enter the amount, and confirm with your PIN.",
        },
        {
            number: 4,
            icon: "fa-receipt",
            title: "Get Receipt",
            description: "Receive digital receipts for all your transactions for easy record keeping.",
        },
        {
            number: 5,
            icon: "fa-chart-line",
            title: "Track Spending",
            description: "Monitor your transaction history and manage your finances with detailed reports.",
        },
    ]

    return (
        <div className="steps-container max-w-3xl mx-auto">
            {steps.map((step, index) => (
                <div key={index} className="step-card" data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                    <div className="step-number">{step.number}</div>
                    <div className="step-content">
                        <div className="step-icon">
                            <i className={`fa-solid ${step.icon}`}></i>
                        </div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Render React Components
document.addEventListener("DOMContentLoaded", () => {
    // Render Hero Animation
    const heroAnimationContainer = document.getElementById("heroAnimation")
    if (heroAnimationContainer) {
        ReactDOM.render(<HeroAnimation />, heroAnimationContainer)
    }

    // Render Features Grid
    const featuresGridContainer = document.getElementById("featuresGrid")
    if (featuresGridContainer) {
        ReactDOM.render(<FeaturesGrid />, featuresGridContainer)
    }

    // Render Steps
    const stepsContainer = document.getElementById("stepsContainer")
    if (stepsContainer) {
        ReactDOM.render(<StepsContainer />, stepsContainer)
    }
})

import ReactDOM from "react-dom"

// Individual Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
    // Phone mockup animation
    const phoneMockup = document.querySelector(".phone-mockup")
    if (phoneMockup) {
        // Initial animation
        phoneMockup.classList.add("animate")

        // Reset animation periodically
        setInterval(() => {
            phoneMockup.classList.remove("animate")

            // Force reflow
            void phoneMockup.offsetWidth

            phoneMockup.classList.add("animate")
        }, 6000)
    }

    // Initialize AOS animations
    let AOS
    if (typeof window !== "undefined") {
        AOS = require("aos")
    }

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
        })
    }

    // Add scroll animation for the bubbles
    const bubbles = document.querySelectorAll(".bubble")

    // Randomize bubble positions
    bubbles.forEach((bubble) => {
        const randomLeft = Math.floor(Math.random() * 100)
        const randomDelay = Math.floor(Math.random() * 10)
        const randomDuration = 5 + Math.floor(Math.random() * 10)

        bubble.style.left = `${randomLeft}%`
        bubble.style.animationDelay = `${randomDelay}s`
        bubble.style.animationDuration = `${randomDuration}s`
    })

    // Add scroll event listener for parallax effect
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY

        // Parallax effect for hero section
        const heroSection = document.querySelector(".individual-hero")
        if (heroSection) {
            const heroOffset = scrollPosition * 0.4
            heroSection.style.backgroundPosition = `center -${heroOffset}px`
        }

        // Parallax effect for benefits illustration
        const benefitsIllustration = document.querySelector(".benefits-illustration")
        if (benefitsIllustration) {
            const rect = benefitsIllustration.getBoundingClientRect()
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parallaxOffset = (window.innerHeight - rect.top) * 0.05
                benefitsIllustration.style.transform = `translateY(-${parallaxOffset}px)`
            }
        }
    })

    // Add hover effects for feature cards
    const featureCards = document.querySelectorAll(".feature-card")
    featureCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            const icon = this.querySelector(".feature-icon i")
            if (icon) {
                icon.style.transform = "scale(1.2)"
                icon.style.transition = "transform 0.3s ease"
            }
        })

        card.addEventListener("mouseleave", function () {
            const icon = this.querySelector(".feature-icon i")
            if (icon) {
                icon.style.transform = "scale(1)"
            }
        })
    })

    // Add click effect for action buttons in phone mockup
    const actionButtons = document.querySelectorAll(".action-button")
    actionButtons.forEach((button) => {
        button.addEventListener("click", function () {
            this.style.transform = "scale(0.95)"
            setTimeout(() => {
                this.style.transform = "scale(1)"
            }, 200)
        })
    })

    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href")
            if (targetId === "#") return

            const targetElement = document.querySelector(targetId)
            if (targetElement) {
                e.preventDefault()
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: "smooth",
                })
            }
        })
    })
})
