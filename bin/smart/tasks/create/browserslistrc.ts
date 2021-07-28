const browserslistrcData = [
  '# Browsers that we support',
  '',
  'defaults',

  'not IE 11',

  '> 0.25%',
  '# current node',
  'supports es6-module'
];

export function getBrowserslistrcConfigData(): string[] {
  return [...browserslistrcData];
}
