export class PrefixManager {
    public static queue(roomId: string) {
        return `queue-${roomId}`;
    }

    public static time(roomId: string) {
        return `time-${roomId}`;
    }
}
