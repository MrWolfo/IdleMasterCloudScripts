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


handlers.ResetPlayerData = function (args)
{
    /*
    var updateUserDataResult = server.UpdateUserData(
            {
                PlayFabId : currentPlayerId,
                Data : {
                    "Clickers" :  null,
                    "FragmentMinions" :  null,
                    "GameLogic" :  null,
                    "MoneyManager" :  null,
                    "PlayerData" :  null,
                    "PrestigeManager" :  null,
                    "TapManager"    : null,
                    "TrainingLevel" :  null,
                    "DailyReward" :  null,
                    "RewardsManager" :  null
             } 
            });
     */
     var updateUserInternalDataResult = server.UpdateUserInternalData(
            {
                PlayFabId : currentPlayerId,
                Data : {
                    "TeamsData" : null ,
                    "Clickers" :  null,
                    "FragmentMinions" :  null,
                    "GameLogic" :  null,
                    "MoneyManager" :  null,
                    "PlayerData" :  null,
                    "PrestigeManager" :  null,
                    "TapManager"    : null,
                    "TrainingLevel" :  null,
                    "DailyReward" :  null,
                    "RewardsManager" :  null
                    
             } 
            });
}
