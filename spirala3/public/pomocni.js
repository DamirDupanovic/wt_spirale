var imena_mjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar','Novembar', 'Decembar'];

function ucitajKalendar(kalendarRef){
    var kal = document.getElementsByClassName(kalendarRef)[0];
    kalendar.iscrtajKalendar(kal, new Date().getMonth());
}

function mijenjajKalendar(dugme, div, kalendarRef){
    var kal = document.getElementsByClassName(kalendarRef)[0];
    var prosli = document.getElementById('prosli');
    var sljedeci = document.getElementById('sljedeci');
    mjesec = document.getElementById(div).innerHTML;
    brojMjeseca=imena_mjeseci.indexOf(mjesec);
   
    if(dugme===prosli){
        sljedeci.disabled=false;
        brojMjeseca--;
        if(brojMjeseca<1) {
            prosli.disabled=true;
        }
    }else if(dugme===sljedeci){
        if(brojMjeseca===11){
            sljedeci.disabled=true;
        }
        else{
            prosli.disabled=false;
            brojMjeseca++;
            if(brojMjeseca>10) {
                sljedeci.disabled=true;
            }
        }
    }
    kalendar.iscrtajKalendar(kal, brojMjeseca);
}


function pozoviUcitajPodatke(){
    kalendar.ucitajPodatke(preiodicni, vanredni);
}

function pozoviObojiZauzeto(saleRef, pocetakRef, krajRef, kalendarRef){
    var kalendarDom = document.getElementsByClassName(kalendarRef)[0];
    var sale = document.getElementsByName(saleRef)[0];
    var nazivSale = sale.options[sale.selectedIndex].innerHTML;
    var pocetak = document.getElementsByName(pocetakRef)[0].value;
    var kraj = document.getElementsByName(krajRef)[0].value;

    var nazivMjeseca = kalendarDom.getElementsByTagName('h3')[0].innerHTML;
    var mjesec = imena_mjeseci.indexOf(nazivMjeseca);

    kalendar.obojiZauzeca(kalendarDom, mjesec, nazivSale, pocetak, kraj);
}