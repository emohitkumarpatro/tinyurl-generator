// Generate a random alphanumeric code for shortened URLs
// Code must match regex: [A-Za-z0-9]{6,8}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODE_LENGTH = 6;

/**
 * Generates a random code of specified length using alphanumeric characters
 * @param {number} length - Length of code to generate (default: 6)
 * @returns {string} Random alphanumeric code
 */
export function generateCode(length = CODE_LENGTH) {
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
        code += CHARACTERS[randomIndex];
    }
    return code;
}

/**
 * Validates if a code matches the required pattern
 * @param {string} code - Code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidCode(code) {
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    return codeRegex.test(code);
}
