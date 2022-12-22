export default function measureLetter(letter: string, font: string, fontSize: number, fontWeight: number) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Could not get canvas context');
    }

    context.font = `${fontWeight} ${fontSize}px ${font}`;
    const metrics = context.measureText(letter);

    return { width: metrics.width, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent };
}
