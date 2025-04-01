var tasks = [];

var isValidTask = function(text, time, excludeIndex) {
    if (typeof excludeIndex === "undefined") {
        excludeIndex = -1;
    }

    if (!text || !time) {
        alert("Không được để rỗng 1 trong 2 ô input");
        return false;
    }

    if (text.length > 20) {
        alert("Name task không được lớn hơn 20 ký tự");
        return false;
    }

    if (tasks.some(function(task, index) {
        return index !== excludeIndex && task.time === time;
    })) {
        alert("Đã có một công việc vào giờ này.");
        return false;
    }

    return true;
};

function addTask() {
    var taskText = document.getElementById("task").value;
    var taskTime = document.getElementById("time").value;
    var isValid = isValidTask(taskText, taskTime);
    if(!isValid){
        return
    }
    var task = { text: taskText, time: taskTime, notify: true, notifyStatus: false };
    tasks.push(task);
    renderTasks();
    document.getElementById("task").value = "";
    document.getElementById("time").value = "";
}

function renderTasks() {
    var list = document.getElementById("todoList");
    list.innerHTML = "";
    tasks.forEach(function(task, index) {
        var daytime = formatDateTime(task.time);
        var li = document.createElement("li");
        li.className = "todo-item";
        li.innerHTML = '<span class="todo-text">' + task.text + ' - ' + daytime + '</span>' +
            '<button class="todo-btn btn-edit" onclick="editTask(' + index + ')">✏️</button>' +
            '<button class="todo-btn btn-delete" onclick="deleteTask(' + index + ')">❌</button>' +
            '<button class="todo-btn btn-bell" onclick="toggleReminder(' + index + ')">' + (task.notify ? '🔔' : '🔕') + '</button>';
        list.appendChild(li);
    });
}

function toggleReminder(index) {
    tasks[index].notify = !tasks[index].notify;
    renderTasks();
}

function editTask(index) {
    var task = tasks[index];
    document.getElementById("editTask").value = task.text;
    document.getElementById("editTime").value = task.time;
    document.getElementById("editOverlay").style.display = "flex";
    document.getElementById("editOverlay").dataset.taskIndex = index;
}

function updateTask() {
    var taskIndex = document.getElementById("editOverlay").dataset.taskIndex;
    var newText = document.getElementById("editTask").value;
    var newTime = document.getElementById("editTime").value;
    var isValid = isValidTask(newText, newTime);
    if(!isValid){
        return
    }
    if (newText && newTime) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].time = newTime;
        renderTasks();
        cancelEdit();
    }
}

function cancelEdit() {
    document.getElementById("editOverlay").style.display = "none";
    document.getElementById("editTask").value = "";
    document.getElementById("editTime").value = "";
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function checkReminders() {
    var now = new Date();
    var nowISO = now.toISOString().slice(0, 16);

    tasks.forEach(function(task) {
        console.log(task.time);
        var taskTime = new Date(task.time).toISOString().slice(0, 16);
        if (!task.notifyStatus && task.notify && taskTime === nowISO) {
            var alarm = document.getElementById("alarm");
            alarm.volume = 1.0;
            alarm.play().catch(function(e) {
                console.log("Lỗi phát âm thanh:", e);
            });
            task.notifyStatus = true;
            stopBell();
            setTimeout(function() {
                task.notifyStatus = false;
            }, 30000);
        }
    });
}

function stopBell() {
    alert("Chuông sẽ dừng lại sau khi bạn nhấn OK.");

    setTimeout(function() {
        var alarm = document.getElementById("alarm");
        alarm.pause();
        alarm.currentTime = 0;
        task.notifyStatus = false;
    }, 100);
}

function formatDateTime(dateString) {
    var date = new Date(dateString);

    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();

    var hours = date.getHours();
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ' ' + ampm;
}

setInterval(checkReminders, 1000);