
/*
***********                                                                     ***********
***********      --------------- PLAYER DATA MANAGEMENT ------------------      ***********
***********                                                                     ***********
*/

/**
 *  Get User Internal Data Wrapper for Given User  
 *  Data will be stored in a Key call GenericData as Json
 * 
 *  return a Parsed Object from stored JSON
 */
function GetGenericPlayerData( playfabUserId )
{
    var dataRequest = server.GetUserInternalData(
                {
                            PlayFabId : playfabUserId,
                            Keys : ["GenericData"]
                  }

    );

    
    if( !dataRequest.Data.hasOwnProperty("GenericData"))
    {
       ResetVolatileData();
       dataRequest = server.GetUserInternalData({
                            PlayFabId : playfabUserId,
                            Keys : ["GenericData"]
                        });
       
    }

    return JSON.parse( dataRequest.Data["GenericData"].Value ); 
}


/**
 *  Set User Internal Data Wrapper for Given User  
 *  Data will be stored in a Key call GenericData as Json
 *  
 *  args Is a Dictionary key<>value to be stored in the JSON
 * 
 *  return JSON Response messageValue:"OK"
 */
handlers.UpdateGenericPlayerData= function( args )
{

    
    var dataRequest = server.GetUserInternalData
                      ({
                            PlayFabId : currentPlayerId, Keys : ["GenericData"]
                      });


    var CurrentData = {};

    for(var i = 0; i < args["argsList"].length;  i++)
    {
        var argName = args["argsList"][i];
        CurrentData[argName] = args[argName];
    }

    var updateUserInternalDataResult = server.UpdateUserInternalData(
            {
                PlayFabId : currentPlayerId,
                Data : {"GenericData" :  JSON.stringify( CurrentData ) } 
            });

   return {  messageValue : "OK" }; 
}

/**
 *  RESET VOLATILE DATA (initializing) 
 *  Resets Generic Data and Also Teams Data (better for Stress)
 */
handlers.ResetVolatileData = function (args)
{

    //---------------------      
    var DataToSave =  {
                                "PlayerName"    : args.PlayerUserName ,
                                "SelectedSkin"  : "1" ,
                                "PlayerLevel"   :  1,
                                "Prestiges"     :  0,
                                "LoginTimes"    :  0,
                                "Ads"           :  "noads",
                                "TimeSinceCreation"    :  "notime",
                                "TotalTimeOnline"      :  "notime",
                                "CurrentMoney"         :  "0",
                                "ClickersDiscovered"   :  0,
                                "QtyDiamonds"     :  "0",
                                "QtyFragments"    :  "0",
                                "APKVersion"      : "none"

                        };

    var updateUserInternalDataResult = server.UpdateUserInternalData(
            {
                PlayFabId : currentPlayerId,
                Data : { 
                    "GenericData" : JSON.stringify(DataToSave)
                       
                    
                }
   
            }); 


    

    CreateResetPlayerTeamsData();


    return {  messageValue : "OK"  }; 

}
