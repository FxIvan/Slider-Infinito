import './App.css'
import Slider from './components/other/Slider';

import React, { useState } from 'react';

const totalSlides = 5;

function getInitialSlides() {
  return [4, 5, 1, 2, 3]; // centrado en 1, con dos prev y dos next
}

function LoopCarousel() {
  const [slides, setSlides] = useState(getInitialSlides);

  const moveRight = () => {
    const newSlides = [...slides];
    newSlides.shift(); // remove first
    const last = newSlides[newSlides.length - 1];
    const next = (last % totalSlides) + 1;
    newSlides.push(next);
    setSlides(newSlides);
  };

  const moveLeft = () => {
    const newSlides = [...slides];
    newSlides.pop(); // remove last
    const first = newSlides[0];
    const prev = ((first - 2 + totalSlides) % totalSlides) + 1;
    newSlides.unshift(prev);
    setSlides(newSlides);
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={moveLeft}>⬅</button>
      <div style={{ display: 'flex', width: 600, overflow: 'hidden' }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              minWidth: 200,
              height: 100,
              border: '1px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            {slide}
          </div>
        ))}
      </div>
      <button onClick={moveRight}>➡</button>
    </div>
  );
}


function App() {
  return <LoopCarousel/>
}

export default App