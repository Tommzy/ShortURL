/**
 * Created by Tommzy on 7/9/2016.
 */
var express = require('express');
var router = express.Router();              // get an instance of the express Router
var URL = require('../app/models/URL.js');  //import url def
var dict = "X,9,E,P,t,b,H,g,R,z,J,W,T,0,D,y,Q,6,l,x,1,V,u,Y,7,Z,j,5,i,h,K,s,v,2,N,G,U,e,q,C,a,n,r,L,k,o,B,f,I,m,M,A,S,F,8,c,p,w,O,d,3,4";
var dictArray = new Array();
dictArray = dict.split(",");
var lengthOfUrl = 5;

function str10to62(num) {
    console.log("num to be translated: " + num);
    var res = "";
    while (num != 0 || res.length < lengthOfUrl) {
        res = dictArray[(num % 62)] + res;
        num = Math.round(num / 62);
    }
    return res;
}
function str62to10(num) {
    console.log("62 bit to be translated: " + num);
    var strNum = new String(num);
    var numLength = strNum.length;
    var res = 0;
    for (var i = 0; i < numLength; i++) {
        res += Math.pow(62, numLength - i - 1) * dictArray.indexOf(strNum.charAt(i));
    }
    console.log("Translated to 10-bites: " + res);
    return res;
}
router.route('/postURL')
    .post(function(req,res){
        var newURL = req.body.newURL;
        console.log("New URL address: " + newURL);
        //generate shortURL;
        var shortURL = "";
        URL.findOne({url : newURL},function(err,url){
            if (err) {
                console.log(err);
                res.json(JSON.stringify(err));
            }
            if (url != null) {
                shortURL = str10to62(url.id);
                console.log("Short url get from the database: "+ shortURL);
                res.json(shortURL);
            } else {
                console.log("Cannot find the url " + newURL +" in the database.");
                console.log("Generating url.");
                var new_url= new URL({
                    url : newURL,
                    id : -1
                });
                new_url.create(function (err, doc) {
                    if (err) return handleError(err);
                    console.log('New URL pattern saved successfully!');
                    new_url.insert(doc, function(err, id){
                        if (err) {
                            console.log(err);
                            res.json(JSON.stringify(err));
                        }
                        shortURL = str10to62(id);
                        console.log("Short url generated: "+ shortURL);
                        res.json(shortURL);
                    });
                });
            }
        });

    });
router.route('/getURL')
    .get(function(req,res){
        var id = str62to10(req.query.shortURL);
        URL.findOne({id : id},function(err,url){
            if (err) {
                console.log("getURL errored: " + err);
                res.json(JSON.stringify(err));
            }
            res.json(url);
        });
    });
router.route('/:urlcode')
    .get(function(req, res){
        var shortURL = req.params.urlcode;
        var urlid = str62to10(shortURL);
        URL.findOne({id : urlid}, function(err, urlEntity){
            if (err) {
                console.log(err);
                res.json(JSON.stringify(err));
            }
            if (urlEntity != null) {
                res.writeHead(302, {
                    'Location': urlEntity.url
                });
            }
            res.end();
        });
    });
module.exports = router;