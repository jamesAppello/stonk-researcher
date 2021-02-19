require('dotenv').config();
const unirest = require("unirest");
const fs = require('fs');
const r = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers");
r.query({ "region": "US" });
r.headers({
	"x-rapidapi-key": process.env.RAPI_KEY,
	"x-rapidapi-host": process.env.RAPI_HOST,
	"useQueryString": true
});
r.end(function (res) {
	if (res.error) throw new Error(res.error);
    const {finance:{result}} = res.body;
    // console.log(result);
    // console.log("_____ TOP-TRENDING-TICKERS _____")
    let data;
    for(let i=0;i<result.length;i+=1){
        // console.log(result[i].quotes);
        for (let j=0;j<result[i].quotes.length;j+=1) {
            data = result[i].quotes[j].longName
                    +" ["+result[i].quotes[j].symbol
                    +"] @$"+result[i].quotes[j].regularMarketPrice
                    +"\n------------------------------------------\n";
            // console.log(data);
            newFile(data);
        }
    }
});
function newFile(payload) { fs.appendFile('./topTix.txt', payload, function(err) { if (err) throw err; }); }