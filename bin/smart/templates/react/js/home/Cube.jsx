import React, { useState, useRef, useEffect, useCallback } from 'react';
import logoPng from 'assets/images/smart.logo.png';

const percent = 90 / 400;

export default function Cube() {
  const wrapperRef = useRef(null);
  const prePositionRef = useRef({preX: 0, preY: 0});
  const isDragRef = useRef(false);
  const [status, setStatus] = useState(true);

  const updateTransform = useCallback((x, y) => {
    const { preX, preY} = prePositionRef.current;
    const distanceX = Math.floor((x - preX) * percent);
    const distanceY = Math.floor((y - preY) * percent);
    let roteX = 0;
    let roteY = 0;
    let timer = -1;

    if (Math.abs(distanceX) > 2) {
      roteX = distanceX;
    }
    if (Math.abs(distanceY) > 2) {
      roteY = distanceY;
    }
    console.log(distanceX, distanceY);
    const target = wrapperRef.current;
    const routeValues =  target.style.transform.split(')');
    let [routeX, routeY] = routeValues.map(str =>  str.trim().split('(')[1]).filter(m => m !== undefined).map(s => Number(s.split('deg')[0]));
    routeX = routeX || 0;
    routeY = routeY || 0;
    const newX = (routeX - roteY);
    const newY = (routeY - roteX);
    target.style.transform = `rotateX(${newX}deg) rotateY(${newY}deg)`;

    clearTimeout(timer);
    timer = setTimeout(() => {
      prePositionRef.current = {preX: x, preY: y};
    }, 50);
  }, []);

  const onMouseOverHandle = useCallback(() => {
    setStatus(false);
  }, []);

  const onMouseLeaveHandle = useCallback(() => {
    isDragRef.current = false;
    setStatus(true);
  }, []);

  const onMouseDownHandle = useCallback((e) => {
    let { clientX, clientY, touches } = e;
    clientX = clientX || touches[0].clientX;
    clientY = clientY || touches[0].clientY;
    isDragRef.current = true;
    prePositionRef.current = {preX: clientX, preY: clientY};
    setStatus(false);
    console.log(e);
  }, []);

  const onMouseUpHandle = useCallback(() => {
    isDragRef.current = false;
  }, []);

  const onMouseMoveHandle = useCallback((e) => {
    let { clientX, clientY, touches } = e;
    clientX = clientX || touches[0].clientX;
    clientY = clientY || touches[0].clientY;
    if (isDragRef.current) {
      updateTransform(clientX, clientY);
    }
  }, [updateTransform]);


  useEffect(() => {
    let timer = -1;
    if (status && wrapperRef.current) {
      timer = setInterval(() => {
        const { preX, preY } = prePositionRef.current;
        updateTransform(preX + 15, preY);
      }, 33);
    } else {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [status, updateTransform]);

  return (
    <div className='Cube'>
      <div className='Cube_Wrapper'
           ref={wrapperRef}
           onMouseUp={onMouseUpHandle}
           onMouseDown={onMouseDownHandle}
           onMouseMove={onMouseMoveHandle}
           onMouseOver={onMouseOverHandle}
           onMouseLeave={onMouseLeaveHandle}
           onTouchStart={onMouseDownHandle}
           onTouchMove={onMouseMoveHandle}
           onTouchEnd={onMouseUpHandle}
      >
        <div className='Cube_font face'>
          <div className='Cube_content'><h5>React Application</h5></div>
        </div>
        <div className='Cube_top face'>
          <div className='Cube_content'><img src={logoPng} alt='logo' /></div>
        </div>
        <div className='Cube_bottom face'>
          <div className='Cube_content'>
            <div>
              <h6>Base</h6>
              <h5>Webpack 5.xx</h5>
            </div>
          </div>
        </div>
        <div className='Cube_left face'>
          <div className='Cube_content'>
            <div>
              <h5>Babel 7.xx</h5>
              <h6>Node 12.xx</h6>
            </div>
          </div>
        </div>
        <div className='Cube_right face'>
          <div className='Cube_content'>
            <div>
              <h5>Eslint</h5>
              <h5>Jest</h5>
            </div>
          </div>
        </div>
        <div className='Cube_back face'>
          <div className='Cube_content'>
            <div>
              <h6>Ts Tsx</h6>
              <h5>Js Jsx</h5>
              <h6>Css Scss Less</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
