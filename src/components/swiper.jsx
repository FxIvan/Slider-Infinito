import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import './styles/swiper.scss';
import SwiperItem from './swiperItem';
import { handleFinalPositon } from './utils';

const classPrefix = 'czh-swiper';

const Swiper = React.forwardRef((props, ref) => {
  const [currentIndex, setCurrentIndex] = useState(props.defultIndex || 0);
  const [dragging, setDragging] = useState(false);

  const startRef = useRef(0);
  const slideRatioRef = useRef(0);
  const trackRef = useRef(null);
  const autoplayRef = useRef(false);
  const intervalRef = useRef(0);

  const { validChildren, count } = useMemo(() => {
    let count = 0;
    const validChildren = React.Children.map(props.children, (child) => {
      if (!React.isValidElement(child)) return null;
      if (child.type !== SwiperItem) {
        console.warn('Swiper children must be Swiper.Item components');
      }
      count++;
      return child;
    });

    return { validChildren, count };
  }, [props.children]);

  const getFinalPosition = (index) => {
    let finalPosition = -currentIndex * 100 + index * 100;
    if (!props.loop) return finalPosition;

    const totalWidth = count * 100;
    const flagWidth = totalWidth / 2;
    finalPosition =
      handleFinalPositon(finalPosition + flagWidth, totalWidth) - flagWidth;
    return finalPosition;
  };

  const getTransition = (position) => {
    if (dragging) return '';

    if (autoplayRef.current) {
      if (position === -100 || position === 0) {
        return 'transform 0.3s ease-out';
      } else {
        return '';
      }
    }

    if (position < -100) {
      return '';
    }

    return 'transform 0.3s ease-out';
  };

  const renderChild = () => {
    return (
      <div className={`${classPrefix}-track-inner`}>
        {React.Children.map(validChildren, (child, index) => {
          const position = getFinalPosition(index);
          return (
            <div
              className={`${classPrefix}-slide`}
              style={{
                left: `-${index * 100}%`,
                transform: `translate3d(${position}%,0,0)`,
                transition: getTransition(position),
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  };

  const getSlideRatio = (diff) => {
    const ele = trackRef.current;
    if (!ele) return 0;
    return diff / ele.offsetWidth;
  };

  const boundIndex = useCallback(
    (targetIndex) => {
      let min = 0;
      let max = count - 1;
      let ret = targetIndex;
      ret = Math.max(targetIndex, min);
      ret = Math.min(ret, max);
      return ret;
    },
    [count]
  );

  const swiperTo = useCallback(
    (finalIndex) => {
      const targetIndex = props.loop
        ? handleFinalPositon(finalIndex, count)
        : boundIndex(finalIndex);
      setCurrentIndex(targetIndex);
    },
    [boundIndex, count, props.loop]
  );

  const swiperNext = useCallback(() => {
    swiperTo(currentIndex + 1);
  }, [currentIndex, swiperTo]);

  const swiperPrev = useCallback(() => {
    swiperTo(currentIndex - 1);
  }, [currentIndex, swiperTo]);

  const handleTouchmove = (e) => {
    const currentX = e.changedTouches[0].clientX;
    const diff = startRef.current - currentX;
    slideRatioRef.current = getSlideRatio(diff);

    let slideIndex = currentIndex + slideRatioRef.current;

    if (!props.loop) {
      slideIndex = boundIndex(slideIndex);
    }

    setCurrentIndex(slideIndex);
  };

  const handleTouchend = () => {
    const index = Math.round(slideRatioRef.current);
    swiperTo(index + currentIndex);
    setDragging(false);
    window.removeEventListener('touchmove', handleTouchmove);
    window.removeEventListener('touchend', handleTouchend);
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    startRef.current = e.changedTouches[0].clientX;
    clearInterval(intervalRef.current);
    autoplayRef.current = false;
    document.addEventListener('touchmove', handleTouchmove);
    document.addEventListener('touchend', handleTouchend);
  };

  useImperativeHandle(ref, () => ({
    swiperTo,
    swiperNext,
    swiperPrev,
  }));

  useEffect(() => {
    if (!props.autoplay || dragging) return;

    intervalRef.current = window.setInterval(() => {
      autoplayRef.current = true;
      swiperNext();
    }, props.autoplayDuration);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [dragging, props.autoplay, props.autoplayDuration, swiperNext]);

  if (count === 0 || !validChildren) {
    console.warn('Swiper at least one child element is required');
    return null;
  }

  return (
    <div className={classPrefix} style={props.style}>
      <div
        className={`${classPrefix}-track`}
        onTouchStart={(e) => handleTouchStart(e)}
        ref={trackRef}
      >
        {renderChild()}
      </div>
    </div>
  );
});

Swiper.defaultProps = {
  autoplay: false,
  loop: false,
  defultIndex: 0,
  showIndicator: true,
  autoplayDuration: 3000,
};

Swiper.displayName = 'Swiper';

export default Swiper;
