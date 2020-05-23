import { packageList} from "./packages";
import Listr from 'listr';
import path from 'path';
import {npmSetup} from "./pkgjson";
import {gitSetup} from "./git";
import {copyFiles} from "./copyfiles";
import {configSetup} from "./config";

export async function createProject(options) {
    options = {
        ...options,
        template: options.typescript ? 'typescript' : 'javascript',
        targetDirectory: options.targetDirectory || `${process.cwd()}/${options.directory}`
    }
    const currentFileURL = import.meta.url;
    const templateDirectory = path.resolve(new URL(currentFileURL).pathname, '../../templates', options.template.toLowerCase())
    options.templateDirectory = templateDirectory

    const files = await copyFiles(options);
    const npm = npmSetup(options)
    const packages = packageList(options);
    const git = gitSetup(options);
    const config = configSetup(options)

    const tasks = new Listr([files, git, npm, packages, config])

    await tasks.run()
}