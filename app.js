// --- 1. الساعة الحية ---
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG');
    document.getElementById('liveClock').innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. مؤقت البومودورو ---
let timer;
let timeLeft = 25 * 60; // 25 دقيقة
let isRunning = false;

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
            alert('انتهى وقت التركيز! خذ استراحة لمدة 5 دقائق ☕');
            timeLeft = 5 * 60;
            document.getElementById('timerStatus').innerText = 'وقت الاستراحة ☕';
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    document.getElementById('timerStatus').innerText = 'وقت المذاكرة والتركيز 🧠';
    updateTimerDisplay();
}

// --- 3. الأصوات الصوتية للتركيز ---
function toggleSound(soundType) {
    const rain = document.getElementById('audioRain');
    const waves = document.getElementById('audioWaves');
    
    rain.pause();
    waves.pause();

    if (soundType === 'rain') rain.play();
    if (soundType === 'waves') waves.play();
}

// --- 4. إدارة المهام (To-Do List) مع الحفظ التلقائي ---
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
    const text = input.value.trim();
    if (text) {
        todos.push({ text: text, completed: false });
        input.value = '';
        saveAndRenderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveAndRenderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveAndRenderTodos();
}

// --- 5. الملاحظات السريعة مع الحفظ التلقائي ---
const notesArea = document.getElementById('quickNotes');
notesArea.value = localStorage.getItem('study_notes') || '';

function saveNotes() {
    localStorage.setItem('study_notes', notesArea.value);
}

// تشغيل الأرقام الابتدائية
saveAndRenderTodos();

