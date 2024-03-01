export const camelCaseToRegular = (s: string) => {
    // transform hyphen case to camel case
    if(!s) return s;
    const re = /([a-z])([A-Z])/g;
    return s.replaceAll(re, (...args: string[]) => args[1] + ' ' + args[2].toLowerCase());
};
