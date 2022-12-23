/* https://jsonplaceholder.typicode.com */
let tasks = [];

Promise.all ([
    loadTasks()
]).then((result) => {
    let [loadedTasks] = result;
    tasks = loadedTasks;
    updateDOMTasks();
});

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    let newtaskTitle = document.querySelector('#new-todo').value;
    sendTasck({
        title: newtaskTitle,
        completed: false,
    }).then((newTask) => {
        tasks.push(newTask);
        updateDOMTasks(); 
        document.querySelector('#new-todo').value = '';
    });
});

function updateDOMTasks() {
    let todo_list = document.querySelector('#todo-list');
    todo_list.innerHTML = '';

    for(let i = tasks.length - 1; i >= 0; i--) {
        let currTask = tasks[i];
        let taskLi = document.createElement('li');
        taskLi.className = 'todo-item';

        taskLi.innerHTML = `<input type="checkbox" ${currTask.completed ? 'checked' : ''}><div style="width: 434px;">${currTask.title}</div><div class="close": italic">&times;</div>`;
        
        taskLi.querySelector('input').addEventListener('click', (e) => {
            e.preventDefault();
            updateTaskStatus(currTask.id, e.target.checked).then((updatedTask) => {
                tasks.find((task) => task.id == currTask.id).completed = updatedTask.completed;
                updateDOMTasks();
            });
        });

        taskLi.querySelector('.close').addEventListener('click', (e) => {
            deleteTask(currTask.id).then((isDeleted) => {
                if(isDeleted) {
                    tasks = tasks.filter((task) => task.id != currTask.id);
                    updateDOMTasks();
                }
            });
        });
        todo_list.appendChild(taskLi);
    }
}

async function loadTasks(limit = 10) {
    try {    
        let response = await fetch('http://jsonplaceholder.typicode.com' + `/todos?_limit=${limit}`);
        let loadedTasks = await response.json();
        return loadedTasks;
    } catch (error) {
        alert(error.message);
    }
}

async function sendTasck(task) {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(task)
        });
        let newTask = await response.json();
        return newTask;      
    } catch (error) {
        alert(error.message);
    }
}

async function updateTaskStatus(taskId, iscompleted) {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/todos' + `/${taskId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({completed: iscompleted})
        });
        let updatedTask = await response.json();
        return updatedTask;     
    } catch (error) {
        alert(error.message)
    }
}

async function deleteTask(taskId) {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/todos' + `/${taskId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
        return response.ok; 
    } catch (error) {
        alert(error.message)
    }
}
