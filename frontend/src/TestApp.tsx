import React from 'react';

function TestApp() {
  return (
    <div className="test-box">
      <h1>Hello World</h1>
      <p>This is a test component to debug rendering issues.</p>
      <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
        This text should be blue if Tailwind is working.
      </div>
    </div>
  );
}

export default TestApp;
