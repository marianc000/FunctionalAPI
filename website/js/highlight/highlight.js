 
import { textNodes } from './textNodes.js';
 

const HIGHLIGHT_NAME = 'match';

const url = import.meta.resolve('./worker.js');
const worker = new Worker(url, {
    type: 'module'
});

function escape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
 
function findAll(txt, strs, i) {
    return strs.flatMap(str => {

        return [...txt.matchAll(new RegExp(escape(str), 'dgi'))].map(match => {
            const [start, end] = match.indices[0];
            return {
                i,
                start,
                end
            };
        });
    });
}

export function highlight(container, strs) {

    console.log('>highlight', container, strs);
    const nodes = textNodes(container);

    const words = nodes.flatMap((n, i) => findAll(n.nodeValue, strs, i));
   // console.log(words);


    const ranges = words.map(v => {
        const node = nodes[v.i];
        return new StaticRange({
            startContainer: node,
            startOffset: v.start,
            endContainer: node,
            endOffset: v.end
        });
    });
   // console.log(ranges);

    CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges));
 
}
