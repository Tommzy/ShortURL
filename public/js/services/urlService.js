/**
 * Created by Tommzy on 11/11/2015.
 */
pageRouter.service('urlService', function ($http) {
    return {
        getURL:function (shortURL) {
            //the data bind on the scope
            return $http.get("getURL?shortURL=" + shortURL).then(function(response){
                var url = null;
                if (response.data != null) {
                    console.log("URL Received from urlService" + response.data.url);
                    url = response.data.url;
                }
                return url;
            }, function(error) {
                // promise rejected, could log the error with: console.log('error', error);
                console.log("Get url Error At server: "+error);
                return "Invalid short url. Please check and input again.";
            });
        },
        addURL:function (url) {
            var nu = {newURL : url};
            return $http.post('postURL',nu).then(function(shortURL){
                console.log("Service get url : " + shortURL.data);
                return shortURL.data;
            },function(error) {
                // promise rejected, could log the error with: console.log('error', error);
                console.log("Get URL Error At server: " + error);
            });
        }
    };
});