/**
 * Receives a query string as parameter and sends it as Ajax request to the POST /query REST endpoint.
 *
 * @param query The query string
 * @returns {Promise} Promise that must be fulfilled if the Ajax request is successful and be rejected otherwise.
 */

CampusExplorer.sendQuery = function(query) {
    return new Promise(function(fulfill, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:4321/query", true);
        xhr.onload = function () {
            fulfill(xhr.response);
        };
        xhr.onerror = function () {
            reject(xhr.response);
        };
        xhr.send(query);
    });
};
