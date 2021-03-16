

class BreakTextIntoParagraphsService {
    constructor() {}

    public execute(text: string): string[] {
        return text.split('\n\n');
    }
}

export default BreakTextIntoParagraphsService;
