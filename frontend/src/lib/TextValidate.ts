export const isValidEnvelopeTitle = (title: string): boolean => {
    const pattern = /[;?!\\/><'"`~_)(%^$&|@+=]/;
    return !pattern.test(title);
}