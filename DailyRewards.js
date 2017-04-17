
//-- Daily Rewards Title Data Format
var DailyRewards_TitleData = 
{
    "DayCounter" : 0,     
    "LastCheckTime" : 0
};



handlers.DailyRewards_DailyCheck = function (args)
{

    var GetTitleDataResult = server.GetTitleInternalData(
                                {
                        	    	"Keys": [ "DailyRewards" ]
	                            });

   var DailyRewards_Data = GetTitleDataResult.Data;

   log.debug(DailyRewards_Data);

   return;
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

