import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos/`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>Todo List</h1>
      <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
        Keep track of your tasks and stay organized
      </p>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        padding: '32px',
        width: '100%',
        maxWidth: '600px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Title</label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              fontSize: '14px',
              color: '#111827'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            Description (optional)
          </label>
          <textarea
            rows="3"
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              resize: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#111827'
            }}
          />
        </div>

        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: '600',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '20px', marginRight: '8px' }}>+</span> Add Todo
        </button>

        <ul style={{ marginTop: '32px', paddingLeft: 0, listStyle: 'none' }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>
                <strong style={{ color: '#111827' }}>{todo.title}</strong>
                {todo.description && (
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{todo.description}</div>
                )}
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
