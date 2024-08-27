export const isValidEnvelopeTitle = (title: string): boolean => {
    const pattern = /[;?!\\/><'"`~_)(%^$&|@+=]/;
    return title.trim().length > 0 && !pattern.test(title);
}