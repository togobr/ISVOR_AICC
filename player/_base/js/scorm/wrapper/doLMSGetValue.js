define([], function() {

    var doLMSGetValue = function(name) {
        var api = Player.Scorm.Wrapper.getAPIHandle();
        if (api == null) {
            alert("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
            return "";
        } else {
                var value = pipwerks.SCORM.get(name);

                var errCode = api.GetLastError().toString();
            
            if (errCode != Player.Scorm.Wrapper.options._NoError) {
                // an error was encountered so display the error description

                    var errDescription = api.GetErrorString(errCode);
               
                
                alert("LMSGetValue(" + name + ") failed. \n" + errDescription);
                return "";
            } else {
                return value.toString();
            }
        }
    }

    return doLMSGetValue;
});