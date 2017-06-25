
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
           case "GameLogic" : return  Save_GameLogic(DATA); break;
           case "PlayerData" : return Save_PlayerData(DATA); break;
           case "TapManager" : return Save_TapManager(DATA); break;
           case "Clickers" :  return   Save_Clickers(DATA); break;
           case "MoneyManager" : return   Save_MoneyManager(DATA); break;
           case "TrainingLevel" : return   Save_TrainingLevel(DATA); break;
           case "FragmentMinions" : return   Save_FragmentMinions(DATA); break;
           case "PrestigeManager" : return   Save_PrestigeManager(DATA); break; 
           case "RewardsManager" : return   Save_RewardsManager(DATA); break; 
           

           
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
           case "MoneyManager" : return  Load_MoneyManager(); break;
           case "TrainingLevel" : return  Load_TrainingLevel(); break;
           case "FragmentMinions" : return  Load_FragmentMinions(); break;
           case "PrestigeManager" : return  Load_PrestigeManager(); break;
           case "RewardsManager" : return  Load_RewardsManager(); break;
           
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

    var ExplodedValues = data.split("#");
    
    DataObj.PlayerName = ExplodedValues[0];
    DataObj.TestMode   = (ExplodedValues[1] == "1");
    DataObj.APKVersion = ExplodedValues[2];
    

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

    Save_Data("GameLogic",Data_GameLogic);
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
    "TapLevel" : "1",
    "Multipliers" : "",
    "TapsQty" : "0"
};


function Save_TapManager(data)
{
    var DataObj = Request_SavedGame("TapManager",Data_TapManager);

    var ExplodedValues = data.split("#");
    DataObj.TapLevel    = ExplodedValues[0];
    DataObj.Multipliers = ExplodedValues[1];
    DataObj.TapsQty     = ExplodedValues[2];

    Save_Data("TapManager",DataObj);

    return ExplodedValues;
}

function Load_TapManager(data)
{
    Data_TapManager = Request_SavedGame("TapManager",Data_TapManager);

    var ReturnString ="";
    ReturnString += Data_TapManager.TapLevel +"#";
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
             "QtyAscensions"   : Clicker_IsAscended,
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
        formattedString += clicker.QtyAscensions + "&";
        formattedString += clicker.SkillLevel + "&";
        formattedString += clicker.MinionsLevel + "&";
        formattedString += clicker.Multipliers + "&";
        formattedString += clicker.Timer ;
        formattedString +=  "#";
    }
    formattedString = formattedString.substring(0,formattedString.length-1);

    return formattedString;
}



//////
//      --------------------------------------- MONEY MANAGER -- INFO  ----------------------------------                        
//////
var Data_MoneyManager = 
{
    "Money"     : "0",
    "Diamonds"  : "0",
    "Fragments" : "0",
    "MoneyAccumulated_LifeTime" : "0",
    "MoneyAccumulated_Prestige" : "0",
    "MaxMoneyThisSeasson" : "0",
    "MaxMoneyReachedEver" : "0"
};


function Save_MoneyManager(data)
{
    var DataObj = Request_SavedGame("MoneyManager",Data_MoneyManager);

    var ExplodedValues  = data.split("#");
    DataObj.Money       = ExplodedValues[0];
    DataObj.Diamonds    = ExplodedValues[1];
    DataObj.Fragments   = ExplodedValues[2];
    DataObj.MoneyAccumulated_LifeTime = ExplodedValues[3];
    DataObj.MoneyAccumulated_Prestige = ExplodedValues[4];
    DataObj.MaxMoneyThisSeasson       = ExplodedValues[5];
    DataObj.MaxMoneyReachedEver       = ExplodedValues[6];
    

    Save_Data("MoneyManager",DataObj);

    return ExplodedValues;
}

function Load_MoneyManager(data)
{
    Data_MoneyManager = Request_SavedGame("MoneyManager",Data_MoneyManager);

    var ReturnString ="";
    ReturnString += Data_MoneyManager.Money +"#";
    ReturnString += Data_MoneyManager.Diamonds + "#";
    ReturnString += Data_MoneyManager.Fragments + "#";
    ReturnString += Data_MoneyManager.MoneyAccumulated_LifeTime + "#";
    ReturnString += Data_MoneyManager.MoneyAccumulated_Prestige + "#";
    ReturnString += Data_MoneyManager.MaxMoneyThisSeasson + "#";
    ReturnString += Data_MoneyManager.MaxMoneyReachedEver;

    return ReturnString;
}



//////
//      --------------------------------------- TrainingLevel -- INFO  ----------------------------------                        
//////
var Data_TrainingLevel = 
{
    "Level"             : "1",
    "MaxLeavelReached"  : "1",
    "CurrentStep_XP"    : "0"
};


function Save_TrainingLevel(data)
{
    var DataObj = Request_SavedGame("TrainingLevel",Data_TrainingLevel);

    var ExplodedValues  = data.split("#");
    DataObj.Level       = ExplodedValues[0];
    DataObj.MaxLeavelReached    = ExplodedValues[1];
    DataObj.CurrentStep_XP   = ExplodedValues[2];
    

    Save_Data("TrainingLevel",DataObj);

    return ExplodedValues;
}

function Load_TrainingLevel(data)
{
    Data_TrainingLevel = Request_SavedGame("TrainingLevel",Data_TrainingLevel);

    var ReturnString ="";
    ReturnString += Data_TrainingLevel.Level + "#";
    ReturnString += Data_TrainingLevel.MaxLeavelReached + "#";
    ReturnString += Data_TrainingLevel.CurrentStep_XP;

    return ReturnString;
}





//////
//      --------------------------------------- FRAGMENT MINIONS -- INFO  ----------------------------------                        
//////
var Data_FragmentMinions = 
{
    "MinionLevels"      : "",
};


function Save_FragmentMinions(data)
{
    var DataObj = Request_SavedGame("FragmentMinions",Data_FragmentMinions);

    DataObj.MinionLevels       = data;

    Save_Data("FragmentMinions",DataObj);
}

function Load_FragmentMinions(data)
{
    Data_FragmentMinions = Request_SavedGame("FragmentMinions",Data_FragmentMinions);

    var ReturnString = Data_FragmentMinions.MinionLevels;

    return ReturnString;
}





//////
//      --------------------------------------- PrestigeManager -- INFO  ----------------------------------                        
//////
var Data_PrestigeManager = 
{
    "Prestiges_Qty"      : "0",
    "LastTime_Prestiged"  : "0",
    "SubLvl_LastPrestige" : "0"
};


function Save_PrestigeManager(data)
{
    var DataObj = Request_SavedGame("PrestigeManager",Data_PrestigeManager);

    var ExplodedValues  = data.split("#");
    DataObj.Prestiges_Qty        = ExplodedValues[0];
    DataObj.LastTime_Prestiged   = ExplodedValues[1];
    DataObj.SubLvl_LastPrestige  = ExplodedValues[2];
    

    Save_Data("PrestigeManager",DataObj);
}

function Load_PrestigeManager(data)
{
    Data_PrestigeManager = Request_SavedGame("PrestigeManager",Data_PrestigeManager);

    var ReturnString ="";
    ReturnString += Data_PrestigeManager.Prestiges_Qty + "#";
    ReturnString += Data_PrestigeManager.LastTime_Prestiged + "#";
    ReturnString += Data_PrestigeManager.SubLvl_LastPrestige;

    return ReturnString;
}





//////
//      --------------------------------------- RewardsManager -- INFO  ----------------------------------                        
//////
var Data_RewardsManager = 
{
    "NatsBuff_Profit_RemainingTime"      : "0",
    "NatsBuff_Time_RemainingTime"      : "0",
    "Perk_24hs_x2_RemainTime"      : "0",
    "Perk_24hs_x4_RemainTime"      : "0",
    "Perk_24hs_x7_RemainTime"      : "0",
    "Perk_Hold_TapPower_1hs_Time"      : "0",
    "Circus_RemainingTime"      : "0",
    "Circus_Multiplier"      : "0",
    "LoopyRoads_RemainingTime"      : "0",
    "LoopyRoads_Multiplier"      : "0",
    "LoopyRoads_ScoreBest"      : "0",
    "Flappy_RemainingTime"      : "0",
    "Flappy_Multiplier"      : "0",
    "Flappy_ScoreBest"      : "0"
};



function Save_RewardsManager(data)
{
    var DataObj = Request_SavedGame("RewardsManager",Data_RewardsManager);

    var ExplodedValues  = data.split("#");
    DataObj.NatsBuff_Profit_RemainingTime        = ExplodedValues[0];
    DataObj.NatsBuff_Time_RemainingTime   = ExplodedValues[1];
    DataObj.Perk_24hs_x2_RemainTime  = ExplodedValues[2];
    DataObj.Perk_24hs_x4_RemainTime  = ExplodedValues[3];
    DataObj.Perk_24hs_x7_RemainTime  = ExplodedValues[4];
    DataObj.Perk_Hold_TapPower_1hs_Time  = ExplodedValues[5];
    DataObj.Circus_RemainingTime  = ExplodedValues[6];
    DataObj.Circus_Multiplier  = ExplodedValues[7];
    DataObj.LoopyRoads_RemainingTime  = ExplodedValues[8];
    DataObj.LoopyRoads_Multiplier  = ExplodedValues[9];
    DataObj.LoopyRoads_ScoreBest  = ExplodedValues[10];
    DataObj.Flappy_RemainingTime  = ExplodedValues[11];
    DataObj.Flappy_Multiplier  = ExplodedValues[12];
    DataObj.Flappy_ScoreBest   = ExplodedValues[13];
    

    Save_Data("RewardsManager",DataObj);
}

function Load_RewardsManager(data)
{
    Data_RewardsManager = Request_SavedGame("RewardsManager",Data_RewardsManager);

    var ReturnString ="";
    ReturnString += Data_RewardsManager.NatsBuff_Profit_RemainingTime + "#";
    ReturnString += Data_RewardsManager.NatsBuff_Time_RemainingTime + "#";
    ReturnString += Data_RewardsManager.Perk_24hs_x2_RemainTime + "#";
    ReturnString += Data_RewardsManager.Perk_24hs_x4_RemainTime + "#";
    ReturnString += Data_RewardsManager.Perk_24hs_x7_RemainTime + "#";
    ReturnString += Data_RewardsManager.Perk_Hold_TapPower_1hs_Time + "#";
    ReturnString += Data_RewardsManager.Circus_RemainingTime + "#";
    ReturnString += Data_RewardsManager.Circus_Multiplier + "#";
    ReturnString += Data_RewardsManager.LoopyRoads_RemainingTime + "#";
    ReturnString += Data_RewardsManager.LoopyRoads_Multiplier + "#";
    ReturnString += Data_RewardsManager.LoopyRoads_ScoreBest + "#";
    ReturnString += Data_RewardsManager.Flappy_RemainingTime + "#";
    ReturnString += Data_RewardsManager.Flappy_Multiplier + "#";
    ReturnString += Data_RewardsManager.Flappy_ScoreBest;
    

    return ReturnString;
}