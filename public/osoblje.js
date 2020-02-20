function populirajListuOsoblja(){
    let datum = new Date();
        let danUsedmici = datum.getDay();
        if(danUsedmici==0){
            danUsedmici=6;
        }else{
            danUsedmici--;
        }
        //let sati = datum.getHours();
        //let minute = datum.getMinutes();
        //let vrijeme = `${(sati<10)?'0'+sati:sati}:${(minute<10)?'0'+minute:minute}`;
        let vrijeme = datum.toLocaleTimeString();
        let dan = datum.getDate();
        let mjesec = datum.getMonth()+1;
        let godina = datum.getFullYear();
        datum = `${(dan < 10) ? "0" + dan:dan}.${(mjesec < 10) ? "0" + mjesec : mjesec }.${godina}`;
        //console.log(datum, vrijeme);
        pozivi.zauzecaSaOsobljem(datum,danUsedmici,vrijeme);
}

function popuni(){
    populirajListuOsoblja();
    setInterval(function(){
        populirajListuOsoblja();
    }, 30000);
}
