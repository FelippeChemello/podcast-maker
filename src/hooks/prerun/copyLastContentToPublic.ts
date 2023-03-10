import { Hook } from '@oclif/core'
import { getPath } from 'config/defaultPaths';
import fs from 'fs'
import path from 'path'

import { getLatestFileCreated } from '../../utils/getFiles';

const hook: Hook<'prerun'> = async function (opts) {
    if (opts.Command.name !== 'Create') {
        return;
    }

    const lastContentFile = await getLatestFileCreated('json', path.resolve(__dirname, '..', '..', '..', 'content'))
    const contentFileDestination = path.resolve(await getPath('content'), path.basename(lastContentFile))

    console.log(contentFileDestination)

    fs.copyFileSync(lastContentFile, contentFileDestination)

    await new Promise((resolve) => { setTimeout(resolve, 5000) })
}

export default hook
