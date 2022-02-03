const pathRegExp = new RegExp('\\\\|/');

export default async function loadFile(filePath: string) {
    const pathArray = filePath.split(pathRegExp);

    const fileName = pathArray[pathArray.length - 1];

    return await require(`../../tmp/${fileName}`);
}
