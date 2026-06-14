// This file acts as the entry point for cPanel's Node.js Passenger server
// It routes the execution directly to the Next.js Standalone build.

const fs = require('fs');
try {
  fs.writeFileSync('./port_debug.log', 'PORT: ' + process.env.PORT + '\nType: ' + typeof process.env.PORT + '\nTime: ' + new Date().toISOString());
} catch (e) {
  // Ignore error
}

// Override parseInt temporarily to prevent Next.js from parsing the Unix socket path into NaN.
const originalParseInt = global.parseInt;
global.parseInt = function(value, radix) {
  if (
    typeof value === 'string' &&
    (value.startsWith('/') ||
      value.startsWith('\\') ||
      value.includes('.sock') ||
      value.includes('passenger'))
  ) {
    return value;
  }
  return originalParseInt(value, radix);
};

// Require the standalone Next.js server with try-catch to debug startup issues
try {
  require('./.next/standalone/server.js');
} catch (err) {
  try {
    fs.appendFileSync('./port_debug.log', '\nERROR: ' + err.message + '\nSTACK: ' + err.stack);
  } catch (e) {
    // Ignore error
  }
}

// Restore parseInt to its original function to prevent side effects
global.parseInt = originalParseInt;

