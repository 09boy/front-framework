import { ScriptType, ProjectType } from 'types/SmartProjectConfig';

const data: Record<string, any> = {
    compilerOptions: {
        noImplicitAny: true,
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        isolatedModules: false,
        module: 'esnext',
        target: 'esnext',
        skipLibCheck: true,
        sourceMap: true,
        noEmit: true,
        strict: true,
        lib: [
            'es2018'
        ],
        baseUrl: '.',
        paths: {
            '*': ['<srcPath>'],
        }
    },
    exclude: [
        '__tests__',
        'node_modules',
        'babel.config.js',
        'jest.config.js',
    ]
};

export function getBabelResolveConfigData(projectType: ProjectType, scriptType: ScriptType, srcPath: string): Record<string, any> {
    const isTs = scriptType === 'ts';
    const compilerOptions: Record<string, any> = { ...(data.compilerOptions as Record<string, any>) };

    compilerOptions.paths = {
        '*': [`${srcPath}/*`],
    };

    if (isTs) {
        compilerOptions.allowJs = true;
        compilerOptions.lib = ['es2020', 'dom'];
    }

    if (projectType === 'react') {
        (compilerOptions.paths as Record<string, any>)['react-dom'] = ['node_modules/@hot-loader/react-dom'];
        compilerOptions.jsx = 'react';
    }

    return { ...data, compilerOptions };
}

