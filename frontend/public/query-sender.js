/**
 * Receives a query string as parameter and sends it as Ajax request to the POST /query REST endpoint.
 *
 * @param query The query string
 * @returns {Promise} Promise that must be fulfilled if the Ajax request is successful and be rejected otherwise.
 */

CampusExplorer.sendQuery = function (query) {
    return new Promise(function (fulfill, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'query', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                fulfill(xhr.response);
            } else {
                reject(xhr.response);
            }
        };
        xhr.send(JSON.stringify(query));
    });
};
