import { useEffect } from 'react';

export default function AboutScreen () {
  useEffect(() => {
    console.log('About Page');
  }, []);
  return (
    <h1>Welcome About</h1>
  );
}