#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { positionals } = parseArgs({
    allowPositionals: true
});

const command = positionals[0];

const getTemplate = (type: string, name: string): string => {
    const templates: Record<string, string> = {
        controller: `export class ${name}Controller {\n  // Logic for ${name}\n}`,
        service: `export class ${name}Service {\n  // Business logic for ${name}\n}`,
        model: `export interface ${name} {\n  id: string;\n}`,
        tsconfig: `{\n  "compilerOptions": {\n    "target": "ESNext",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "outDir": "./dist",\n    "rootDir": "./src",\n    "strict": true,\n    "esModuleInterop": true\n  },\n  "include": ["src/**/*"]\n}`
    };
    return templates[type] || '';
};

const init = (targetDir: string = '.') => {
    const root = resolve(process.cwd(), targetDir);

    console.log(`Initializing structure in: ${root}`);

    // Create target directory if it doesn't exist
    if (!existsSync(root)) {
        mkdirSync(root, { recursive: true });
    }

    const folders = ['src/features', 'src/common', 'src/config'];
    folders.forEach(folder => {
        mkdirSync(join(root, folder), { recursive: true });
    });

    writeFileSync(join(root, 'tsconfig.json'), getTemplate('tsconfig', ''));

    // Execute commands inside the target directory
    const execOptions = { cwd: root, stdio: 'inherit' as const };

    if (!existsSync(join(root, 'package.json'))) {
        execSync('npm init -y', execOptions);
    }

    execSync('npm install -D typescript @types/node ts-node', execOptions);
    console.log('Project initialized successfully.');
};

const generateResource = (name: string) => {
    if (!name) {
        console.error('Error: Please provide a resource name (e.g., npx my-cli res user)');
        process.exit(1);
    }

    // Assumes execution from project root
    const root = process.cwd();
    const featureDir = join(root, 'src/features', name.toLowerCase());

    if (!existsSync(join(root, 'src'))) {
        console.error('Error: src directory not found. Run "init" first.');
        process.exit(1);
    }

    mkdirSync(featureDir, { recursive: true });

    const files = [
        { fileName: `${name.toLowerCase()}.controller.ts`, type: 'controller' },
        { fileName: `${name.toLowerCase()}.service.ts`, type: 'service' },
        { fileName: `${name.toLowerCase()}.model.ts`, type: 'model' }
    ];

    files.forEach(file => {
        writeFileSync(join(featureDir, file.fileName), getTemplate(file.type, name));
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