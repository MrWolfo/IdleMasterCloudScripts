handlers.RefreshCloudScript = function( args )
{
    var request = admin.GetCloudScriptRevision();

    return { pepote: request}
}