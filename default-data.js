export const DEFAULT_MODES = [
  {
    id: "classic",
    name: "Classic",
    icon: "⌨️",
    description: "โหมดมาตรฐาน พิมพ์ Code ตามต้นฉบับ จับเวลา WPM และ Accuracy",
    scoreMultiplier: 1.00,
    timeMultiplier: 1.00,
    mistakePenalty: 2,
    enforceTimeLimit: false,
    allowBackspace: true,
    sortOrder: 1
  },
  {
    id: "speed",
    name: "Speed Rush",
    icon: "⚡",
    description: "เวลาน้อยลง ต้องพิมพ์ให้ทัน ได้ตัวคูณคะแนนสูงขึ้น",
    scoreMultiplier: 1.35,
    timeMultiplier: 0.65,
    mistakePenalty: 2.5,
    enforceTimeLimit: true,
    allowBackspace: true,
    sortOrder: 2
  },
  {
    id: "accuracy",
    name: "Accuracy Pro",
    icon: "🎯",
    description: "เน้นความแม่นยำ พิมพ์ผิดหักคะแนนมากกว่า Classic",
    scoreMultiplier: 1.20,
    timeMultiplier: 1.20,
    mistakePenalty: 6,
    enforceTimeLimit: false,
    allowBackspace: true,
    sortOrder: 3
  },
  {
    id: "hardcore",
    name: "Hardcore",
    icon: "🔥",
    description: "จำกัดเวลาและห้าม Backspace/Delete คะแนนสูงที่สุด",
    scoreMultiplier: 1.70,
    timeMultiplier: 0.80,
    mistakePenalty: 7,
    enforceTimeLimit: true,
    allowBackspace: false,
    sortOrder: 4
  }
];

export const DEFAULT_LEVELS = [
  {
    levelNo: 1, title: "HTML: Hello World", language: "HTML",
    difficulty: "ง่าย", difficultyMultiplier: 1.00, basePoints: 100,
    timeLimit: 90, description: "โครงสร้าง HTML เบื้องต้น",
    code: `<!DOCTYPE html>
<html>
<body>
    <h1>Hello World</h1>
</body>
</html>`
  },
  {
    levelNo: 2, title: "CSS: Button Style", language: "CSS",
    difficulty: "ง่าย", difficultyMultiplier: 1.10, basePoints: 140,
    timeLimit: 95, description: "Selector และ Property พื้นฐาน",
    code: `.button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}`
  },
  {
    levelNo: 3, title: "JavaScript: Condition", language: "JavaScript",
    difficulty: "ง่าย", difficultyMultiplier: 1.20, basePoints: 200,
    timeLimit: 105, description: "ตัวแปรและ if / else",
    code: `const score = 80;

if (score >= 50) {
    console.log("Pass");
} else {
    console.log("Try again");
}`
  },
  {
    levelNo: 4, title: "Python: For Loop", language: "Python",
    difficulty: "ง่าย", difficultyMultiplier: 1.30, basePoints: 260,
    timeLimit: 115, description: "List, for loop และ f-string",
    code: `subjects = ["HTML", "CSS", "JavaScript", "Python"]

for subject in subjects:
    print(f"Learning: {subject}")`
  },
  {
    levelNo: 5, title: "HTML: Login Form", language: "HTML",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.45, basePoints: 350,
    timeLimit: 130, description: "Form, Label, Input และ Button",
    code: `<form id="loginForm">
    <label for="email">Email</label>
    <input id="email" type="email" required>

    <label for="password">Password</label>
    <input id="password" type="password" required>

    <button type="submit">Login</button>
</form>`
  },
  {
    levelNo: 6, title: "CSS: Responsive Grid", language: "CSS",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.60, basePoints: 450,
    timeLimit: 145, description: "CSS Grid และ Media Query",
    code: `.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}`
  },
  {
    levelNo: 7, title: "JavaScript: Array Methods", language: "JavaScript",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.75, basePoints: 560,
    timeLimit: 160, description: "filter, map และ Arrow Function",
    code: `function calculateBonus(scores) {
    return scores
        .filter(score => score >= 50)
        .map(score => score + 10);
}

console.log(calculateBonus([40, 55, 70]));`
  },
  {
    levelNo: 8, title: "Python: Dictionary", language: "Python",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.90, basePoints: 680,
    timeLimit: 175, description: "Dictionary Comprehension",
    code: `scores = {"Ann": 72, "Boy": 48, "Cat": 91}

passed = {
    name: score
    for name, score in scores.items()
    if score >= 50
}

print(passed)`
  },
  {
    levelNo: 9, title: "JavaScript: DOM Event", language: "JavaScript",
    difficulty: "ยาก", difficultyMultiplier: 2.10, basePoints: 820,
    timeLimit: 190, description: "DOM และ Event Listener",
    code: `const button = document.querySelector("#startButton");
const statusText = document.querySelector("#status");

button.addEventListener("click", () => {
    statusText.textContent = "Game started!";
    button.disabled = true;
});`
  },
  {
    levelNo: 10, title: "Python: Class", language: "Python",
    difficulty: "ยาก", difficultyMultiplier: 2.30, basePoints: 980,
    timeLimit: 210, description: "Class, Constructor และ Method",
    code: `class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name
        self.score = 0

    def add_score(self, points):
        self.score += points
        return self.score`
  },
  {
    levelNo: 11, title: "JavaScript: Async Await", language: "JavaScript",
    difficulty: "ยาก", difficultyMultiplier: 2.60, basePoints: 1200,
    timeLimit: 230, description: "async / await, fetch และ error handling",
    code: `async function loadStudents() {
    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Request failed");
        }

        const students = await response.json();
        return students;
    } catch (error) {
        console.error(error);
        return [];
    }
}`
  },
  {
    levelNo: 12, title: "Flask: JSON API Endpoint", language: "Python / Flask",
    difficulty: "Expert", difficultyMultiplier: 3.00, basePoints: 1500,
    timeLimit: 260, description: "Flask Route, JSON และ Validation",
    code: `@app.post("/api/score")
def save_score():
    data = request.get_json()

    if not data or "score" not in data:
        return jsonify({"error": "score is required"}), 400

    score = int(data["score"])

    return jsonify({
        "success": True,
        "score": score
    }), 201`
  }
];
