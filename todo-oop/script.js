class Task {
  constructor({ id, name, completed }) {
    this.id = id;
    this.name = name;
    this.completed = completed;
  }
}

class Board {
  constructor({ id, title, tasks }) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  onDeleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);

    const taskContainer = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${this.id}"]`
    );
    taskContainer.remove();
  }

  onCompleteTask(taskId) {
    const completedTask = this.tasks.find((task) => task.id === taskId);
    completedTask.completed = !completedTask.completed;

    const taskContainer = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${this.id}"]`
    );
    taskContainer.classList.toggle("completed");
  }

  onAddTask(newTaskName) {
    const task = new Task({
      id: this.getNextTaskId(this.tasks),
      name: newTaskName,
      completed: false,
    });
    this.tasks.push(task);

    const tasksContainer = document.querySelector(
      `[data-board-id="${this.id}"] .tasks`
    );
    const taskContainer = this.getTaskView(task);
    tasksContainer.appendChild(taskContainer);
  }

  handleNewTaskInputKeypress(e) {
    if (e.key === "Enter") {
      this.onAddTask(e.target.value);
      e.target.value = "";
    }
  }

  getNextTaskId() {
    const lastTaskIndex = this.tasks.length - 1;
    const lastTaskId = this.tasks[lastTaskIndex]?.id;
    if (!lastTaskId) return 1;

    return lastTaskId + 1;
  }

  getTaskView(task) {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task");
    taskContainer.dataset.taskId = task.id;
    taskContainer.dataset.boardId = this.id;
    if (task.completed) {
      taskContainer.classList.add("completed");
    }

    const taskCheckbox = document.createElement("input");
    taskCheckbox.id = `checkbox-${task.id}-${Date.now()}`;
    taskCheckbox.classList.add("checkbox");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = task.completed;
    taskCheckbox.addEventListener("click", () => this.onCompleteTask(task.id));
    taskContainer.appendChild(taskCheckbox);

    const taskName = document.createElement("label");
    taskName.classList.add("task-name");
    taskName.textContent = task.name;
    taskName.htmlFor = taskCheckbox.id;
    taskContainer.appendChild(taskName);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => this.onDeleteTask(task.id));
    taskContainer.appendChild(deleteButton);

    return taskContainer;
  }
}

class Page {
  constructor({ boards, newBoardInput }) {
    this.boards = boards;
    this.newBoardInput = newBoardInput;
  }

  init() {
    const boardsContainer = document.querySelector(".boards");

    this.boards.forEach((board) => {
      const boardContainer = this.getBoardView(board);

      boardsContainer.appendChild(boardContainer);
    });

    this.newBoardInput.addEventListener(
      "keypress",
      this.handleNewBoardInputKeypress.bind(this)
    );
  }

  onDuplicateBoard(board) {
    const boardsContainer = document.querySelector(".boards");
    const newBoard = new Board(board);
    newBoard.id = this.getNextBoardId();
    newBoard.title = `${newBoard.title} Copy`;

    const boardContainer = this.getBoardView(newBoard);
    boardsContainer.appendChild(boardContainer);
    this.boards.push(newBoard);
  }

  onBoardTitleClick(board) {
    const newTitle = prompt("Novo titulo do board");
    if (!newTitle) {
      alert("Insira o novo título!");
      return;
    }

    const boardTitleElement = document.querySelector(
      `[data-board-id="${board.id}"] .board-title`
    );
    board.title = newTitle;
    boardTitleElement.textContent = newTitle;
  }

  onDeleteBoard(boardId) {
    this.boards = this.boards.filter((board) => board.id !== boardId);

    const boardContainer = document.querySelector(
      `[data-board-id="${boardId}"]`
    );
    boardContainer.remove();
  }

  onAddBoard(newBoardTitle) {
    const board = new Board({
      id: this.getNextBoardId(),
      title: newBoardTitle,
      tasks: [],
    });
    this.boards.push(board);

    const boardsContainer = document.querySelector(".boards");
    const boardContainer = this.getBoardView(board);
    boardsContainer.appendChild(boardContainer);
  }

  handleNewBoardInputKeypress(e) {
    if (e.key === "Enter") {
      this.onAddBoard(e.target.value);
      e.target.value = "";
    }
  }

  getNextBoardId() {
    const lastBoardIndex = this.boards.length - 1;
    const lastBoardId = this.boards[lastBoardIndex]?.id;
    if (!lastBoardId) return 1;

    return lastBoardId + 1;
  }

  getBoardView(board) {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board");
    boardContainer.dataset.boardId = board.id;

    const htmlRow = document.createElement("div");
    htmlRow.classList.add("row");

    const duplicateButton = document.createElement("button");
    duplicateButton.classList.add("duplicate-button");
    duplicateButton.textContent = "Duplicate board";
    duplicateButton.addEventListener("click", () =>
      this.onDuplicateBoard(board)
    );
    htmlRow.appendChild(duplicateButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => this.onDeleteBoard(board.id));
    htmlRow.appendChild(deleteButton);

    boardContainer.appendChild(htmlRow);

    const boardTitle = document.createElement("p");
    boardTitle.classList.add("board-title");
    boardTitle.textContent = board.title;
    boardTitle.addEventListener("click", () => this.onBoardTitleClick(board));
    boardContainer.appendChild(boardTitle);

    const tasksContainer = document.createElement("ul");
    tasksContainer.classList.add("tasks");
    boardContainer.appendChild(tasksContainer);

    board.tasks.forEach((task) => {
      const taskContainer = board.getTaskView(task);
      tasksContainer.appendChild(taskContainer);
    });

    const newTaskInput = document.createElement("input");
    newTaskInput.dataset.boardId = board.id;
    newTaskInput.classList.add("new-task-input");
    newTaskInput.type = "text";
    newTaskInput.placeholder = "Nova tarefa";
    newTaskInput.addEventListener("keypress", (e) =>
      board.handleNewTaskInputKeypress(e)
    );
    boardContainer.appendChild(newTaskInput);

    return boardContainer;
  }
}

const boardPessoal = new Board({
  id: 1,
  title: "Title",
  tasks: [
    new Task({ id: 1, name: "tarefa 1", completed: false }),
    new Task({ id: 2, name: "tarefa 2", completed: false }),
    new Task({ id: 3, name: "tarefa 3", completed: true }),
    new Task({ id: 4, name: "tarefa 4", completed: false }),
    new Task({ id: 5, name: "tarefa 5", completed: true }),
  ],
});

const boards = [boardPessoal];
const newBoardInput = document.querySelector(".new-board-input");
const page = new Page({ boards, newBoardInput });
page.init();
