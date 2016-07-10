/**
 * Created by Tommzy on 12/5/2015.
 */
// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema of url
var urlSchema = new Schema({
    url: String,
    id : Number
});

// static method that let it use mongodb's findAndModify.
urlSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

// the schema is useless so far
// we need to create a model using it
var URL = mongoose.model('URL', urlSchema);
// make this available to our users in our Node applications
module.exports = URL;

//get incrementer and assign id
URL.prototype.create = function(callback) {
    var This = this;
    URL.findAndModify({idsign:"incrementer"}, [],{$inc:{'incid' : 1}},{ new: true, upsert : true }, function (err, doc) {
        //each time get the incrementer's value and record
        var url = {
            url : This.url,
            id : doc.value.incid
        };
        callback(null, url);
    });
};

// save into the database
URL.prototype.insert = function (url, callback){
    var new_url = new URL(url);
    new_url.save(function(err,doc){
        if (err) {
            return err;
        }
        var id = doc.id;
        return  callback(null, id);
    });
};