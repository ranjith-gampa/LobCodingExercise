var google_api_key = "AIzaSyDYXdvSuBqsP_ToM7fWN6iFKsdEPNubWfI";
var lob_api_key = "test_775b4abdae34271f21b71d0e57b6c3a6dd5";

const fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var opn = require('opn');
var path = require('path');
var request = require('request');
var tinyurl = require('tinyurl');
var lob = require('lob')(lob_api_key);

var arg = process.argv.slice(2);
var rawdata;
var user;
var official = {};

// reads file name from command line input
try{
    rawdata = fs.readFileSync(arg[0]);
    user = JSON.parse(rawdata);
}
catch(err){
    console.log("File missing or Empty File")
}


app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'jade');


app.get('/', function (req, res) {

    if(user === undefined){
        res.status(404).send("Empty File Contains, See the guidelines for file");
    }
    else {
        var address = user.address_line1 + user.address_line2 + user.address_city;
        var url = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address + "&includeOffices=true&levels=administrativeArea1&roles=headOfGovernment&key=" + google_api_key;

        request(
            {
                url: url
            },
            function (error, response, body) {
                if (!error) {
                    var officials = JSON.parse(body)["officials"];
                    var officialName = officials[0]["name"];
                    var officialAddress = officials[0]["address"];
                    official.name = officialName;
                    if (officialAddress[0] === undefined) {
                        console.log("No Official Found at given address");
                        return
                    }
                    else {
                        official.address_line1 = officialAddress[0]["line1"];
                        official.address_line2 = officialAddress[0]["line2"];
                        official.address_city = officialAddress[0]["city"];
                        official.address_state = officialAddress[0]["state"];
                        official.address_zip = officialAddress[0]["zip"];
                        official.address_country = 'US';
                    }

                    res.render('index', {
                        name: user.name,
                        addressline1: user.address_line1,
                        addressline2: user.address_line2,
                        city: user.address_city,
                        state: user.address_state,
                        country: user.address_country,
                        zip: user.address_zip,
                        message: user.message,
                        toname: official.name,
                        toaddressline1: official.address_line1,
                        toaddressline2: official.address_line2,
                        tocity: official.address_city,
                        tostate: official.address_state,
                        tozip: official.address_zip
                    });
                }
                else {
                    console.log(error);
                }
            }
        );
    }
});


//post request to send create letter using Lob SDK.
app.post('/sendLetter', function(req, res){

    var name = official.name
    var message = user.message;
    delete user.message;

    var letter = lob.letters.create({
            description : 'Letter to Representative',
            to : official,
            from : user,
            file: '<html style="padding-top: 3in; margin: .5in;">{{message}}</html>',
            merge_variables:{message:message},
            color : true
        },
        function (err, resp) {
            if(!err) {
                var url = resp['url']
                tinyurl.shorten(url, function(shortenedUrl){
                    console.log(shortenedUrl);
                })
                res.status(200).send("Success");
            }
            else {
                console.log(err.message);
                res.status(500).send(err.message);
            }
        }
    )
});

//opens HTML page to show user data and to-address info
if(user !== undefined){
    opn('http://localhost:3012');
}


http.listen(3012);


