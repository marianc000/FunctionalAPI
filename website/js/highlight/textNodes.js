

export function textNodes(parent) {
    return [...parent.childNodes].flatMap(node => {
        switch (node.nodeType) {
            case Node.TEXT_NODE:
                    return node;
 
            case Node.ELEMENT_NODE:
                return textNodes(node);
            default:
                return [];
        }
    });
}
