import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Config } from '@oclif/core';

export const loadSecrets = async () => {
    const config = await Config.load();
    const secretsFilePath = path.resolve(config.configDir, 'secrets.json');

    const { parsed: dotEnv } = dotenv.config();

    if (!fs.existsSync(secretsFilePath)) {
        return dotenv;
    }

    const secretsFileContent = fs.readFileSync(secretsFilePath, 'utf8');
    const secrets = JSON.parse(secretsFileContent);

    Object.entries(secrets).forEach(([key, value]) => {
        process.env[key] = (dotEnv && dotEnv[key]) ?? String(value);
    });

    return secrets;
};

export const saveSecrets = async (secrets: { [key: string]: unknown }) => {
    const config = await Config.load();
    const secretsFilePath = path.resolve(config.configDir, 'secrets.json');

    if (!fs.existsSync(config.configDir)) {
        fs.mkdirSync(config.configDir, { recursive: true });
    }

    fs.writeFileSync(secretsFilePath, JSON.stringify(secrets, null, 2));
};
