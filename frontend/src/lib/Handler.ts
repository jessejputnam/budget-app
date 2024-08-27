export async function handle(promise: Promise<unknown>) {
    try {
        const data = await promise;
        return [undefined, data];
    } catch (err) {
        return await Promise.resolve([err, null]);
    }
}