
var request = require('request');
var rp = require('request-promise');
var url = '52.66.151.182:8080';
// var url = 'newerp.storeking.in';

function getUrl(){
    var promise = new Promise(function(resolve, reject){
        rp('https://'+url).then(function (data) {
            resolve(url = "https://"+url);
        }).catch(function(){
            resolve(url = "http://"+url);
        });
    });
    return promise;
}

module.exports = {
    getUrl: getUrl()
};
