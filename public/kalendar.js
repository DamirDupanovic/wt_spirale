let kalendar = (function(){
    //privatni atributi
    var preiodicni = [];
    var vanredni = [];

    var imena_mjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar','Novembar', 'Decembar'];

    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
       //if(pocetak =="" || kraj =="") console.log("prazna vremena");
       if(pocetak>=kraj){
            var kal = document.getElementsByClassName('date')[0];
            iscrtajKalendarImpl(kal, mjesec);
        }else if((mjesec >=0 && mjesec < 12) && sala != "" && pocetak != "" && kraj != "" && preiodicni.length != 0 && vanredni.length != 0){
        var semestar = (mjesec > 0 && mjesec < 6) ? "ljetni" : "zimski";
        //console.log(semestar);

        //ocisti zauzeca da bi se ponovo mogla zauzeti-----------------------
        var sedmice = document.getElementsByClassName('sedmica');
        for(i=0; i<sedmice.length; i++){
            var sedmica = sedmice[i];
            //console.log(sedmica);
             for(j=0; j<5; j++){
                var dan = sedmica.getElementsByClassName('broj')[j];
                //console.log(dan);
                if(!dan.classList.contains("prazan")){
                    dan.classList.remove("zauzeti");
                    dan.classList.add("slobodni");
                 }
             }
         } 
        
        //periodicni--------------------------------------
        //niz svih zauzeca koja se poklapaju sa podatcima
        var per = [];
        preiodicni.forEach((obj) => {
            //console.log("usao u foreach");
            //console.log(obj);
            //ako se poklapaju podatci objekat stavljamo u niz
            
            if(obj.semestar == semestar && (obj.pocetak >= pocetak || obj.pocetak>=kraj) && (obj.kraj <= kraj || obj.kraj >= pocetak) && obj.naziv == sala){
                per.push(obj);
            }
        });


        if(per.length != 0){
            //iscrtava
            for(i=0; i<sedmice.length; i++){
                var sedmica = sedmice[i];
                 for(j=0 ; j<per.length; j++){
                    var zauzece = per[j];
                    for(k=0; k<7; k++){
                        if(zauzece.dan == k){
                             var dan = sedmica.getElementsByClassName('broj')[k];
                             if(!dan.classList.contains("prazan")){
                                dan.classList.remove("slobodni");
                                dan.classList.add("zauzeti");
                             }
                        }
                    }
                }
            } 
        }

        //vanredni--------------------------------------
        var van = [];
        vanredni.forEach((obj) => {
            let datum = obj.datum.split('.');
            //console.log(datum[1]-1);
            let d = new Date(datum[2], datum[1]-1, datum[0]);
            //console.log("usao u foreach");
            //console.log(obj);
            //ako se poklapaju podatci objekat stavljamo u niz
            if(d.getMonth() == mjesec && (obj.pocetak >= pocetak || obj.kraj>=kraj) && (obj.kraj <= kraj || obj.kraj >= pocetak) && obj.naziv == sala){
                van.push(obj);
                //console.log(obj);
            }
        });

        if(van.length != 0){
            //var dani = kalendarRef.getElementsByClassName('broj');
            //console.log(dani);
            for(i=0; i<van.length; i++){
                let datum = van[i].datum.split('.');
                //console.log(datum[1]-1);
                let d = new Date(datum[2], datum[1]-1, datum[0]);
                let dan = kalendarRef.getElementsByClassName(d.getDate())[0];

                dan.classList.remove("slobodni");
                dan.classList.add("zauzeti");
            } 
        }

       }else{
        console.log("nisu svi elementi uneseni!");
    }
    }
    function ucitajPodatkeImpl(periodicna, vanredna){
        preiodicni = periodicna;
        vanredni = vanredna;
    }
    function iscrtajKalendarImpl(kalendarRef, mjesec){
        kalendarRef.innerHTML="";
        var datumTrenutni = new Date(2020, mjesec);
        kalendarRef.innerHTML=
        `<h3 id="mjesec">${imena_mjeseci[datumTrenutni.getMonth()]}</h3>
        <div class="days">
            <div class="s">
                <div class="day">PON</div>
                <div class="day">UTO</div>
                <div class="day">SRI</div>
                <div class="day">CET</div>
                <div class="day">PET</div>
                <div class="day">SUB</div>
                <div class="day">NED</div>
            </div>
        </div>`;

        var pocetniDatum = new Date(datumTrenutni.getFullYear(), datumTrenutni.getMonth(), 1);
        var krajDatum = new Date(datumTrenutni.getFullYear(), datumTrenutni.getMonth()+1, 0);

        var prviDanUMj = pocetniDatum.getDate();
        var prviDanUSedmici = pocetniDatum.getDay();
        if(prviDanUSedmici==0){
            prviDanUSedmici=7;
        }
        var zadnjiDanUMj= krajDatum.getDate();

        var days = document.getElementsByClassName('days')[0];

        var sedmica = document.createElement('div');
        sedmica.className='sedmica';

        for(let i=0; i<6; i++){
            var neApenduj = false;
            var sedmica = document.createElement('div');
            sedmica.className='sedmica';
            for(let j=0; j<7; j++){
                if(i===0){
                    if(j<prviDanUSedmici-1){
                        var dan = document.createElement('div');
                        dan.className = `broj prazan`;
                        sedmica.appendChild(dan);
                    }
                    else{
                        var dan = document.createElement('div');
                        dan.className = `broj slobodni ${prviDanUMj}`;
                        var unutra = document.createElement('div');
                        unutra.className='unutra';
                        unutra.innerHTML=`${prviDanUMj}`;
                        dan.appendChild(unutra);
                        dan.addEventListener('click', function(){ rezervisiSalu(this);}, false);
                        
                        sedmica.appendChild(dan);
                        prviDanUMj++;
                    }
                }else if(prviDanUMj<=zadnjiDanUMj){
                    var dan = document.createElement('div');
                    dan.className = `broj slobodni ${prviDanUMj}`;
                    var unutra = document.createElement('div');
                    unutra.className='unutra';
                    unutra.innerHTML=`${prviDanUMj}`;
                    dan.appendChild(unutra);
                    dan.addEventListener('click', function(){ rezervisiSalu(this);}, false);
                    sedmica.appendChild(dan);
                    prviDanUMj++;
                    continue;
                }if(prviDanUMj>zadnjiDanUMj){
                    if(i<6){
                        var dan = document.createElement('div');
                        dan.className = `broj prazan`;
                        sedmica.appendChild(dan);
                    }else{
                        neApenduj= true;
                    }
                }
            }
            if(!neApenduj){
                days.appendChild(sedmica);
            }else{
                break;
            }
        }        
    }
    return {
        obojiZauzeca: obojiZauzecaImpl,
        ucitajPodatke: ucitajPodatkeImpl,
        iscrtajKalendar: iscrtajKalendarImpl
    }
}());

