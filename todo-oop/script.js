class BoardList {
  constructor() {
    this.boards = [];
  }

  addBoard(board) {
    this.boards.push(board);
  }

  removeBoard(boardId) {
    this.boards = this.boards.filter((board) => board.id !== boardId);
  }

  getNextBoardId() {
    const lastBoardIndex = this.boards.length - 1;
    const lastBoardId = this.boards[lastBoardIndex]?.id;
    if (!lastBoardId) return 1;

    return lastBoardId + 1;
  }
}

class Board {
  constructor({ id, title, tasks }) {
    this.id = id;
    this.title = title;
    this.tasks = tasks || [];
  }

  setTitle(title) {
    if (!title) {
      throw new Error("title cannot be null");
    }

    this.title = title;
  }

  createDuplicate(id) {
    const newBoard = new Board({
      id,
      title: `${this.title} Copy`,
      tasks: this.tasks,
    });

    return newBoard;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  getNextTaskId() {
    const lastTaskIndex = this.tasks.length - 1;
    const lastTaskId = this.tasks[lastTaskIndex]?.id;
    if (!lastTaskId) return 1;

    return lastTaskId + 1;
  }
}

class Task {
  constructor({ id, name, completed }) {
    this.id = id;
    this.name = name;
    this.completed = completed;
  }

  complete() {
    this.completed = true;
  }

  undo() {
    this.completed = false;
  }
}

class Controller {
  constructor({ boardListView, boardView, taskView, boardList }) {
    this.boardListView = boardListView;
    this.boardView = boardView;
    this.taskView = taskView;
    this.boardList = boardList;
  }

  initialize() {
    this.boardListView.renderBoardList(this.boardList.boards);
    this.boardListView.configureNewKeyBoardInput(this.onAddBoard.bind(this));
  }

  getBoardViewHandlers() {
    return {
      duplicateButtonClickHandler: this.onDuplicateBoard.bind(this),
      deleteButtonClickHandler: this.onDeleteBoard.bind(this),
      titleClickHandler: this.onBoardTitleClick.bind(this),
      taskCheckboxClickHandler: this.onTaskCheckboxClick.bind(this),
      deleteTaskButtonClickHandler: this.onDeleteTask.bind(this),
      newTaskInputKeypressHandler: this.onAddTask.bind(this),
    };
  }

  onAddBoard(newBoardTitle) {
    const board = new Board({
      id: this.boardList.getNextBoardId(),
      title: newBoardTitle,
    });
    this.boardList.addBoard(board);
    this.boardView.renderBoard({
      board,
      ...this.getBoardViewHandlers(),
    });
  }

  onDuplicateBoard(board) {
    const newBoard = board.createDuplicate(this.boardList.getNextBoardId());
    this.boardList.addBoard(newBoard);
    this.boardView.renderBoard({
      board: newBoard,
      ...this.getBoardViewHandlers(),
    });
  }

  onDeleteBoard(boardId) {
    this.boardList.removeBoard(boardId);
    this.boardView.removeBoard(boardId);
  }

  onBoardTitleClick(boardId) {
    const board = this.boardList.boards.find((board) => board.id === boardId);
    const newTitle = prompt("Novo titulo do board");

    try {
      board.setTitle(newTitle);
      this.boardView.updateBoardTitle(boardId, newTitle);
    } catch (error) {
      alert(error.message);
    }
  }

  onTaskCheckboxClick(completed, boardId, taskId) {
    const board = this.boardList.boards.find((board) => board.id === boardId);
    const task = board.tasks.find((task) => task.id === taskId);
    if (completed) {
      task.complete();
    } else {
      task.undo();
    }

    this.taskView.toggleTaskCompletedView(boardId, taskId);
  }

  onDeleteTask(boardId, taskId) {
    const board = this.boardList.boards.find((board) => board.id === boardId);
    board.removeTask(taskId);

    this.taskView.removeTask(boardId, taskId);
  }

  onAddTask(boardId, newTaskName) {
    const board = this.boardList.boards.find((board) => board.id === boardId);
    const task = new Task({
      id: board.getNextTaskId(),
      name: newTaskName,
      completed: false,
    });
    board.addTask(task);

    this.taskView.renderTask({
      boardId,
      task,
      checkboxClickHandler: this.onTaskCheckboxClick.bind(this),
      deleteButtonClickHandler: this.onDeleteTask.bind(this),
    });
  }
}

class BoardView {
  constructor({ taskView }) {
    this.boardsContainer = document.querySelector(".boards");
    this.taskView = taskView;
  }

  renderBoard({
    board,
    duplicateButtonClickHandler,
    deleteButtonClickHandler,
    titleClickHandler,
    taskCheckboxClickHandler,
    deleteTaskButtonClickHandler,
    newTaskInputKeypressHandler,
  }) {
    const boardContainer = this.getBoardView({
      board,
      duplicateButtonClickHandler,
      deleteButtonClickHandler,
      titleClickHandler,
      taskCheckboxClickHandler,
      deleteTaskButtonClickHandler,
      newTaskInputKeypressHandler,
    });
    this.boardsContainer.appendChild(boardContainer);
  }

  removeBoard(boardId) {
    const boardContainer = document.querySelector(
      `[data-board-id="${boardId}"]`
    );
    boardContainer.remove();
  }

  updateBoardTitle(boardId, newTitle) {
    const boardTitleElement = document.querySelector(
      `[data-board-id="${boardId}"] .board-title`
    );
    boardTitleElement.textContent = newTitle;
  }

  getBoardView({
    board,
    duplicateButtonClickHandler,
    deleteButtonClickHandler,
    titleClickHandler,
    taskCheckboxClickHandler,
    deleteTaskButtonClickHandler,
    newTaskInputKeypressHandler,
  }) {
    const boardContainerView = this.getBoardContainerView(board);

    const boardActionsHeaderView = this.getBoardActionsHeaderView(
      board,
      duplicateButtonClickHandler,
      deleteButtonClickHandler
    );
    boardContainerView.appendChild(boardActionsHeaderView);

    const boardTitleView = this.getBoardTitleView(
      board.id,
      board.title,
      titleClickHandler
    );
    boardContainerView.appendChild(boardTitleView);

    this.renderBoardTasks(
      board,
      boardContainerView,
      taskCheckboxClickHandler,
      deleteTaskButtonClickHandler
    );

    const newTaskInputView = this.taskView.getNewTaskInputView(
      board.id,
      newTaskInputKeypressHandler
    );
    boardContainerView.appendChild(newTaskInputView);

    return boardContainerView;
  }

  getBoardContainerView(board) {
    const boardContainerView = document.createElement("div");
    boardContainerView.classList.add("board");
    boardContainerView.dataset.boardId = board.id;
    return boardContainerView;
  }

  getBoardActionsHeaderView(
    board,
    duplicateButtonClickHandler,
    deleteButtonClickHandler
  ) {
    const boardActionsHeaderView = document.createElement("header");
    boardActionsHeaderView.classList.add("row");

    const duplicateButtonView = this.getDuplicateButtonView(
      board,
      duplicateButtonClickHandler
    );
    boardActionsHeaderView.appendChild(duplicateButtonView);

    const deleteButtonView = this.getDeleteBoardButtonView(
      board.id,
      deleteButtonClickHandler
    );
    boardActionsHeaderView.appendChild(deleteButtonView);
    return boardActionsHeaderView;
  }

  renderBoardTasks(
    board,
    boardContainer,
    taskCheckboxClickHandler,
    deleteTaskButtonClickHandler
  ) {
    const tasksContainerView = document.createElement("ul");
    tasksContainerView.classList.add("tasks");
    boardContainer.appendChild(tasksContainerView);

    board.tasks.forEach((task) => {
      const taskContainer = this.taskView.getTaskView({
        boardId: board.id,
        task,
        checkboxClickHandler: taskCheckboxClickHandler,
        deleteButtonClickHandler: deleteTaskButtonClickHandler,
      });
      tasksContainerView.appendChild(taskContainer);
    });
  }

  getBoardTitleView(boardId, boardTitle, titleClickHandler) {
    const boardTitleView = document.createElement("p");
    boardTitleView.classList.add("board-title");
    boardTitleView.textContent = boardTitle;
    boardTitleView.addEventListener("click", () => titleClickHandler(boardId));
    return boardTitleView;
  }

  getDeleteBoardButtonView(boardId, deleteButtonClickHandler) {
    const deleteButtonView = document.createElement("button");
    deleteButtonView.classList.add("delete-button");
    deleteButtonView.textContent = "X";
    deleteButtonView.addEventListener("click", () =>
      deleteButtonClickHandler(boardId)
    );
    return deleteButtonView;
  }

  getDuplicateButtonView(board, duplicateButtonClickHandler) {
    const duplicateButtonView = document.createElement("button");
    duplicateButtonView.classList.add("duplicate-button");
    duplicateButtonView.textContent = "Duplicate board";
    duplicateButtonView.addEventListener("click", () =>
      duplicateButtonClickHandler(board)
    );
    return duplicateButtonView;
  }
}

class TaskView {
  handleNewTaskInputKeypress(onAddTask) {
    return (e) => {
      if (e.key === "Enter") {
        onAddTask(Number(e.target.dataset.boardId), e.target.value);
        e.target.value = "";
      }
    };
  }

  getTaskView({
    boardId,
    task,
    checkboxClickHandler,
    deleteButtonClickHandler,
  }) {
    const taskContainerView = this.getTaskContainerView(boardId, task);

    const taskCheckboxView = this.getTaskCheckboxView(
      boardId,
      task,
      checkboxClickHandler
    );
    taskContainerView.appendChild(taskCheckboxView);

    const taskNameView = this.getTaskNameView(task, taskCheckboxView);
    taskContainerView.appendChild(taskNameView);

    const deleteButtonView = this.getTaskDeleteButtonView(
      boardId,
      task,
      deleteButtonClickHandler
    );
    taskContainerView.appendChild(deleteButtonView);

    return taskContainerView;
  }

  getTaskDeleteButtonView(boardId, task, deleteButtonClickHandler) {
    const deleteButtonView = document.createElement("button");
    deleteButtonView.classList.add("delete-button");
    deleteButtonView.textContent = "X";
    deleteButtonView.addEventListener("click", () =>
      deleteButtonClickHandler(boardId, task.id)
    );
    return deleteButtonView;
  }

  getTaskNameView(task, taskCheckbox) {
    const taskNameView = document.createElement("label");
    taskNameView.classList.add("task-name");
    taskNameView.textContent = task.name;
    taskNameView.htmlFor = taskCheckbox.id;
    return taskNameView;
  }

  getTaskCheckboxView(boardId, task, checkboxClickHandler) {
    const taskCheckboxView = document.createElement("input");
    taskCheckboxView.id = `checkbox-${task.id}-${Date.now()}`;
    taskCheckboxView.classList.add("checkbox");
    taskCheckboxView.type = "checkbox";
    taskCheckboxView.checked = task.completed;
    taskCheckboxView.addEventListener("click", (e) =>
      checkboxClickHandler(e.target.checked, boardId, task.id)
    );
    return taskCheckboxView;
  }

  getTaskContainerView(boardId, task) {
    const taskContainerView = document.createElement("li");
    taskContainerView.classList.add("task");
    taskContainerView.dataset.taskId = task.id;
    taskContainerView.dataset.boardId = boardId;
    if (task.completed) {
      taskContainerView.classList.add("completed");
    }
    return taskContainerView;
  }

  getNewTaskInputView(boardId, newTaskInputKeypressHandler) {
    const newTaskInputView = document.createElement("input");
    newTaskInputView.dataset.boardId = boardId;
    newTaskInputView.classList.add("new-task-input");
    newTaskInputView.type = "text";
    newTaskInputView.placeholder = "Nova tarefa";
    newTaskInputView.addEventListener(
      "keypress",
      this.handleNewTaskInputKeypress(newTaskInputKeypressHandler)
    );

    return newTaskInputView;
  }

  toggleTaskCompletedView(boardId, taskId) {
    const taskContainerView = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${boardId}"]`
    );
    taskContainerView.classList.toggle("completed");
  }

  removeTask(boardId, taskId) {
    const taskContainer = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${boardId}"]`
    );
    taskContainer.remove();
  }

  renderTask({
    boardId,
    task,
    checkboxClickHandler,
    deleteButtonClickHandler,
  }) {
    const tasksContainerView = document.querySelector(
      `[data-board-id="${boardId}"] .tasks`
    );

    const taskContainerView = this.getTaskView({
      boardId,
      task,
      checkboxClickHandler,
      deleteButtonClickHandler,
    });
    tasksContainerView.appendChild(taskContainerView);
  }
}

class BoardListView {
  constructor({ boardView }) {
    this.boardsContainer = document.querySelector(".boards");
    this.newBoardInput = document.querySelector(".new-board-input");
    this.boardView = boardView;
  }

  configureNewKeyBoardInput(command) {
    this.newBoardInput.addEventListener(
      "keypress",
      this.handleNewBoardInputKeyPress(command)
    );
  }

  handleNewBoardInputKeyPress(onAddBoard) {
    return (e) => {
      if (e.key === "Enter") {
        onAddBoard(e.target.value);
        e.target.value = "";
      }
    };
  }

  renderBoardList(boardList) {
    boardList.forEach((board) => {
      const boardContainer = this.boardView.getBoardView(board);

      this.boardsContainer.appendChild(boardContainer);
    });
  }
}

const boardList = new BoardList();
const taskView = new TaskView();
const boardView = new BoardView({
  taskView,
});
const boardListView = new BoardListView({
  boardView,
});
const controller = new Controller({
  boardListView,
  boardView,
  taskView,
  boardList,
});

try {
  controller.initialize();
} catch (error) {
  console.error("error on initializing", error);
}
