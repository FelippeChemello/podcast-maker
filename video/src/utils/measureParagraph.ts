import measureWord from "./measureWord";

export default function measureParagraph(
    paragraph: string,
    font: string,
    fontSize: number,
    fontWeight: number,
    limits: { width: number, height: number }
) {
    const words = paragraph.split(' ').map(word => word.trim()).filter(word => word.length > 0);
    const wordMetrics = words.map(word => measureWord(word, font, fontSize, fontWeight));
    const blankSpaceWidth = fontSize / 4
    const spaceBetweenLines = fontSize / 5

    const lines: { words: string[], height: number, width: number }[] = [];
    let currentLine: string[] = [];
    let currentLineWidth = 0;
    let currentLineHeight = 0;

    console.log(blankSpaceWidth)

    for (let i = 0; i < wordMetrics.length; i++) {
        const word = words[i];
        const wordWidth = wordMetrics[i].width;
        const wordHeight = wordMetrics[i].height;

        if (currentLineWidth
            + wordWidth
            + (blankSpaceWidth * (currentLine.length + 2)) // +2 because we add a space before and after the line
            > limits.width
        ) {
            lines.push({ words: currentLine, height: currentLineHeight, width: currentLineWidth });
            currentLine = [];
            currentLineWidth = 0;
            currentLineHeight = 0;
        }

        currentLine.push(word);
        currentLineWidth += wordWidth;
        currentLineHeight = Math.max(currentLineHeight, wordHeight);
    }

    if (currentLine.length > 0) {
        lines.push({ words: currentLine, height: currentLineHeight, width: currentLineWidth });
    }

    let totalHeight = 0;
    let totalWidth = 0;

    for (let i = 0; i < lines.length; i++) {
        totalHeight += lines[i].height + (spaceBetweenLines);
        totalWidth = Math.max(totalWidth, lines[i].width);
    }

    return { width: totalWidth, height: totalHeight, lines: lines.filter(line => line.words.length > 0) };
}
