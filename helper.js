const DomParser = require('dom-parser');

function setBody(bodyHtml) {
    const parser = new DomParser();
    const doc = parser.parseFromString(bodyHtml, "text/html");

    return doc.getElementsByTagName('meta').reduce((prev, curr) => {
        if (curr &&
            curr.getAttribute('property') === "og:site_name" ||
            curr.getAttribute('property') === "og:title" ||
            curr.getAttribute('property') === "og:description" ||
            curr.getAttribute('property') === "og:image"
        ) {
            return {
                ...prev,
                [curr.getAttribute('property').match(/og:(\w+)/)[1]]: curr.getAttribute('content')
            }
        }
        return prev;
    }, []);
}

module.exports = {
    setBody
};
