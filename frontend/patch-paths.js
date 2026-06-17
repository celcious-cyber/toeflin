const fs = require('fs');
const path = require('path');

const targetRoot = '/home/u118737573/domains/ruangweb.my.id/nodejs/frontend';
const localRoot = 'D:\\Project\\APPS\\TOEFLin\\frontend';

// File 1: server.js
const serverJsPath = path.join(__dirname, '.next', 'standalone', 'server.js');
if (fs.existsSync(serverJsPath)) {
  console.log('Patching:', serverJsPath);
  let content = fs.readFileSync(serverJsPath, 'utf8');
  
  // Replace Windows path with Linux path
  content = content.replace(/D:\\\\Project\\\\APPS\\\\TOEFLin\\\\frontend/gi, targetRoot);
  content = content.replace(/D:\\Project\\APPS\\TOEFLin\\frontend/gi, targetRoot);
  
  // Replace cpus count to 1 to prevent fork/EAGAIN crash on cPanel
  content = content.replace(/"cpus":\s*\d+/g, '"cpus":1');
  content = content.replace(/"staticGenerationMaxConcurrency":\s*\d+/g, '"staticGenerationMaxConcurrency":1');
  
  fs.writeFileSync(serverJsPath, content, 'utf8');
  console.log('server.js patched successfully!');
} else {
  console.error('File not found:', serverJsPath);
}

// File 2: required-server-files.json
const jsonPath = path.join(__dirname, '.next', 'standalone', '.next', 'required-server-files.json');
if (fs.existsSync(jsonPath)) {
  console.log('Patching:', jsonPath);
  let content = fs.readFileSync(jsonPath, 'utf8');
  
  // Replace Windows paths
  content = content.replace(/D:\\\\Project\\\\APPS\\\\TOEFLin\\\\frontend/gi, targetRoot);
  content = content.replace(/D:\\Project\\APPS\\TOEFLin\\frontend/gi, targetRoot);
  
  // Replace backslashes in files list
  try {
    const data = JSON.parse(content);
    if (data.files && Array.isArray(data.files)) {
      data.files = data.files.map(f => f.replace(/\\/g, '/'));
    }
    if (data.appDir) {
      data.appDir = targetRoot;
    }
    if (data.config && data.config.outputFileTracingRoot) {
      data.config.outputFileTracingRoot = targetRoot;
    }
    if (data.config && data.config.experimental && data.config.experimental.turbopack && data.config.experimental.turbopack.root) {
      data.config.experimental.turbopack.root = targetRoot;
    }
    content = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error('Error parsing JSON:', err);
  }
  
  fs.writeFileSync(jsonPath, content, 'utf8');
  console.log('required-server-files.json patched successfully!');
} else {
  console.error('File not found:', jsonPath);
}

// Copy public and .next/static folders
const publicSrc = path.join(__dirname, 'public');
const publicDest = path.join(__dirname, '.next', 'standalone', 'public');
const staticSrc = path.join(__dirname, '.next', 'static');
const staticDest = path.join(__dirname, '.next', 'standalone', '.next', 'static');

try {
  if (fs.existsSync(publicSrc)) {
    console.log('Copying public files...');
    fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
    console.log('Public files copied successfully.');
  }
} catch (err) {
  console.error('Error copying public files:', err);
}

try {
  if (fs.existsSync(staticSrc)) {
    console.log('Copying static files...');
    fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
    console.log('Static files copied successfully.');
  }
} catch (err) {
  console.error('Error copying static files:', err);
}

console.log('All standalone tasks completed!');
