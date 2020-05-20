import {packages, packageListGenerator, taskListGenerator} from "./packages";
import Listr from 'listr';
import path from 'path';
export async function createProject(options) {
    options = {
        ...options,
        template: options.typescript ? 'typescript' : 'javascript',
        targetDirectory: options.targetDirectory || `${process.cwd()}`
    }
    const currentFileURL = import.meta.url;
    const templateDirectory = path.resolve(new URL(currentFileURL).pathname, '../../templates', options.template.toLowerCase())
    options.templateDirectory = templateDirectory
    console.log(options);

    const packageManager = options.pkgMgr === 'Yarn' ? 'yarn' : 'npm'
    const packageManagerFlags = packageManager === 'yarn' ? ['add'] : ['i']
    const packageManagerDevFlags = packageManager === 'yarn' ? [...packageManagerFlags, '--dev'] : [...packageManagerFlags, '-D']

    console.log(packageManagerDevFlags)

    const react = packageListGenerator(packageManager, packageManagerFlags, packages.react, options)
    const redux = packageListGenerator(packageManager, packageManagerFlags, packages.redux[0], options);
    const reduxDev = packageListGenerator(packageManager, packageManagerDevFlags, packages.redux[1], options)
    const typescript = packageListGenerator(packageManager, packageManagerDevFlags, packages.typescript[0], options)
    const reactTypescript = packageListGenerator(packageManager, packageManagerDevFlags, packages.typescript[1], options);
    const reduxTypescript = packageListGenerator(packageManager, packageManagerDevFlags, packages.typescript[2], options);

    const reactTask = taskListGenerator('React', react, true)
    const reduxDependenciesTask = taskListGenerator('Redux Dependencies', redux, true);
    const reduxDevDependenciesTask = taskListGenerator('Redux Development Dependencies', reduxDev, true)
    const typescriptTask = taskListGenerator('TypeScript', typescript, options.template === "typescript")
    const reactTypescriptTask = taskListGenerator('Types for React', reactTypescript, options.template === 'typescript')
    const reduxTypescriptTask = taskListGenerator('Types for Redux', reduxTypescript, options.template === 'typescript')

    const reduxMaster = taskListGenerator('Redux', [reduxDependenciesTask, reduxDevDependenciesTask], true)
    const typeScriptMaster = taskListGenerator('TypeScript', [typescriptTask, reactTypescriptTask, reduxTypescriptTask], options.template === 'typescript');

    const masterPackageList = taskListGenerator('Package Install', [reactTask, reduxMaster, typeScriptMaster], true)

    const tasks = new Listr([masterPackageList])

    await tasks.run()
    // console.log(tasks);
}