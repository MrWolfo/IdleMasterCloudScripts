var TYPE_CASUAL   = 1;
var TYPE_HARDCORE = 2;
var TYPE_MIXED    = 3;




handlers.GetDataForKey = function (args)
{

    var requestDataKey  = args.DataKey;
    var requestDataHash = args.DataHash;

    var DATA_BY_KEY = 
    {
        "Clickers_InfoData"   : JSON.stringify( CLICKERS_INFO ) ,
        "Clickers_StatsData"  : JSON.stringify( CLICKERS_STATS ) ,
        "Clickers_BoostData"  : JSON.stringify( CLICKERS_BOOST_CONFIG )
    };

    var serverData = DATA_BY_KEY[requestDataKey];
    var serverDataHash = GetHashByHand(serverData);


    return Get_CSVFile_FromWeb();

    
    return (serverDataHash == requestDataHash) ? "OK" : serverData;
}


function Get_CSVFile_FromWeb()
{
    var url = "https://www.dropbox.com/s/zkyna8i5c15cl8q/Minions_Data.csv?dl=1";
    var method = "get";
    var contentBody = "";
    var contentType = "text/plain";
    var headers = {};
    var responseString =  http.request(url,method,contentBody,contentType,headers); 

    return responseString;

}


