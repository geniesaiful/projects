import { useState } from "react";
import "./App.css";

function App() {

  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('RctTodoApp_Tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState('all');

  const handleAddTask = () => {
    if(taskInput.trim() === ''){
      alert('write something');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskInput,
      checked: false
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);  

    localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));
    setTaskInput(''); 
  }
  const handleToggleTask = (taskIdtoToggle) => {
    const updatedTasks= tasks.map((task)=>{
      if(task.id === taskIdtoToggle){
        return{...task, checked: !task.checked};
        }
        return task;
      });

    setTasks(updatedTasks);     
    localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));
  };

  const handleClearDone = () => {
    if (doneTasks == 0){
      alert("No completed Task!");
      return;
    }

    const confirmClear = window.confirm("Are you sure you want to delete completed tasks?");

    if(confirmClear){
      const updatedTasks = tasks.filter((task) => !task.checked);
      setTasks(updatedTasks);
      localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));
    }
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task)=> task.checked).length;
  const remainingTasks = totalTasks - doneTasks;

  const filteredTasks = tasks.filter((task) => {
      if( filter === 'completed') return task.checked;
      if( filter === 'remaining') return !task.checked;
      return true;
  });

  return(
    <div className="mainContainer" style={{padding: '2rem', fontFamily: 'arial' }}>
      <h3>TO-DO List</h3>
      <div className="inputContainer">
        <input 
        type="text"
        placeholder="Write the task"
        value={taskInput}
        className="task-input"
        onChange={(e) => setTaskInput(e.target.value)}
        />
        <button className="add-btn" onClick={handleAddTask}>Add</button>

      </div>

      <div className="statBar">
        <span>Total: {totalTasks}</span>
        <span>Done: {doneTasks}</span>
        <span>Remaining: {remainingTasks}</span>
      </div>

      <div className='filterBar'>
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}>
          All
        </button>
        <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => setFilter('completed')}>
          Completed
        </button>
        <button className={`filter-btn ${filter === 'remaining' ? 'active' : ''}`}
        onClick={() => setFilter('remaining')}>
          Reamaining
        </button>
      
      </div>
   
      <div className="tasksContainer">
        <ul className="taksList">
          {filteredTasks.map((task)=> (
            <li key={task.id}>
              <input 
                type="checkbox"
                checked={task.checked}
                onChange={()=> handleToggleTask(task.id)}
              />
              <span style={{ 
                marginLeft: '.5rem', 
                textDecoration: task.checked ? 'line-through' : 'none',
              }}>
                {task.text}
              </span>
            </li>
          ))}

        </ul>
      </div>
      <div className="clearBar">
        <button className="clear-btn" onClick={handleClearDone}>
          Clear Done Tasks
        </button>
      </div>
    </div>
    
  );
}



export default App;

