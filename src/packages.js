import execa from "execa";
import Listr from 'listr';

const packages = {
    react: ['react', 'react-dom', 'react-scripts'],
    reactRouter: ['react-router-dom'],
    reduxDependencies: ['redux', 'react-redux']
}

const devPackages = {
    reduxDevDependencies: ['redux-logger', 'redux-devtools-extension'],
    typescript: ['typescript'],
    reactTypes: ['@types/react', '@types/node', '@types/react-dom'],
    reduxTypes: ['@types/redux-logger', '@types/redux-devtools-extension', '@types/react-redux'],
    reactRouterTypes: ['@types/react-router-dom']
}

const packageListGenerator = (pkgMgr, flags, packages, options) => {
    return packages.map(pkg => ({
        title: `Installing ${pkg}`,
        task: async () => {
            const result = await execa(pkgMgr, [...flags, pkg], {
                cwd: options.targetDirectory
            });
            if (result.failed) {
                throw new Error(`Failed to install ${pkg}`)
            }
        }
    }))
}

const taskListGenerator = (title, tasks, enable) => ({
    title,
    enabled: () => enable,
    task: () => new Listr(tasks)
})

export const packageList = options => {
    const packageManager = options.pkgMgr === 'Yarn' ? 'yarn' : 'npm'
    const packageManagerFlags = packageManager === 'yarn' ? ['add'] : ['i']
    const packageManagerDevFlags = packageManager === 'yarn' ? [...packageManagerFlags, '--dev'] : [...packageManagerFlags, '-D']

    const packageList = {}

    Object.keys(packages).forEach(pkgs => {
        packageList[pkgs] = packageListGenerator(packageManager, packageManagerFlags, packages[pkgs], options)
    })
    Object.keys(devPackages).forEach(pkgs => {
        packageList[pkgs] = packageListGenerator(packageManager, packageManagerDevFlags, devPackages[pkgs], options);
    })

    const reactTask = taskListGenerator('React', packageList['react'], true)
    const reactRouterTask = taskListGenerator('React Router', packageList['reactRouter'], true)
    const reduxDepTask = taskListGenerator('Redux Dependencies', packageList['reduxDependencies'], options.redux)
    const reduxDevDepTask = taskListGenerator('Redux Development Dependencies', packageList['reduxDevDependencies'], options.redux)
    const reduxTask = taskListGenerator('Redux', [reduxDepTask, reduxDevDepTask], options.redux)
    const typeScriptSubTask = taskListGenerator('TypeScript', packageList['typescript'], options.typescript)
    const reactTypeScriptTask = taskListGenerator('Types for React', packageList['reactTypes'], true)
    const reduxTypeScriptTask = taskListGenerator('Types for Redux', packageList['reduxTypes'], options.redux)
    const reactRouterTypesTask = taskListGenerator('Types for Reaact Router', packageList['reactRouterTypes'], true)
    const typescriptTask = taskListGenerator('TypeScript', [typeScriptSubTask, reactTypeScriptTask, reactRouterTypesTask, reduxTypeScriptTask], options.typescript)

    const allPackages = [reactTask, reactRouterTask, reduxTask, typescriptTask]

    return taskListGenerator('Package Install', allPackages, true)

}