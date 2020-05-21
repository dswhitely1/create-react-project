import { packageList} from "./packages";
import Listr from 'listr';
import path from 'path';
import {npmSetup} from "./pkgjson";
import {gitSetup} from "./git";

export async function createProject(options) {
    options = {
        ...options,
        template: options.typescript ? 'typescript' : 'javascript',
        targetDirectory: options.targetDirectory || `${process.cwd()}`
    }
    const currentFileURL = import.meta.url;
    const templateDirectory = path.resolve(new URL(currentFileURL).pathname, '../../templates', options.template.toLowerCase())
    options.templateDirectory = templateDirectory

    const npm = npmSetup(options)
    const packages = packageList(options);
    const git = gitSetup(options);

    const tasks = new Listr([git, npm, packages])

    await tasks.run()
}