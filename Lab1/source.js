const fs = require("fs");
const { type } = require("os");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePathInputCaeser = path.join(__dirname, "inputCaeser.txt");
const filePathOutputCaeser = path.join(__dirname, "outputCaeser.txt");
const filePathInputVigenere = path.join(__dirname, "inputVigenere.txt");
const filePathOutputVigenere = path.join(__dirname, "outputVigenere.txt");

const russianAlphabet = [];
const startCharCodeLower = "а".charCodeAt(0);
const endCharCodeLower = "я".charCodeAt(0);
for (
  let charCode = startCharCodeLower;
  charCode <= endCharCodeLower;
  charCode++
) {
  russianAlphabet.push(String.fromCharCode(charCode));
}
russianAlphabet.splice(6, 0, "ё");

function getText(filePathInputCaeser) {
  data = fs.readFileSync(filePathInputCaeser, "utf8");
  return data;
}

// CAESER CIPHER

function caeserIn(text, shift) {
  fs.truncateSync(filePathOutputCaeser, 0);
  let data = "";

  for (let i = 0; i < text.length; ++i) {
    let isUpper = text[i].toUpperCase() == text[i];

    if (text[i].toLowerCase() >= "a" && text[i].toLowerCase() <= "z") {
      let newCharCode = (text[i].toLowerCase().charCodeAt(0) - 96 + shift) % 26;

      data = isUpper
        ? String.fromCharCode(newCharCode + 96).toUpperCase()
        : String.fromCharCode(newCharCode + 96);
    } else if (russianAlphabet.includes(text[i].toLowerCase())) {
      const index = russianAlphabet.indexOf(text[i].toLowerCase());
      const newIndex = (index + shift) % 33;
      data = isUpper
        ? russianAlphabet[newIndex].toUpperCase()
        : russianAlphabet[newIndex];
    } else {
      data = text[i];
    }

    fs.appendFileSync(filePathOutputCaeser, data, "utf8");
  }
}

function caeserOut(text, shift) {
  fs.truncateSync(filePathOutputCaeser, 0);
  let data = "";

  for (let i = 0; i < text.length; ++i) {
    let isUpper = text[i].toUpperCase() == text[i];

    if (text[i].toLowerCase() >= "a" && text[i].toLowerCase() <= "z") {
      let newCharCode =
        (text[i].toLowerCase().charCodeAt(0) - 96 - shift + 26) % 26;

      data = isUpper
        ? String.fromCharCode(newCharCode + 96).toUpperCase()
        : String.fromCharCode(newCharCode + 96);
    } else if (russianAlphabet.includes(text[i].toLowerCase())) {
      const index = russianAlphabet.indexOf(text[i].toLowerCase());
      const newIndex = (index - shift + 33) % 33;
      data = isUpper
        ? russianAlphabet[newIndex].toUpperCase()
        : russianAlphabet[newIndex];
    } else {
      data = text[i];
    }

    fs.appendFileSync(filePathOutputCaeser, data, "utf8");
  }
}

// VIGENERE CIPHER

function getVigenereKey(filePathInputVigenere) {
  const data = fs.readFileSync(filePathInputVigenere, "utf8");
  const lines = data.trim().split("\n");
  return lines[lines.length - 1];
}

function vigenereIn(text, key) {
  fs.truncateSync(filePathOutputVigenere, 0);
  let data = "";
  let i = 0;
  while (text[i] != "\n") {
    let isUpper = text[i].toUpperCase() == text[i];

    if (text[i].toLowerCase() >= "a" && text[i].toLowerCase() <= "z") {
      const curCharCode = text[i].toLowerCase().charCodeAt(0) - 96;
      const keyCharCode = key[i].toLowerCase().charCodeAt(0) - 96;
      const newCharCode = (curCharCode + keyCharCode) % 26;
      data = isUpper
        ? String.fromCharCode(newCharCode + 95).toUpperCase()
        : String.fromCharCode(newCharCode + 95);
    } else {
      data = text[i];
    }

    fs.appendFileSync(filePathOutputVigenere, data, "utf8");
    i++;
  }
}

function vigenereOut(text, key) {
  fs.truncateSync(filePathOutputVigenere, 0);
  let data = "";
  let i = 0;
  while (text[i] != "\n") {
    let isUpper = text[i].toUpperCase() == text[i];

    if (text[i].toLowerCase() >= "a" && text[i].toLowerCase() <= "z") {
      const curCharCode = text[i].toLowerCase().charCodeAt(0) - 96;
      const keyCharCode = key[i].toLowerCase().charCodeAt(0) - 96;
      let newCharCode = (curCharCode - keyCharCode) % 26;
      newCharCode = newCharCode < 0 ? 26 + newCharCode : newCharCode;
      data = isUpper
        ? String.fromCharCode(newCharCode + 97).toUpperCase()
        : String.fromCharCode(newCharCode + 97);
    } else {
      data = text[i];
    }

    fs.appendFileSync(filePathOutputVigenere, data, "utf8");
    i++;
  }
}

function main() {
  while (true) {
    rl.question(`What to do?\n1. Encrypt\n2. Decrypt\n3. Exit\n`, (choice) => {
      switch (choice) {
        case "1":
          handleOperation("encrypt");
          break;
        case "2":
          handleOperation("decrypt");
          break;
        case "3":
          console.log("Exiting...");
          break;
        default:
          console.log("Invalid choice. Please try again.");
      }
    });
  }
}

function handleOperation(operation) {
  rl.question(
    `Choose a method:\nCaeser Cipher - 1\nVigenere Cipher - 2\n`,
    (choice) => {
      switch (choice.trim()) {
        case "1":
          processText("caeser", operation);
          break;
        case "2":
          processText("vigenere", operation);
          break;
        default:
          console.log("Invalid choice. Please try again.");
      }
      rl.close();
    }
  );
}

function processText(method, operation) {
  switch (method) {
    case "caeser":
      if (operation === "encrypt") {
        caeserIn(getText(filePathInputCaeser), 3);
      } else if (operation === "decrypt") {
        caeserOut(getText(filePathInputCaeser), 3);
      }
      break;
    case "vigenere":
      if (operation === "encrypt") {
        vigenereIn(
          getText(filePathInputVigenere),
          getVigenereKey(filePathInputVigenere)
        );
      } else if (operation === "decrypt") {
        vigenereOut(
          getText(filePathInputVigenere),
          getVigenereKey(filePathInputVigenere)
        );
      }
      break;
    default:
      console.log("Invalid method.");
  }
}

main();
