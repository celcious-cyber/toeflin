// This file acts as the entry point for cPanel's Node.js Passenger server
// It routes the execution directly to the Next.js Standalone build.

const fs = require('fs');
try {
  fs.writeFileSync('./port_debug.log', 'PORT: ' + process.env.PORT + '\nType: ' + typeof process.env.PORT + '\nTime: ' + new Date().toISOString());
} catch (e) {
  // Ignore error
}

// Catch any asynchronous crashes
process.on('uncaughtException', (err) => {
  try {
    fs.appendFileSync('./port_debug.log', '\nUNCAUGHT EXCEPTION: ' + err.message + '\nSTACK: ' + err.stack);
  } catch (e) {}
});

process.on('unhandledRejection', (reason, promise) => {
  try {
    fs.appendFileSync('./port_debug.log', '\nUNHANDLED REJECTION: ' + (reason instanceof Error ? reason.message + '\nSTACK: ' + reason.stack : reason));
  } catch (e) {}
});

// Override http.Server.prototype.listen to remove any hostname string (e.g. '0.0.0.0' or 'localhost')
// This forces Node.js to use the port/socket only, allowing Phusion Passenger's hook to intercept it correctly.
const http = require('http');
const originalListen = http.Server.prototype.listen;
http.Server.prototype.listen = function(...args) {
  if (typeof args[1] === 'string') {
    args.splice(1, 1); // Remove the hostname argument
  }
  return originalListen.apply(this, args);
};

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

