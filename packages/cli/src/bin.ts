#!/usr/bin/env node

import path from 'path';
import process from 'process';
import { Command } from 'commander';
import fs from 'fs-extra';
import { flattenObject } from '@translator-app/core';
import * as ExcelJS from 'exceljs';

const program = new Command();
program.version('0.0.1');

async function transform(inputFilePath: string, options: { outputFile?: string }) {
  inputFilePath = path.resolve(inputFilePath);
  let inputFileExtension = path.extname(inputFilePath);
  let outputExtension = inputFileExtension === '.json' ? '.xlsx' : '.json';
  let outputFilePath = options?.outputFile
    ? path.resolve(options.outputFile)
    : inputFilePath.replace(inputFileExtension, outputExtension);

  // Ensure output directory exists
  await fs.ensureDir(path.dirname(outputFilePath));

  if (inputFileExtension === '.json') {
    let inputFileContent = await fs.readFile(inputFilePath, 'utf-8');
    let inputValue = flattenObject(JSON.parse(inputFileContent));
    let workbook = new ExcelJS.Workbook();
    let sheet = workbook.addWorksheet('Translations', {
      properties: {
        defaultColWidth: 50,
      },
      views: [
        {
          zoomScale: 200,
        },
      ],
    });
    sheet.addRows(
      Object.keys(inputValue).map((key) => {
        return [key, inputValue[key]];
      })
    );

    await workbook.xlsx.writeFile(outputFilePath);
  } else {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);
    let worksheet = workbook.worksheets[0];
    let keyColumn = worksheet.getColumn(1);
    let valueColumn = worksheet.getColumn(2);

    let keys = [];
    let values = [];

    keyColumn.eachCell((cell) => {
      keys.push(cell.value);
    });

    valueColumn.eachCell((cell) => {
      values.push(cell.value);
    });

    let outputObject = {};
    for (let i = 0; i < keys.length; i++) {
      if (values.length <= i) {
        break;
      }

      outputObject[keys[i]] = values[i];
    }
    
    let stringified = JSON.stringify(outputObject, null, ' '.repeat(2));
    await fs.writeFile(outputFilePath, stringified, 'utf-8');
  }
}

async function main() {
  try {
    program
      .command('convert <pathname>')
      .description('Convert between json <-> Excel')
      .option('-o, --output-file <pathname>', 'The target file path, default to input path with .json <-> .xlsx')
      .action(transform);

    await program.parseAsync(process.argv);
  } catch (err) {
    console.error(err);
  }
}

main();
