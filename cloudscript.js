var TIME_ONE_SECOND = 1000;
var TIME_ONE_MINUTE = TIME_ONE_SECOND * 60;
var TIME_ONE_HOUR   = TIME_ONE_MINUTE * 60;
var TIME_ONE_DAY    = TIME_ONE_HOUR * 24;
//***********
var LOGIN_TIMES = "LoginTimes";
///----------- DAILY REWARDS CONSTANTS
var TIME_FOR_ONE_REWARD = TIME_ONE_DAY ; //0.4 * TIME_ONE_MINUTE;
var LAST_TIME_DAILY_REWARD = "DailyRewardLastTime";
var TOTAL_NUMBER_REWARD_DAYS = 15;
////---------- TEAMS AND TOURNAMENTS CONSTANTS
var TOURNAMENT_DURATION = TIME_ONE_DAY;

var TEMPORAL_CODE_GIFT_50DIAMONDS = "IDLESUNsssssDAaaaaaY";


//------------------------------------- LIBRARY FUNCTIONS -----------------------------------------
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/*-----------------------------------------------------------------------------------------
                      AUTOMATIC METHODS 
   These Methos are fired by events or by task manager and will run automatically, without 
   an user called Run CloudScript
 ------------------------------------------------------------------------------------------
  */

///------- OnPlayerCreated rename display name and something else?
handlers.OnPlayer_Created = function (args,context)
{
    var ServerData = server.GetPlayerCombinedInfo(
                                {
                        	    	"PlayFabId": currentPlayerId,
                                    "InfoRequestParameters" : []
	                            });
}

handlers.Add_500d_For_TimePlayed = function (args)
{
    var GranItem = server.GrantItemsToUser(
                                {
                        	    	"PlayFabId": currentPlayerId,
                                    "Annotation": "Granted for Buy",
                                    "ItemIds" : ["diamonds_pack_01"]
	                            });

     var Message = "A little Present for being playing since the beginning of times.\n-The Idling Admin";

     try
     {
         Message = args["CustomMessage"];
     }   
     catch(e)
     {
        Message = "A little Present for being playing since the beginning of times.\n-The Idling Admin";
     }
            
     
     var InstanceID = GranItem.ItemGrantResults[0].ItemInstanceId;
     
     server.UpdateUserInventoryItemCustomData({
                        	    	"PlayFabId": currentPlayerId,
                                    "ItemInstanceId": InstanceID,
                                    "Data" : {"CustomMessage":Message}
	                            });


}

handlers.Add_Small_50Diamonds_Gift = function (args)
{
    var GranItem = server.GrantItemsToUser(
                                {
                        	    	"PlayFabId": currentPlayerId,
                                    "Annotation": "Granted by Gift (codes or others)",
                                    "ItemIds" : ["diamonds_pack_gift"]
	                            });

     var Message = "Stay tunned on Social Media\nfor more Gifts!";

     try
     {
         Message = args["CustomMessage"];
     }   
     catch(e)
     {
        Message = "Stay tunned on Social Media\nfor more Gifts!";
     }
            
     
     var InstanceID = GranItem.ItemGrantResults[0].ItemInstanceId;
     
     server.UpdateUserInventoryItemCustomData({
                        	    	"PlayFabId": currentPlayerId,
                                    "ItemInstanceId": InstanceID,
                                    "Data" : {"CustomMessage":Message}
	                            });


}



///------- GRANT ITEM ON BUY STUFF
handlers.OnRealMoneyPurchase = function (args,context)
{
    var ItemSKU = context.playStreamEvent.PurchasedProduct[0];
    var ItemsIds = [ItemSKU];

    server.WritePlayerEvent( 
                {
                    PlayFabId : currentPlayerId,
                    EventName : "ITEM_PURCHASED",
                    Body      : {  "SKU" :ItemSKU  }
                });  


    //---- Add the Persistent Item that probably will be used for Diamonds if we do Resets of Progressions to Restore all Bought Diamonds
    if(ItemSKU == "diamonds_pack_00" || ItemSKU == "diamonds_pack_01" || ItemSKU == "diamonds_pack_02"|| ItemSKU == "diamonds_pack_03")
            ItemsIds = [ItemSKU+"_persistent"];
    //--- If the item just bought are the Packages of Diamonds 04 or 05, a Golden Nats is included!!
    else if(ItemSKU == "diamonds_pack_04" || ItemSKU == "diamonds_pack_05")
            ItemsIds = [ItemSKU+"_persistent","giftbox_golden_nats"];
    //--- If the SKU is not Diamonds then no need to add anything else
    else
    {
        return {"data":"No need of add additional items"};
    }
   
    //---- Grant the items in the server --------------------------------------
    var GranItem = server.GrantItemsToUser(
                                {
                        	    	"PlayFabId": currentPlayerId,
                                    "Annotation": "Granted for Buy",
                                    "ItemIds" : ItemsIds
	                            });

                                  
}

///------- GRANT ITEM ON BUY STUFF
handlers.PRT_DN = function (args,context)
{

   var ItemSKU = args["IDIT"];
   var Signature = args["SIGN"];
   var ItemExists = false;

   //---- Register the possible ItemSKu IDs..

   ItemExists = (ItemSKU == "golden_nats")      || 
                (ItemSKU == "diamonds_pack_00") ||
                (ItemSKU == "diamonds_pack_01") ||
                (ItemSKU == "diamonds_pack_02") ||
                (ItemSKU == "diamonds_pack_03") ||
                (ItemSKU == "diamonds_pack_04") ||
                (ItemSKU == "diamonds_pack_05");

   if(!ItemExists)     
        return;

    var ItemsIds = [ItemSKU];

    //---- Add the Persistent Item that probably will be used for Diamonds if we do Resets of Progressions to Restore all Bought Diamonds
    if(ItemSKU == "diamonds_pack_00" || ItemSKU == "diamonds_pack_01" || ItemSKU == "diamonds_pack_02"|| ItemSKU == "diamonds_pack_03")
            ItemsIds = [ItemSKU,ItemSKU+"_persistent"];

    //--- If the item just bought are the Packages of Diamonds 04 or 05, a Golden Nats is included!!
    if(ItemSKU == "diamonds_pack_04" || ItemSKU == "diamonds_pack_05")
            ItemsIds = [ItemSKU,ItemSKU+"_persistent","giftbox_golden_nats"];

  
    //---- Grant the items in the server --------------------------------------
    var GranItem = server.GrantItemsToUser(
                                {
                        	    	"PlayFabId": currentPlayerId,
                                    "Annotation": "Granted for Buy",
                                    "ItemIds" : ItemsIds
	                            });
  
    var EventBody = 
    {
        "SKU" : ItemSKU,
        "Signature" : Signature
    };

    server.WritePlayerEvent( 
                {
                    PlayFabId : currentPlayerId,
                    EventName : "ITEM_BOUGHT",
                    Body      : EventBody
                });

  
  return {  messageValue : GranItem };
}


handlers.OnResetVersion_Reward = function (args,context)
{
   var PlayerInventory = server.GetUserInventory({"PlayFabId": currentPlayerId});

   var Packs_to_Add = ["diamonds_pack_02"];

   for(var i = 0 ; i< PlayerInventory.Inventory.length ; i++)
   {
       if(PlayerInventory.Inventory[i].ItemId.includes("_persistent") )
       {
            Packs_to_Add.push(PlayerInventory.Inventory[i].ItemId.replace("_persistent",""));
       }
           
   }

   server.SubtractUserVirtualCurrency(
       {
           "PlayFabId": currentPlayerId,
           "VirtualCurrency" : "GD",
           "Amount" : 60000
       }
   );


   var GranItem = server.GrantItemsToUser(
                                {
                        	    	"PlayFabId": currentPlayerId,
                                    "Annotation": "Granted for Version Reset",
                                    "ItemIds" : Packs_to_Add
	                            });
  
   server.WritePlayerEvent( 
                {
                    PlayFabId : currentPlayerId,
                    EventName : "VERSION_RESET"
                });

  
  return {  messageValue : GranItem };
}


handlers.On_PlayerLevelUp = function (args,context)
{
  
  var GetTitleDataResult = server.GetTitleData(
                                {
                        	    	"Keys": [ "LevelsUp"]
	                            });
  
  var PlayerNewLevel = context.playStreamEvent.NewLevel - 1;
  
  var Data = JSON.parse(GetTitleDataResult.Data["LevelsUp"]);
  Data.PerLevel[ PlayerNewLevel ][ (PlayerNewLevel+1).toString() ]++
  
  //GetTitleDataResult.Data["LevelsUp"] = JSON.stringify(Data);
  
  var Created = server.SetTitleData({
                                    "Key": "LevelsUp",
                                    "Value": JSON.stringify(Data)

                                    });
  
}

function Get_LeaderboardName_ForTournamentNumber(number)
{
    if(number%2 == 0)
        return "TeamPoints_Even";

    return "TeamPoints_Odd";
}

//--------- Global Statistics 

handlers.UpdateGlobalStats_OnFirstLogin = function (args)
{
    var GetTitleDataResult = server.GetTitleData(
                                {
                        	    	"Keys": [ "TotalPlayers" , "GooglePlay","Amazon","Mobango"]
	                            });


    GetTitleDataResult.Data["TotalPlayers"].TotalPlayers ++;
    GetTitleDataResult.Data[ args["StoreName"] ]++;


    //--- Update Sever Info
    var CreatedInfo = server.SetTitleData({
         							 "Keys": [ "TotalPlayers" , "GooglePlay","Amazon","Mobango"],
      							     "Value": GetTitleDataResult
        								});   

}


///---- Every 30 Minutes it checks if touranment has finished
handlers.Check_If_Tournament_Finished = function (args)
{
    var GetTitleDataResult = server.GetTitleData(
                                {
                        	    	"Keys": [ "TeamsAndTournaments" ]
	                            });

    var TandTDAta = JSON.parse( GetTitleDataResult.Data.TeamsAndTournaments );                                

    if(TandTDAta.EndTime < Date.now())
    {
        handlers.RestartTournament();
        return "YES_RESTARTED";
    }

    var date = new Date(TandTDAta.EndTime - Date.now() );
    var str = '';
    str += (date / TIME_ONE_DAY) + " days, ";
    str += (date /TIME_ONE_HOUR ) + " hours, ";
    str += (date /TIME_ONE_MINUTE ) + " Minutes, ";
    str += (date /TIME_ONE_SECOND ) + " Seconds, ";
    

    return "NOT_RESTARTED -- " + str;
}

///------------ Restart the Tournament Timer
//-- Resets the current Leaderboard and kick the info to Last one for Record
handlers.RestartTournament = function (args)
{
    var GetTitleDataResult = server.GetTitleData(
                                {
                        	    	"Keys": [ "TeamsAndTournaments" ]
	                            });





 	//---- Create the Tournaments and Teams Data. THIS WILL RUN ONLY ONCE for first time of we destroy all the data
    if( !GetTitleDataResult.Data.hasOwnProperty("TeamsAndTournaments"))
    {
        

        // 0 Pigs, 1 Cavalliers ,2 BigFishes,3 Unicorns,4 Mosters
        //---- Qty1to5 is the times this team finished in that position
        var TournamentData =
            {
                "Number":1,
                "StartTime" : Date.now(),
                "EndTime" : Date.now() + TIME_ONE_DAY * 2,
                "TeamsStatus":[
                        {  "ID":0, "Points":50  , "LastPoints" : 7 , "LastPos" : 4 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0 },
                        {  "ID":1, "Points":51 , "LastPoints" : 14 , "LastPos" : 3 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0 },
                        {  "ID":2, "Points":49 , "LastPoints" : 18 , "LastPos" : 2 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0 },
                        {  "ID":3, "Points":48 , "LastPoints" : 1 , "LastPos" : 5 , "MedalsByPos":[0,0,0,0,0]  , "TotalPlayers" : 0 },
                        {  "ID":4, "Points":52 , "LastPoints" : 20 , "LastPos" : 1 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0 }
                      ]
            };
        //--- Create Info On Server for Tournaments (title data)
        var CreatedInfo = server.SetTitleData({
         							 "Key": "TeamsAndTournaments",
      							     "Value": JSON.stringify(TournamentData)

        								});   
        //---- Get Info Again to Refresh and use in the next steps
        GetTitleDataResult = server.GetTitleData(
                                {
                        	    	"Keys": [ "TeamsAndTournaments" ]
	                            });
    }

    //---- Data from the Current Tournament 
    var TandTDAta = JSON.parse( GetTitleDataResult.Data.TeamsAndTournaments );
   
    //--- Clone last tournament and order the list of Teams for Final Position ---------
    var ClonedTournament =JSON.parse(JSON.stringify(TandTDAta));
    ClonedTournament.TeamsStatus.sort(function(a,b) {return (a.Points > b.Points) ? 1 : ((b.Points > a.Points) ? -1 : 0);} );
    ClonedTournament.TeamsStatus.reverse();
    
    ///-- Reset the global data of tournaments
    var New_Tournament_Number = TandTDAta.Number+1;
    var New_Tournament_Duration =   (New_Tournament_Number%2==0)  ? TIME_ONE_DAY * 2 :  TIME_ONE_DAY * 5; 

    var TournamentData =
        {
            "Number": New_Tournament_Number,
            "StartTime" : Date.now(),
            "EndTime"   : Date.now() + New_Tournament_Duration,
            "TeamsStatus":[
                    {  "ID":0, "Points": getRandomInt(109,341)  , "LastPoints" : 0 , "LastPos" : 0 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0},
                    {  "ID":1, "Points": getRandomInt(109,341)  , "LastPoints" : 0 , "LastPos" : 0 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0},
                    {  "ID":2, "Points": getRandomInt(109,341)  , "LastPoints" : 0 , "LastPos" : 0 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0},
                    {  "ID":3, "Points": getRandomInt(109,341)  , "LastPoints" : 0 , "LastPos" : 0 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0},
                    {  "ID":4, "Points": getRandomInt(109,341)  , "LastPoints" : 0 , "LastPos" : 0 , "MedalsByPos":[0,0,0,0,0] , "TotalPlayers" : 0}
                    ]

        };


    //-- Assign the Position in the last Tournament to Each Team
    for(var i=0 ; i < 5 ; i++)
    {
        //--- the ID of the current pos Team (because Cloned is sorted by position of last tournament)  
        var RealID =    ClonedTournament.TeamsStatus[i].ID;
        //--- Assign to the current team the final position and how much points did in the last tournament 
        TournamentData.TeamsStatus[ RealID ].LastPos      = i+1;
        TournamentData.TeamsStatus[ RealID ].LastPoints   = ClonedTournament.TeamsStatus[i].Points;
        TournamentData.TeamsStatus[ RealID ].TotalPlayers = ClonedTournament.TeamsStatus[i].TotalPlayers;

        //--- Clone the medals by position from the last tournament to this (will be resetted otherwise)
        for(var j=0 ; j < 5 ; j++)
        {
            TournamentData.TeamsStatus[ RealID ].MedalsByPos[j] = TandTDAta.TeamsStatus[ RealID ].MedalsByPos[ j ]; 
        }
        //-- Add 1 to the position the team finished in the MedalsByPosition
        TournamentData.TeamsStatus[ RealID ].MedalsByPos[i]++; 

    }

    //---- replace Tournament Data with the New Resetted tournament
    var Created = server.SetTitleData({
                                    "Key": "TeamsAndTournaments",
                                    "Value": JSON.stringify(TournamentData)

                                    });

    
    TandTDAta["TimeToFinish"] = TandTDAta.EndTime - Date.now();

    // Increment Points Leaderboard
    var LeaderboardName_ForNewTournament = Get_LeaderboardName_ForTournamentNumber(TournamentData.Number);


    var url = "https://1446.playfabapi.com/Admin/IncrementPlayerStatisticVersion";
    var method = "post";
    var contentBody = JSON.stringify( {"StatisticName": LeaderboardName_ForNewTournament} );
    var contentType = "application/json";
    var headers = {"X-SecretKey" : "K8QOEEG46WU8CR6693X6WS6QYKT1I8BBQUEZD8MBUQ73NEUO16"};
    var responseString =  http.request(url,method,contentBody,contentType,headers); 


    //admin.IncrementPlayerStatisticVersion();

	return {  messageValue : "OK" , tournament: TandTDAta.Number , AllData : TandTDAta };

}

//--- When Player Logs for First Time, his Data is Created and Initialized
handlers.PlayerCreated  = function (args)
{
    handlers.ResetVolatileData(args);
}

handlers.ReLoggedEvent = function (args)
{
    server.WritePlayerEvent( 
            {
                PlayFabId : currentPlayerId,
                EventName : "LOGGED_BACK" ,
                Body : args
            });
        
        

    //-- Get Already Stored Info 
    var CurrentData = GetGenericPlayerData(  currentPlayerId );

    if(!CurrentData.hasOwnProperty("LoginTimes"))
    	CurrentData.LoginTimes = 0;  
  
    CurrentData.LoginTimes ++;
    CurrentData.PlayerName = args["UserName"]; 
    CurrentData.Ads        = args["Ads"];
    CurrentData.TimeSinceCreation  = args["TimeSinceCreation"];
    CurrentData.TotalTimeOnline    = args["TotalTimeOnline"];
    CurrentData.CurrentMoney       = args["CurrentMoney"];
    CurrentData.ClickersDiscovered = args["ClickersDiscovered"];
    CurrentData.APKVersion         = args["APKVersion"];

    var updateUserInternalDataResult = server.UpdateUserInternalData(
            {
                PlayFabId : currentPlayerId,
                Data : {"GenericData" :  JSON.stringify( CurrentData ) } 
            });
}


///----------------------- GET leaderboards
handlers.Get_LeaderboardForTournament = function (args)
{

     

    var TournamentNumber = args["TNumber"];
    var LeaderboardName  = Get_LeaderboardName_ForTournamentNumber(TournamentNumber); 

    

    var LeaderBoardResponse =  server.GetLeaderboard({
        "StatisticName": LeaderboardName,
        "StartPosition": 0,
        "MaxResultsCount": 50
     });

    

    var AllLeaderBoard = LeaderBoardResponse.Leaderboard;
    var opertuzo = "";

    var ThisFriendGenericData1 = GetGenericPlayerData(  AllLeaderBoard[0].PlayFabId );
    var ThisFriendGenericData2 = GetGenericPlayerData(  AllLeaderBoard[1].PlayFabId );
    var ThisFriendGenericData3 = GetGenericPlayerData(  AllLeaderBoard[2].PlayFabId );


    for (var i = 0 ; i<AllLeaderBoard.length;i++)
    {
            continue;

            var dataRequest = server.GetUserInternalData(
                {
                  PlayFabId : AllLeaderBoard[i].PlayFabId,
                  Keys : ["GenericData"]
                }
            );

            opertuzo +=  dataRequest.Data["GenericData"].Value.Skin + "&&&";

            //return JSON.parse( dataRequest.Data["GenericData"].Value );

            
            //var ThisFriendGenericData = GetGenericPlayerData(  AllLeaderBoard[i].PlayFabId );
            
            //AllLeaderBoard[i].Skin        =  dataRequest.Data["GenericData"].Value.Skin; // ThisFriendGenericData["SelectedSkin"];
            /*
            AllLeaderBoard[i].PlayerName  = ThisFriendGenericData["PlayerName"];
            AllLeaderBoard[i].PlayerLevel = ThisFriendGenericData["PlayerLevel"];
            */   
            

            var ThisPlayer = server.GetUserInternalData(
                                {
                                    PlayFabId : AllLeaderBoard[i].PlayFabId,
                                    Keys : "TeamsData"
                                }
            );

            var PlayerTeamsData = JSON.parse( ThisPlayer.Data["TeamsData"].Value );
            AllLeaderBoard[i].SelectedTeam = PlayerTeamsData.SelectedTeam;
            
    }
    
    return {  messageValue : "OKaa33333aaa" , e: opertuzo, lala : AllLeaderBoard };

    var PlayerStatistics = server.GetLeaderboardAroundUser
    ({
            "PlayFabId" : currentPlayerId,
            "StatisticName": LeaderboardName,
            "MaxResultsCount": 20
    });
    var ThisPlayerStats = PlayerStatistics.Leaderboard[0];

    for (var i = 0 ; i<PlayerStatistics.Leaderboard.length;i++)
    {
            if(PlayerStatistics.Leaderboard[i].PlayFabId == currentPlayerId)
                    ThisPlayerStats = PlayerStatistics.Leaderboard[i];
    }


    return {  
                  messageValue : "OK" , 
                  data : 
                  {
                      ThisPlayerPosition : ThisPlayerStats.Position,
                      ThisPlayerPoints   : ThisPlayerStats.StatValue,
                      playersList : AllLeaderBoard
                  } 
            }; 
}



/**
 *   LOAD FRIEND LIST WITH ADDITIONAL DATA LIKE SKIN AND NAME (and others)
 */

handlers.GetFriendData = function (args)
{
    var DataReturn = 
    {
        PlayFabId : args["PlayfabID"]
    };

    var ThisFriendGenericData = GetGenericPlayerData(  args["PlayfabID"] );
	DataReturn.Skin           = ThisFriendGenericData["SelectedSkin"];
    DataReturn.PlayerName     = ThisFriendGenericData["PlayerName"];
    DataReturn.PlayerLevel    = ThisFriendGenericData["PlayerLevel"];
    DataReturn.Prestiges      = ThisFriendGenericData["Prestiges"];

    var ThisFriendTeamData = server.GetUserInternalData(
                            {
                                PlayFabId : args["PlayfabID"],
                                Keys : "TeamsData"
                            }
    );


    var PlayerTeamsData = JSON.parse( ThisFriendTeamData.Data["TeamsData"].Value );
    DataReturn.SelectedTeam = PlayerTeamsData.SelectedTeam;

    return {  data : DataReturn }; 
}


handlers.LoadFriendList = function (args)
{

    try
    {
        var FriendList = server.GetFriendsList(
            {
                PlayFabId : currentPlayerId,
                IncludeFacebookFriends : true
            }); 
        return {  messageValue : "OK" , data : FriendList };     
    }
    catch(e)
    {
        log.debug(e);
        return "NO_FRIENDS"; 
    }
    

   //[{"FriendPlayFabId":"64D76C71AE52A215","FacebookInfo":{"FacebookId":"325693174465514","FullName":"Roberto Planta"}}]   

   return {  messageValue : "OazK" }; 

   return {  messageValue : "OK" , data : FriendList }; 

   for (var i = 0 ; i<FriendList.Friends.length;i++)
   {
        var ThisFriendGenericData = GetGenericPlayerData(  FriendList.Friends[i].FriendPlayFabId );
		
        
        
        FriendList.Friends[i].Skin        = ThisFriendGenericData["SelectedSkin"];
        FriendList.Friends[i].PlayerName  = ThisFriendGenericData["PlayerName"];
        FriendList.Friends[i].PlayerLevel = ThisFriendGenericData["PlayerLevel"];

        var ThisFriendTeamData = server.GetUserInternalData(
                            {
                                PlayFabId : FriendList.Friends[i].FriendPlayFabId,
                                Keys : "TeamsData"
                            }
        );

    

        var PlayerTeamsData = JSON.parse( ThisFriendTeamData.Data["TeamsData"].Value );
        FriendList.Friends[i].SelectedTeam = PlayerTeamsData.SelectedTeam;
        FriendList.Friends[i].CurrentPlayingTournament    = PlayerTeamsData.CurrentPlayingTournament;
        
        //--- FIX the issue of players that are not updated in current tournament, so we fake the information and avoid to recalculate everyplayer because of this player 
        
        if(DataTaT.Number == PlayerTeamsData.CurrentPlayingTournament) //-- If Friends is playing the Current Tournament
        {
              FriendList.Friends[i].PointsNow    = PlayerTeamsData.PointsNow;
              FriendList.Friends[i].PointsLast   = PlayerTeamsData.PointsLast;  
        }
        else if(DataTaT.Number - 1 == PlayerTeamsData.CurrentPlayingTournament) //--- If Friend played the last tournament but not the current one
        {
              FriendList.Friends[i].PointsNow    = 0;
              FriendList.Friends[i].PointsLast   = PlayerTeamsData.PointsNow;  
        }
        else //-- if Friend didnt play this or the last tournament 
        {
            FriendList.Friends[i].PointsNow    = 0;
            FriendList.Friends[i].PointsLast   = 0;
        }

        
        
   }
    return {  messageValue : "OK" , data : FriendList }; 

}





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


/***
	 CLOUD SCRIPT FOR TEAMS AND TOURNAMENTS

*/


/****
 *   SAVE USER CLOUD  -------------------- USER CLOUD DATA --------------
 */
handlers.SaveUserCloudData = function (args)
{
   

  return {  messageValue : "OK" , data : typeof( JsonData ) }; 

}


/****
 *   RETRIEVE TOURNAMENTS DATA FOR INTERNAL USE ONLY 
 */

function GetTeamsAndTournamentData()
{
    
	// Get Teams and Tournament Data
	var GetTitleDataRequest =
    {
	    	"Keys": [ "TeamsAndTournaments" ]
	};
    var GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);

    

    if( !GetTitleDataResult.Data.hasOwnProperty("TeamsAndTournaments"))
    {
       handlers.CheckIfTournamentFinished({"CodigoLoco":"123TUVIEJA"});
       GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
    }

    var JSON_TnTData = GetTitleDataResult.Data["TeamsAndTournaments"];
    
    var DataTaT = JSON.parse(JSON_TnTData);

    return DataTaT;
    
}

/****
 *   RETRIEVE PLAYER DATA FOR INTERNAL USE ONLY , for the keys passed as arguments
 */
function GetPlayerDataForKeys( keys )
{
   var playerData = server.GetUserInternalData(
     {
         PlayFabId : currentPlayerId,
         Keys : keys
     }
    );

   return playerData.Data;
}


////-------------------------------- PLAYER ADD POINTS TO TEAM FOR A PRESTIGE
handlers.AddPrestigeTeamPoints = function ( args )
{
    //---------------------------------------------- UPDATE Data for the Team which earns this points -----------
    var QtyPoints = args["Qty"];


    


    var DataTaT    = GetTeamsAndTournamentData();

    var PlayerTeamsData = handlers.Get_TeamsAndTournaments_Data().data.PlayerData; 


    var SelectedTeam = PlayerTeamsData.SelectedTeam;

    var YouSent =     QtyPoints;

    if( ! isFinite(QtyPoints))
    {
            QtyPoints = 1500;
    }

    QtyPoints  += DataTaT.TeamsStatus[SelectedTeam].Points ;

    DataTaT.TeamsStatus[SelectedTeam].Points = QtyPoints;


    
    

    var Created = server.SetTitleData({
         							 "Key": "TeamsAndTournaments",
      							     "Value": JSON.stringify(DataTaT)

        								});

   //----------- UPDATE THE PLAYER'S DATA WITH CURRENT POINTS DONE
                                      
   PlayerTeamsData.PointsNow += YouSent; 
   PlayerTeamsData.CurrentPlayingTournament = DataTaT.Number;


   var updateUserInternalDataResult = server.UpdateUserInternalData(
   {
        PlayFabId : currentPlayerId,
        Data :
            {
            "TeamsData": JSON.stringify( PlayerTeamsData )
            }
   });  
   
   //----------------- Update Leaderboard Statistic
   server.UpdatePlayerStatistics
    ({
            PlayFabId : currentPlayerId,
            "Statistics": 
            [
                {   "StatisticName": Get_LeaderboardName_ForTournamentNumber(PlayerTeamsData.CurrentPlayingTournament),  "Value": PlayerTeamsData.PointsNow }
            ]

    });

   ///, "Version" : PlayerTeamsData.CurrentPlayingTournament 

    return {  messageValue : "OK" , qty: QtyPoints , total: PlayerTeamsData.PointsNow };

}


////----------------------------------------------------------------------------- COLLECT LAST TOURNAMENT BOUNTY
handlers.CollectBountyTournament = function ( args )
{


     var DataTaT         = GetTeamsAndTournamentData();

     var PlayerTeamsData = handlers.Get_TeamsAndTournaments_Data().data.PlayerData;

     

     var LastTournamentEarned =   PlayerTeamsData.LastTournamentEarned;  //--- The last Tournament in which player received bounty
     var PastTournamentNumber = (DataTaT.Number - 1);  //--- Past Tournament to the tournament currently on course


    

     //--- if the player collected bounty for an old tounrament, different from the last one
     //--- then I should collect the last tournament's bounty, because it's finished
     if(  LastTournamentEarned!= PastTournamentNumber)
     {
          
         
          var YourTeamPos      =  DataTaT.TeamsStatus[ PlayerTeamsData.SelectedTeam ].LastPos;
          var MedalPosToUpdate = YourTeamPos - 1; //- minus 1 because will be saved in an array and firt pos is 0

          


          //--- update saved values
          PlayerTeamsData.LastTournamentEarned = PastTournamentNumber;
          PlayerTeamsData.Medals[ MedalPosToUpdate ]++;                           ///--- add the medal to your personal inventory  
          PlayerTeamsData.TimesPlayedByTeam[ PlayerTeamsData.SelectedTeam ]++;    ///--- add one time played with this team for you
          PlayerTeamsData.PointsLast            = PlayerTeamsData.PointsNow;
          PlayerTeamsData.PointsNow             = 0; 
          

         


          var updateUserInternalDataResult = server.UpdateUserInternalData(
           {
              PlayFabId : currentPlayerId,
              Data :
                 {
                   "TeamsData": JSON.stringify( PlayerTeamsData )
                 }
           });  

           return {  messageValue : "cccccccccc ALTO OPERTUZO" , lala : YourTeamPos};


    	   return {  messageValue : "COLLECTED" , data: {TournamentCollecting:PastTournamentNumber, TeamPos: YourTeamPos}};
     }

  	 return {  messageValue : "ERROR_NOCOLLECTIONFORTIWACHO" };





}



///--------------------------- Create Player Teams Data -------------
function CreateResetPlayerTeamsData()
{
    var DataTaT = GetTeamsAndTournamentData(); 

    var PlayerTeamData = {
            "SelectedTeam" : -1 ,
            "SelectedDate" : Date.now(),
            "PointsNow"    : 0,
            "PointsLast"   : 0,
            "RegisteredAtTournamentNumber" : DataTaT.Number ,
            "LastTournamentEarned": -10,
            "TournamentsPlayed"   : 0,
            "CurrentPlayingTournament" : 0,
            "Medals" : [0,0,0,0,0],
            "TimesPlayedByTeam" :  [0,0,0,0,0]
        };

    //--- Default Data
    var updateUserInternalDataResult = server.UpdateUserInternalData(
    {
        PlayFabId : currentPlayerId,
        Data : {  "TeamsData" : JSON.stringify( PlayerTeamData ) }
        
    });

    var PlayerKeysUsed = ["TeamsData"];
    var playerData     =  GetPlayerDataForKeys(PlayerKeysUsed) ;

    return playerData;
}

//// -----  GET INFO OF TEAMS AND TOURNAMENTS
//          It Also resturns the data for only ThisPlayer
handlers.Get_TeamsAndTournaments_Data = function (args)
{

  ///---------- Get the Teams and Tournaments data for this player
  var PlayerKeysUsed = ["TeamsData"];
  var playerData =  GetPlayerDataForKeys(PlayerKeysUsed) ;
  ///----- Create Player Team Data if not created ------------------
  if( !playerData.hasOwnProperty("TeamsData"))
  {
          CreateResetPlayerTeamsData();
          //---- RELOAD data after creation so this Method can keep working for first time
          playerData = GetPlayerDataForKeys(PlayerKeysUsed) ;

  }//-- end if need to create data

  var ParsedDataPlayer   = JSON.parse( playerData["TeamsData"].Value );

  ///--------- Get the global Teams and Tournaments Data
  var DataTaT = GetTeamsAndTournamentData();
  DataTaT["TimeToFinish"] = DataTaT.EndTime - Date.now();
  DataTaT["Duration"] = TOURNAMENT_DURATION;

  
  var ReturnData = 
  {
        messageValue : "OK" , 
        data :
        {
                PlayerData : ParsedDataPlayer,
                GlobalData : DataTaT
        }
          

  };


  return ReturnData;

}

///----------------------------- Player Select Team
handlers.SelectTeam = function(args)
{
    var PlayerKeysUsed  = ["TeamsData"];
    var playerData      =  GetPlayerDataForKeys(PlayerKeysUsed) ;
    var ParsedTeamData  = JSON.parse( playerData["TeamsData"].Value );

    var IDReceived = args["TeamID"];


    var DataTaT         = GetTeamsAndTournamentData();
    var PreviousTeam = ParsedTeamData.SelectedTeam;

    if(PreviousTeam != "-1")
    {
        DataTaT.TeamsStatus[PreviousTeam].TotalPlayers--;
    }
    DataTaT.TeamsStatus[IDReceived].TotalPlayers++;

    var Created = server.SetTitleData({
                                    "Key": "TeamsAndTournaments",
                                    "Value": JSON.stringify(DataTaT)

                                    });

    ParsedTeamData.SelectedTeam = IDReceived;
    ParsedTeamData.SelectedDate =  Date.now();

    var updateUserInternalDataResult = server.UpdateUserInternalData(
     {
     	PlayFabId : currentPlayerId,
        Data : {  "TeamsData" : JSON.stringify ( ParsedTeamData ) }
     });


	return {  messageValue : "OK" , data : IDReceived };
}


///-------------------------------------------------------------------------------
///---- SUPORT CODE STUFF
///------------------------------------------------

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

handlers.CollectDailyReward = function (args)
{
     var playerData = server.GetUserInternalData(
     {
         PlayFabId : currentPlayerId,
         Keys : ["DailyRewardLastTime","LoginTimes","RewardNumberOnCalendar"]
     }
      );


    var LastTimeDailyReward = Date.now();
    var RewardNumberOnCalendar = playerData.Data["RewardNumberOnCalendar"].Value;

    RewardNumberOnCalendar ++;

    var ReturnData =
    {
        "RewardNumberOnCalendar" : RewardNumberOnCalendar - 1,
        "Status" : "OK"
    };


    if(RewardNumberOnCalendar >= TOTAL_NUMBER_REWARD_DAYS)
        RewardNumberOnCalendar=0;

    var updateUserInternalDataResult = server.UpdateUserInternalData(
     {
     	PlayFabId : currentPlayerId,
        Data :
           {
             "DailyRewardLastTime" : LastTimeDailyReward ,
             "RewardNumberOnCalendar" :RewardNumberOnCalendar

           }


     }

   );


    return {  messageValue : "OK" , data : ReturnData };


}



handlers.CheckDailyRewards = function (args)
{



   var playerData = server.GetUserInternalData(
     {
         PlayFabId : currentPlayerId,
         Keys : ["DailyRewardLastTime","LoginTimes","RewardNumberOnCalendar"]
     }

   );




   var LastTimeDailyReward = -1;
   var RewardNumberOnCalendar = 0;
   var DataStatus;

   try
   {
     LastTimeDailyReward = playerData.Data[ "DailyRewardLastTime" ].Value;
     RewardNumberOnCalendar = playerData.Data["RewardNumberOnCalendar"].Value;

     DataStatus = "DataRetrieved";
   }
   catch(e)
   {

     var nowDate = Date.now();
     LastTimeDailyReward = nowDate;
     RewardNumberOnCalendar = 0;

     DataStatus = "DataReseted";
   }



   if(currentPlayerId == "183272FA15A79320")
		TIME_FOR_ONE_REWARD = 0.4 * TIME_ONE_MINUTE;
  
   var TimePassed =  Date.now() - LastTimeDailyReward;

   //--- This Value is in Seconds, Because we use Seconds in Unity3D
   var TimeForNextReward =  (TIME_FOR_ONE_REWARD - TimePassed) / TIME_ONE_SECOND;
   var STATUS = "";



   if(TimePassed > TIME_FOR_ONE_REWARD)
   {
     	//----------- If you lost the chance, then, reset all the calendar
   		if(TimePassed > TIME_FOR_ONE_REWARD *2)
        {
             STATUS = "REWARD_MISSED";
             RewardNumberOnCalendar = 0;
          	 TimeForNextReward = 0;


        }
        //------- If still didnt lost the chance
     	else
        {
            STATUS = "REWARD_READY";
            TimeForNextReward = 0;
        }
   }
   else
   {
      STATUS = "REWARD_WAITING";

   }

   //return {  messageValue : "FORCED" , data : ReturnData };


  var ReturnData =
  {
      "DataStatus" : DataStatus,
      "LastTimeDailyReward" : LastTimeDailyReward,
      "RewardNumberOnCalendar" : RewardNumberOnCalendar ,
      "TimeForNextReward" : TimeForNextReward,   //--- In Seconds
      "Status" : STATUS,
      "Now" : Date.now(),
      "TimePassed" : TimePassed
  };

   var updateUserInternalDataResult = server.UpdateUserInternalData(
     {
     	PlayFabId : currentPlayerId,
        Data :
           {
             "DailyRewardLastTime" : LastTimeDailyReward ,
             "RewardNumberOnCalendar" :RewardNumberOnCalendar

           }


     }

   );


   return {  messageValue : "OK" , data : ReturnData };

}