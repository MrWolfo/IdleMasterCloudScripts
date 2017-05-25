
/*
***********                                                                     ***********
***********      --------------- PLAYER DATA MANAGEMENT ------------------      ***********
***********                                                                     ***********
*/


handlers.SaveInfo = function( args )
{
    var SAVE_NAME = args["SaveName"];
    var DATA      = args["data"];

    switch(SAVE_NAME)
    {
           case "GameLogic" : return  Save_GameLogic(); break;
           case "PlayerData" : return Save_PlayerData(); break;
           case "TapManager" : return Save_TapManager(); break;
           case "Clickers" : return   Save_Clickers(); break;
    }

    return OK;
}

handlers.LoadInfo = function( args )
{
    var SAVE_NAME = args["SaveName"];

    switch(SAVE_NAME)
    {
           case "GameLogic" : return  Load_GameLogic(); break;
           case "PlayerData" : return  Load_PlayerData(); break;
           case "TapManager" : return  Load_TapManager(); break;
           case "Clickers" : return  Load_Clickers(); break;
           
    }
    
}

function Request_SavedGame(SaveName, DefaultObject)
{
    var dataRequest = server.GetUserInternalData
                      ({
                            PlayFabId : currentPlayerId, 
                            Keys : [SaveName]
                      });

    //--- If Saved Data, overwritte it
    if(dataRequest.Data.hasOwnProperty(SaveName))
    {
        DefaultObject = JSON.parse(dataRequest.Data[SaveName].Value) ;
    }
    else
    {
        Save_Data(SaveName,DefaultObject);
    }
    return DefaultObject;
}

function Save_Data(SaveName,dataInfo)
{
    var SaveData = {};
    SaveData[SaveName] = JSON.stringify( dataInfo);

    var save = server.UpdateUserInternalData(
            {
                    PlayFabId : currentPlayerId,
                    Data : SaveData 
            } 
        );
}


//////
//      --------------------------------------- PLAYER DATA INFO  ----------------------------------                        
//////
var Data_PlayerData = 
{
    "PlayerName" : "",
    "TestMode"   : false,
    "APKVersion" : ""
};


function Save_PlayerData(data)
{
    var DataObj = Request_SavedGame("PlayerData",Data_PlayerData);

    var ExplodedValues = DataObj.split("#");
    for (var dataString of ExplodedValues)
    {
        DataObj.PlayerName = dataString[0];
        DataObj.TestMode   = (dataString[1] == "1");
        DataObj.APKVersion = dataString[2];
    }

    Save_Data("PlayerData",DataObj);
}

function Load_PlayerData(data)
{
    Data_PlayerData = Request_SavedGame("PlayerData",Data_PlayerData);

    var ReturnString ="";
    ReturnString += Data_PlayerData.PlayerName +"#";
    ReturnString += Data_PlayerData.TestMode ? "1" : "0" + "#";
    ReturnString += Data_PlayerData.APKVersion;

    return ReturnString;
}


//////
//      --------------------------------------- GAME LOGIC INFO  ----------------------------------                        
//////
var Data_GameLogic = 
{
    "LastSavedTime" : 0
};


function Save_GameLogic(data)
{
    Data_GameLogic = Request_SavedGame("GameLogic",Data_GameLogic);

    Data_GameLogic.LastSavedTime = data;

    //Save_Data("GameLogic",Data_GameLogic);

    return data;
}

function Load_GameLogic(data)
{
    Data_GameLogic = Request_SavedGame("GameLogic",Data_GameLogic);

    var ReturnString = Data_GameLogic.LastSavedTime;

    return ReturnString;
}


//////
//      --------------------------------------- TAP MANAGER -- INFO  ----------------------------------                        
//////
var Data_TapManager = 
{
    "TapPower" : "1",
    "Multipliers" : "",
    "TapsQty" : "0"
};


function Save_TapManager(data)
{
    var DataObj = Request_SavedGame("TapManager",Data_TapManager);

    var ExplodedValues = DataObj.split("#");
    for (var dataString of ExplodedValues)
    {
        DataObj.TapPower    = dataString[0];
        DataObj.Multipliers = dataString[1];
        DataObj.TapsQty     = dataString[2];
    }

    Save_Data("TapManager",DataObj);
}

function Load_TapManager(data)
{
    Data_TapManager = Request_SavedGame("TapManager",Data_TapManager);

    var ReturnString ="";
    ReturnString += Data_TapManager.TapPower +"#";
    ReturnString += Data_TapManager.Multipliers + "#";
    ReturnString += Data_TapManager.TapsQty;

    return ReturnString;
}

//////
//      --------------------------------------- CLICKERS MANAGER -- INFO  ----------------------------------                        
//////

var Data_Clickers = 
{
};


//-- This function will save only the received clickers, not all of them, in order to improve the request speed
function Save_Clickers(data)
{
    var DataObj = Request_SavedGame("Clickers",Data_Clickers);

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
        var Clicker_TimeCounter  = ClickerExploded[7];

        var Clicker_JSON = 
        {
             "Level"        : Clicker_Level,
             "Boosts"       : Clicker_BoostsDone,
             "IsAscended"   : Clicker_IsAscended,
             "SkillLevel"   : Clicker_SkillLevel,
             "MinionsLevel" : Clicker_MinionsLevel,
             "Multipliers"  : Clicker_Multipliers,
             "Timer"        : Clicker_TimeCounter
        };

        DataObj[Clicker_ID]  = Clicker_JSON;   
    }

    Save_Data("Clickers",DataObj);
}


function Load_Clickers(data)
{
    Data_Clickers = Request_SavedGame("Clickers",Data_Clickers);

    var formattedString = "";

    for(var aKey of Object.keys( Data_Clickers) )
    {
        var clicker = Data_Clickers[aKey];
        
        formattedString += aKey + "&";
        formattedString += clicker.Level + "&";
        formattedString += clicker.Boosts + "&";
        formattedString += clicker.IsAscended + "&";
        formattedString += clicker.SkillLevel + "&";
        formattedString += clicker.MinionsLevel + "&";
        formattedString += clicker.Multipliers + "&";
        formattedString += clicker.Timer ;
        formattedString +=  "#";
    }
    formattedString = formattedString.substring(0,formattedString.length-1);

    return formattedString;
}


