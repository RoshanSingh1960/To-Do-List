document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const taskInput = document.getElementById('new-task-input');
    const taskPriority = document.getElementById('new-task-priority');
    const taskDueDate = document.getElementById('new-task-due-date');
    const addTaskButton = document.getElementById('add-task-button');
    const clearTaskButton = document.getElementById('clear-task-button');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Render tasks in the UI
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const topRow = document.createElement('div');
            topRow.className = 'task-top-row';

            const taskLeft = document.createElement('div');
            taskLeft.className = 'task-left';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                tasks[index].completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const taskDesc = document.createElement('span');
            taskDesc.className = 'task-desc';
            if (task.completed) taskDesc.classList.add('completed');
            taskDesc.textContent = task.description;

            taskLeft.appendChild(checkbox);
            taskLeft.appendChild(taskDesc);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.title = 'Edit task';

            editButton.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = task.description;
                input.className = 'edit-input';

                const prioritySelect = document.createElement('select');
                prioritySelect.className = 'edit-priority';
                ['Low', 'Medium', 'High'].forEach(level => {
                    const option = document.createElement('option');
                    option.value = level;
                    option.textContent = `${level} Priority`;
                    if (level === task.priority) option.selected = true;
                    prioritySelect.appendChild(option);
                });

                const dueDateInput = document.createElement('input');
                dueDateInput.type = 'date';
                dueDateInput.value = task.dueDate || '';
                dueDateInput.className = 'edit-due-date';

                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Save';
                saveBtn.className = 'save-btn';

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'cancel-btn';

                const bottomRow = li.querySelector('.task-bottom-row');
                bottomRow.innerHTML = '';
                bottomRow.appendChild(input);
                bottomRow.appendChild(prioritySelect);
                bottomRow.appendChild(dueDateInput);
                bottomRow.appendChild(saveBtn);
                bottomRow.appendChild(cancelBtn);

                saveBtn.addEventListener('click', () => {
                    const newValue = input.value.trim();
                    if (!newValue) {
                        alert('Task description cannot be empty.');
                        return;
                    }
                    tasks[index].description = newValue;
                    tasks[index].priority = prioritySelect.value;
                    tasks[index].dueDate = dueDateInput.value;
                    saveTasks();
                    renderTasks();
                });

                cancelBtn.addEventListener('click', renderTasks);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.title = 'Delete task';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);

            topRow.appendChild(taskLeft);
            topRow.appendChild(actionsDiv);

            const bottomRow = document.createElement('div');
            bottomRow.className = 'task-bottom-row';

            const taskMeta = document.createElement('div');
            taskMeta.className = 'task-meta';

            const prioritySpan = document.createElement('span');
            const priority = task.priority || 'Medium';
            prioritySpan.textContent = `${priority} Priority`;
            prioritySpan.className = 'priority-' + priority.toLowerCase();
            taskMeta.appendChild(prioritySpan);

            if (task.dueDate) {
                const dueDateSpan = document.createElement('span');
                dueDateSpan.textContent = 'Due: ' + task.dueDate;
                taskMeta.appendChild(dueDateSpan);
            }

            bottomRow.appendChild(taskMeta);
            li.appendChild(topRow);
            li.appendChild(bottomRow);

            // Animate task
            li.style.opacity = 0;
            li.style.transition = 'opacity 0.3s ease';
            taskList.appendChild(li);
            requestAnimationFrame(() => {
                li.style.opacity = 1;
            });
        });
    }

    // Add task to list
    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            alert('Please enter a task description.');
            return;
        }
        const priority = taskPriority.value;
        const dueDate = taskDueDate.value;
        tasks.push({
            description: taskText,
            completed: false,
            priority,
            dueDate
        });
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskPriority.value = 'Medium';
        taskDueDate.value = '';
        taskInput.focus();
    }

    // Clear all tasks
    function clearTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }

    // Event Listeners
    addTaskButton.addEventListener('click', addTask);
    clearTaskButton.addEventListener('click', clearTasks);

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initial render
    renderTasks();
});
