// --- 1. الساعة الحية ---
function updateClock() {
    const now = new Date();
    document.getElementById('liveClock').innerText = now.toLocaleTimeString('ar-EG');
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. مؤقت التركيز والتعديل عليه ---
let timer;
let timeLeft = 25 * 60;
let isRunning = false;

function setCustomTime() {
    const mins = parseInt(document.getElementById('customMinutes').value);
    if (mins > 0) {
        pauseTimer();
        timeLeft = mins * 60;
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            alert('انتهى وقت التركيز! خذ استراحة ☕');
            document.getElementById('timerStatus').innerText = 'وقت الاستراحة ☕';
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    pauseTimer();
    setCustomTime();
    document.getElementById('timerStatus').innerText = 'وقت المذاكرة والتركيز 🧠';
}

// --- 3. الأصوات الصوتية المعدلة ---
function toggleSound(soundType) {
    const sounds = ['audioRain', 'audioWaves', 'audioForest', 'audioWhite'];
    
    sounds.forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    if (soundType === 'rain') document.getElementById('audioRain').play();
    if (soundType === 'waves') document.getElementById('audioWaves').play();
    if (soundType === 'forest') document.getElementById('audioForest').play();
    if (soundType === 'white') document.getElementById('audioWhite').play();
}

// --- 4. المهام والملاحظات ---
let todos = JSON.parse(localStorage.getItem('study_todos')) || [];

function saveAndRenderTodos() {
    localStorage.setItem('study_todos', JSON.stringify(todos));
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span onclick="toggleTodo(${index})" style="cursor:pointer">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">🗑️</button>
        `;
        todoList.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todoInput');
    if (input.value.trim()) {
        todos.push({ text: input.value.trim(), completed: false });
        input.value = '';
        saveAndRenderTodos();
    }
}
function toggleTodo(index) { todos[index].completed = !todos[index].completed; saveAndRenderTodos(); }
function deleteTodo(index) { todos.splice(index, 1); saveAndRenderTodos(); }

const notesArea = document.getElementById('quickNotes');
notesArea.value = localStorage.getItem('study_notes') || '';
function saveNotes() { localStorage.setItem('study_notes', notesArea.value); }

// --- 5. حاسبة النسبة (مادة واحدة / عدة مواد) ---
function changeCalcMode(mode) {
    if (mode === 'single') {
        document.getElementById('singleCalcBox').style.display = 'block';
        document.getElementById('multiCalcBox').style.display = 'none';
    } else {
        document.getElementById('singleCalcBox').style.display = 'none';
        document.getElementById('multiCalcBox').style.display = 'block';
    }
}

function generateSubjectInputs() {
    const count = parseInt(document.getElementById('subjectsCount').value);
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';

    if (count > 0 && count <= 15) {
        for (let i = 1; i <= count; i++) {
            const div = document.createElement('div');
            div.className = 'subject-row';
            div.innerHTML = `
                <span>مادة ${i}:</span>
                <input type="number" class="sub-score" placeholder="الدرجة">
                <input type="number" class="sub-total" placeholder="الدرجة النهائية">
            `;
            container.appendChild(div);
        }
    }
}

function calculatePercentage() {
    const mode = document.getElementById('calcMode').value;
    const resultBox = document.getElementById('calcResult');
    let totalScore = 0;
    let userScore = 0;

    if (mode === 'single') {
        userScore = parseFloat(document.getElementById('userScore').value);
        totalScore = parseFloat(document.getElementById('totalScore').value);
    } else {
        const scores = document.querySelectorAll('.sub-score');
        const totals = document.querySelectorAll('.sub-total');

        scores.forEach((input, i) => {
            const val = parseFloat(input.value) || 0;
            const tot = parseFloat(totals[i].value) || 0;
            userScore += val;
            totalScore += tot;
        });
    }

    if (isNaN(userScore) || isNaN(totalScore) || totalScore <= 0) {
        resultBox.innerText = 'يرجى إدخال الدرجات بشكل صحيح!';
        resultBox.style.color = '#ff6384';
        return;
    }

    const percentage = ((userScore / totalScore) * 100).toFixed(1);
    let grade = '';
    if (percentage >= 85) grade = 'ممتاز 🌟';
    else if (percentage >= 75) grade = 'جيد جداً 👍';
    else if (percentage >= 65) grade = 'جيد 👌';
    else if (percentage >= 50) grade = 'مقبول 📝';
    else grade = 'يحتاج إلى تحسين 💪';

    resultBox.innerText = `النسبة: ${percentage}% (${grade})`;
    resultBox.style.color = '#4da6ff';
}

function toggleFullscreen() {
    const timerCard = document.querySelector('.timer-card');
    if (!document.fullscreenElement) {
        timerCard.requestFullscreen().catch(err => alert(err.message));
    } else {
        document.exitFullscreen();
    }
}

saveAndRenderTodos();
