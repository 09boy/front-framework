import { getConfigData } from 'share/smartHelper';
import { exec } from 'child_process';
import { SMART_ROOT_PATH } from 'share/path';

export async function build(option?: Record<string, any>): Promise<void> {

  const configData = await getConfigData(option);
  process.env.buildData = JSON.stringify(configData);
  const child = exec(`${SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${SMART_ROOT_PATH}/dist/@webpack/index.js --color`);

  child.stdout?.on('data', function(d) {
    console.log(d);
  })
  child.stdout?.on('end', function() {
    console.log('** build end **')
  })
}

export function upgrade(): void {
  //
}