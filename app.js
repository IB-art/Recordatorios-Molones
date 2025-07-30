const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const alertSound = document.getElementById('alert-sound');
const tasks = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = document.getElementById('task-text').value.trim();
  const date = document.getElementById('task-date').value;
  const time = document.getElementById('task-time').value;

  if (!text || !date || !time) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  const dateTime = new Date(`${date}T${time}`);

  const task = {
    id: Date.now(),
    text,
    dateTime,
    done: false,
    alerted: false
  };

  tasks.push(task);
  renderTask(task);
  form.reset();
});

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task';
  li.dataset.id = task.id;

  const content = document.createElement('span');
  content.textContent = `${task.text} ⏰  ${task.dateTime.toLocaleString()}`;
  
  const btnDone = document.createElement('button');
  btnDone.textContent = '✅ Hecho';
  btnDone.title = 'Marcar como hecha';
  btnDone.onclick = () => toggleDone(task.id, li);

  const btnDelete = document.createElement('button');
  btnDelete.textContent = '🗑️ Eliminar';
  btnDelete.title = 'Eliminar';
  btnDelete.onclick = () => deleteTask(task.id, li);

  li.appendChild(content);
  li.appendChild(btnDone);
  li.appendChild(btnDelete);

  li.addEventListener('mouseover', () => li.style.boxShadow = '0 0 10px #ccc');
  li.addEventListener('mouseout', () => li.style.boxShadow = 'none');

  taskList.appendChild(li);
}

function toggleDone(id, li) {
  const task = tasks.find(t => t.id === id);
  task.done = !task.done;
  li.classList.toggle('done');
}

function deleteTask(id, li) {
  const index = tasks.findIndex(t => t.id === id);
  if (index > -1) tasks.splice(index, 1);
  li.remove();
}

setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    if (!task.alerted && !task.done && task.dateTime <= now) {
      task.alerted = true;
      const li = document.querySelector(`.task[data-id="${task.id}"]`);
      li.classList.add('alert');
       alertSound.play();
      alert(`¡Hora de hacer la compra de: ${task.text}!`);
     
    }
  });
}, 30000);

// Envío con Enter desde cualquier campo
form.querySelectorAll('input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
  });
});
