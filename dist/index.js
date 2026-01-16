#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_util_1 = require("node:util");
const { positionals } = (0, node_util_1.parseArgs)({
    allowPositionals: true
});
const command = positionals[0];
const getTemplate = (type, name) => {
    const templates = {
        controller: `export class ${name}Controller {\n  // Logic for ${name}\n}`,
        service: `export class ${name}Service {\n  // Business logic for ${name}\n}`,
        model: `export interface ${name} {\n  id: string;\n}`,
        tsconfig: `{\n  "compilerOptions": {\n    "target": "ESNext",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "outDir": "./dist",\n    "rootDir": "./src",\n    "strict": true,\n    "esModuleInterop": true\n  },\n  "include": ["src/**/*"]\n}`
    };
    return templates[type] || '';
};
const init = (targetDir = '.') => {
    const root = (0, node_path_1.resolve)(process.cwd(), targetDir);
    console.log(`Initializing structure in: ${root}`);
    // Create target directory if it doesn't exist
    if (!(0, node_fs_1.existsSync)(root)) {
        (0, node_fs_1.mkdirSync)(root, { recursive: true });
    }
    const folders = ['src/features', 'src/common', 'src/config'];
    folders.forEach(folder => {
        (0, node_fs_1.mkdirSync)((0, node_path_1.join)(root, folder), { recursive: true });
    });
    (0, node_fs_1.writeFileSync)((0, node_path_1.join)(root, 'tsconfig.json'), getTemplate('tsconfig', ''));
    // Execute commands inside the target directory
    const execOptions = { cwd: root, stdio: 'inherit' };
    if (!(0, node_fs_1.existsSync)((0, node_path_1.join)(root, 'package.json'))) {
        (0, node_child_process_1.execSync)('npm init -y', execOptions);
    }
    (0, node_child_process_1.execSync)('npm install -D typescript @types/node ts-node', execOptions);
    console.log('Project initialized successfully.');
};
const generateResource = (name) => {
    if (!name) {
        console.error('Error: Please provide a resource name (e.g., npx my-cli res user)');
        process.exit(1);
    }
    // Assumes execution from project root
    const root = process.cwd();
    const featureDir = (0, node_path_1.join)(root, 'src/features', name.toLowerCase());
    if (!(0, node_fs_1.existsSync)((0, node_path_1.join)(root, 'src'))) {
        console.error('Error: src directory not found. Run "init" first.');
        process.exit(1);
    }
    (0, node_fs_1.mkdirSync)(featureDir, { recursive: true });
    const files = [
        { fileName: `${name.toLowerCase()}.controller.ts`, type: 'controller' },
        { fileName: `${name.toLowerCase()}.service.ts`, type: 'service' },
        { fileName: `${name.toLowerCase()}.model.ts`, type: 'model' }
    ];
    files.forEach(file => {
        (0, node_fs_1.writeFileSync)((0, node_path_1.join)(featureDir, file.fileName), getTemplate(file.type, name));
    });
    console.log(`Module "${name}" generated in ${featureDir}`);
};
// --- Command Dispatcher ---
switch (command) {
    case 'init':
        init(positionals[1]); // positionals[1] is the folder name if provided
        break;
    case 'res':
        generateResource(positionals[1]);
        break;
    default:
        console.log('Usage:\n  npx my-cli init [folder-name]\n  npx my-cli res [resource-name]');
}
