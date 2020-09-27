let lists = [
  {
    name: "List 1",
    tasks: [
      {
        title: "task 1",
        id: "1233",
        complete: true,
      },
      {
        title: "task 3",
        id: "122121",
        complete: false,
      },
    ],
    id: "msdsd",
  },
];

var selectedListId = null;

//Query Selectors

const listsUL = document.querySelector("[data-lists]");
const listForm = document.querySelector("[data-list-form]");
const taskForm = document.querySelector("[data-task-form]");
const taskInput = document.querySelector("[data-task-input]");
const listInput = document.querySelector("[data-list-input]");
const taskContainer = document.querySelector("[data-task-container]");
const taskList = document.querySelector("[data-task-list]");
const taskHeader = document.querySelector("[data-task-header]");
const taskTemplate = document.querySelector("#task-template");
const deleteList = document.querySelector("[data-delete-list]");
const deleteCompletedTask = document.querySelector(
  "[data-delete-completed-tasks]"
);

//Functions

function render() {
  clearElement(listsUL);
  showLists();

  const selectedList = lists.find((list) => list.id === selectedListId);

  if (selectedListId == null) {
    taskContainer.style.display = "none";
  } else {
    taskContainer.style.display = "";
    renderTaskHeader(selectedList);
    clearElement(taskList);
    renderTaskList(selectedList);
  }
}

function showLists() {
  lists.forEach((list) => {
    const listLi = document.createElement("li");
    listLi.dataset.listId = list.id;
    listLi.classList.add("list");
    listLi.innerText = list.name;
    if (list.id === selectedListId) {
      listLi.classList.add("active");
    }
    listsUL.appendChild(listLi);
  });
}

function renderTaskHeader(selectedList) {
  const taskHeading = taskHeader.querySelector(".task-heading");
  const taskCount = taskHeader.querySelector(".task-count");
  const noOfTasksIncomplete = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskRenderText = noOfTasksIncomplete === 1 ? "task" : "tasks";
  taskHeading.innerText = selectedList.name;
  taskCount.innerText = `${noOfTasksIncomplete} ${taskRenderText} remaining`;
}

function renderTaskList(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskEl = document.importNode(taskTemplate.content, true);
    const checkbox = taskEl.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskEl.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.title);
    taskList.append(taskEl);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createList(name) {
  return { name: name, tasks: [], id: Date.now().toString() };
}
function createTask(name) {
  return { title: name, id: Date.now().toString(), complete: false };
}

function saveAndRender() {
  render();
}

//EVENT LISTENERS
listsUL.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

listForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = listInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  listInput.value = null;
  lists.push(list);
  saveAndRender();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedList = lists.find((list) => list.id === selectedListId);
  const taskName = taskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  taskInput.value = null;
  selectedList.tasks.push(task);
  saveAndRender();
});

taskList.addEventListener("change", (e) => {
  console.log(e.target.checked);
  let selectedTaskId = e.target.id;
  let selectedList = lists.find((list) => list.id === selectedListId);
  let selectedTask = selectedList.tasks.find(
    (task) => task.id === selectedTaskId
  );
  selectedTask.complete = e.target.checked;
});

deleteList.addEventListener("click", (e) => {
  listsNew = lists.filter((list) => list.id !== selectedListId);
  lists = listsNew;
  selectedListId = null;
  saveAndRender();
});

deleteCompletedTask.addEventListener("click", (e) => {
  let selectedList = lists.find((list) => list.id === selectedListId);
  let taskList = selectedList.tasks;
  let newTaskList = taskList.filter((task) => !task.complete);
  selectedList.tasks = newTaskList;
  saveAndRender();
});
//Render
render();
