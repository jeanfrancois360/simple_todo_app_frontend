import React, { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';

function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    await fetch('http://localhost:8000/todos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      setTodos(data)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(()=>{
    fetchTodos();
  },[])
  const addTodo = async todo => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    await fetch(`http://localhost:8000/todos/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo)
    })
    .then(response => response.json())
    .then(data => {
      if(data.hasOwnProperty('id')){
        fetchTodos();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const updateTodo = async (id, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    let updatedTodos = todos.filter((todo) => todo.id === id).map(filtered_todo => {
      filtered_todo.text = newValue.text
      return filtered_todo;
    });
    await fetch(`http://localhost:8000/todos/${id}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodos[0])
    })
    .then(response => response.json())
    .then(data => {
      if(data.hasOwnProperty('id')){
        fetchTodos();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const removeTodo = async id => {
    await fetch(`http://localhost:8000/todos/${id}/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      if(data === "Todo was deleted"){
        fetchTodos();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const completeTodo = async id => {
    let updatedTodos = todos.filter((todo) => todo.id === id).map(filtered_todo => {  
      filtered_todo.is_complete = !filtered_todo.is_complete;
      return filtered_todo;
    });
    await fetch(`http://localhost:8000/todos/${id}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodos[0])
    })
    .then(response => response.json())
    .then(data => {
      if(data.hasOwnProperty('id')){
        fetchTodos();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;
