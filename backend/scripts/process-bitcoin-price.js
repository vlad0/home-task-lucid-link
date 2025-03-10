const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function processCSV(inputFile) {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({ input: fileStream });

  let jsonData = [];
  let lastTimestamp = null;
  let headerProcessed = false;
  let fileName = '';

  for await (const line of rl) {
    if (!headerProcessed) {
      headerProcessed = true;
      continue;
    }

    const columns = line.split(',');
    if (columns.length < 3) continue;

    const timestamp = parseFloat(columns[1]);
    const price = parseFloat(columns[2]);

    if (isNaN(timestamp) || isNaN(price)) continue;

    if (lastTimestamp !== null && timestamp - lastTimestamp < 1) {
      continue;
    }

    const datetime = new Date(timestamp * 1000).toISOString()
    jsonData.push({ timestamp: datetime, price });
    lastTimestamp = timestamp;
    if (!fileName) {
      fileName = `${datetime.slice(0, 10)}.json`;
    }
  }

  const outputFile = path.join(outputFolder, fileName);
  fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
  console.log(`JSON data saved to ${outputFile}`);
}

async function processFolder(inputFolder, outputFolder) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const files = fs.readdirSync(inputFolder).filter(file => file.endsWith('.csv'));
  for (const file of files) {
    const inputFile = path.join(inputFolder, file);

    await processCSV(inputFile);
  }
}

const inputFolder = '../data-source'; // Change to your input folder
const outputFolder = '../data'; // Change to your output folder
processFolder(inputFolder, outputFolder).catch(console.error);
