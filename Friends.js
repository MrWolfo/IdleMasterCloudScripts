

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
