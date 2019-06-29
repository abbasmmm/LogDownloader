chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    //console.log(JSON.stringify(details));
    var headers = details.requestHeaders,
        blockingResponse = {};

    mod_headers(headers, 'AtlasWebLogs', 'true');
        //alert('testing log');
    blockingResponse.requestHeaders = headers;
    return blockingResponse;
},
    { urls: ["<all_urls>"] }, ['requestHeaders', 'blocking']);

function mod_headers(header_array, p_name, p_value) {
    var did_set = false;
    for (var i in header_array) {
        var header = header_array[i];
        var name = header.name;
        var value = header.value;

        // If the header is already present, change it:
        if (name === p_name) {
            header.value = p_value;
            did_set = true;
        }
    }
    // if it is not, add it:
    if (!did_set) { header_array.push({ name: p_name, value: p_value }); }
}
