

//------------------------------------- LIBRARY FUNCTIONS -----------------------------------------

/*-----------------------------------------------------------------------------------------
                      AUTOMATIC METHODS 
   These Methos are fired by events or by task manager and will run automatically, without 
   an user called Run CloudScript
 ------------------------------------------------------------------------------------------
  */


//--------- Global Statistics 












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


