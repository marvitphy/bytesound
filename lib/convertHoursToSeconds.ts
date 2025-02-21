export function convertToSeconds(time: string): number {
    const parts = time.split(":").map(Number);

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else {
        throw new Error("Formato de tempo inválido. Use HH:MM:SS ou MM:SS.");
    }
}
