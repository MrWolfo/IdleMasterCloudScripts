
//-- Daily Rewards Title Data Format
var DailyRewards_TitleData = 
{
    "DayCounter" : 0,     
    "LastCheckTime" : 0
};


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
    var playerData = server.GetUserInternalData(
        {
            PlayFabId : currentPlayerId,
            Keys : ["DailyReward"]
        }
    );

    var Player_DailyRewards_Data = {};
    
    if(dataRequest.Data.hasOwnProperty("DailyReward"))
    {
        
        Player_DailyRewards_Data = JSON.parse(dataRequest.Data["DailyReward"].Value) ;
        
    }



    return {   data : Player_DailyRewards_Data };
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

