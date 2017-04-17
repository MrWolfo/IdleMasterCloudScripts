
handlers.SupportCode = function ( args )
{
	var ReturnData =
    {
        "ID"   : "0" ,
        "CODE" : args["code"].toUpperCase(),
        "TYPE" : "SKIN_LOCO",
        "VALUE" : "",
        "MESSAGE" : ""
    };

    var playerData = server.GetUserData(
            {
                PlayFabId : currentPlayerId,
                Keys : ["APKVersion"]
            }
     );


    if(ReturnData.CODE == "71588" || ReturnData.CODE == "71588A")
    {
            ReturnData.ID       = "CORGI";
            ReturnData.VALUE    = "CORGI";
            ReturnData.MESSAGE  = "You've Unlocked Corgi Bebop Skin!*Open the Gift Box in the Game Screen."
    }
    else if (ReturnData.CODE == TEMPORAL_CODE_GIFT_50DIAMONDS)
    {
        
            handlers.Add_Small_50Diamonds_Gift();
            ReturnData.ID       = TEMPORAL_CODE_GIFT_50DIAMONDS;
            ReturnData.VALUE    = "50Diamonds";
            ReturnData.MESSAGE  = "Diamonds Retrieved!*Open the Gift Box in the Game Screen."



    }
    else if(ReturnData.CODE == "BEERINCREMENT" || ReturnData.CODE == "BEERINCREMENT2" )
    {
            ReturnData.ID       = "BEERINCREMENT";
            ReturnData.VALUE    = "BEERINCREMENT";
            ReturnData.MESSAGE  = "You've Unlocked Beer Master Skin!*Open the Gift Box in the Game Screen."
    }
    else
    {
            return "ERROR_NO_CODE";
    }





	return {  messageValue : "OK" , data : ReturnData };

}
