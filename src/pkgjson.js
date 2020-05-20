const fs = require('fs');

export function addToPackageJson() {
    const scripts = {
        start: "react-app-rewired start",
        build: "react-app-rewired build",
        test: "react-app-rewired test --env=jsdom",
        eject: "react-scripts eject",
        commit: "git-cz"
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

    const rawData = fs.readFileSync('package.json');
    const data = JSON.parse(rawData)
    try {
        fs.unlinkSync('package.json')
    } catch (err) {
        console.log('file not found')
    }

    const newData = {...data, scripts, config, 'lint-staged': lintStaged}
    const newJSONData = JSON.stringify(newData, null, 2)
    fs.writeFileSync('package.json', newJSONData)
}