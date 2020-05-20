import execa from "execa";
import Listr from 'listr';

const react = ['react', 'react-dom', 'react-scripts']
const reduxDependencies = ['redux', 'react-redux']
const reduxDevDependencies = ['redux-logger', 'redux-devtools-extension']
const typescript = ['typescript']
const reactTypes = ['@types/react', '@types/node', '@types/react-dom']
const reduxTypes = ['@types/redux-logger', '@types/redux-devtools-extension', '@types/react-redux']

export const packages = {
    react,
    redux: [reduxDependencies, reduxDevDependencies],
    typescript: [typescript, reactTypes, reduxTypes]
}

export const packageListGenerator = (pkgMgr, flags, packages, options) => {
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

export const taskListGenerator = (title, tasks, enable) => ({
    title,
    enabled: () => enable,
    task: () => new Listr(tasks)
})