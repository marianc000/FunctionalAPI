export function groupByColIndex(data, i) {
    const map = {};
    data.forEach(r => {
        const key = r[i];
        map[key] ? map[key].push(r) : map[key] = [r];
    });
    return Object.entries(map).map(([k, v]) => ([k, v.length]))
        .sort((a, b) => a[0].localeCompare(b[0]));
}


