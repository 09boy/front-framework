import './style';
import React, { FC } from 'react';
import { RouteProps } from 'react-router-dom';
import Cube from './Cube';

const HomeScreen: FC<RouteProps> = () => {
  return (
    <section className='Home-Page Page'>
      <Cube />
    </section>
  );
};

export default HomeScreen;
