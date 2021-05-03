import { cd, mkdir, touch, rm } from 'shelljs';
import { isSmartProject, getClassName, getComponentDirName, getProjectName, getScriptType, getCreateNames } from 'share/projectHelper';

describe('Test share/projectHelper functions', () => {
  describe.each([
    [
      { title: 'Exist smart project', dir: __dirname + '/test' },
      { return: true }
    ],
    [
      { title: 'Exist smart project', dir: __dirname + '/test' },
      { return: false }
    ],
  ])('Test isSmartProject Function', (input, expected) => {
    beforeAll(() => {
      mkdir('-p', input.dir);
      if(expected.return) {
        touch([input.dir + '/package.json', input.dir + '/smart.config.yml']);
      }
      cd(input.dir);
    });
    afterEach(() => {
      rm('-rf', input.dir);
      cd('..');
    });

    it(input.title, () => {
      expect(isSmartProject()).toBe(expected.return);
    });
  });

  describe.each([
    [
      { title: 'Input "new_project_A_b-D"', dir: 'new_project_A_b-D' },
      { return: 'new_project_a_b-d' }
    ],
    [
      { title: 'Input "_project A bD"', dir: '_project A bD' },
      { return: '_project-a-bd' }
    ],
    [
      { title: 'Input " _project A  "', dir: ' _project A  ' },
      { return: '_project-a' }
    ],
  ])('Test getProjectName function', (input, expected) => {
    it(input.title, () => {
      expect(getProjectName(input.dir)).toBe(expected.return);
    });
  });

  describe.each([
    [
      { title: 'Input a invalid value', script: 'hello' },
      { return: 'js' }
    ],
    [
      { title: 'Input javascript', script: 'javascript' },
      { return: 'js' }
    ],
    [
      { title: 'Input Javascript', script: 'Javascript' },
      { return: 'js' }
    ],
    [
      { title: 'Input Ts', script: 'Ts' },
      { return: 'js' }
    ],
    [
      { title: 'Input typescript', script: 'typescript' },
      { return: 'js' }
    ],
    [
      { title: 'Input ts', script: 'ts' },
      { return: 'ts' }
    ],
  ])('Test getScriptType function', (input, expected) => {
    it (input.title, () => {
      expect(getScriptType(input.script)).toBe(expected.return);
    });
  });

  describe.each([
    [
      { title: 'input myclass', class: 'myclass' },
      { return:  'Myclass' },
    ],
    [
      { title: 'input my  class', class: 'my  class' },
      { return:  'MyClass' },
    ],
    [
      { title: 'input Myclass', class: 'Myclass' },
      { return:  'Myclass' },
    ],
    [
      { title: 'input my', class: 'my' },
      { return:  'My' },
    ],
    [
      { title: 'input my-class', class: 'my-class' },
      { return:  'MyClass' },
    ],
    [
      { title: 'input my_class', class: 'my_class' },
      { return:  'MyClass' },
    ]
  ])('Test getClassName function', (input, expected) => {
    it (input.title, () => {
      expect(getClassName(input.class)).toBe(expected.return);
    });
  });

  describe.each([
    [
      { title: 'Input roo nav', cm: 'root nav' },
      { return: 'root-nav' }
    ],
    [
      { title: 'Input roo_nav', cm: 'root_nav' },
      { return: 'root-nav' }
    ],
    [
      { title: 'Input roo-nav ', cm: 'root-nav ' },
      { return: 'root-nav' }
    ],
    [
      { title: 'Input roo nav_b', cm: 'root nav_b' },
      { return: 'root-nav-b' }
    ],
    [
      { title: 'Input nav', cm: 'nav' },
      { return: 'nav' }
    ],
  ])('Test getComponentDirName function', (input, expected) => {
    it (input.title, () => {
      expect(getComponentDirName(input.cm)).toBe(expected.return);
    });
  });

  describe.each([
    [
      { title: 'Input a', name: 'a' },
      { return: ['a'] }
    ],
    [
      { title: 'Input a,b, c', name: 'a,b, c' },
      { return: ['a', 'b', 'c'] }
    ],
    [
      { title: 'Input [a, b, c]', name: ['a', 'b', 'c'] },
      { return: ['a', 'b', 'c'] }
    ],
    [
      { title: 'Input { a: A, b: B }', name: { a: 'A', b: 'B' } },
      { return: ['A', 'B'] }
    ],
    [
      { title: 'Input a, b, a', name: 'a, b, a' },
      { return: ['a', 'b'] }
    ],
  ])('Test getCreateNames function', (input, expected) => {
    it (input.title, () => {
      expect(getCreateNames(input.name)).toStrictEqual(expected.return);
    });
  });
});
