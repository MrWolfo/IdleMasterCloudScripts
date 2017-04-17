
/*
***********                                                                     ***********
***********      --------------- PLAYER DATA MANAGEMENT ------------------      ***********
***********                                                                     ***********
*/


handlers.SetClickersData = function( args )
{
    // the formatted string with clickers data
    var data = args["data"];

    var ClickersData_New = {};

    var ExplodedValues = data.split("#");

    
    for (var clickerString of ExplodedValues)
    {
        var ClickerExploded = clickerString.split('&');

        var Clicker_ID    = ClickerExploded[0];
        var Clicker_Level = ClickerExploded[1];
        var Clicker_BoostsDone   = ClickerExploded[2];
        var Clicker_IsAscended   = ClickerExploded[3];
        var Clicker_SkillLevel   = ClickerExploded[4];
        var Clicker_MinionsLevel = ClickerExploded[5];
        var Clicker_Multipliers  = ClickerExploded[6];
        
        var Clicker_JSON = 
        {
             "Level"        : Clicker_Level,
             "Boosts"       : Clicker_BoostsDone,
             "IsAscended"   : Clicker_IsAscended,
             "SkillLevel"   : Clicker_SkillLevel,
             "MinionsLevel" : Clicker_MinionsLevel,
             "Multipliers"  : Clicker_Multipliers
        };

        ClickersData_New[Clicker_ID]  = Clicker_JSON;   
    }

    var save = server.UpdateUserInternalData(
           {
                PlayFabId : currentPlayerId,
                Data : {"SavedClickers" :  JSON.stringify( ClickersData_New ) } 
            } 
    );



    return "OK";

}


handlers.GetClickersData = function( args )
{
     

     var dataRequest = server.GetUserInternalData
                      ({
                            PlayFabId : currentPlayerId, 
                            Keys : ["SavedClickers"]
                      });

    //--- If no saved data for this, will ask to client for saving the empty/default data 
    if(! dataRequest.Data.hasOwnProperty("SavedClickers"))
    {
        return "NODATA";
    }

    //--- 

    return "LADATALOCA";
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
