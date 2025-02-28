// Load tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Function to validate task name
function validTaskName(taskName) {
    let taskListItems = document.querySelectorAll('#taskList li p');
    if (!taskName) {
        return 'Task name cannot be empty! Please enter a valid task name.'; // Throws error when task name is empty
    } else {
        for (let task of taskListItems) {
            if (task.textContent === taskName) {
                return 'Duplicate task name exists! Please enter a valid task name.'; // Throws error when task name is a duplicate
            }
        }
    }
    return null;
}

// Function to save tasks to localStorage
function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#taskList li').forEach(task => {
        tasks.push({
            name: task.querySelector('.taskName').textContent,
            completed: task.querySelector('input[type="checkbox"]').checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        let newTask = document.createElement('li');
        newTask.className = `list-group-item d-flex justify-content-between align-items-center`;
        newTask.innerHTML = `<input type="checkbox" class="mr-2" ${task.completed ? "checked" : ""}/>
                            <p class='taskName mb-0 ${task.completed ? "completed" : ""}'>${task.name}</p>
                            <div>
                                <button class="btn btn-warning btn-sm edit-button">Edit</button>
                                <button class="btn btn-danger btn-sm ml-2 delete-button">Delete</button>
                            </div>`;
        taskList.appendChild(newTask);
    });
}

// Function to add a new task
function addTask() {
    try {
        let taskName = document.querySelector('#taskInput').value;
        let taskList = document.querySelector('#taskList');

        let errorMessage = validTaskName(taskName);
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        let newTask = document.createElement('li');
        newTask.className = `list-group-item d-flex justify-content-between align-items-center`;
        newTask.innerHTML = `<input type="checkbox" class="mr-2"/>
                            <p class='taskName mb-0'>${taskName}</p>
                            <div>
                                <button class="btn btn-warning btn-sm edit-button">Edit</button>
                                <button class="btn btn-danger btn-sm ml-2 delete-button">Delete</button>
                            </div>`;
        taskList.appendChild(newTask);

        document.querySelector('#taskInput').value = ''; // Clear input field

        saveTasks(); // Save tasks to localStorage
    } catch (error) {
        alert('Error: ' + error.message);
        document.querySelector('#taskInput').value = ''; // Clear input field
    }
}

// Function to delete a task
function deleteTask(event) {
    if (event.target.classList.contains('delete-button')) {
        let parentElement = event.target.closest('.list-group-item');
        parentElement.remove();
        saveTasks(); // Update localStorage after deleting
    }
}

// Function to edit a task
function editTask(event) {
    try {
        if (event.target.classList.contains('edit-button')) {
            let newTaskName = prompt('Enter the new task name.');
            let errorMessage = validTaskName(newTaskName);
            if (errorMessage) {
                throw new Error(errorMessage);
            }

            let newTaskNameElement = event.target.closest('.list-group-item').querySelector('.taskName');
            newTaskNameElement.innerText = newTaskName;
            saveTasks(); // Update localStorage after editing
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Function to mark a task as done
function taskDone(event) {
    if (event.target.type === 'checkbox') {
        let task = event.target.closest('.list-group-item').querySelector('.taskName');
        task.classList.toggle('completed');
        saveTasks(); // Update localStorage after marking completed
    }
}

// Event Listeners
document.querySelector('#addTaskBtn').addEventListener('click', addTask);
document.querySelector('#taskList').addEventListener('click', deleteTask);
document.querySelector('#taskList').addEventListener('click', editTask);
document.querySelector('#taskList').addEventListener('click', taskDone);