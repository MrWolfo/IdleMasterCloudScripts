var TYPE_CASUAL   = 1;
var TYPE_HARDCORE = 2;
var TYPE_MIXED    = 3;




handlers.GetDataForKey = function (args)
{

    var requestDataKey  = args.DataKey;
    var requestDataHash = args.DataHash;

    
    var csvData = Get_CSVFile_FromWeb(requestDataKey);
    var serverDataHash = GetHashByHand(csvData);

    return (serverDataHash == requestDataHash) ? "OK" : csvData;
}


function Get_CSVFile_FromWeb(Key)
{
    var DATA_CSV_URLS = 
    {
        "Clickers_Boosts_Info"   : "1y5u0ye8cmcms5j" ,
        "Clickers_Boosts_Stats"  : "dp45vpgcic5q7b4" ,
        "Clickers_Data_Info"     : "teiqokglbh46vo4" ,
        "Clickers_Data_Stats"    : "vtdpk43ab5xiog9" ,
        "Clickers_Minions_Info"  : "gztv6oa52dy4zps"
    };

    var url = "https://www.dropbox.com/s/" + DATA_CSV_URLS[Key] + "/" + Key + ".csv?dl=1";
    var method = "get";
    var contentBody = "";
    var contentType = "text/plain";
    var headers = {};
    var responseString =  http.request(url,method,contentBody,contentType,headers); 

    return responseString;

}


