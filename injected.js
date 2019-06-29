//(function (proxied) {
//    alert('injected js');
//    var XHR = XMLHttpRequest.prototype;

//    var open = XHR.open;
//    var send = XHR.send;
//    var setRequestHeader = XHR.setRequestHeader;

//    XHR.open = function (method, url) {
//        this._method = method;
//        this._url = url;
//        this._requestHeaders = {};
//        this._startTime = (new Date()).toISOString();

//        return open.apply(this, arguments);
//    };

//    XHR.setRequestHeader = function (header, value) {
//        this._requestHeaders[header] = value;
//        return setRequestHeader.apply(this, arguments);
//    };

//    XHR.send = function (postData) {

//        this.addEventListener('load', function () {
//            var endTime = (new Date()).toISOString();

//            var myUrl = this._url ? this._url.toLowerCase() : this._url;
//            if (myUrl) {

//                if (postData) {
//                    if (typeof postData === 'string') {
//                        try {
//                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
//                            this._requestHeaders = postData;
//                        } catch (err) {
//                            console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
//                            console.log(err);
//                        }
//                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
//                        // do something if you need
//                    }
//                }

//                // here you get the RESPONSE HEADERS
//                var responseHeaders = this.getAllResponseHeaders();

//                if (this.responseType !== 'blob' && this.responseText) {
//                    // responseText is string or null
//                    try {
//                        console.log(this.responseText);
//                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
//                        var arr = this.responseText;

//                        // printing url, request headers, response headers, response body, to console

//                        //console.log(this._url);
//                        //console.log(JSON.parse(this._requestHeaders));
//                        //console.log(responseHeaders);
//                        //console.log(JSON.parse(arr));
//                        this.responseText = 'overriden value';

//                    } catch (err) {
//                        console.log("Error in responseType try catch");
//                        console.log(err);
//                    }
//                }

//            }
//        });

//        return send.apply(this, arguments);
//    };

//})(XMLHttpRequest);

function plantXhrHook() {
    let origStateChange;

    function modifyResponse(e) {
        if (this.responseType !== 'blob') {

            if (this.readyState === 4) {
                const value = 'foo';
                let xml;
                var resp = removeLogFromResponse(this.responseText);

                console.log(typeof(this.response));
                console.log(typeof(this.responseText));
                console.log(typeof (this.responseXML));
                console.log(this.getAllResponseHeaders());
                //console.log(this.responseText);

                Object.defineProperties(this,
                    {
                        //response: resp,
                        responseText: { value: resp },
                        //responseXML: {
                        //    get() {
                        //        if (typeof xml === 'undefined')
                        //            xml = new DOMParser().parseFromString(value, 'application/xml');
                        //        return xml;
                        //    },
                        //},
                    });
            }
        }

        if (origStateChange) {
            origStateChange.apply(this, arguments);
        }
    };

    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        origStateChange = this.onreadystatechange;
        this.onreadystatechange = modifyResponse;
        origSend.apply(this, arguments);
    };

    function removeLogFromResponse(resp) {    
        var arr = resp.split('_*_*_*_');
        //console.log('splitting ' + arr.length, arr[0], arr[1]);
        //console.log(arr[0]);
        //console.log(arr[1]);


        if (arr.length === 2)
            return arr[1];

        return resp;
    }
}

const script = document.createElement('script');
script.textContent = `(${plantXhrHook})()`;
document.documentElement.appendChild(script);
script.remove();