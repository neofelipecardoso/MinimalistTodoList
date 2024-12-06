function saveTasksToCookies(tasks) {
  const tasksJSON = JSON.stringify(tasks); 
  document.cookie = `tasks=${encodeURIComponent(tasksJSON)}; path=/; max-age=31536000`; 
}

function loadTasksFromCookies() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name.trim() === 'tasks') {
      return JSON.parse(decodeURIComponent(value)); 
    }
  }
  return []; 
}


document.addEventListener('DOMContentLoaded', function() {
  const taskList = document.getElementById('taskList');
  
  const savedTasks = loadTasksFromCookies();
  savedTasks.forEach(task => {
    addTaskToList(task.text, task.priority);
  });

  document.getElementById('inputArea').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();  

          const taskText = document.getElementById('inputArea').value.trim();
          const priority = document.getElementById('priority').value;

          if (taskText === '') {
              return;
          }

          addTaskToList(taskText, priority);

          saveTasksToCookies(getAllTasksFromList());

          document.getElementById('inputArea').value = '';
      }
  });

  function addTaskToList(taskText, priority) {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item', priority);

      taskItem.innerHTML = `
          <div class="task-name">
              <span>${taskText}</span>
          </div>
          <div class="task-priority">
              <span class="priority ${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
          </div>
          <div class="task-delete">
              <button class="delete">Delete</button>
          </div>
      `;

      taskItem.querySelector('.delete').addEventListener('click', function() {
          taskItem.remove();
          saveTasksToCookies(getAllTasksFromList()); 
      });

      taskItem.addEventListener('click', function() {
          taskItem.classList.toggle('completed');
          saveTasksToCookies(getAllTasksFromList()); 
      });

      taskList.appendChild(taskItem);
  }

  function getAllTasksFromList() {
      const tasks = [];
      const taskItems = document.querySelectorAll('.task-item');
      taskItems.forEach(item => {
          const taskText = item.querySelector('.task-name span').textContent;
          const priority = item.querySelector('.task-priority .priority').textContent.toLowerCase();
          tasks.push({ text: taskText, priority: priority });
      });
      return tasks;
  }
});
