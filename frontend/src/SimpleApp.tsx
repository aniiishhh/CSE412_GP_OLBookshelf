import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#0284c7' }}>Online Bookshelf</h1>
      <p>This is a simple test component to debug rendering issues.</p>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <p>If you can see this box, React is rendering correctly!</p>
      </div>
      <button 
        style={{
          marginTop: '20px',
          padding: '10px 15px',
          backgroundColor: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Click me
      </button>
    </div>
  );
};

export default SimpleApp;
