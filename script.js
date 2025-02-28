// Task name validity check function
function validTaskName(taskName) {
    let taskListItems = document.querySelectorAll('#taskList li p');
    if (!taskName) {
        return 'Task name cannot be empty! Please enter a valid task name.'; // Error for empty task name
    } else {
        for (let task of taskListItems) {
            if (task.textContent === taskName) {
                return 'Duplicate task name exists! Please enter a valid task name.'; // Error for duplicate task name
            }
        }
    }
  return null;
}

// Add Task Function
function addTask() {
    try {
        let taskName = document.querySelector('#taskInput').value;
        let taskList = document.querySelector('#taskList');
        let taskListItems = document.querySelectorAll('#taskList li p');
        // Task name validity checks
        let errorMessage = validTaskName(taskName);
        if (errorMessage) {
            throw new Error(errorMessage);
        } else {
        // Add task to list (after passing checks)
            let newTask = document.createElement('li');
            newTask.className = `list-group-item d-flex justify-content-between align-items-center`;
            newTask.innerHTML = `<input type="checkbox" class="mr-2"/>
                                <p class='taskName mb-0'>${taskName}</p>
                                <div>
                                    <button class="btn btn-warning btn-sm edit-button">Edit</button>
                                    <button class="btn btn-danger btn-sm ml-2 delete-button">Delete</button>
                                </div>`;
            taskList.appendChild(newTask);
            document.querySelector('#taskInput').value = ''; // Clear input field after adding task
        }
    } catch (error) {
        alert('Error: ' + error.message);
        document.querySelector('#taskInput').value = ''; // Clear input field
    }
}

// Delete Task Function
function deleteTask(event) {
    if (event.target.classList.contains('delete-button')) {
        let parentElement = event.target.closest('.list-group-item');
        parentElement.remove();
    }
}

// Edit Task Function
function editTask(event) {
    try {
        if (event.target.classList.contains('edit-button')) {
            let newTaskName = prompt('Enter the new task name.');
            // New task name validity checks
            let errorMessage = validTaskName(newTaskName);
            if (errorMessage) {
                throw new Error(errorMessage);
            }
            else {
                // Change task name after validity checks
                let newTaskNameElement = event.target
                .closest('.list-group-item')
                .querySelector('.taskName');
                newTaskNameElement.innerText = newTaskName;
            }
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Mark Task as Done Function
function taskDone(event) {
    if (event.target.type === 'checkbox') {
        let task = event.target.closest('.list-group-item').querySelector('.taskName');
        task.classList.toggle('completed');
    }
}

// Event Triggers
document.querySelector('#addTaskBtn').addEventListener('click', addTask); // Add Event
document.querySelector('#taskList').addEventListener('click', deleteTask); // Delete Event
document.querySelector('#taskList').addEventListener('click', editTask); // Edit Event
document.querySelector('#taskList').addEventListener('click', taskDone); // Checkbox Event