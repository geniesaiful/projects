import { useState } from "react";

function App() {

  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);

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
  
    setTasks([...tasks, newTask]);  
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
  };


  return(
    <div style={{padding: '2rem', fontFamily: 'ariel' }}>
      <h3>TO-DO List</h3>
      
      
      
      <div>
        <input 
        type="text"
        placeholder="Write the task"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>

      </div>

      <ul style={{padding: '1rem', listStyle: 'none', marginTop: '.2rem'}}>
        {tasks.map((task)=> (
          <li key={task.id}>
            <input 
              type="checkbox"
              checked={task.checked}
              onChange={()=> handleToggleTask(task.id)}
            />
            <span>
              {task.text}
            </span>
          </li>
        ))}

      </ul>
    </div>
    
  );
}



export default App;

