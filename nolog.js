const readline = require('readline');

const regex = /console\.log\(([^)]+)\);?/g; // Replace with your actual regex

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  // Remove parts of the line that match the regex
  const modifiedLine = line.replace(regex, '');

  // Write the modified line to the standard output
  console.log(modifiedLine);
});