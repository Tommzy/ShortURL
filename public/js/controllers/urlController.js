/**
 * Created by Tommzy on 10/29/2015.
 */

function shrinkHttpAddress(url){
    var str = url;
    if (str.indexOf('http://') == 0 ){
        str = str.replace('http://','');
    }
    if (str.indexOf('https://') == 0 ){
        str = str.replace('https://','');
    }
    return str;
}
pageRouter.controller('urlController', function($scope,$location,urlService) {
    /*
     alert functions
     */
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    /*
     url variables
     */
    var local = shrinkHttpAddress($location.absUrl());
    $scope.newURL = local.substring(0, local.length - 1);
    $scope.submitURL = function(nu){
        var url = shrinkHttpAddress(nu);
        url = "http://" + url;
        var urlPromise= urlService.addURL(url);
        urlPromise.then(function(data){
            $scope.newURL = local + data;
        }, function(error) {
            console.log("Get url Error: "+error);
        });
    };
    $scope.parseURL = function(nu){
        var urlSlice = nu.split("/");
        var key = urlSlice[urlSlice.length - 1];
        var urlPromise= urlService.getURL(key);
        urlPromise.then(function(data){
            if(data == null) {
                $scope.alerts.push({ type: 'info', msg: 'Not valid short url, please double check and try again!'});
            } else {
                var purl = data.replace('http://', '');
                purl = purl.replace('https://', '');
                $scope.newURL = purl;
            }
        }, function(error) {
            console.log("Get url Error: "+error);
        });
    };
});
