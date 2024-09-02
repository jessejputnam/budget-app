export async function handle(promise: Promise<unknown>) {
    try {
        const data = await promise;
        return [null, data];
    } catch (err) {
        return await Promise.resolve([err, null]);
    }
}