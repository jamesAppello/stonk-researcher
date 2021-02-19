require('dotenv').config();
const unirest = require("unirest");

const r = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-popular-watchlists");

r.headers({
	"x-rapidapi-key": process.env.RAPI_KEY,
	"x-rapidapi-host": process.env.RAPI_HOST,
	"useQueryString": true
});


r.end(function (res) {
	if (res.error) throw new Error(res.error);

	// console.log(res.body);
    const {finance:{result}} = res.body;
    console.log(result);
    for(let i=0;i<result.length;i+=1){
        console.log(result[i].portfolios);
    }
});
