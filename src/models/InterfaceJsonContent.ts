export default interface InterfaceJsonContent {
    timestamp: number;
    width: number;
    height: number;
    news: { text: string; url?: string; shortLink?: string }[];
    fps: number;
    title: string;
    fullDuration?: number;
    date: string;
    renderData?: {
        text: string;
        duration: number;
        audioFilePath: string;
    }[];
}
