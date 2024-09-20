import React, { useState, useEffect } from "react";
import '../App.css'; 

const getTasksFromLocalStorage = () => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
};

const TodoApp = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("weekly");
  const [tasks, setTasks] = useState(getTasksFromLocalStorage());
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title || !date) {
      alert("Please fill in all fields");
      return;
    }

    if (tasks.find((task) => task.title === title)) {
      alert("Task title already exists!");
      return;
    }

    const newTask = { title, date, type, completed: false, deleted: false };
    setTasks([...tasks, newTask]);
    setTitle("");
    setDate("");
  };

  const editTask = (taskToEdit) => {
    const updatedTitle = prompt("Edit Title", taskToEdit.title);
    const updatedDate = prompt("Edit Date", taskToEdit.date);
    const updatedType = prompt("Edit Type (weekly/monthly)", taskToEdit.type);

    setTasks(
      tasks.map((task) =>
        task.title === taskToEdit.title
          ? { ...task, title: updatedTitle, date: updatedDate, type: updatedType }
          : task
      )
    );
  };

  const completeTask = (taskToComplete) => {
    setTasks(
      tasks.map((task) =>
        task.title === taskToComplete.title ? { ...task, completed: true } : task
      )
    );
  };

  const deleteTask = (taskToDelete) => {
    setTasks(
      tasks.map((task) =>
        task.title === taskToDelete.title ? { ...task, deleted: true } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "completed") return task.completed && !task.deleted;
    if (activeTab === "deleted") return task.deleted;
    if (filterType === "weekly") return task.type === "weekly" && !task.deleted;
    if (filterType === "monthly") return task.type === "monthly" && !task.deleted;
    return !task.deleted;
  });

  return (
    <div className="mainContainer">
        <div className="container">
      <div className="inputContainer">
        <h1 className="heading">Todo List</h1>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
          <select value={type} onChange={(e) => setType(e.target.value)} className="input">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button onClick={addTask} className="addButton">Add Task</button>
        </div>

        <div className="tabsContainer">
          <button onClick={() => setActiveTab("all")} className="tabButton">
            All Tasks
          </button>
          <button onClick={() => setActiveTab("completed")} className="tabButton">
            Completed Tasks
          </button>
          <button onClick={() => setActiveTab("deleted")} className="tabButton">
            Deleted Tasks
          </button>
        </div>

        <div className="filterContainer">
          <button onClick={() => setFilterType("all")} className="filterButton">
            All Tasks
          </button>
          <button onClick={() => setFilterType("weekly")} className="filterButton">
            Weekly Tasks
          </button>
          <button onClick={() => setFilterType("monthly")} className="filterButton">
            Monthly Tasks
          </button>
        </div>
      </div>

      <div className="taskListContainer">
        <ul className="taskList">
          {filteredTasks.map((task) => (
            <li key={task.title} className="taskItem" style={{ backgroundColor: task.completed ? '#d4edda' : task.deleted ? '#f8d7da' : '#fff' }}>
              <strong>{task.title}</strong> | {task.date} | {task.type}
              {task.completed && <span className="completedText"> (Completed)</span>}
              {task.deleted && <span style={{ color: 'red', marginLeft: '10px' }}> (Deleted)</span>}
              {!task.completed && !task.deleted && (
                <>
                  <button onClick={() => completeTask(task)} className="CompleteButton">
                    Complete
                  </button>
                  <button onClick={() => deleteTask(task)} className="deleteButton">
                    Delete
                  </button>
                  <button onClick={() => editTask(task)} className="editButton">
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default TodoApp;
