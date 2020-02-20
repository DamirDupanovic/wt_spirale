let assert = chai.assert;

describe('Kalendar', function(){
    describe('iscrtajKalendar()', function(){
        it('Should display 1st of november as monday', function(){  
            var kal = document.getElementsByClassName('date')[0];
            kalendar.iscrtajKalendar(kal, 10);
            var prvaSedmica = kal.getElementsByClassName('sedmica')[0];
            var prviDan = prvaSedmica.getElementsByClassName('1')[0];
            var datum = prviDan.getElementsByClassName('unutra')[0];
            var tacno= false;
            if(datum.innerHTML == 1) tacno = true;
            assert.equal(tacno, true, "Nije tacno");
        });
        it('Should display 30th of november as saturday', function(){  
            var kal = document.getElementsByClassName('date')[0];
            kalendar.iscrtajKalendar(kal, 10);
            var zadnjaSedmica = kal.getElementsByClassName('sedmica')[4];
            var zadnjiDan = zadnjaSedmica.getElementsByClassName('30')[0];
            var datum = zadnjiDan.getElementsByClassName('unutra')[0];
            var tacno= false;
            if(datum.innerHTML == 30) tacno = true;
            assert.equal(tacno, true, "Nije tacno");
        });
        it('Should display 31 days when parameters are "date", 11', function(){  
            var kal = document.getElementsByClassName('date')[0];
            kalendar.iscrtajKalendar(kal, 11);
            let sviDani = document.getElementsByClassName('broj');
            let dani =0;
            for(let i=0; i<sviDani.length; i++){
                if(!sviDani[i].classList.contains("prazan")){
                    dani++;
                }
            }
            assert.equal(dani, 31, "Broj prikazanih dana je uredu!");
        });
        it('Should display 30 days when parameters are "date", 10', function(){  
            var kal = document.getElementsByClassName('date')[0];
            kalendar.iscrtajKalendar(kal, 10);
            let sviDani = document.getElementsByClassName('broj');
            let dani =0;
            for(let i=0; i<sviDani.length; i++){
                if(!sviDani[i].classList.contains("prazan")){
                    dani++;
                }
            }
            assert.equal(dani, 30, "Broj prikazanih dana je uredu!");
        });
        it('Pozivanje iscrtajKalendar za januar: očekivano je da brojevi dana idu od 1 do 31', function(){  
            var kal = document.getElementsByClassName('date')[0];
            kalendar.iscrtajKalendar(kal, 0);
            let sviDani = document.getElementsByClassName('broj');
            let dani =0;
            for(let i=0; i<sviDani.length; i++){
                if(!sviDani[i].classList.contains("prazan")){
                    dani++;
                }
            }
            //prva sedmica
            

            var prvaSedmica = kal.getElementsByClassName('sedmica')[0];
            var prviDan = prvaSedmica.getElementsByClassName('1')[0];
            var datum = prviDan.getElementsByClassName('unutra')[0];
            var tacno= false;
            if(datum.innerHTML == 1) tacno = true;
            assert.equal(dani, 31, "Mjesec nema 31 dan!");
            assert.equal(tacno, true, "Prvi dan nije u utorak!");
        });
        it('Pozivanje obojiZauzeca kada podaci nisu učitani', function(){  
            var kal = document.getElementsByClassName('date')[0];
            kalendar.iscrtajKalendar(kal, 10);
            let praznoca = [];
            kalendar.ucitajPodatke(praznoca, praznoca);
            kalendar.obojiZauzeca(kal, 10, "0-01", "10:00", "11:00");
            let sviDani = kal.getElementsByClassName('broj');
            let zauzeti = false;
            for(let i=0; i<sviDani.length; i++){
                if(sviDani[i].classList.contains("zauzeti")){
                    zauzeti=true;
                }
            }
            assert.equal(zauzeti, false, "Ima zauzetih dana!");
        });
        
    });
});