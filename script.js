let currentUser;

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

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

function clearLoginRegister() {
    document.querySelector("#loginInput").value = "";
    document.querySelector("#passwordInput").value = "";
}

async function loginRegister() {
    let emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let username = document.querySelector("#loginInput").value;
    let password = document.querySelector("#passwordInput").value;

    // userList = [
    //     {username: "dhruv@gmail.com", password: await hashPassword("dhruv")}, 
    //     {username: "raj@gmail.com", password: await hashPassword("raj")}, 
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
            throw new Error("Password and Username cannot be empty! Please enter a user name and password");
        }
        else if (emailFormat.test(username) === false) {
            throw new Error("Email is in incorrect format! Please check and enter your email again.");
        }
        else {
            let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
            let storedTasksLists = JSON.parse(localStorage.getItem("taskLists")) || [];
            let userFound = false;
            const hashedPassword = await hashPassword(password);
            
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
        return null; // Explicitly return null on error
    }
}

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

function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#taskList li').forEach((task) => {
        tasks.push({
            name: task.querySelector('.taskName').textContent,
            completed: task.querySelector('input[type="checkbox"]').checked
        });
    });
    
    // Get current taskLists from localStorage
    let taskLists = JSON.parse(localStorage.getItem("taskLists"));
    
    // Find and update the current user's tasks
    let userTaskList = taskLists.find(list => list.username === currentUser);
    if (userTaskList) {
        userTaskList.tasks = tasks;
        // Save updated taskLists back to localStorage
        localStorage.setItem("taskLists", JSON.stringify(taskLists));
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

document.querySelector("#loginRegisterBtn").addEventListener("click", async () => {
    currentUser = await loginRegister();
    if (currentUser) {
        alert(currentUser + " has logged in successfully!")
        document.querySelector("#loginSection").classList.add("d-none");
        document.querySelector("#toDoSection").classList.remove("d-none");
        loadTasks(currentUser)
    }
});
document.querySelector('#addTaskBtn').addEventListener('click', addTask);
document.querySelector('#taskList').addEventListener('click', deleteTask);
document.querySelector('#taskList').addEventListener('click', editTask);
document.querySelector('#taskList').addEventListener('click', taskDone);