// Converter Page Functionality
class SignLanguageConverter {
  constructor() {
    this.webcam = null
    this.isRecognitionActive = false
    this.detectedText = ""
    this.gestureCount = 0
    this.confidenceSum = 0
    this.fps = 0
    this.lastFrameTime = 0
    this.settings = {
      confidenceThreshold: 0.7,
      language: "asl",
      ttsEnabled: true,
      autoSpeak: false,
    }

    this.currentMode = "local" // "local" or "backend"

    this.initializeConverter()
  }

  initializeConverter() {
    this.bindEvents()
    this.loadSettings()
    this.setupMockRecognition() // Keep mock recognition for local mode
    this.setInitialMode()
  }

  bindEvents() {
    // Camera controls (for local mode)
    document.getElementById("startBtn").addEventListener("click", () => this.startCamera())
    document.getElementById("stopBtn").addEventListener("click", () => this.stopCamera())
    document.getElementById("recognitionBtn").addEventListener("click", () => this.toggleRecognition())

    // Output controls
    document.getElementById("speakBtn").addEventListener("click", () => this.speakText())
    document.getElementById("clearBtn").addEventListener("click", () => this.clearText())
    document.getElementById("downloadBtn").addEventListener("click", () => this.downloadTranscript())
    document.getElementById("shareBtn").addEventListener("click", () => this.shareResults())

    // Settings
    document.getElementById("saveSettings").addEventListener("click", () => this.saveSettings())

    // New mode toggle button
    document.getElementById("toggleLiveDetectionMode").addEventListener("click", () => this.toggleDetectionMode())

    // Streamlit iframe loading
    document.getElementById("streamlitApp").addEventListener("load", () => {
      document.getElementById("streamlitLoading").classList.add("d-none")
    })
  }

  setInitialMode() {
    const localContainer = document.getElementById("localDetectionContainer")
    const backendContainer = document.getElementById("backendDetectionContainer")
    const toggleButton = document.getElementById("toggleLiveDetectionMode")

    if (this.currentMode === "local") {
      localContainer.classList.remove("d-none")
      backendContainer.classList.add("d-none")
      toggleButton.innerHTML = '<i class="fas fa-exchange-alt me-2"></i>Switch to Backend Mode'
      toggleButton.classList.remove("btn-outline-primary")
      toggleButton.classList.add("btn-primary")
    } else {
      localContainer.classList.add("d-none")
      backendContainer.classList.remove("d-none")
      toggleButton.innerHTML = '<i class="fas fa-exchange-alt me-2"></i>Switch to Local Mode'
      toggleButton.classList.remove("btn-primary")
      toggleButton.classList.add("btn-outline-primary")
      // Show loading spinner for iframe initially
      document.getElementById("streamlitLoading").classList.remove("d-none")
    }
  }

  toggleDetectionMode() {
    this.currentMode = this.currentMode === "local" ? "backend" : "local"
    this.setInitialMode()

    if (this.currentMode === "backend") {
      // Stop local camera if active when switching to backend mode
      this.stopCamera()
      window.showNotification("Switched to Backend (Streamlit) Mode. Ensure your Streamlit app is running.", "info")
    } else {
      window.showNotification("Switched to Local (Browser) Mode. Start camera to begin mock recognition.", "info")
    }
  }

  // Existing camera and recognition functions (for local mode)
  async startCamera() {
    if (this.currentMode !== "local") return // Only run in local mode
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      })

      this.webcam = document.getElementById("webcam")
      this.webcam.srcObject = stream

      document.getElementById("startBtn").disabled = true
      document.getElementById("stopBtn").disabled = false
      document.getElementById("recognitionBtn").disabled = false

      this.updateDetectionStatus("Camera ready")
      window.showNotification("Camera started successfully!", "success")
    } catch (error) {
      console.error("Error accessing camera:", error)
      window.showNotification("Failed to access camera. Please check permissions.", "error")
    }
  }

  stopCamera() {
    if (this.webcam && this.webcam.srcObject) {
      const tracks = this.webcam.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      this.webcam.srcObject = null
    }

    this.isRecognitionActive = false
    document.getElementById("startBtn").disabled = false
    document.getElementById("stopBtn").disabled = true
    document.getElementById("recognitionBtn").disabled = true

    this.updateRecognitionButton()
    this.updateDetectionStatus("Camera stopped")
    window.showNotification("Camera stopped", "info")
  }

  toggleRecognition() {
    if (this.currentMode !== "local") return // Only run in local mode
    this.isRecognitionActive = !this.isRecognitionActive
    this.updateRecognitionButton()

    if (this.isRecognitionActive) {
      this.startRecognition()
      window.showNotification("Recognition started", "success")
    } else {
      this.stopRecognition()
      window.showNotification("Recognition stopped", "info")
    }
  }

  updateRecognitionButton() {
    const btn = document.getElementById("recognitionBtn")
    const icon = btn.querySelector("i")

    if (this.isRecognitionActive) {
      btn.className = "btn btn-warning btn-lg me-2"
      btn.innerHTML = '<i class="fas fa-pause me-2"></i>Stop Recognition'
    } else {
      btn.className = "btn btn-primary btn-lg me-2"
      btn.innerHTML = '<i class="fas fa-hand-paper me-2"></i>Start Recognition'
    }
  }

  startRecognition() {
    this.updateDetectionStatus("Recognizing gestures...")
    this.recognitionLoop()
  }

  stopRecognition() {
    this.updateDetectionStatus("Recognition stopped")
  }

  // Mock recognition system for demonstration
  setupMockRecognition() {
    this.mockLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    this.mockGestures = [
      { letter: "A", confidence: 0.95, instructions: ["Make a fist", "Extend thumb upward"] },
      { letter: "B", confidence: 0.88, instructions: ["Extend all fingers upward", "Keep thumb across palm"] },
      { letter: "C", confidence: 0.92, instructions: ["Curve fingers", "Form C shape"] },
      // Add more mock gestures as needed
    ]
  }

  recognitionLoop() {
    if (!this.isRecognitionActive || this.currentMode !== "local") return // Only run in local mode

    // Simulate recognition delay
    setTimeout(() => {
      this.simulateGestureDetection()
      this.updateFPS()
      this.recognitionLoop()
    }, 100)
  }

  simulateGestureDetection() {
    // Simulate random gesture detection
    if (Math.random() > 0.7) {
      // 30% chance of detection
      const randomGesture = this.mockGestures[Math.floor(Math.random() * this.mockGestures.length)]
      const confidence = Math.random() * 0.4 + 0.6 // 0.6 to 1.0

      if (confidence >= this.settings.confidenceThreshold) {
        this.processDetection(randomGesture.letter, confidence)
      }
    }
  }

  processDetection(letter, confidence) {
    // Update current detection
    document.getElementById("currentLetter").textContent = letter
    this.updateConfidenceMeter(confidence)

    // Add to text output
    this.detectedText += letter
    document.getElementById("textOutput").textContent = this.detectedText

    // Update statistics
    this.gestureCount++
    this.confidenceSum += confidence
    this.updateStatistics()

    // Auto-speak if enabled
    if (this.settings.autoSpeak && this.settings.ttsEnabled) {
      this.speakLetter(letter)
    }

    this.updateDetectionStatus(`Detected: ${letter} (${Math.round(confidence * 100)}%)`)
  }

  updateConfidenceMeter(confidence) {
    const fill = document.getElementById("confidenceFill")
    const text = document.getElementById("confidenceText")

    fill.style.width = `${confidence * 100}%`
    text.textContent = `${Math.round(confidence * 100)}%`

    // Color coding based on confidence
    if (confidence >= 0.8) {
      fill.style.background = "var(--success-color)"
    } else if (confidence >= 0.6) {
      fill.style.background = "var(--warning-color)"
    } else {
      fill.style.background = "var(--danger-color)"
    }
  }

  updateFPS() {
    const now = performance.now()
    if (this.lastFrameTime) {
      this.fps = Math.round(1000 / (now - this.lastFrameTime))
      document.getElementById("fpsCounter").textContent = `FPS: ${this.fps}`
    }
    this.lastFrameTime = now
  }

  updateStatistics() {
    document.getElementById("totalGestures").textContent = this.gestureCount
    const avgConfidence = this.gestureCount > 0 ? Math.round((this.confidenceSum / this.gestureCount) * 100) : 0
    document.getElementById("avgConfidence").textContent = `${avgConfidence}%`
  }

  updateDetectionStatus(status) {
    document.getElementById("detectionStatus").textContent = status
  }

  speakText() {
    if (!this.settings.ttsEnabled) {
      window.showNotification("Text-to-speech is disabled", "warning")
      return
    }

    if (this.detectedText) {
      this.speak(this.detectedText)
    } else {
      window.showNotification("No text to speak", "info")
    }
  }

  speakLetter(letter) {
    if (this.settings.ttsEnabled) {
      this.speak(letter)
    }
  }

  speak(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    } else {
      window.showNotification("Text-to-speech not supported", "error")
    }
  }

  clearText() {
    this.detectedText = ""
    document.getElementById("textOutput").textContent = "Start making gestures to see text appear here..."
    document.getElementById("currentLetter").textContent = "-"
    this.updateDetectionStatus("Text cleared")
    window.showNotification("Text cleared", "info")
  }

  downloadTranscript() {
    if (!this.detectedText) {
      window.showNotification("No text to download", "warning")
      return
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const content = `Sign Language Recognition Transcript
Generated: ${new Date().toLocaleString()}
Language: ${this.settings.language.toUpperCase()}
Total Gestures: ${this.gestureCount}
Average Confidence: ${Math.round((this.confidenceSum / this.gestureCount) * 100)}%

Detected Text:
${this.detectedText}`

    window.downloadFile(content, `transcript_${timestamp}.txt`)
    window.showNotification("Transcript downloaded", "success")
  }

  shareResults() {
    if (!this.detectedText) {
      window.showNotification("No text to share", "warning")
      return
    }

    if (navigator.share) {
      navigator.share({
        title: "Sign Language Recognition Results",
        text: `I converted sign language to text: "${this.detectedText}"`,
        url: window.location.href,
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(this.detectedText).then(() => {
        window.showNotification("Text copied to clipboard", "success")
      })
    }
  }

  loadSettings() {
    const saved = localStorage.getItem("converterSettings")
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) }
    }
    this.applySettings()
  }

  saveSettings() {
    this.settings.confidenceThreshold = Number.parseFloat(document.getElementById("confidenceThreshold").value)
    this.settings.language = document.getElementById("languageSelect").value
    this.settings.ttsEnabled = document.getElementById("ttsToggle").checked
    this.settings.autoSpeak = document.getElementById("autoSpeak").checked

    localStorage.setItem("converterSettings", JSON.stringify(this.settings))
    window.showNotification("Settings saved", "success")

    const modal = bootstrap.Modal.getInstance(document.getElementById("settingsModal"))
    modal.hide()
  }

  applySettings() {
    document.getElementById("confidenceThreshold").value = this.settings.confidenceThreshold
    document.getElementById("languageSelect").value = this.settings.language
    document.getElementById("ttsToggle").checked = this.settings.ttsEnabled
    document.getElementById("autoSpeak").checked = this.settings.autoSpeak
  }
}

// Initialize converter when page loads
document.addEventListener("DOMContentLoaded", () => {
  new SignLanguageConverter()
})
