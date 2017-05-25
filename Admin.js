handlers.RefreshCloudScript = function( args )
{
    var url = "https://6C14.playfabapi.com/Admin/GetCloudScriptRevision";
    var method = "post";
    var contentBody = JSON.stringify( {} );
    var contentType = "application/json";
    var headers = {"X-SecretKey" : "Y3XPTHQKPUXRJRYAZAUF7AXZCQNJ1Q99KWNB41KK4UBXWD653B"};
    var responseString =  http.request(url,method,contentBody,contentType,headers);

    return { pepote: responseString}
}