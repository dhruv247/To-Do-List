let currentUser; // Tracks current user to maintain state

// Simple password hashing function
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16); // Convert to hex string
}

// Function to validate task name (avoid duplicates and empty entries)
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

// Function to clear login fields
function clearLoginRegister() {
    document.querySelector("#loginInput").value = "";
    document.querySelector("#passwordInput").value = "";
}

// Function to handle logout
function logout() {
    currentUser = null;
    document.querySelector("#taskList").innerHTML = '';
    document.querySelector("#toDoSection").classList.add("d-none");
    document.querySelector("#loginSection").classList.remove("d-none");
}

// Function to load tasks from local storage after login
function loadTasks(user) {
    let taskLists = JSON.parse(localStorage.getItem("taskLists"));
    let userTaskList = taskLists.find(list => list.username === user).tasks;
    userTaskList.forEach(task => {
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

// Function to save tasks to local storage after add, edit, delete and marked done actions
function saveTasks() {
    // Create array of tasks by getting it from the UI
    let tasks = [];
    document.querySelectorAll('#taskList li').forEach((task) => {
        tasks.push({
            name: task.querySelector('.taskName').textContent,
            completed: task.querySelector('input[type="checkbox"]').checked
        });
    });
    let taskLists = JSON.parse(localStorage.getItem("taskLists"));
    // Find and update the current user's tasks
    let userTaskList = taskLists.find(list => list.username === currentUser);
    if (userTaskList) {
        userTaskList.tasks = tasks;
        // Save updated taskLists back to localStorage
        localStorage.setItem("taskLists", JSON.stringify(taskLists));
    }
}

// Login / register Function
function loginRegister() {
    let emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let username = document.querySelector("#loginInput").value;
    let password = document.querySelector("#passwordInput").value;

    // // Sample Users (updated without await)
    // userList = [
    //     {username: "dhruv@gmail.com", password: hashPassword("dhruv")},
    //     {username: "raj@gmail.com", password: hashPassword("raj")},
    // ]
    // localStorage.setItem("users", JSON.stringify(userList))

    // taskLists = [
    //     {
    //         username: "dhruv@gmail.com", tasks: [
    //             {
    //                 name: "sample1",
    //                 completed: false
    //             },
    //             {
    //                 name: "sample2",
    //                 completed: true
    //             }
    //         ]
    //     },
    //     {
    //         username: "raj@gmail.com", tasks: [
    //             {
    //                 name: "sample1",
    //                 completed: true
    //             },
    //             {
    //                 name: "sample2",
    //                 completed: false
    //             }
    //         ]
    //     }
    // ]
    // localStorage.setItem("taskLists", JSON.stringify(taskLists))

    try {
        if (!username || !password) {
            throw new Error("Password and Username cannot be empty! Please enter a user name and password"); // Empty fields error
        }
        else if (emailFormat.test(username) === false) {
            throw new Error("Email is in incorrect format! Please check and enter your email again."); // Incorrect email format error
        }
        // Login validation passed
        else {
            let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
            let storedTasksLists = JSON.parse(localStorage.getItem("taskLists")) || [];
            let userFound = false;
            const hashedPassword = hashPassword(password);
            // Login implementation
            for (let user of storedUsers) {
                if (username === user.username) {
                    userFound = true;
                    if (hashedPassword === user.password) {
                        clearLoginRegister();
                        return username;
                    }
                    else {
                        clearLoginRegister();
                        throw new Error("Incorrect password for " + username + "! Please try again.");
                    }
                }
            }
            // Registration implementation (for new users)
            if (!userFound) {
                newUser = { username: username, password: hashedPassword };
                storedUsers.push(newUser);
                localStorage.setItem("users", JSON.stringify(storedUsers))
                newTaskList = { username: username, tasks: [] };
                storedTasksLists.push(newTaskList);
                localStorage.setItem("taskLists", JSON.stringify(storedTasksLists));
                clearLoginRegister();
                alert(username + " has been registered successfully!")
                return username;
            }
        }
    } catch (error) {
        alert("Error: " + error.message);
        clearLoginRegister();
        return null;
    }
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
        document.querySelector('#taskInput').value = '';
        saveTasks(); // Save tasks to localStorage
    } catch (error) {
        alert('Error: ' + error.message);
        document.querySelector('#taskInput').value = '';
    }
}

// Function to delete a task
function deleteTask(event) {
    if (event.target.classList.contains('delete-button')) {
        let parentElement = event.target.closest('.list-group-item');
        parentElement.remove();
        saveTasks();
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
            saveTasks();
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
        saveTasks();
    }
}

// Event Triggers
document.querySelector("#loginRegisterBtn").addEventListener("click", () => {
    currentUser = loginRegister();
    if (currentUser) {
        alert(currentUser + " has logged in successfully!")
        document.querySelector("#loginSection").classList.add("d-none");
        document.querySelector("#toDoSection").classList.remove("d-none");
        loadTasks(currentUser)
    }
}); // Login
document.querySelector("#logoutBtn").addEventListener("click", logout); // Logout
document.querySelector('#addTaskBtn').addEventListener('click', addTask); // Add task
document.querySelector('#taskList').addEventListener('click', deleteTask); // Delete task
document.querySelector('#taskList').addEventListener('click', editTask); // Edit task
document.querySelector('#taskList').addEventListener('click', taskDone); // Mark as done