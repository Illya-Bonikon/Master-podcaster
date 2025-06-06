import '@testing-library/jest-dom';

// Додаємо TextEncoder для тестів
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder; 