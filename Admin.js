

//--- THIS IS EXECUTED BY A RULE, PLEASE REMOVE THE RULE WHEN THE GAME IS ONLINE

handlers.RefreshCloudScript = function( args )
{
    var url = "https://6C14.playfabapi.com/Admin/GetCloudScriptRevision";
    var method = "post";
    var contentBody = JSON.stringify( {} );
    var contentType = "application/json";
    var headers = {"X-SecretKey" : "Y3XPTHQKPUXRJRYAZAUF7AXZCQNJ1Q99KWNB41KK4UBXWD653B"};
    var responseString =  http.request(url,method,contentBody,contentType,headers);

    var data = JSON.parse( responseString );


    var url = "https://6C14.playfabapi.com/Admin/SetPublishedRevision";
    var method = "post";
    var contentBody = JSON.stringify( {
                            "Version": 1,
                            "Revision": data.data.Revision
                            } );
    var contentType = "application/json";
    var headers = {"X-SecretKey" : "Y3XPTHQKPUXRJRYAZAUF7AXZCQNJ1Q99KWNB41KK4UBXWD653B"};
    var responseString =  http.request(url,method,contentBody,contentType,headers);

    return { answer : responseString };
}