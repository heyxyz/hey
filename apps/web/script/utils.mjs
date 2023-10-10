import { execSync } from 'child_process';

export const getFilesInDirectory = (directory) => {
  const EXTENSIONS_TO_INCLUDE = [
    'txt',
    'js',
    'css',
    'png',
    'jpg',
    'jpeg',
    'svg',
    'ttf',
    'ico',
    'woff',
    'woff2'
  ];

  const filesToInclude = [];
  const filesInDirectory = execSync(`find ${directory} -type f`)
    .toString()
    .split('\n');
  for (const file of filesInDirectory) {
    const extension = file.split('.').pop();
    if (EXTENSIONS_TO_INCLUDE.includes(extension) && !file.endsWith('sw.js')) {
      filesToInclude.push(file.replace(directory, ''));
    }
  }

  return filesToInclude;
};