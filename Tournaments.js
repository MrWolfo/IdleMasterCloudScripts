
function Get_LeaderboardName_ForTournamentNumber(number)
{
    if(number%2 == 0)
        return "TeamPoints_Even";

    return "TeamPoints_Odd";
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
