require('dotenv').config();
const unirest = require('unirest');
const r = unirest("GET","https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers");
const fs = require('fs');
r.query({
	"region": "US",
	"lang": "en-US",
	"start": "0",
	"count": "100"
});

r.headers({
	"x-rapidapi-key": process.env.RAPI_KEY,
	"x-rapidapi-host": process.env.RAPI_HOST,
	"useQueryString": true
});


r.end(function (res) {
	if (res.error) throw new Error(res.error);

	// console.log(res.body);
    const {finance: {result}} = res.body;
    // console.log(result)
    let data;
    for (let i = 0; i < result.length; i+=1) {
        // console.log("===========TITLE===========")
        // console.log(result[i]['title']);
        // console.log("===========DESCRIPTION===========")
        // console.log(result[i]['description']);
        // console.log('\n======| SYMBOLS  |======');
        for (let j = 0; j < result[i]['quotes'].length; j+=1) {
            // console.log(result[i]['quotes'][j].symbol);
            data += "\n"+result[i]['quotes'][j].symbol+"\n";
        }
    }
    newFile(data);
});
function newFile(payload) { fs.appendFile('./topMovers.txt', payload, function(err) { if (err) throw err; }); }