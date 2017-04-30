


//-- Called automatically from Task each 6 hours
//-- This Triggers on all players the Level Up of Selectec Active Skin
handlers.LevelUp_AllSkins = function (args)
{

    //--- SkinsLvlUp_Counter:
    //------- each time this function is called, the counter will increment by 1. 
    //------- this will be useful for tracking and also to know how many level ups the player has skipped/accumulated.
    //------- Player will save "last upgrade done number" to compare how many upgrades they need to do.

    var GetTitleDataResult = server.GetTitleInternalData(
                                {
                        	    	"Keys": [ "SkinsGlobal_Data" ]
	                            });

   var SkinsGlobal_Data =  JSON.parse( GetTitleDataResult.Data[ "SkinsGlobal_Data" ] );

   SkinsGlobal_Data.LvlUp_Counter ++;

   var update = server.SetTitleInternalData(
                                {
                                  "Key": "SkinsGlobal_Data"  ,
                                  "Value" : JSON.stringify( SkinsGlobal_Data )
	                            }
                              );
   return "OK";

}