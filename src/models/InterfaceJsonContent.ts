export default interface InterfaceJsonContent {
    timestamp: number;
    width: number;
    height: number;
    text: string[];
    fps: number;
    fullDuration?: number;
    renderData?: {
        text: string;
        duration: number;
        audioFilePath: string;
    }[];
}
