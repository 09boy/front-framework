import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

jest.mock('fs');
jest.mock('path');
jest.mock('child_process');

function sum(a: number, b: number): number {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  // child_process.exec('cd ../../../');
  console.log(__dirname, process.cwd(), path.resolve(__dirname));
  expect(sum(1, 2)).toBe(3);
});