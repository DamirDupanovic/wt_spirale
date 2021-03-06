

function ucitajPodatke(){
    pozivi.ucitajPodatke();
    pozivi.dajOsoblje();
}

var imena_mjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar','Novembar', 'Decembar'];

function rezervisiSalu(element){
    var forma = document.getElementsByClassName('forma-kalendar')[0];
    var nazivMjeseca = document.getElementById('mjesec').innerHTML;
    var godina = new Date().getFullYear().toString();
    var mjesec = imena_mjeseci.indexOf(nazivMjeseca);
    //console.log(element);
    var dan = element.getElementsByClassName('unutra')[0].innerHTML;
    //var datum = new Date(godina, mjesec,dan);
    //console.log(datum);
    var semestar = (mjesec > 0 && mjesec < 6) ? "ljetni" : "zimski";

    var sala = forma.elements[0];
    var periodicno = forma.elements[1];
    var pocetak = forma.elements[2].value;
    var kraj = forma.elements[3].value;

    var imeSale = sala.options[sala.selectedIndex].value;
    var jeLiPeriodicnoZauz= periodicno.checked;
    
    //vracanje osobe
    var osoba = document.getElementById('osoblje');
    let osobaId = parseInt(osoba.options[osoba.selectedIndex].value.substring(0, 1));

    //vracanje termina
    var termin = {
        redovni:jeLiPeriodicnoZauz,
        dan: dan,
        datum: new Date(godina, mjesec, dan),
        semestar:semestar,
        pocetak:pocetak,
        kraj: kraj
    }

    //vracanje sala
    var sala = {
        naziv: imeSale
    }

    if(pocetak =="" || kraj==""){
        alert("Unesite pocetno i krajnje vrijeme");
    }else if(pocetak>kraj){
        alert("Pocetak veci od kraja!");
    }else if(pocetak==kraj){
        alert("Pocetak i kraj su isti!");
    }else{
        if(element.classList.contains('zauzeti')){
            alert(`Sala ${imeSale} je vec rezervisana u datom periodu!`);
        }else{
            var odgovor = confirm(`Zelite li zauzeti salu ${imeSale}, ${jeLiPeriodicnoZauz ? "PERIODICNO":"VANREDNO"} u periodu od ${pocetak} do ${kraj}!`);
            if(odgovor){
                //pozivi.rezervisiSalu(imeSale, jeLiPeriodicnoZauz, semestar, pocetak, kraj, godina, mjesec, dan);
                pozivi.rezervisiSalu(sala, termin, osobaId);
            }else{
                alert("Ponisteno");
            }
        }
    }  
}
