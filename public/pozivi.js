var pozivi = (function(){
    var slikeTrenutne = [];
    var slikeProlse = [];


    function ucitajPodatkeImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
	    if (ajax.readyState == 4 && ajax.status == 200){
            //console.log(this.responseText);
            if (ajax.responseText)
            {
                var zauzecaJson = JSON.parse(this.responseText);
                kalendar.ucitajPodatke(zauzecaJson.periodicna, zauzecaJson.vanredna);
                //console.log(zauzecaJson.periodicna, zauzecaJson.vanredna);
            }
        }
	    if (ajax.readyState == 4 && ajax.status == 404){
            alert(this.responseText);
        }
    }
    ajax.open("GET", "http://localhost:8080/zauzeca", true);
    ajax.send();

    }

    

    function rezervisiSaluImpl(sala, termin, osobaId){
        //console.log(sala, termin, osobaId);
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
            if (ajax.readyState == 4 && ajax.status == 200){
                //console.log(this.responseText);
                if (ajax.responseText)
               {
                   //alert(this.responseText);
                   var zauzecaJson = JSON.parse(this.responseText);
                   kalendar.ucitajPodatke(zauzecaJson.periodicna, zauzecaJson.vanredna);
                   pozoviObojiZauzeto('Sale', 'pocetak', 'kraj', 'date');
               }
           }
           if (ajax.readyState == 4 && ajax.status == 404){
               var odg = this.responseText;
               alert(odg);
               pozoviObojiZauzeto('Sale', 'pocetak', 'kraj', 'date');
           }	
        }    
    ajax.open("POST", "http://localhost:8080/rezervisiSalu", true);
    //ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify({
        sala: sala,
        termin: termin,
        osobljeId: osobaId
    }));
    }


    
    function prikaziSlikuImpl(div, red, prosli, sljedeci){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
	    if (ajax.readyState == 4 && ajax.status == 200){
            if (ajax.responseText)
            {    
                var slike = JSON.parse(this.responseText);
                //console.log(slike);
                for(let i=0; i<3; i++){
                    var okvir = document.getElementsByClassName(div)[i].getElementsByTagName('img')[0];
                    if(slike[`slika${i+1}`]!= undefined){
                        okvir.style.visibility='visible';
                        let slika = slike[`slika${i+1}`].data;
                        //var b64encoded = btoa(String.fromCharCode.apply(null, slika));
                        var b64encoded=btoa(new Uint8Array(slika).reduce(function (slika, byte) {
                            return slika + String.fromCharCode(byte);
                        }, ''));
                        var datajpg = "data:image/png;base64," + b64encoded;
                        okvir.src = datajpg;
                    }else{
                        okvir.style.visibility='hidden';
                    }
                }
                //koristen red
                if(red==1){
                    prosli.disabled=true;
                }
                sljedeci.disabled=slike.disableSljedeci;
                
            }
        }
            //console.log(this.responseText);
	    if (ajax.readyState == 4 && ajax.status == 404){
            alert("Nije uspjelo!");
        }
        }
        //koristen red
    ajax.open("GET", "http://localhost:8080/dajSliku"+ "?red=" + red, true);
    
    ajax.send();

    }

    //poziv za zadatak 1 spirala 4
    function dajOsobljeImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
	    if (ajax.readyState == 4 && ajax.status == 200){
            //console.log(this.responseText);
            if (ajax.responseText)
            {
                var osoblje = JSON.parse(this.responseText);
                var select_osoblje = document.getElementById('osoblje');
                select_osoblje.innerHTML ="";
                //console.log(osoblje[0]);
                for(let i=0; i<osoblje.length; i++){
                    let option = document.createElement("option");
                    option.text = `${osoblje[i].id}, ${osoblje[i].ime} ${osoblje[i].prezime}, ${osoblje[i].uloga}`;
                    select_osoblje.appendChild(option);
                }
            }
        }
	    if (ajax.readyState == 4 && ajax.status == 404){
            alert("Nije uspjelo!");
        }
    }
    ajax.open("GET", "http://localhost:8080/osoblje", true);
    ajax.send();
    }

    function zauzecaSaOsobljemImpl(datum, dan, vrijeme){
        //console.log(sala, termin, osobaId);
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
            if (ajax.readyState == 4 && ajax.status == 200){
                //console.log(this.responseText);
                if (ajax.responseText)
               {
                   var odg = JSON.parse(this.responseText);
                   //console.log(odg[0].osobaSalaTekst);
                   //console.log(odg);
                   for(let i=0; i<odg.length; i++){
                        var node = document.createElement("li");                
                        var textnode = document.createTextNode(odg[i].osobaSalaTekst);        
                        node.appendChild(textnode);       
                        document.getElementsByClassName("osoblje")[0].appendChild(node);
                   }
               }
           }
           if (ajax.readyState == 4 && ajax.status == 404){
               alert("nevalja");
           }	
        }    
    ajax.open("GET", "http://localhost:8080/osobljeZauzeca/?datum=" + datum +"&dan=" + dan + "&vrijeme=" + vrijeme, true);
    ajax.send();
    }

    return {
        ucitajPodatke: ucitajPodatkeImpl,
        rezervisiSalu: rezervisiSaluImpl,
        prikaziSliku:prikaziSlikuImpl,
        dajOsoblje:dajOsobljeImpl,
        zauzecaSaOsobljem:zauzecaSaOsobljemImpl   
    }
}());

