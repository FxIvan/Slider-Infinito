import React, { useState, useRef } from 'react';

const totalSlides = 5;
const slideWidth = 200;

function getInitialSlides() {
  return [4, 5, 1, 2, 3]; // centrado en 1
}

function LoopCarousel() {
  const [slides, setSlides] = useState(getInitialSlides);
  const [offset, setOffset] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);

  const moveRightSlide = () => {
    setSlides((prev) => {
      const newSlides = [...prev];
      newSlides.shift();
      const last = newSlides[newSlides.length - 1];
      newSlides.push((last % totalSlides) + 1);
      return newSlides;
    });
  };

  const moveLeftSlide = () => {
    setSlides((prev) => {
      const newSlides = [...prev];
      newSlides.pop();
      const first = newSlides[0];
      newSlides.unshift(((first - 2 + totalSlides) % totalSlides) + 1);
      return newSlides;
    });
  };

  const handleMouseDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    let newOffset = offset + delta;

    while (newOffset > slideWidth) {
      moveLeftSlide();
      newOffset -= slideWidth;
      startX.current += slideWidth;
    }

    while (newOffset < -slideWidth) {
      moveRightSlide();
      newOffset += slideWidth;
      startX.current -= slideWidth;
    }

    setOffset(newOffset);
    startX.current = e.clientX;
  };

  const handleMouseUp = () => {
    dragging.current = false;
    // No autoajuste, se mantiene en el lugar que quedó
  };

  const handleTouchStart = (e) => {
    dragging.current = true;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!dragging.current) return;
    const delta = e.touches[0].clientX - startX.current;
    let newOffset = offset + delta;

    while (newOffset > slideWidth) {
      moveLeftSlide();
      newOffset -= slideWidth;
      startX.current += slideWidth;
    }

    while (newOffset < -slideWidth) {
      moveRightSlide();
      newOffset += slideWidth;
      startX.current -= slideWidth;
    }

    setOffset(newOffset);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    // Queda en la posición actual sin ajustar
  };

  const getColor = (index) => {
    switch (index) {
      case 1: return 'red';
      case 2: return 'blue';
      case 3: return 'green';
      case 4: return 'yellow';
      case 5: return 'purple';
      default: return 'black';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          overflow: 'hidden',
          width: slideWidth * 3,
          cursor: dragging.current ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: 'flex',
            transform: `translateX(${offset}px)`,
            transition: dragging.current ? 'none' : 'transform 0.2s ease'
          }}
        >
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
    </div>
  );
}

function App() {
  return <LoopCarousel />;
}

export default App;
