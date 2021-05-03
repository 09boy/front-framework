import { parseCliDocData, loadCliData } from 'cli';
import { SmartCliConfig } from 'types/SmartCliConfig';
import { parseBuildEnv, parseApiPathByCli, parsePortByCli, parseScriptTypeByCli, parseSmartCliByCli } from 'cli/parseFun';

describe('Test Smart Cli', () => {
  let configData: SmartCliConfig;
  beforeAll(() => {
    configData = loadCliData();
  });

  it ('#Test parseCliDocData function return Data', () => {
    const { commandOptions, inquirerOptions } = parseCliDocData(configData, []);
    expect(commandOptions.length > 0).toBeTruthy();
    expect(inquirerOptions.length > 0).toBeTruthy();
  });

  describe.each([
    [
      { title: 'value is not a valid value',  command: 'hello' },
      { return: 'Arg Error: hello not a valid command. run \'smart --help\'' }
    ],
    [
      { title: 'value is not a valid value',  command: 'crea-react' },
      { return: 'Arg Error: hello not a valid command. run \'smart --help\'' }
    ],
    [
      { title: 'value is init',  command: 'init' },
      { return: { cli: 'init' } }
    ],
    [
      { title: 'value is server',  command: 'server' },
      { return: { cli: 'server' } }
    ],
    [
      { title: 'value is create',  command: 'create' },
      { return: { cli: 'create', mode: 'normal' } }
    ],
    [
      { title: 'value is create-react',  command: 'create-react' },
      { return: { cli: 'create', mode: 'react' } }
    ],
    [
      { title: 'value is create-vue',  command: 'create-vue' },
      { return: { cli: 'create', mode: 'vue' } }
    ],
    [
      { title: 'value is create-nodejs',  command: 'create-nodejs' },
      { return: { cli: 'create', mode: 'nodejs' } }
    ],
    [
      { title: 'value is create-miniProgram',  command: 'create-miniProgram' },
      { return: { cli: 'create', mode: 'miniProgram' } }
    ],
    [
      { title: 'value is create-other',  command: 'create-other' },
      { return: 'Arg Error: hello not a valid command. run \'smart --help\'' }
    ],
    [
      { title: 'value is page',  command: 'page' },
      { return: { cli: 'page' } }
    ],
    [
      { title: 'value is component',  command: 'component' },
      { return: { cli: 'component' } }
    ],
    [
      { title: 'value is upgrade',  command: 'upgrade' },
      { return: { cli: 'upgrade' } }
    ],
  ])('# Test parseSmartCliByCli', (input, expected) => {
    it ('Command ' + input.title, () => {
      try {
        const values = parseSmartCliByCli(input.command);
        expect(values).toMatchObject(expected.return);
      } catch (e) {
        expect((e as TypeError).message).toMatch(expected.return as string);
      }
    });
  });

  describe.each([
    [
      { title: 'type is undefined',  type: undefined },
      { return: 'js' }
    ],
    [
      { title: 'type is not a valid value', type: 'hello' },
      { return: 'Error'  }
    ],
    [
      { title: 'type value is js', type: 'js' },
      { return: 'js' }
    ],
    [
      { title: 'type value is javascript', type: 'javascript' },
      { return: 'Error' }
    ],
    [
      { title: 'type value is ts', type: 'ts' },
      { return: 'ts' }
    ],
    [
      { title: 'type value is typescript', type: 'typescript' },
      { return: 'Error' }
    ],
  ])('# Test parseScriptTypeByCli function', (input, expected) => {
    it('Script Type: ' + input.title, () => {
      try {
        const scriptType = parseScriptTypeByCli(input.type);
        expect(scriptType).toBe(expected.return);
      } catch (e) {
        expect((e as TypeError).message).toMatch('Not a valid value. expected value is js、ts');
      }
    });
  });

  describe.each([
    [
      { title: 'value is undefined', port: undefined },
      { return: 'Not a valid value.' }
    ],
    [
      { title: 'value not a number', port: 'string' },
      { return: 'Not a valid value.' }
    ],
    [
      { title: 'value is a string number', port: '1000' },
      { return: 1000 }
    ],
    [
      { title: 'value length > 4', port: 45678 },
      { return: 'Port must be 4 digits.' }
    ],
    [
      { title: 'value start with 0', port: '0676' },
      { return: 'Port Cannot start with 0.' }
    ],
    [
      { title: 'value is 2345', port: 2345 },
      { return: 2345 }
    ],
  ])('# Test parsePortByCli function', (input, expected) => {
    it('Port ' + input.title, () => {
      try {
        const port = parsePortByCli(input.port);
        expect(port).toBe(expected.return);
      } catch (e) {
        expect((e as TypeError).message).toMatch(expected.return.toString());
      }
    });
  });

  describe.each([
    [
      { title: 'type is not a valid value', type: 'hello' },
      { return: 'Arg Error: hello not a valid value. you can input \'test\' | \'staging\' | \'release\'' }
    ],
    [
      { title: 'type is testing mode value', type: 'test' },
      { return: 'test' }
    ],
    [
      { title: 'type is staging mode value', type: 'staging' },
      { return: 'staging' }
    ],
    [
      { title: 'type is release mode value', type: 'release' },
      { return: 'release' }
    ],
  ])('# Test parseBuildEnv function', (input, expected) => {
    it ('Build Mode: ' + input.title, () => {
      try {
        const mode = parseBuildEnv(input.type);
        expect(mode).toBe(expected.return);
      } catch (e) {
        const message = `Arg Error: ${input.type} not a valid value. you can input 'test' | 'staging' | 'release'`;
        expect((e as TypeError).message).toMatch(message);
      }
    });
  });

  describe.each([
    [
      { title: 'value is undefined', path: undefined },
      { return: '/' }
    ],
    [
      { title: 'value is path', path: '/www/root' },
      { return: '/www/root' }
    ]
  ])('# Test parseApiPathByCli function', (input, expected) => {
    it ('Path ' + input.title, () => {
      const path = parseApiPathByCli(input.path);
      expect(path).toBe(expected.return);
    });
  });
});

