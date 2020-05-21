import {taskListGenerator} from "./packages";

const fs = require('fs');
import execa from "execa";
import Listr from 'listr'

function addToPackageJson(options) {
    const scripts = {
        start: "react-app-rewired start",
        build: "react-app-rewired build",
        test: "react-app-rewired test --env=jsdom",
        eject: "react-scripts eject",
        commit: "git-cz",
        precommit: 'lint-staged'
    }

    const config = {
        commitizen: {
            path: "./node_modules/cz-conventional-changelog"
        }
    }

    const lintStaged = {
        "*.{js,ts,tsx}": [
            "eslint --fix"
        ]
    }

    // Open Package.json for editing

    const filename = `${options.targetDirectory}/package.json`

    const rawData = fs.readFileSync(filename);
    const data = JSON.parse(rawData)
    try {
        fs.unlinkSync(filename)
    } catch (err) {
        console.log('file not found')
    }

    const newData = {...data, scripts, config, 'lint-staged': lintStaged}
    const newJSONData = JSON.stringify(newData, null, 2)
    fs.writeFileSync(filename, newJSONData)
}

export const npmSetup = options => {
    const npmInit = {
        title: 'NPM Init',
        task: async () => {
            const result = await execa('npm', ['init', '-y'], {
                cwd: options.targetDirectory
            })
            if (result.failed) {
                throw new Error('Error initializing NPM')
            }
        }
    }
    const packageJson = {
        title: 'Add Scripts to Package.json',
        task: async () => addToPackageJson(options)
    }

    return taskListGenerator('Intializing Project', [npmInit, packageJson], true)

}