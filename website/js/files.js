async function load(filename) {
    return await fetch(import.meta.resolve(filename)).then(res => res.text()).then(lines);
}

export const KEYWORDS = ['java.util.function', 'java.util.stream'];

function lines(txt) {
    return txt.split(/[\r\n]+/)
        .map(l => l.split(/\t/).map(v => v.trim()))
        .filter(r => includes(r, KEYWORDS));
}

function includes(inStrs, strs) {
    return inStrs.find(s => strs.find(k => s.includes(k)));
}
export function get8() {
    return load('./methods8.txt');
}

export function get20() {
    return load('./methods20.txt');
}

export async function getDiff() {
    const lines8 = (await get8()).map(l=>l.join(','));
    const lines20 = await get20();
    return lines20.filter(l => !lines8.includes(l.join(',')));
}
 