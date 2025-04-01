document.querySelector("ul").addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    event.target.classList.toggle("checked");
  } else if (event.target.tagName === "SPAN") {
    event.target.parentElement.remove();
  }
});

document.querySelector("ul").addEventListener("dblclick", (event) => {
  if (event.target.tagName === "LI") {
    editTask(event.target);
  }
});

document.getElementById("myInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    newElement();
  }
});

const editTask = (element) => {
  let oldValue = element.firstChild.textContent.trim();
  let input = document.createElement("input");

  input.type = "text";
  input.value = oldValue;
  input.className = "editInput";

  element.innerHTML = "";
  element.appendChild(input);
  input.focus();

  input.addEventListener("blur", () => {
    saveTask(element, input, oldValue);
  });
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      saveTask(element, input, oldValue);
    }
  });
};

const saveTask = (element, input, oldValue) => {
  let newValue = input.value.trim();
  if (!newValue) {
    alert("You must write something!");
    element.innerHTML = `${oldValue} <span class= 'close'>x</span>`;

    return;
  } else {
    element.innerHTML = `${newValue} <span class= 'close'>x</span>`;
  }
};
const newElement = () => {
  var input = document.getElementById("myInput");
  var inputValue = input.value.trim();

  if (!inputValue) {
    alert("You must write something!");
    return;
  }
  var li = document.createElement("li");
  li.innerHTML = `${inputValue} <span class = "close">x</span>`;

  document.getElementById("myUL").appendChild(li);
  input.value = "";
};
