import React from 'react';
import './styles/swiper-item.scss';

const classPrefix = 'czh-swiper-item';

const SwiperItem = (props) => {
  return (
    <div className={classPrefix} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

SwiperItem.displayName = 'SwiperItem';

export default SwiperItem;
