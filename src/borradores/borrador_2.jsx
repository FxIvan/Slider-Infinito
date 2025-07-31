import React, { useState, useRef } from 'react';
import './App.css'

function getInitialSlides() {
  return [4, 5, 1, 2, 3]; // centrado en 1, con dos prev y dos next
}


const totalSlides = 5;
const slideWidth = 200;

function LoopCarousel() {
  const [slides, setSlides] = useState(getInitialSlides);
  const startX = useRef(null);

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

  // Eventos de drag
  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (startX.current === null) return;

    const diff = e.clientX - startX.current;

    if (diff > slideWidth / 2) {
      moveLeft();
    } else if (diff < -slideWidth / 2) {
      moveRight();
    }

    startX.current = null;
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const diff = touch.clientX - startX.current;

    if (diff > slideWidth / 2) {
      moveLeft();
    } else if (diff < -slideWidth / 2) {
      moveRight();
    }

    startX.current = null;
  };

  const getColor = (indice) => {
    switch (indice) {
      case 1:
        return 'red';
      case 2:
        return 'blue';
      case 3:
        return 'green';
      case 4:
        return 'yellow';
      case 5:
        return 'purple';
      default:
        return 'black';
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={moveLeft}>⬅</button>

      <div
        style={{ overflow: 'hidden', width: slideWidth * 3 }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{ display: 'flex' }}>
          {slides.map((slide, i) => (
            <div
              key={i}
              style={{
                minWidth: slideWidth,
                height: 100,
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                userSelect: 'none',
                backgroundColor: getColor(slide)
              }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button onClick={moveRight}>➡</button>
    </div>
  );
}



function App() {
  return <LoopCarousel/>
}

export default App