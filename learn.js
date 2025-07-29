// Learn Page Functionality
class SignLanguageLearning {
  constructor() {
    this.letters = this.generateLetterData()
    this.filteredLetters = [...this.letters]
    this.practiceMode = false
    this.practiceScore = 0
    this.currentPracticeLetter = "A"

    this.initializeLearning()
  }

  initializeLearning() {
    this.renderAlphabetGrid()
    this.bindEvents()
    this.setupSearch()
  }

  generateLetterData() {
    const difficulties = ["easy", "medium", "hard"]
    const categories = ["basic", "intermediate", "advanced"]
    const handIcons = [
      "fa-hand-paper",
      "fa-hand-rock",
      "fa-hand-peace",
      "fa-hand-point-up",
      "fa-hand-point-right",
      "fa-hand-point-down",
      "fa-hand-point-left",
      "fa-hand-lizard",
      "fa-hand-spock",
    ]

    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, index) => ({
      letter,
      difficulty: difficulties[index % 3],
      category: categories[Math.floor(index / 9)],
      handIcon: handIcons[index % handIcons.length],
      description: this.getLetterDescription(letter),
      instructions: this.getLetterInstructions(letter),
    }))
  }

  getLetterDescription(letter) {
    const descriptions = {
      A: "Closed fist with thumb extended upward",
      B: "Open palm with fingers extended upward",
      C: "Curved fingers forming a C shape",
      D: "Index finger pointing up, other fingers curved",
      E: "Fingers curved inward touching thumb",
      F: "Index and thumb form circle, others extended",
      G: "Index finger and thumb pointing horizontally",
      H: "Index and middle fingers extended horizontally",
      I: "Pinky finger extended upward",
      J: "Pinky finger traces J shape in air",
      K: "Index and middle fingers form V, thumb touches middle",
      L: "Index finger and thumb form L shape",
      M: "Thumb under three fingers",
      N: "Thumb under two fingers",
      O: "Fingers curved forming O shape",
      P: "Index and middle fingers pointing down",
      Q: "Index finger and thumb pointing down",
      R: "Index and middle fingers crossed",
      S: "Closed fist with thumb over fingers",
      T: "Thumb between index and middle fingers",
      U: "Index and middle fingers extended upward",
      V: "Index and middle fingers form V shape",
      W: "Index, middle, and ring fingers extended",
      X: "Index finger curved like hook",
      Y: "Thumb and pinky extended",
      Z: "Index finger traces Z shape in air",
    }
    return descriptions[letter] || "Hand gesture for letter " + letter
  }

  getLetterInstructions(letter) {
    const instructions = {
      A: [
        "Make a fist with your dominant hand",
        "Extend your thumb upward",
        "Keep other fingers closed",
        "Hold steady in front of camera",
      ],
      B: ["Extend all four fingers upward", "Keep fingers together", "Place thumb across palm", "Palm faces forward"],
      C: ["Curve all fingers", "Form a C shape with hand", "Keep thumb and fingers apart", "Palm faces left"],
      // Add more instructions for other letters
    }
    return (
      instructions[letter] || [
        "Position hand clearly in camera view",
        "Form the gesture slowly and deliberately",
        "Hold position for recognition",
        "Ensure good lighting",
      ]
    )
  }

  renderAlphabetGrid() {
    const grid = document.getElementById("alphabetGrid")
    grid.innerHTML = ""

    this.filteredLetters.forEach((letterData) => {
      const card = this.createLetterCard(letterData)
      grid.appendChild(card)
    })
  }

  createLetterCard(letterData) {
    const col = document.createElement("div")
    col.className = "col-md-3 col-sm-4 col-6"

    col.innerHTML = `
          <div class="letter-card position-relative" data-letter="${letterData.letter}">
              <span class="badge bg-${this.getDifficultyColor(letterData.difficulty)} difficulty-badge">
                  ${letterData.difficulty}
              </span>
              <div class="letter-display">${letterData.letter}</div>
              <div class="letter-hand">
                  <i class="fas ${letterData.handIcon}"></i>
              </div>
              <div class="letter-description">${letterData.description}</div>
          </div>
      `

    const card = col.querySelector(".letter-card")
    card.addEventListener("click", () => this.showLetterDetail(letterData))

    // Hover effects
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.05)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
    })

    return col
  }

  getDifficultyColor(difficulty) {
    const colors = {
      easy: "success",
      medium: "warning",
      hard: "danger",
    }
    return colors[difficulty] || "secondary"
  }

  showLetterDetail(letterData) {
    const modal = new bootstrap.Modal(document.getElementById("letterModal"))

    document.getElementById("modalTitle").textContent = `Letter ${letterData.letter}`
    document.getElementById("modalHandDemo").innerHTML = `<i class="fas ${letterData.handIcon} fa-8x text-primary"></i>`

    const instructionsList = document.getElementById("gestureInstructions")
    instructionsList.innerHTML = letterData.instructions.map((instruction) => `<li>${instruction}</li>`).join("")

    document.getElementById("modalDifficulty").textContent = letterData.difficulty
    document.getElementById("modalDifficulty").className =
      `badge bg-${this.getDifficultyColor(letterData.difficulty)} me-2`

    document.getElementById("modalCategory").textContent = letterData.category

    modal.show()
  }

  bindEvents() {
    // Practice mode
    document.getElementById("startPractice").addEventListener("click", () => this.togglePracticeMode())
    document.getElementById("randomLetter").addEventListener("click", () => this.showRandomLetter())

    // Practice this letter from modal
    document.getElementById("practiceThis").addEventListener("click", () => {
      const letter = document.getElementById("modalTitle").textContent.split(" ")[1]
      this.practiceSpecificLetter(letter)
    })

    // Filter
    document.getElementById("difficultyFilter").addEventListener("change", (e) => {
      this.filterByDifficulty(e.target.value)
    })
  }

  setupSearch() {
    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("input", (e) => {
      this.searchLetters(e.target.value)
    })
  }

  searchLetters(query) {
    const searchTerm = query.toLowerCase()
    this.filteredLetters = this.letters.filter(
      (letter) =>
        letter.letter.toLowerCase().includes(searchTerm) ||
        letter.description.toLowerCase().includes(searchTerm) ||
        letter.difficulty.toLowerCase().includes(searchTerm),
    )
    this.renderAlphabetGrid()
  }

  filterByDifficulty(difficulty) {
    if (difficulty === "all") {
      this.filteredLetters = [...this.letters]
    } else {
      this.filteredLetters = this.letters.filter((letter) => letter.difficulty === difficulty)
    }
    this.renderAlphabetGrid()
  }

  togglePracticeMode() {
    this.practiceMode = !this.practiceMode
    const btn = document.getElementById("startPractice")

    if (this.practiceMode) {
      btn.innerHTML = '<i class="fas fa-stop me-2"></i>Stop Practice'
      btn.className = "btn btn-danger me-2"
      this.startPracticeSession()
    } else {
      btn.innerHTML = '<i class="fas fa-play me-2"></i>Start Practice'
      btn.className = "btn btn-primary me-2"
      this.stopPracticeSession()
    }
  }

  startPracticeSession() {
    this.practiceScore = 0
    this.updatePracticeScore()
    this.showRandomLetter()
    window.showNotification("Practice mode started! Try to recognize the letters.", "success")

    // Auto-advance every 3 seconds
    this.practiceInterval = setInterval(() => {
      this.showRandomLetter()
    }, 3000)
  }

  stopPracticeSession() {
    if (this.practiceInterval) {
      clearInterval(this.practiceInterval)
    }
    window.showNotification(`Practice session ended! Final score: ${this.practiceScore}`, "info")
  }

  showRandomLetter() {
    const randomIndex = Math.floor(Math.random() * this.letters.length)
    this.currentPracticeLetter = this.letters[randomIndex].letter
    document.getElementById("practiceLetter").textContent = this.currentPracticeLetter

    // Add animation
    const letterElement = document.getElementById("practiceLetter")
    letterElement.style.transform = "scale(1.2)"
    letterElement.style.color = "var(--accent-color)"

    setTimeout(() => {
      letterElement.style.transform = "scale(1)"
      letterElement.style.color = "var(--primary-color)"
    }, 300)
  }

  practiceSpecificLetter(letter) {
    this.currentPracticeLetter = letter
    document.getElementById("practiceLetter").textContent = letter

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("letterModal"))
    modal.hide()

    // Scroll to practice section
    document.querySelector(".practice-letter").scrollIntoView({
      behavior: "smooth",
    })

    window.showNotification(`Now practicing letter ${letter}`, "info")
  }

  updatePracticeScore() {
    document.getElementById("practiceScore").textContent = this.practiceScore
  }

  // Simulate correct answer (in real app, this would be triggered by recognition)
  correctAnswer() {
    this.practiceScore += 10
    this.updatePracticeScore()
    window.showNotification("Correct! +10 points", "success")
  }
}

// Initialize learning page
document.addEventListener("DOMContentLoaded", () => {
  new SignLanguageLearning()
})
