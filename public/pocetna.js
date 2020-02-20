var redSlika=1;

var prosleTriSlike = [];
var redProslih=0;

function ucitajPrviPut(div){
    var prosli = document.getElementById('prosli');
    var sljedeci = document.getElementById('sljedeci');
    pozivi.prikaziSliku(div, redSlika, prosli, sljedeci);
}

function dajSLike(div,dugme){
    var prosli = document.getElementById('prosli');
    var sljedeci = document.getElementById('sljedeci');
    
    if(dugme===sljedeci){
        prosleTriSlike = [];
        for(let i=0; i<3; i++){
            prosleTriSlike.push(document.getElementsByClassName(div)[i].getElementsByTagName('img')[0].src);
        }
        redProslih=redSlika;
        //console.log(redProslih, redSlika);
        prosli.disabled=false;
        //koristen red
        redSlika++;
        //console.log(redProslih, redSlika);
        pozivi.prikaziSliku(div, redSlika,prosli, sljedeci);
    }else if(dugme===prosli){
        sljedeci.disabled=false;
        //console.log(redProslih, redSlika);
        redSlika--;
        //koristen red
        if(redSlika==redProslih){
            //console.log(redProslih, redSlika);
            for(let i=0; i<3; i++){
                let okvir= document.getElementsByClassName(div)[i].getElementsByTagName('img')[0];
                okvir.style.visibility='visible';
                okvir.src=prosleTriSlike[i];
                if(redProslih==1) prosli.disabled=true;
            }
        }else{
            pozivi.prikaziSliku(div, redSlika,prosli, sljedeci);   
        }  
    }
}