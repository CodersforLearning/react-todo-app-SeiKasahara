
import './App.css'

import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Load todos from local storage on mount
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    // Save todos to local storage on change
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { text: input, isDone: false, children: [] }]);
      setInput('');
    }
  };

  const handleAddNestedTodo = (index, nestedInput) => {
    const newTodos = [...todos];
    newTodos[index].children.push({ text: nestedInput, isDone: false, children: [] });
    setTodos(newTodos);
  };

  const handleToggleDone = (index) => {
    const newTodos = [...todos];
    newTodos[index].isDone = !newTodos[index].isDone;
    setTodos(newTodos);
  };

  const handleRemoveTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-app-container">
      <div className="todo-input-container">
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={handleAddTodo}>Create a task</button>
      </div>
      <div className="todo-list-container">
        {todos.map((todo, index) => (
          <TodoItem 
            key={index} 
            todo={todo} 
            index={index} 
            handleToggleDone={handleToggleDone} 
            handleRemoveTodo={handleRemoveTodo} 
            handleAddNestedTodo={handleAddNestedTodo} 
          />
        ))}
      </div>
    </div>
  );
}

function TodoItem({ todo, index, handleToggleDone, handleRemoveTodo, handleAddNestedTodo }) {
  const [nestedInput, setNestedInput] = useState('');

  return (
    <div className="todo-item">
      <span style={{ textDecoration: todo.isDone ? 'line-through' : '' }}>
        {todo.text}
      </span>
      <button onClick={() => handleToggleDone(index)}>
        {todo.isDone ? 'Tag to uncompleted' : 'Tag to completed'}
      </button>
      <button onClick={() => handleRemoveTodo(index)}>Delete task</button>
      <div>
        <input value={nestedInput} onChange={e => setNestedInput(e.target.value)} />
        <button onClick={() => {
          handleAddNestedTodo(index, nestedInput);
          setNestedInput('');
        }}>Add Subtask</button>
      </div>
      {todo.children.length > 0 && (
        <div className="nested-todo-list">
          {todo.children.map((nestedTodo, nestedIndex) => (
            <TodoItem 
              key={nestedIndex} 
              todo={nestedTodo} 
              index={nestedIndex} 
              handleToggleDone={(childIndex) => {
                const newTodos = [...todo.children];
                newTodos[childIndex].isDone = !newTodos[childIndex].isDone;
                const newParentTodos = [...todos];
                newParentTodos[index].children = newTodos;
                setTodos(newParentTodos);
              }} 
              handleRemoveTodo={(childIndex) => {
                const newTodos = [...todo.children];
                newTodos.splice(childIndex, 1);
                const newParentTodos = [...todos];
                newParentTodos[index].children = newTodos;
                setTodos(newParentTodos);
              }} 
              handleAddNestedTodo={handleAddNestedTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoApp;

