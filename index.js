/**
 * FIBONACCI_RETRACEMENT LEVELS
 * 23.6% 
 * 38.2% 
 * 50% 
 * 61.8%
 * 100%
 * ------------------------------
 *  UR = H - ((H-L)×percentage)  
    UE = H + ((H-L)×percentage)  
    DR = L + ((H-L)×percentage)  
    DE = L - ((H-L)×percentage)  
        
        Where,  
        H = High Range  
        L = Low Range  
        UR = Uptrend Retracement  
        UE = Uptrend Extention  
        DR = Downtrend Retracement  
        DE = Downtrend Extention   
*/
require('dotenv').config();
const unirest = require('unirest');
const request = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data");
const fs = require('fs');
const ticker = process.argv[2];
request.query({
    "symbol": ticker.toString(),
    "region": "US"
});
request.headers({
    "x-rapidapi-key": process.env.RAPI_KEY,
    "x-rapidapi-host": process.env.RAPI_HOST,
    "useQueryString": true
});
request.end(function(res) {
    if (res.error) {
        throw new Error(res.error);
    }
    // console.log(res.body);
    let data = res.body;
    for (let i = 0; i < data['prices'].length; i+=1) {
        let date = data['prices'][i].date;
        let open = data['prices'][i].open;
        let high = data['prices'][i].high;
        let low = data['prices'][i].low;
        let close = data['prices'][i].close;
        let vol = data['prices'][i].volume;
        // console.log('---------------------')
        // console.log(unixTimeConverter(date));
        // console.log("OPEN--->",open);
        // console.log("CLOSE--->",close);
        // console.log("VOLUME--->", vol);
        // console.log("__FIBONACCI_RETRACEMENT__")

        const {up_retracements, up_extentions, down_retracements, down_extentions} = fibRet(high, low);
        // console.log(fibRet(high, low));
        const URS = [up_retracements.zro, up_retracements.twenT6_six, up_retracements.thirT8_two, up_retracements.half, up_retracements.phi, up_retracements.full];
        const UES = [up_extentions.zro, up_extentions.twenT6_six, up_extentions.thirT8_two, up_extentions.half, up_extentions.phi, up_extentions.full];
        const DRS = [down_retracements.zro, down_retracements.twenT6_six, down_retracements.thirT8_two, down_retracements.half, down_retracements.phi, down_retracements.full];
        const DES = [down_extentions.zro, down_extentions.twenT6_six, down_extentions.thirT8_two, down_extentions.half, down_extentions.phi, down_extentions.full];
        // console.log("===UP_RETRACEMENTS===\n");
        // console.log(printR(URS))
        // console.log("===UP_EXTENTIONS===\n");
        // console.log(printR(UES));
        // console.log("===DOWN_RETRACEMENTS===\n");
        // console.log(printR(DRS));
        // console.log("===DOWN_EXTENTIONS===\n");
        // console.log(printR(DES));
        // console.log('---------------------\n')
        newFile(date, open, close, vol, printR(URS), printR(UES), printR(DRS), printR(DES));
    }
    console.log('file created...')
});

function printR(arr)
{
    let data;
    for (let i=0; i<arr.length; i+=1) {
        data += arr[i];
    }
    return data;
}


function newFile(d,open,close, vol, urs,ues,drs,des) {
    let payload = "******CURRENT******\nTICKER: "+ticker
                    +"\nDate:"+unixTimeConverter(d)
                    +"\nOPEN@ "+open
                    +"\nCLOSE@ "+close
                    +"\nVOLUME = "+vol
                    +"\nFibRet\nUP_Retracements:: "+urs
                    +"\nUP_Extentions:: "+ues
                    +"\nDOWN_Retracements:: "+drs
                    +"\nDOWN_Extentions:: "+des; 
    fs.writeFile("./fr/"+ticker.toString()+".txt", payload, function(err) { if (err) throw err; });
}

function unixTimeConverter(ut) {
    let input = new Date(ut*1_000);
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let yr = input.getFullYear();
    let month = months[input.getMonth()];
    let date = input.getDate();
    let hr = input.getHours();
    let min = input.getMinutes();
    let sec = input.getSeconds();
    let time = date+" "+month+" "+yr+" - "+hr+":"+min+":"+sec;
    return time;
}

function fibRet(hi, lo) {
    // levels
    const zro = 0.0
    const one = 0.236;
    const two = 0.382;
    const half = 0.50;
    const phib = 0.618;
    const full = 1;
    let percentages = [zro, one, two, half, phib, full];
    let up_retracements,up_extentions,down_retracements,down_extentions;
    up_retracements = {
        zro:UpTrend_Retracement(hi, lo, percentages[0]), 
        twenT3_six:UpTrend_Retracement(hi, lo, percentages[1]), 
        thirT8_two:UpTrend_Retracement(hi, lo, percentages[2]), 
        half:UpTrend_Retracement(hi, lo, percentages[3]), 
        phi:UpTrend_Retracement(hi, lo, percentages[4]), 
        full:UpTrend_Retracement(hi, lo, percentages[5])
    }
    up_extentions = {
        zro:UpTrend_Extention(hi, lo, percentages[0]), 
        twenT3_six:UpTrend_Extention(hi, lo, percentages[1]), 
        thirT8_two:UpTrend_Extention(hi, lo, percentages[2]), 
        half:UpTrend_Extention(hi, lo, percentages[3]), 
        phi:UpTrend_Extention(hi, lo, percentages[4]), 
        full:UpTrend_Extention(hi, lo, percentages[5])
    }
    down_retracements = {
        zro:DownTrend_Retracement(hi, lo, percentages[0]), 
        twenT3_six:DownTrend_Retracement(hi, lo, percentages[1]), 
        thirT8_two:DownTrend_Retracement(hi, lo, percentages[2]), 
        half:DownTrend_Retracement(hi, lo, percentages[3]), 
        phi:DownTrend_Retracement(hi, lo, percentages[4]), 
        full:DownTrend_Retracement(hi, lo, percentages[5])
    }
    down_extentions = {
        zro:DownTrend_Extention(hi, lo, percentages[0]), 
        twenT3_six:DownTrend_Extention(hi, lo, percentages[1]), 
        thirT8_two:DownTrend_Extention(hi, lo, percentages[2]), 
        half:DownTrend_Extention(hi, lo, percentages[3]), 
        phi:DownTrend_Extention(hi, lo, percentages[4]), 
        full:DownTrend_Extention(hi, lo, percentages[5])
    }
    return {up_retracements,up_extentions,down_retracements,down_extentions};
}

function UpTrend_Retracement(h,l,p) { return h - ((h-l)*p); }
function UpTrend_Extention(h,l,p) { return h + ((h-l)*p); }
function DownTrend_Retracement(h,l,p) { return l + ((h-l)*p); }
function DownTrend_Extention(h,l,p) { return l - ((h-l)*p); }

// app.listen(PORT,function(){ console.log("EXPRESS RUNNING @", PORT); });