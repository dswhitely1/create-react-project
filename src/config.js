import fs from 'fs';
import {taskListGenerator} from "./packages";

const huskyConfig = (options) => {
    const filename = `${options.targetDirectory}/.huskyrc`

    const husky = {
        hooks: {
            'pre-commit': 'lint-staged'
        }
    }

    fs.writeFileSync(filename, JSON.stringify(husky, null, 2))
}

const eslintConfig = (options) => {
    const filename = `${options.targetDirectory}/.eslintrc`

    const eslint = {
        extends: ["react-app", "prettier", "prettier/react"],
        plugins: ["prettier"],
        rules: {}
    }

    fs.writeFileSync(filename, JSON.stringify(eslint, null, 2));
}

const prettierConfig = (options) => {
    const filename = `${options.targetDirectory}/.prettierrc`;

    const prettier = {
        singleQuote: true
    }

    fs.writeFileSync(filename, JSON.stringify(prettier, null, 2));
}

export const configSetup = (options) => {
    const tasks = [
        {
            title: 'Husky Configuration',
            task: () => huskyConfig(options)
        },
        {
            title: "Eslint Configuration",
            task: () => eslintConfig(options)
        },
        {
            title: "Prettier Configuration",
            task: () => prettierConfig(options)
        }
        ]
    return taskListGenerator('Configuration Files', tasks, true)
}