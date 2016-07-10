/**
 * Created by Tommzy on 10/29/2015.
 */
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
    var local = $location.absUrl().replace('http://', '');
    local = local.replace('https://','');
    $scope.newURL = local.substring(0, local.length - 1);
    $scope.submitURL = function(nu){
        var url;
        if (nu.indexOf('http://') != 0 || nu.indexOf('https://')!= 0 ) {
            url = "http://" + nu;
        }else {
            url = nu.replace('https://','http://');
        }
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