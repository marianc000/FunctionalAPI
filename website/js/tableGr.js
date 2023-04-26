import { groupByColIndex } from "./groupBy.js";

const HEADERS = ['Class', 'Count'];
const UP = '▲', DOWN = '▼';

thead.innerHTML = '<tr>' + HEADERS.map(c => `<th class='${c}'>${c}<i>${DOWN}</i></th>`).join('') + '</tr>';
const is = [...thead.querySelectorAll('i')];

const BASE = "https://docs.oracle.com/en/java/javase/20/docs/api/java.base/";

function row(cells) {
    return '<tr>' + cells.map((val, i) => {
        if (i == 0) val = `<a href="${BASE + val.replaceAll('.', '/') + '.html'}" target="_blank">${val}</a>`;

        return `<td class='${HEADERS[i]}'>${val}</td>`
    }).join(' ') + '</tr>';
}


let data;

export function init(rows) {
    console.log(rows);
    data = groupByColIndex(rows, 1);
    console.log(data)
    show();
}

function show() {
    countSpan.innerText = data.length;
    tbody.innerHTML = data.map(l => row(l)).join('');

    [...thead.firstElementChild.children]
        .forEach(e => e.addEventListener('click', onSort));
}

function onSort() {
    console.log(">onSort")
    const i = this.querySelector('i');
    const col = [...this.parentElement.children].indexOf(this);
 
    const f = (a, b) => {
        if (a[col].localeCompare)
            return a[col].localeCompare(b[col]);
        return a[col] - b[col];
    };
    if (i.innerHTML === UP) {
        i.innerHTML = DOWN;
        data.sort((a, b) => -f(a, b));
    } else {
        i.innerHTML = UP;
        data.sort(f)
    }
    is.forEach(e => e.style.visibility='hidden');
    is[col].style.visibility='visible';
    show();
}
