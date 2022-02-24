// import { cd, mkdir, rm } from 'shelljs';
// import { getSmartConfigureData } from "share/parseData";
// import {SmartOption, SmartTaskOption} from "types/SmartType";
// import {PROJECT_ROOT_PATH} from "share/path";
//
// describe('Test share/configHelper functions', () => {
//     describe.each([
//         [
//             { title: 'Only use upgrade cli', cliValue: { cli: 'upgrade' }, isNewProject: true },
//             { return: { cli: 'upgrade' } },
//         ],
//         [
//             { title: 'Only use server cli with default arguments', cliValue: { cli: 'server' }, isNewProject: true},
//             { return: { cli: 'server',  serverOption: { port: 4001, host: '127.0.0.1', htmlPath: `${PROJECT_ROOT_PATH}/dist/index.html` } } as SmartTaskOption },
//         ],
//         [
//             { title: 'Only use server cli with { port: 3300 } arguments', cliValue: { cli: 'server', args: { port: 3300 } }, isNewProject: true},
//             { return: { cli: 'server',  serverOption: { port: 3300, host: '127.0.0.1', htmlPath: `${PROJECT_ROOT_PATH}/dist/index.html` } } as SmartTaskOption },
//         ],
//     ])('Test parseSmartOption Function', (input, expected) => {
//         beforeAll(() => {
//             mkdir('-p', 'test-app');
//             cd('test-app');
//         });
//         afterEach(() => {
//             rm('-rf', 'test-app');
//             cd('..');
//         });
//
//         it(input.title, async () => {
//             const taskOption = await getSmartConfigureData(input.isNewProject, input.cliValue as SmartOption);
//             expect(taskOption).toEqual(expected.return);
//         });
//     });
// });