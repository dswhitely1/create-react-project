import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import {promisify} from 'util';
import {taskListGenerator} from "./packages";

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    })
}

export const copyFiles = async (options) => {
    try {
        await access(options.templateDirectory, fs.constants.R_OK)
    } catch (error) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'))
        process.exit(1)
    }

    const task = {
        title: 'Copying Files',
        task: () => copyTemplateFiles(options)
    }

    const copyFileTask = await taskListGenerator('Template Files', [task], true)
    return copyFileTask
}