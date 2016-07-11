/**
 * Created by Tommzy on 10/29/2015.
 */
pageRouter.controller('urlController', function($scope,$location,$sce,urlService) {
    /*
     alert functions
     */
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    /*
     validate url function
     */
    $scope.validateURL = function() {
        $scope.isDisabled = !validator.isURL($scope.newURL.toString(),{require_protocol : true});
    };
    /*
     url variables
     */
    var local = $location.absUrl();
    $scope.newURL = local.substring(0, local.length - 1);
    $scope.tips = $sce.trustAsHtml('<span class="glyphicon glyphicon-search" ' +
        'aria-hidden="true"></span> Please input valid url. E.g. http://www.google.com');
    $scope.submitURL = function(nu){
        var url = nu;
        var urlPromise= urlService.addURL(url);
        urlPromise.then(function(data){
            $scope.newURL = local + data;
        }, function(error) {
            console.log("Get url Error: "+error);
        });
    };
    $scope.isDisabled = !validator.isURL($scope.newURL.toString());
    $scope.parseURL = function(nu){
        var urlSlice = nu.split("/");
        var key = urlSlice[urlSlice.length - 1];
        var urlPromise= urlService.getURL(key);
        urlPromise.then(function(data){
            if(data == null) {
                $scope.alerts.push({ type: 'info', msg: 'Not valid short url, please double check and try again!'});
            } else {
                $scope.newURL = data;
            }
        }, function(error) {
            console.log("Get url Error: "+error);
        });
    };
});
