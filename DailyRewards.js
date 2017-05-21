
//-- Daily Rewards Title Data Format
var DailyRewards_TitleData = 
{
    "DayCounter" : 0,     
    "LastCheckTime" : 0
};

var ONE_DAY = 1000 * 60 * 60 * 24;


//----------- ONLY CALLED BY TASK IN SERVER -------------
//-- Called automatically from Task once a day. 
//-- This moves the daily rewards counter for all the players to check
handlers.DailyRewards_DailyCheck = function (args)
{

    var GetTitleDataResult = server.GetTitleInternalData(
                                {
                        	    	"Keys": [ "DailyRewards" ]
	                            });

   var DailyRewards_Data =  JSON.parse( GetTitleDataResult.Data[ "DailyRewards" ] );

   DailyRewards_Data.DayCounter ++;
   var nowDate = Date.now();
   DailyRewards_Data.LastCheckTime = nowDate;


    var update = server.SetTitleInternalData(
                                {
                                  "Key": "DailyRewards"  ,
                                  "Value" : JSON.stringify( DailyRewards_Data )
	                            }
                              );

   return "OK";

}


///---------- CALLED BY CLIENTS -----------------

handlers.DailyRewards_GetMyInfo = function (args)
{
    //--- global server data 
    var GetTitleDataResult = server.GetTitleInternalData( 
                                {
                        	    	"Keys": [ "DailyRewards" ]
	                            });

    var DailyRewards_Data =  JSON.parse( GetTitleDataResult.Data[ "DailyRewards" ] );


    //--- Player Data 
    var dataRequest = server.GetUserInternalData(
        {
            PlayFabId : currentPlayerId,
            Keys : ["DailyReward"]
        }
    );

    var Player_DailyRewards_Data = 
    {
        "LastDayCollected" : 0,
        "StreakCounter"    : 0
    };
    
    if(dataRequest.Data.hasOwnProperty("DailyReward"))
    {
        Player_DailyRewards_Data = JSON.parse(dataRequest.Data["DailyReward"].Value) ;
    }

    //-- Reset the player collect streak if player missed one day
    if(Player_DailyRewards_Data.DayCounter - Player_DailyRewards_Data.LastDayCollected > 1)
    {
        Player_DailyRewards_Data.StreakCounter = 0;
    }

    var save = server.UpdateUserInternalData(
           {
                PlayFabId : currentPlayerId,
                Data : {"DailyReward" :  JSON.stringify( Player_DailyRewards_Data ) } 
           } 
        );

    var TimeSinceLastCheck = Date.now() - DailyRewards_Data.LastCheckTime;
    var TimeToNextCheck    = DailyRewards_Data.LastCheckTime + ONE_DAY - TimeSinceLastCheck;

    var returnData = {
        "GC" : DailyRewards_Data.DayCounter,
        "PC" : Player_DailyRewards_Data.LastDayCollected,
        "SC" : Player_DailyRewards_Data.StreakCounter,
        "T0"  : Math.trunc( TimeSinceLastCheck / 1000),
        "T1"  : Math.trunc( TimeToNextCheck / 1000 )
    };

    return {   data : returnData };
}


handlers.CollectDailyReward = function (args)
{
     
    //--- global server data 
    var GetTitleDataResult = server.GetTitleInternalData( 
                                {
                        	    	"Keys": [ "DailyRewards" ]
	                            });

    var DailyRewards_Data =  JSON.parse( GetTitleDataResult.Data[ "DailyRewards" ] );


    //--- Player Data 
    var dataRequest = server.GetUserInternalData(
        {
            PlayFabId : currentPlayerId,
            Keys : ["DailyReward"]
        }
    );

    var Player_DailyRewards_Data = 
    {
        "LastDayCollected" : 0,
        "StreakCounter"    : 0
    };
    
    if(dataRequest.Data.hasOwnProperty("DailyReward"))
    {
        Player_DailyRewards_Data = JSON.parse(dataRequest.Data["DailyReward"].Value) ;
    }

    //-- Reset the player collect streak if player missed one day
    if(Player_DailyRewards_Data.DayCounter - Player_DailyRewards_Data.DailyRewardLastTime > 1)
    {
        Player_DailyRewards_Data.StreakCounter = 0;
    }

    //-- Reset Streak if already did all the possible days
    if(Player_DailyRewards_Data.StreakCounter >= 14)
        Player_DailyRewards_Data.StreakCounter = 0;


    Player_DailyRewards_Data.StreakCounter++;
    Player_DailyRewards_Data.LastDayCollected = DailyRewards_Data.DayCounter;

    var save = server.UpdateUserInternalData(
           {
                PlayFabId : currentPlayerId,
                Data : {"DailyReward" :  JSON.stringify( Player_DailyRewards_Data ) } 
            } 
    );

    var ReturnData = 
    {
        "SC" : Player_DailyRewards_Data.StreakCounter
    };

    return {  data : ReturnData };


}

