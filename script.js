const ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    
function validateInput(input) {
    input.value = input.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
}

function copyToClipboard() {
    const resultText = document.getElementById("result").textContent;
    navigator.clipboard.writeText(resultText).then(() => {
        alert("Copied to clipboard!");
    });
}

function generateMatrix() {
    const key = document.getElementById("key").value.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let keySet = new Set();
    let matrixString = '';

    for (let char of key + ALPHABET) {
        if (!keySet.has(char)) {
            keySet.add(char);
            matrixString += char;
        }
    }

    let matrixHTML = '';
    for (let i = 0; i < 25; i++) {
        matrixHTML += `<div>${matrixString[i]}</div>`;
    }
    document.getElementById("matrix").innerHTML = matrixHTML;
}

function generateMatrixArray(key) {
    const matrix = [];
    const keyProcessed = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let keySet = new Set();
    let matrixString = '';

    for (let char of keyProcessed + ALPHABET) {
        if (!keySet.has(char)) {
            keySet.add(char);
            matrixString += char;
        }
    }

    for (let i = 0; i < 5; i++) {
        matrix[i] = [];
        for (let j = 0; j < 5; j++) {
            matrix[i][j] = matrixString[i * 5 + j];
        }
    }
    return matrix;
}

function prepareText(text) {
    let preparedText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let pairs = [];

    for (let i = 0; i < preparedText.length; i += 2) {
        if (i + 1 < preparedText.length && preparedText[i] !== preparedText[i + 1]) {
            pairs.push(preparedText[i] + preparedText[i + 1]);
        } else {
            pairs.push(preparedText[i] + 'X');
            i--;
        }
    }
    return pairs.join('');
}

function findPosition(matrix, letter) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (matrix[i][j] === letter) {
                return [i, j];
            }
        }
    }
    return [-1, -1];
}

function playfairCipher(text, key, encrypt = true) {
    let matrix = generateMatrixArray(key);
    let preparedText = prepareText(text);
    let result = '';

    for (let i = 0; i < preparedText.length; i += 2) {
        let [aRow, aCol] = findPosition(matrix, preparedText[i]);
        let [bRow, bCol] = findPosition(matrix, preparedText[i + 1]);

        if (aRow === bRow) {
            result += matrix[aRow][(aCol + (encrypt ? 1 : -1) + 5) % 5];
            result += matrix[bRow][(bCol + (encrypt ? 1 : -1) + 5) % 5];
        } else if (aCol === bCol) {
            result += matrix[(aRow + (encrypt ? 1 : -1) + 5) % 5][aCol];
            result += matrix[(bRow + (encrypt ? 1 : -1) + 5) % 5][bCol];
        } else {
            result += matrix[aRow][bCol] + matrix[bRow][aCol];
        }
    }
    return result;
}

function encryptText() {
    document.getElementById("result").textContent = "🔒 Encrypted: " + playfairCipher(document.getElementById("plaintext").value, document.getElementById("key").value, true);
}

function decryptText() {
    document.getElementById("result").textContent = "🔓 Decrypted: " + playfairCipher(document.getElementById("ciphertext").value, document.getElementById("key").value, false);
}