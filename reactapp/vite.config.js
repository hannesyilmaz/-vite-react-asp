import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { spawn } from 'child_process';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : "reactapp";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// https://vitejs.dev/config/
export default defineConfig(async () => {
    // Ensure the certificate and key exist
    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        // Wait for the certificate to be generated
        await new Promise((resolve) => {
            spawn('dotnet', [
                'dev-certs',
                'https',
                '--export-path',
                certFilePath,
                '--format',
                'Pem',
                '--no-password',
            ], { stdio: 'inherit', })
                .on('exit', (code) => {
                    resolve();
                    if (code) {
                        process.exit(code);
                    }
                });
        });
    }


    return {
        plugins: [plugin()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            proxy: {
                '^/weatherforecast': {
                    target: 'https://localhost:7242/',
                    secure: false
                },
                '^/home': {  // <-- Added this route
                    target: 'https://localhost:7242/',
                    secure: false
                },
                '^/authenticate/login': {  // <-- Added this route
                    target: 'https://localhost:7242/',
                    secure: false
                },
                '^/authenticate/register': {  // <-- Added this route
                    target: 'https://localhost:7242/',
                    secure: false
                }
            },
            port: 5173,
            https: {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            }
        }
    }
})
