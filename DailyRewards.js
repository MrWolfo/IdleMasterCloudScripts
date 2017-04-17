
//-- Daily Rewards Title Data Format
var DailyRewards_TitleData = 
{
    "DayCounter" : 0,     
    "LastCheckTime" : 0
};


//-- Called automatically from Task once a day. 
//-- This moves the daily rewards counter for all the players to check
handlers.DailyRewards_DailyCheck = function (args)
{

    var GetTitleDataResult = server.GetTitleInternalData(
                                {
                        	    	"Keys": [ "DailyRewards" ]
	                            });

   var DailyRewards_Data = GetTitleDataResult.Data;

   DailyRewards_Data.DayCounter ++;
   var nowDate = Date.now();
   DailyRewards_Data.LastCheckTime = nowDate;


    var update = server.SetTitleInternalData(
                                {
                                  "Key": "DailyRewards"  ,
                                  "Value" : "DailyRewards_Data"
	                            }
                              );

   return "OK";

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

