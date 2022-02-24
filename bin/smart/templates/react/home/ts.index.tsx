import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  useEffect(() => {
    console.log('Home Page');
  }, []);

  return (
    <div>
      <h1>Welcome Home</h1>
      <Link to='/about'>Go To About</Link>
    </div>
  );
}