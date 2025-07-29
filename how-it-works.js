// How It Works Page Functionality
class HowItWorksDemo {
  constructor() {
    this.currentStage = 1
    this.totalStages = 5
    this.isRunning = false

    this.initializeDemo()
  }

  initializeDemo() {
    this.bindEvents()
    this.setupAnimations()
  }

  bindEvents() {
    document.getElementById("runDemo").addEventListener("click", () => this.runDemo())
    document.getElementById("resetDemo").addEventListener("click", () => this.resetDemo())

    // Process step interactions
    document.querySelectorAll(".process-step").forEach((step, index) => {
      step.addEventListener("click", () => this.showStageDetails(index + 1))
    })
  }

  setupAnimations() {
    // Animate neural network
    this.animateNeuralNetwork()

    // Animate hand landmarks
    this.animateHandLandmarks()

    // Setup intersection observer for scroll animations
    this.setupScrollAnimations()
  }

  animateNeuralNetwork() {
    const neurons = document.querySelectorAll(".neuron")
    neurons.forEach((neuron, index) => {
      neuron.style.animationDelay = `${index * 0.1}s`
    })
  }

  animateHandLandmarks() {
    const landmarks = document.querySelectorAll(".landmark")
    landmarks.forEach((landmark, index) => {
      landmark.style.animationDelay = `${index * 0.2}s`
    })
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".card, .process-step").forEach((el) => {
      observer.observe(el)
    })
  }

  runDemo() {
    if (this.isRunning) return

    this.isRunning = true
    this.currentStage = 1

    const runButton = document.getElementById("runDemo")
    runButton.disabled = true
    runButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Running...'

    this.animateStages()
  }

  animateStages() {
    // Reset all stages
    document.querySelectorAll(".demo-stage").forEach((stage) => {
      stage.classList.remove("active", "processing", "completed")
    })

    // Animate through each stage
    this.animateStage(1)
  }

  animateStage(stageNumber) {
    if (stageNumber > this.totalStages) {
      this.completeDemo()
      return
    }

    const stage = document.getElementById(`stage${stageNumber}`)
    stage.classList.add("active", "processing")

    // Stage-specific animations
    this.runStageAnimation(stageNumber)

    setTimeout(() => {
      stage.classList.remove("processing")
      stage.classList.add("completed")

      setTimeout(() => {
        stage.classList.remove("active")
        this.animateStage(stageNumber + 1)
      }, 500)
    }, 1500)
  }

  runStageAnimation(stageNumber) {
    const stage = document.getElementById(`stage${stageNumber}`)
    const visual = stage.querySelector(".stage-visual")

    switch (stageNumber) {
      case 1:
        // Video input animation
        visual.style.transform = "scale(1.1)"
        visual.style.filter = "brightness(1.2)"
        break
      case 2:
        // Hand detection animation
        visual.style.transform = "rotate(10deg) scale(1.1)"
        visual.style.color = "var(--warning-color)"
        break
      case 3:
        // Feature analysis animation
        visual.style.transform = "rotate(360deg) scale(1.1)"
        visual.style.color = "var(--info-color)"
        break
      case 4:
        // Processing animation
        visual.style.animation = "spin 1s linear infinite"
        visual.style.color = "var(--success-color)"
        break
      case 5:
        // Result animation
        const letter = visual.querySelector(".result-letter")
        letter.style.transform = "scale(1.3)"
        letter.style.color = "var(--primary-color)"
        letter.style.textShadow = "0 0 20px rgba(99, 102, 241, 0.8)"
        break
    }

    // Reset animation after delay
    setTimeout(() => {
      visual.style.transform = ""
      visual.style.filter = ""
      visual.style.animation = ""
      visual.style.color = ""
      visual.style.textShadow = ""
    }, 1500)
  }

  completeDemo() {
    this.isRunning = false

    const runButton = document.getElementById("runDemo")
    runButton.disabled = false
    runButton.innerHTML = '<i class="fas fa-play me-2"></i>Run Demo'

    // Show completion message
    window.showNotification("Demo completed! The AI successfully recognized the gesture.", "success")

    // Highlight final result
    const finalStage = document.getElementById("stage5")
    finalStage.classList.add("active")

    setTimeout(() => {
      finalStage.classList.remove("active")
    }, 3000)
  }

  resetDemo() {
    this.isRunning = false
    this.currentStage = 1

    // Reset all stages
    document.querySelectorAll(".demo-stage").forEach((stage) => {
      stage.classList.remove("active", "processing", "completed")
    })

    // Activate first stage
    document.getElementById("stage1").classList.add("active")

    // Reset button
    const runButton = document.getElementById("runDemo")
    runButton.disabled = false
    runButton.innerHTML = '<i class="fas fa-play me-2"></i>Run Demo'

    window.showNotification("Demo reset to initial state", "info")
  }

  showStageDetails(stageNumber) {
    const stageInfo = {
      1: {
        title: "Video Capture",
        description:
          "The webcam captures a continuous video stream at 30 FPS. Each frame is processed in real-time to detect hand gestures.",
        technical: "Uses WebRTC API for camera access with optimized frame processing.",
      },
      2: {
        title: "Hand Detection",
        description:
          "Computer vision algorithms identify and locate hands within the video frame using MediaPipe technology.",
        technical: "Employs deep learning models trained on diverse hand datasets.",
      },
      3: {
        title: "Feature Extraction",
        description:
          "21 key hand landmarks are identified and tracked, creating a mathematical representation of the hand pose.",
        technical: "Extracts 3D coordinates and calculates relative positions and angles.",
      },
      4: {
        title: "Gesture Classification",
        description:
          "A neural network processes the extracted features to classify the gesture into one of 26 letters.",
        technical: "Uses a trained CNN model with 95%+ accuracy on test datasets.",
      },
      5: {
        title: "Text Output",
        description: "The recognized letter is displayed with confidence score and can be converted to speech.",
        technical: "Includes post-processing for noise reduction and confidence thresholding.",
      },
    }

    const info = stageInfo[stageNumber]
    if (info) {
      // Create and show modal with stage details
      this.showStageModal(info)
    }
  }

  showStageModal(info) {
    // Create modal dynamically
    const modalHTML = `
          <div class="modal fade" id="stageModal" tabindex="-1">
              <div class="modal-dialog">
                  <div class="modal-content bg-dark">
                      <div class="modal-header">
                          <h5 class="modal-title">${info.title}</h5>
                          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">
                          <p><strong>Overview:</strong></p>
                          <p>${info.description}</p>
                          <p><strong>Technical Details:</strong></p>
                          <p>${info.technical}</p>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
              </div>
          </div>
      `

    // Remove existing modal if any
    const existingModal = document.getElementById("stageModal")
    if (existingModal) {
      existingModal.remove()
    }

    // Add new modal
    document.body.insertAdjacentHTML("beforeend", modalHTML)

    // Show modal
    const bootstrap = window.bootstrap
    const modal = new bootstrap.Modal(document.getElementById("stageModal"))
    modal.show()
  }
}

// Initialize demo when page loads
document.addEventListener("DOMContentLoaded", () => {
  new HowItWorksDemo()
})

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
  .process-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 2rem;
      background: var(--card-bg);
      border-radius: 16px;
      border: 1px solid var(--border-color);
  }

  .process-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1rem;
      border-radius: 12px;
      transition: all 0.3s ease;
      cursor: pointer;
      min-width: 150px;
  }

  .process-step:hover {
      background: rgba(99, 102, 241, 0.1);
      transform: translateY(-5px);
  }

  .process-step.active {
      background: rgba(99, 102, 241, 0.2);
      border: 2px solid var(--primary-color);
  }

  .step-circle {
      width: 40px;
      height: 40px;
      background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      margin-bottom: 1rem;
  }

  .process-arrow {
      color: var(--text-secondary);
      font-size: 1.5rem;
  }

  .pipeline-demo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
      padding: 2rem 0;
  }

  .demo-stage {
      text-align: center;
      padding: 1rem;
      border-radius: 12px;
      transition: all 0.3s ease;
      opacity: 0.5;
      min-width: 120px;
  }

  .demo-stage.active {
      opacity: 1;
      background: rgba(99, 102, 241, 0.1);
      transform: scale(1.05);
  }

  .demo-stage.processing {
      animation: pulse 1s infinite;
  }

  .demo-stage.completed {
      background: rgba(16, 185, 129, 0.1);
  }

  .stage-visual {
      margin-bottom: 1rem;
      transition: all 0.3s ease;
  }

  .result-letter {
      font-size: 4rem;
      font-weight: bold;
      color: var(--primary-color);
  }

  .hand-landmarks {
      position: relative;
      display: inline-block;
  }

  .landmarks-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
  }

  .landmark {
      position: absolute;
      width: 6px;
      height: 6px;
      background: var(--accent-color);
      border-radius: 50%;
      animation: pulse 2s infinite;
  }

  .neural-network {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 1rem 0;
  }

  .network-layer {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
  }

  .neuron {
      width: 20px;
      height: 20px;
      background: var(--primary-color);
      border-radius: 50%;
      animation: neuronPulse 2s infinite;
  }

  .metric-item {
      margin-bottom: 1.5rem;
  }

  .metric-label {
      font-weight: 500;
      margin-bottom: 0.5rem;
  }

  .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
  }

  .metric-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
  }

  .metric-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      transition: width 1s ease;
  }

  .requirement-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
  }

  @keyframes neuronPulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
  }

  @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
  }

  .animate-in {
      animation: slideUp 0.6s ease forwards;
  }

  @media (max-width: 768px) {
      .process-flow {
          flex-direction: column;
      }
      
      .process-arrow {
          transform: rotate(90deg);
      }
      
      .pipeline-demo {
          flex-direction: column;
      }
  }
`
document.head.appendChild(style)
