// Global variables
let currentTheme = "dark"

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  initializeNavigation()
  initializeAnimations()
  initializeInteractions()
})

// Theme Management
function initializeTheme() {
  const themeToggle = document.getElementById("themeToggle")
  const savedTheme = localStorage.getItem("theme") || "dark"

  setTheme(savedTheme)

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }
}

function setTheme(theme) {
  currentTheme = theme
  document.body.className = theme === "light" ? "theme-light" : ""

  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    const icon = themeToggle.querySelector("i")
    icon.className = theme === "light" ? "fas fa-sun" : "fas fa-moon"
  }

  localStorage.setItem("theme", theme)
}

function toggleTheme() {
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  setTheme(newTheme)
}

// Navigation
function initializeNavigation() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Active navigation highlighting
  const navLinks = document.querySelectorAll(".nav-link")
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    }
  })
}

// Animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .step-card, .glass-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Parallax effect for hero background
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroBackground = document.querySelector(".hero-bg")
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })
}

// Interactive Elements
function initializeInteractions() {
  // Button hover effects
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Card hover effects
  document.querySelectorAll(".glass-card, .feature-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Loading states for buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (!this.classList.contains("loading")) {
        this.classList.add("loading")
        setTimeout(() => {
          this.classList.remove("loading")
        }, 1000)
      }
    })
  })
}

// Utility Functions
window.showNotification = (message, type = "info") => {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} position-fixed`
  notification.style.cssText = `
      top: 100px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      animation: slideIn 0.3s ease;
  `
  notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check" : type === "error" ? "times" : "info"}-circle me-2"></i>
      ${message}
      <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 5000)
}

window.formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

window.downloadFile = (content, filename, contentType = "text/plain") => {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
      from {
          transform: translateX(100%);
          opacity: 0;
      }
      to {
          transform: translateX(0);
          opacity: 1;
      }
  }
  
  @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
  }
  
  @keyframes slideUp {
      from {
          transform: translateY(30px);
          opacity: 0;
      }
      to {
          transform: translateY(0);
          opacity: 1;
      }
  }
`
document.head.appendChild(style)
