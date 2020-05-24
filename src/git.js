import execa from "execa";
import {taskListGenerator} from "./packages";

const packages = {
    'Git Init': {
        title: 'Initialize Git',
        command: 'git',
        flags: ['init']
    },
    'Git Ignore': {
        title: 'Generate GitIgnore',
        command: 'npx',
        flags: ['gitignore', 'node']
    }
}

export const gitSetup = options => {
    const gitTasks = Object.keys(packages).map(pkg => {
        const {title, command, flags} = packages[pkg]
        return {
            title,
            task: async () => {
                const result = await execa(command, flags, {
                    cwd: options.targetDirectory
                })
                if (result.failed) {
                    throw new Error(`Failed to ${title}`)
                }
            }
        }
    })
    return taskListGenerator('Git', gitTasks, options.git)
}