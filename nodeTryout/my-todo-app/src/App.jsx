import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('RctTodoApp_Tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  useEffect(()=>{
    localStorage.setItem('RctTodoApp_Tasks', JSON.stringify(tasks));
    console.log("local storage updated");
  }, [tasks]);

  const [filter, setFilter] = useState('all');

  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');

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

    //localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));
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
    //localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));
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
      //localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));
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

  
  
  const handleEditStart = (task)=>{
      //console.log("handle edit start");
      setEditTaskId(task.id);
      setEditText(task.text);
  };

  const handleEditSave = (taskId) =>{
    //console.log("handle edit save");
    if (editText.trim() === ''){
      alert("Edit text can not be empty!!");
      return;
    }

    const updatedTasks = tasks.map((task)=>{
      if(task.id === taskId){
        return{...task, text: editText};
      }
      return task;
    });

    setTasks(updatedTasks);
    //localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));

    setEditTaskId(null);
    setEditText('');

  };

  const handleEditCancel = () =>{
    setEditTaskId(null);
    setEditText('');
  };
  
  const handleDeleteTask = (taskIdtoDelete) => {

    const confirmDelete = window.confirm("Do you want to delete this todo item?");

    if(confirmDelete){
      const updatedTasks = tasks.filter((task) => task.id !== taskIdtoDelete);
      
      setTasks(updatedTasks);
      //localStorage.setItem('RctTodoApp_Tasks',JSON.stringify(updatedTasks));
    }
    else return;
  };




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
            <li className="taskItem" key={task.id}>
               {editTaskId===task.id ? (
                  <div className="editContainer">
                    <input 
                      type="text"
                      value={editText}
                      className="edit-input"
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEditSave(task.id)}
                    />
                    <div className="taskActionArea">
                      <button className="save-btn" onClick={()=>handleEditSave(task.id)}>Save</button>
                      <button className="cancel-btn" onClick={handleEditCancel}>Cancel</button>
                    </div>
                  </div>

                ) : (

                <div className="normalTask">
                  <div className="taskText">
                    <input 
                      type="checkbox"
                      checked={task.checked}
                      onChange={()=> handleToggleTask(task.id)}
                    />
                    <span style={{ 
                      marginLeft: '.5rem', 
                      marginRight: '.5rem',
                      textDecoration: task.checked ? 'line-through' : 'none',
                    }}>
                      {task.text}
                    </span>
                  </div>

                  <div className="taskActionArea">
                    <button className="edit-btn" onClick={() => handleEditStart(task)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={()=> handleDeleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
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

