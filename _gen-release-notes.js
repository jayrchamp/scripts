'use strict'
const findUp = require('find-up')
const cc = require('conventional-changelog')
const fs = require('fs')
const version = process.argv[2] || process.env.VERSION

const filename = `RELEASE_NOTE${version ? `_${version}` : ``}.md`
const file = `./release-notes/${filename}`
const configPath = findUp.sync(['.versionrc', '.version.json'])
const { types = {} } = configPath ? JSON.parse(fs.readFileSync(configPath)) : {}
const fileStream = fs.createWriteStream(file)

return cc({
    preset: {
        name: 'conventionalcommits',
        types,
        preMajor: false,
        commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
        compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
        issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
        userUrlFormat: '{{host}}/{{user}}',
        releaseCommitMessageFormat: 'chore(release): {{currentTag}}' },
    pkg: {
        transform (pkg) {
            pkg.version = `v${version}`
            return pkg
        }
    }
}).pipe(fileStream).on('close', () => {
    console.log(file)
})
