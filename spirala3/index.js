const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");

const app = express();

app.use(express.static('public'));
;
app.use(bodyParser.json());


app.get('/', function(req, res){
    res.sendFile('pocetna.html', { root: __dirname + '/public' });
});

app.get('/sale', function(req, res){
    res.sendFile('sale.html', { root: __dirname + '/public' });
});

app.get('/unos', function(req, res){
    res.sendFile('unos.html', { root: __dirname + '/public' });
});

app.get('/rezervacije', function(req, res){
    res.sendFile('rezervacija.html', { root: __dirname + '/public' });
});

app.get('/zauzeca', function(req, res){
    res.sendFile('zauzeca.json', { root: __dirname + '/baza'});
});

app.post('/rezervisiSalu', function(req, res){
    //console.log(req.body);
    let tijelo = req.body;
    let sala = tijelo.sala;
    let periodicna = tijelo.periodicno;
    let semestar = tijelo.semestar;
    let pocetak = tijelo.pocetak;
    let kraj = tijelo.kraj;
    let godina = tijelo.godina;
    let mjesec = tijelo.mjesec;
    let dan = tijelo.dan;
    let datumString = `${dan}.${mjesec+1}.${godina}`;
    let datum = new Date(godina, mjesec, dan);
    let danUsedmici = datum.getDay();

    if(danUsedmici==0){
        danUsedmici=6;
    }else{
        danUsedmici--;
    }

    let zauzeca = fs.readFileSync('./baza/zauzeca.json');
    let zauzecaJson = JSON.parse(zauzeca);

    let periodicnaNiz = zauzecaJson.periodicna;
    let vanrednaNiz = zauzecaJson.vanredna;

    let postojiRezervacija = false;

    //console.log(zauzecaJson);
    //periodicna zauzeca
    if(periodicna){
        
        for(let i=0; i<zauzecaJson.periodicna.length; i++ ){
            let zauzece = periodicnaNiz[i];
            //console.log(zauzece);
            if(zauzece.dan==dan && zauzece.semestar == semestar && zauzece.pocetak == pocetak && zauzece.kraj==kraj && zauzece.naziv==sala){
                postojiRezervacija=true;
            }
        }
        if(postojiRezervacija){
            res.status(404).send(`Nije moguće rezervisati salu ${sala} za navedeni datum ${dan}/${mjesec}/${godina} i termin od ${pocetak} do ${kraj}!`);
        }else{
            let obj = {
                dan:danUsedmici,
                semestar:semestar,
                pocetak: pocetak,
                kraj: kraj,
                naziv: sala,
                predavac:"Neko"
            };
            periodicnaNiz.push(obj);
            fs.writeFileSync('./baza/zauzeca.json',JSON.stringify({periodicna:periodicnaNiz, vanredna:vanrednaNiz}));
            let novaZauzeca = fs.readFileSync('./baza/zauzeca.json');
            //novaZauzeca = JSON.parse(novaZauzeca);
            //console.log(novaZauzeca);
            //res.sendFile('zauzeca.json', { root: __dirname + '/baza'});
            res.send(novaZauzeca);
        }
    }else{
        //vanredno
        //console.log(vanrednaNiz);
        for(let i=0; i<zauzecaJson.vanredna.length; i++ ){
            let zauzece = vanrednaNiz[i];
            if(zauzece.datum==datumString && zauzece.pocetak == pocetak && zauzece.kraj==kraj && zauzece.naziv==sala){
                postojiRezervacija=true;
            }
        }
        if(postojiRezervacija){
            res.status(404).send(`Nije moguće rezervisati salu ${sala} za navedeni datum ${dan}/${mjesec}/${godina} i termin od ${pocetak} do ${kraj}!`);
        }else{
            let obj = {
                datum:datumString,
                pocetak: pocetak,
                kraj: kraj,
                naziv: sala,
                predavac:"Neko"
            };
            vanrednaNiz.push(obj);
            fs.writeFileSync('./baza/zauzeca.json',JSON.stringify({periodicna:periodicnaNiz, vanredna:vanrednaNiz}));
            //res.sendFile('zauzeca.json', { root: __dirname + '/baza'});
            let novaZauzeca = fs.readFileSync('./baza/zauzeca.json');
            //novaZauzeca = JSON.parse(novaZauzeca);
            //console.log(novaZauzeca);
            res.send(novaZauzeca);
        }
        
    }
});

app.get('/dajSliku', function(req, res){
    var imena = fs.readdirSync(__dirname+'/baza/slike');
    //console.log(req.query.red);
    //koristen red
    let red = req.query.red;
    //koristen red
    let triImenaSlika = imena.slice(3*red-3, red*3);
    //console.log(triImenaSlika);
    var obj ={};
    for(let i=0; i<triImenaSlika.length; i++){
        var slika= fs.readFileSync(__dirname + '/baza/slike/'+ triImenaSlika[i]);
        obj[`slika${i+1}`]=slika;
    }
    if(triImenaSlika.length<3 || red*3+1>imena.length){
        obj.disableSljedeci = true;
    }else{
        obj.disableSljedeci = false;
    }
    res.end(JSON.stringify(obj));
});

app.listen(8080);