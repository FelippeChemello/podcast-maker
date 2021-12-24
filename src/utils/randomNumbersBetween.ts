export default function randomNumbersBetween(
    min: number,
    max: number,
    except?: number,
): number {
    const random = Math.floor(Math.random() * (max - min + 1) + min);

    if (random === except) {
        return randomNumbersBetween(min, max, except);
    }

    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
