const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const { Op } = require("sequelize");

var db= require('./db/baza.js');

db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        //process.exit();
    });
});


function inicializacija(){
    var listaPromiseaOsoblja = [];
    var listaPromiseaTermina = [];
    var listaPromiseaSala = [];
    var listaPromiseaRezervacija = [];

    return new Promise(function(resolve, reject){
        listaPromiseaOsoblja.push(db.osoblje.create({ime:"Neko", prezime: "Nekic",uloga:"profesor"}));
        listaPromiseaOsoblja.push(db.osoblje.create({ime:"Drugi", prezime:"Neko",uloga:"asistent"}));
        listaPromiseaOsoblja.push(db.osoblje.create({ime:"Test", prezime:"Test",uloga:"asistent"}));

        listaPromiseaTermina.push(db.termin.create({redovni:false, dan: null, datum: "01.01.2020", semestar: null, pocetak: "12:00" , kraj: "13:00"}));
        listaPromiseaTermina.push(db.termin.create({redovni:true, dan: 0, datum: null, semestar: "zimski", pocetak: "13:00" , kraj: "14:00"}));
        
        Promise.all(listaPromiseaOsoblja).then(function(osoblje){
            var osoba1 = osoblje.filter(function(a){return a.ime==='Neko'})[0].dataValues.id;
            var osoba2 = osoblje.filter(function(a){return a.ime==='Drugi'})[0].dataValues.id;
            var osoba3 = osoblje.filter(function(a){return a.ime==='Test'})[0].dataValues.id;
           //console.log(osoblje, osoba1);
            Promise.all(listaPromiseaTermina).then(function(termini){
                var termin1 = termini.filter(function(t){return t.id==1})[0].dataValues.id;
                var termin2 = termini.filter(function(t){return t.id==2})[0].dataValues.id;
                //console.log(termini, termin1);

                listaPromiseaSala.push(
                    db.sala.create({naziv:"1-11"}).then(function(s){
                        s.setOsoblje([osoba1]);
                        return new Promise(function(resolve,reject){resolve(s);});
                    })
                );

                listaPromiseaSala.push(
                    db.sala.create({naziv:"1-15"}).then(function(s){
                        s.setOsoblje([osoba2]);
                        return new Promise(function(resolve,reject){resolve(s);});
                    })
                );

                Promise.all(listaPromiseaSala).then(function(sale){
                    var sala1 = sale.filter(function(s){return s.naziv=="1-11"})[0].dataValues.id;
                    var sala2 = sale.filter(function(s){return s.naziv=="1-15"})[0].dataValues.id;
                
                    listaPromiseaRezervacija.push(
                        db.rezervacije.create({}).then(function(r){
                            return r.setTermin([termin1]).then(function(r){
                                return r.setSala([sala1]).then(function(r){
                                    return r.setOsoblje([osoba1]).then(function(){
                                        return new Promise(function(resolve,reject){resolve(r);});
                                    })
                                })
                            })
                        })
                    );
                
                    listaPromiseaRezervacija.push(
                        db.rezervacije.create({}).then(function(r){
                            //console.log(r);
                            return r.setTermin([termin2]).then(function(r){
                                //console.log(termin2, sala1);
                                return r.setSala([sala1]).then(function(r){
                                    return r.setOsoblje([osoba3]).then(function(){
                                        return new Promise(function(resolve,reject){resolve(r);});
                                    })
                                })
                            })
                        })
                    );
                
                    Promise.all(listaPromiseaRezervacija).then(function(r){resolve(r);}).catch(function(err){console.log("Rezervacije greska "+err);});

                }).catch(function(err){console.log("Sala greška " + err);});
            }).catch(function(err){console.log("Termin greška " + err);});
        }).catch(function(err){console.log("Osoblje greska "+err);});
    });
}


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


function napraviZauzeca(rez, ter, sal){
    var zauzeca = {};
    var periodicna = [];
    var vanredna = [];
    var idSale;
    var nazivSale;
    //console.log(rez.dataValues, ter.dataValues,sal.dataValues)
    for(let i=0; i<ter.length; i++){
        for(let j=0; j< rez.length; j++){
            if(rez[j].dataValues.terminId == ter[i].dataValues.id){
                idSale = rez[j].dataValues.salaId;
                break;
            }
        }
        for(let j=0; j< sal.length; j++){
            if(sal[j].dataValues.id == idSale){
                nazivSale = sal[j].dataValues.naziv;
                break;
            }
        }
        if(ter[i].dataValues.redovni){
            let periodicni = {
                dan:ter[i].dataValues.dan,
                semestar:ter[i].dataValues.semestar,
                pocetak:ter[i].dataValues.pocetak,
                kraj:ter[i].dataValues.kraj,
                naziv:nazivSale
            }
            periodicna.push(periodicni);
        }
        else{
            let vanredno = {
                datum:ter[i].dataValues.datum,
                pocetak:ter[i].dataValues.pocetak,
                kraj:ter[i].dataValues.kraj,
                naziv:nazivSale
            }
            vanredna.push(vanredno);
        }
    }
    zauzeca.periodicna = periodicna;
    zauzeca.vanredna = vanredna;
    return zauzeca;
}

app.get('/zauzeca', function(req, res){
    //res.sendFile('zauzeca.json', { root: __dirname + '/baza'});
    var zauzeca = {};

    db.rezervacije.findAll().then(rez => {
        db.termin.findAll().then(ter =>{
           db.sala.findAll().then(sal =>{
                
            zauzeca = napraviZauzeca(rez, ter, sal);
            //console.log(zauzeca);
            res.status(200);
            res.send(JSON.stringify(zauzeca));
           }).catch(function(err){
               res.status(404);
               res.send("Sale error " + err);
           });
        }).catch(function(err){
            res.status(404);
            res.send("Termini error " + err);
        });
    }).catch(function(err){
        res.status(404);
        res.send("Rezultati error " + err);
    });
});
//sp 4 zadatak 2
app.post('/rezervisiSalu', function(req, res){
    //console.log(req.body.termin);
    //ovaj kod je mogau pozivima biti
    var daniUSedmici = ['ponedeljkom', 'utorkom', 'srijedom', 'cetvrtkom', 'petkom', 'subotom', 'nedeljom'];
    let tijelo = req.body;
    var sala = tijelo.sala;
    var termin = tijelo.termin;
    console.log(termin);
    var osobljeId = tijelo.osobljeId;
    var datum = new Date(termin.datum);
    var dan = datum.getDay();
    var datum2 = "";
    let dan1= new Date(datum).getDate();
    let datum1=[];
    //vraca prvi n-ti dan
    while(dan1 > 7){
        dan1=dan1 - 7;
    }
    //pravi niz stringova datuma sa n-tim dano u sedmici
    while(dan1<new Date(datum.getFullYear(), datum.getMonth(), 0).getDate()){
        let datumPomocni=new Date(datum.getFullYear(), datum.getMonth(), dan1);
        let datePomocni = datumPomocni.getDate();
        let mjesec = datum.getMonth()+1;
        let godina = datum.getFullYear();
        datumPomocni = `${(datePomocni < 10) ? "0" + datePomocni:datePomocni}.${(mjesec < 10) ? "0" + mjesec : mjesec }.${godina}`;
        datum1.push(datumPomocni);
        (dan1 == datum.getDate())? datum2=datumPomocni:"";
        dan1=dan1+7;
    }

    //mjenja nedelju za ponedeljak kao 0-ti dan
    if(dan==0){
        dan=6;
    }else{
        dan--;
    }
    let date = datum.getDate();
    let mjesec = datum.getMonth()+1;
    let godina = datum.getFullYear();
    datum = `${(date < 10) ? "0" + date:date}.${(mjesec < 10) ? "0" + mjesec : mjesec }.${godina}`;
    
    var terminVanredni ={
        redovni: false,
        dan: null,
        datum: (termin.redovni==false)? [datum2]:datum1,
        semestar: null,
        pocetak: termin.pocetak,
        kraj: termin.kraj
    }

    var terminPeriodicni={
        redovni: true,
        dan: dan,
        datum: null,
        semestar: termin.semestar,
        pocetak: termin.pocetak,
        kraj: termin.kraj
    }
    console.log(terminPeriodicni, terminVanredni, datum1, datum2);
    //console.log(datum);
    db.sala.findOne({where:{naziv:sala.naziv}}).then((sala)=>{
        db.termin.findOne({where:{
            //provjerava ima li periodicnih i vanrednih termina za dati datum i vrijeme
            [Op.or]:[
                {
                    redovni: terminVanredni.redovni,
                    dan: terminVanredni.dan,
                    datum: {
                        [Op.or] : terminVanredni.datum
                    },
                    semestar: terminVanredni.semestar,
                    pocetak: terminVanredni.pocetak,
                    kraj: terminVanredni.kraj
                },
                {
                    redovni: terminPeriodicni.redovni,
                    dan: terminPeriodicni.dan,
                    datum: terminPeriodicni.datum,
                    semestar: terminPeriodicni.semestar,
                    pocetak: terminPeriodicni.pocetak,
                    kraj: terminPeriodicni.kraj
                }
            ]
        }}).then(ter=>{
            //console.log(ter.dataValues);
            if(ter!=null){
                //postoji termin -- pa mora biti i rezervacija
                //console.log(ter.dataValues);
                //ovdje nastavljas
                db.rezervacije.findOne({where:{
                        terminId: ter.id,
                        salaId: sala.id
                }}).then((rezervacija)=>{
                    db.osoblje.findOne({where:{id:rezervacija.osobljeId}}).then((osoba)=>{
                        var tr = ter.dataValues;
                        res.status(404);
                        res.send(`Vec postoji rezervacija za salu ${sala.dataValues.naziv} sa ${tr.redovni?'redovnim':'vanrednim'} terminom od ${tr.pocetak} do ${tr.kraj}, ${(tr.dan!=null)?daniUSedmici[tr.dan]:'datuma '+tr.datum} od strane osobe ${osoba.dataValues.ime} ${osoba.dataValues.prezime} (${osoba.dataValues.uloga})`);
                    }).catch(function(err){console.log("Osoblje error: " + err);})
                }).catch(function(err){console.log("Rezervacija error: " + err);})
            }else{
                //ne postoji terin pa ni rezervacija -- ovdje ga kreiramo i dodajemo u bazu kao i rezervaciju
                db.termin.create({
                    redovni:termin.redovni,
                    dan: (termin.redovni)? dan:null,
                    datum: (termin.redovni)? null:datum,
                    semestar: (termin.redovni)? termin.semestar:null,
                    pocetak: termin.pocetak,
                    kraj: termin.kraj
                }).then((tr)=>{
                    //console.log(tr)
                    db.rezervacije.create({}).then(r =>{
                        r.setTermin([tr.dataValues.id]).then(r=>{
                            r.setSala([sala.dataValues.id]).then(r=>{
                                r.setOsoblje([osobljeId]).then(()=>{

                                    var zauzeca = {};

                                    db.rezervacije.findAll().then(rez => {
                                        db.termin.findAll().then(ter =>{
                                        db.sala.findAll().then(sal =>{
                                                
                                            zauzeca = napraviZauzeca(rez, ter, sal);
                                            //console.log(zauzeca);
                                            res.status(200);
                                            res.send(JSON.stringify(zauzeca));
                                        }).catch(function(err){
                                            res.status(404);
                                            res.send("Sale error " + err);
                                        });
                                        }).catch(function(err){
                                            res.status(404);
                                            res.send("Termini error " + err);
                                        });
                                    }).catch(function(err){
                                        res.status(404);
                                        res.send("Rezultati error " + err);
                                    });
                                
                                }).catch(function(err){
                                    res.status(404);
                                    res.send("Set osoblje error " + err);
                                });
                            }).catch(function(err){
                                res.status(404);
                                res.send("Set sala error " + err);
                            });
                        }).catch(function(err){
                            res.status(404);
                            res.send("Set termin error " + err);
                        });
                    }).catch(function(err){
                        res.status(404);
                        res.send("Create rezervacije error " + err);
                    });
                }).catch(function(err){
                    res.status(404);
                    res.send("Termini error " + err);
                });
            }
        }).catch(function(err){console.log("Termin error: " + err);})
    }).catch(function(err){console.log("Sala error: " + err);});
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


//spirala 4 Z1
app.get('/osoblje', function(req, res){
    db.osoblje.findAll().then(osoblje=>{
        res.send(JSON.stringify(osoblje));
    });
    
});

//sp4 z3
app.get('/osobljeZauzeca', function(req, res){
    var vrijeme = req.query.vrijeme;
    var datum = req.query.datum;
    var dan = parseInt(req.query.dan);
    var osobaSalaTekst=[];
    //dohvati sve pa for petljama pretrazi sve dzumbus kod
    db.rezervacije.findAll().then(rez =>{
        db.termin.findAll().then(ter=>{
            db.sala.findAll().then(sal=>{
                db.osoblje.findAll().then(os=>{
                    //console.log(rez[0], rez[1]);
                    for(let i=0; i<os.length; i++){
                        let osoba = os[i].dataValues;
                        let nazivSale;
                        let nadjenTermin = false;
                        for(let j=0; j<rez.length; j++){
                            let rezervacija = rez[j].dataValues;
                            //ako osoba ima rezervaciju
                            if(osoba.id == rezervacija.osobljeId){
                                //trazimo salu
                                for(let k=0; k<sal.length; k++){
                                    if(sal[k].dataValues.id==rezervacija.salaId){
                                        nazivSale = sal[k].dataValues.naziv;
                                    }
                                }
                                //pa trazimo termin
                                for(let h=0; h<ter.length; h++){
                                    if(ter[h].dataValues.id == rezervacija.terminId){
                                        let termin = ter[h].dataValues;
                                        //console.log(termin);
                                        //ako je vandredni prvojeri datum
                                        if(termin.dan == null && termin.datum != null){
                                            if(datum == termin.datum && (vrijeme==termin.pocetak || vrijeme==termin.kraj || (vrijeme>termin.pocetak && vrijeme<termin.kraj))){
                                                nadjenTermin = true;
                                                break;
                                            }
                                            
                                        }else if(termin.dan != null && termin.datum ==null){
                                            //termin nije vanredan provjeri dan

                                            if(dan == termin.dan && (vrijeme==termin.pocetak || vrijeme==termin.kraj || (vrijeme>termin.pocetak && vrijeme<termin.kraj))){
                                               nadjenTermin = true;
                                               break;
                                            }
                                        }
                                    }
                                    //h
                                }
                            }
                            //j
                        }
                        if(nadjenTermin){
                            osobaSalaTekst.push({osobaSalaTekst:`${osoba.ime} ${osoba.prezime} je u ${nazivSale}`});
                        
                        }else{
                            osobaSalaTekst.push({osobaSalaTekst:`${osoba.ime} ${osoba.prezime} je u kancelariji`});
                        }
                    }
                    res.send(JSON.stringify(osobaSalaTekst));
                })
            })
        })
    })
    
    //res.send(vrijeme);
});

app.listen(8080);