import React, { useRef, useEffect, useState } from 'react';
import './slider.scss'; // Asegúrate de tener estilos para .slide, .slider, etc.

const Slider = ({ slides }) => {
  const sliderRef = useRef(null);
  const slidesRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [allowShift, setAllowShift] = useState(true);

  const pos = useRef({
    posX1: 0,
    posX2: 0,
    posInitial: 0,
    posFinal: 0,
    slideSize: 0
  });

  useEffect(() => {
    const items = slidesRef.current;
    const slideElements = items.getElementsByClassName('slide');
    const firstSlide = slideElements[0];
    const lastSlide = slideElements[slideElements.length - 1];

    const cloneFirst = firstSlide.cloneNode(true);
    const cloneLast = lastSlide.cloneNode(true);

    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);

    pos.current.slideSize = firstSlide.offsetWidth;
    sliderRef.current.classList.add('loaded');

    items.addEventListener('transitionend', checkIndex);

    return () => {
      items.removeEventListener('transitionend', checkIndex);
    };
  }, []);

  const dragStart = (e) => {
    e.preventDefault();
    pos.current.posInitial = slidesRef.current.offsetLeft;

    if (e.type === 'touchstart') {
      pos.current.posX1 = e.touches[0].clientX;
    } else {
      pos.current.posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  };

  const dragAction = (e) => {
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    pos.current.posX2 = pos.current.posX1 - currentX;
    pos.current.posX1 = currentX;

    slidesRef.current.style.left = `${slidesRef.current.offsetLeft - pos.current.posX2}px`;
  };

  const dragEnd = () => {
    pos.current.posFinal = slidesRef.current.offsetLeft;
    const threshold = 100;

    if (pos.current.posFinal - pos.current.posInitial < -threshold) {
      shiftSlide(1, true);
    } else if (pos.current.posFinal - pos.current.posInitial > threshold) {
      shiftSlide(-1, true);
    } else {
      slidesRef.current.style.left = `${pos.current.posInitial}px`;
    }

    document.onmouseup = null;
    document.onmousemove = null;
  };

  const shiftSlide = (dir, isDrag = false) => {
    if (!allowShift) return;
    const slideSize = pos.current.slideSize;
    const items = slidesRef.current;

    setAllowShift(false);
    items.classList.add('shifting');

    const offset = items.offsetLeft + (dir === -1 ? slideSize : -slideSize);
    items.style.left = `${offset}px`;
    setIndex((prev) => prev + dir);
  };

  const checkIndex = () => {
    const slideSize = pos.current.slideSize;
    const slidesCount = slides.length;
    const items = slidesRef.current;

    items.classList.remove('shifting');

    let newIndex = index;

    if (index === -1) {
      items.style.left = `${-(slidesCount * slideSize)}px`;
      newIndex = slidesCount - 1;
    }

    if (index === slidesCount) {
      items.style.left = `${-slideSize}px`;
      newIndex = 0;
    }

    setIndex(newIndex);
    setAllowShift(true);
  };

  return (
    <div className="slider" ref={sliderRef}>
      <div
        className="slides"
        ref={slidesRef}
        onMouseDown={dragStart}
        onTouchStart={dragStart}
        onTouchEnd={dragEnd}
        onTouchMove={dragAction}
        style={{ left: `-${pos.current.slideSize}px` }}
      >
        {slides.map((slide, idx) => (
          <div className="slide" key={idx}>
            {slide}
          </div>
        ))}
      </div>
      <button id="prev" onClick={() => shiftSlide(-1)}>‹</button>
      <button id="next" onClick={() => shiftSlide(1)}>›</button>
    </div>
  );
};

export default Slider;
