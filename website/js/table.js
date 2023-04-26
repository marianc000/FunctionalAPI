import { highlight } from './highlight/highlight.js';
import {KEYWORDS} from './files.js'

const HEADERS = ['Return type', 'Class', 'Name', 'Parameters', 'Exception'];

const UP = '▲', DOWN = '▼';

thead.innerHTML = '<tr>' + HEADERS.map(c => `<th class='${c}'>${c}<i>${DOWN}</i></th>`).join('') + '</tr>';
const is = [...thead.querySelectorAll('i')];

const classIdx = HEADERS.indexOf('Class');
const methodIdx = HEADERS.indexOf('Name');
const paramIdx = HEADERS.indexOf('Parameters');
const BASE = "https://docs.oracle.com/en/java/javase/20/docs/api/java.base/";

function row(cells) {
    return '<tr>' + cells.map((c, i) => {
        let val = c;
        if (i == classIdx) val = `<a href="${BASE + val.replaceAll('.', '/') + '.html'}" target="_blank">${val}</a>`;
        if (i == methodIdx) val = `<a href="${BASE + cells[classIdx].replaceAll('.', '/') + '.html#' + val + '(' + cells[paramIdx] + ')'}" target="_blank">${val}</a>`;

        return `<td class='${HEADERS[i]}'>${val}</td>`
    }).join(' ') + '</tr>';
}
 
let data;
 
export function init(rows) {
    data = rows;
    show();
}

function show() {

    countSpan.innerText=data.length;
    tbody.innerHTML = data.map(l => row(l)).join('');
    highlight(tbody, KEYWORDS);
    [...thead.firstElementChild.children]
        .forEach(e => e.addEventListener('click', onSort));
}

function onSort() {
    console.log(">onSort")
    const i = this.querySelector('i');
    const col = [...this.parentElement.children].indexOf(this);
    console.log("col idx", col)
    const f = (a, b) => {
        try {
            return a[col].localeCompare(b[col]);
        } catch (ex) {
            console.error(col, a, b);
            throw ex;
        }
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
