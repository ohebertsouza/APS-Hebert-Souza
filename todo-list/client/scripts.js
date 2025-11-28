const API_URL = 'http://localhost:8000'; 

// Variáveis Globais
let selectedTasks = new Set();
let isManageMode = false;

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

// 1. CARREGAR TAREFAS
const taskList = document.getElementById('taskList');

async function loadTasks() {
    const token = localStorage.getItem('token');
    if (!token && document.getElementById('taskList')) return;

    if (taskList) {
        try {
            const response = await fetch(`${API_URL}/tasks`, { headers: getAuthHeader() });
            if (response.status === 401) { logout(); return; }
            const data = await response.json();
            renderTasks(data); 
        } catch (error) { console.error(error); }
    }
}

// 2. DESENHAR NA TELA
function renderTasks(responseData) {
    taskList.innerHTML = ''; 
    let lista = [];
    
    if (responseData.tasks && Array.isArray(responseData.tasks)) { lista = responseData.tasks; } 
    else if (Array.isArray(responseData)) { lista = responseData; } 
    else if (responseData.data) { lista = responseData.data; }

    if (lista.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">✨</div>
                <p style="font-size: 1.2rem; font-weight: 600;">Tudo limpo por aqui</p>
                <p style="font-size: 0.9rem; margin-top: 8px; opacity: 0.7;">Toque no + para começar.</p>
            </div>
        `;
        return;
    }

    lista.forEach(task => {
        const li = document.createElement('li');
        const id = task.id || task._id;
        const text = task.title || task.description || "Sem título";
        
        // Clique para selecionar
        li.onclick = () => toggleSelection(id, li);
        
        li.innerHTML = `
            <span>${text}</span>
            <div class="actions">
                <button class="btn-icon" onclick="event.stopPropagation(); deleteTask('${id}')">✕</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// 3. LÓGICA DE SELEÇÃO MÚLTIPLA
function toggleManageMode() {
    isManageMode = !isManageMode;
    const btn = document.getElementById('manageBtn');
    const bulkBtn = document.getElementById('bulkDeleteBtn');
    
    btn.innerText = isManageMode ? 'Cancelar' : 'Gerenciar';
    btn.classList.toggle('active');
    bulkBtn.style.display = isManageMode ? 'block' : 'none';
    
    if (!isManageMode) {
        selectedTasks.clear();
        updateBulkButton();
        document.querySelectorAll('li.selected').forEach(li => li.classList.remove('selected'));
    }
}

function toggleSelection(id, element) {
    if (!isManageMode) return;
    if (selectedTasks.has(id)) {
        selectedTasks.delete(id);
        element.classList.remove('selected');
    } else {
        selectedTasks.add(id);
        element.classList.add('selected');
    }
    updateBulkButton();
}

function updateBulkButton() {
    const btn = document.getElementById('bulkDeleteBtn');
    btn.innerText = `Apagar Selecionados (${selectedTasks.size})`;
}

async function deleteSelectedTasks() {
    if (selectedTasks.size === 0) { alert("Selecione tarefas."); return; }
    if (confirm(`Apagar ${selectedTasks.size} tarefas?`)) {
        const ids = Array.from(selectedTasks);
        for (const id of ids) {
            try {
                await fetch(`${API_URL}/tasks/${id}`, {
                    method: 'DELETE', headers: getAuthHeader()
                });
            } catch (error) { console.error(error); }
        }
        selectedTasks.clear();
        updateBulkButton();
        toggleManageMode();
        await loadTasks();
    }
}

// 4. CRIAR TAREFA
async function createTask() {
    const descInput = document.getElementById('taskDesc');
    const saveBtn = document.querySelector('.save-btn');
    const valor = descInput.value;

    if (!valor) return;

    const oldText = saveBtn.innerText;
    saveBtn.innerText = '...';

    const payload = { title: valor, name: valor, description: valor, completed: false };

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST', headers: getAuthHeader(), body: JSON.stringify(payload)
        });
        if (response.ok) {
            descInput.value = ''; 
            await loadTasks(); 
        } else { alert('Erro ao criar tarefa'); }
    } catch (error) { alert('Erro de conexão'); } 
    finally { saveBtn.innerText = oldText; descInput.focus(); }
}

// 5. DELETAR INDIVIDUAL
async function deleteTask(id) {
    if(confirm('Apagar atividade?')) {
        try {
            await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE', headers: getAuthHeader()
            });
            await loadTasks();
        } catch (error) { console.error(error); }
    }
}

// 6. LOGOUT
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// 7. EVENT LISTENERS PARA LOGIN E CADASTRO (Isso estava faltando antes!)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');
        const oldText = btn.innerText;
        btn.innerText = '...';
        
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            const data = await res.json();
            if(res.ok) {
                localStorage.setItem('token', data.access_token || data.token);
                window.location.href = 'tarefas.html';
            } else { alert('Login falhou'); }
        } catch(e) { console.error(e); }
        finally { btn.innerText = oldText; }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email, password})
            });
            if(res.ok) {
                alert('Sucesso! Faça login.');
                window.location.href = 'login.html';
            } else { alert('Erro ao cadastrar'); }
        } catch(e) { console.error(e); }
    });
}

// Exportar funções globais para o HTML
window.toggleManageMode = toggleManageMode; 
window.toggleSelection = toggleSelection;
window.deleteSelectedTasks = deleteSelectedTasks;
window.createTask = createTask;
window.deleteTask = deleteTask;
window.logout = logout;

// Inicializa
loadTasks();