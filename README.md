
# cfts

Modulo nodejs in typescript che effettua il check/creazione/parsing del Codice Fiscale italiano, l'elenco dei comuni italiani viene aggiornato [dal repo di matteocontrini](https://github.com/matteocontrini/comuni-json); buona parte della logica proviene [dal repo di lucavandro](https://github.com/lucavandro/CodiceFiscaleJS) \
Semplice e diretto!

# Intallation

    npm i @lucaiaconelli/cfts --save

# Usage

```typescript
import * as cfts from '@lucaiaconelli/cfts';
let  infos  =  cfts.parse("RSSMRA72L09H501S");
console.log(infos);
// {
// nome: 'MARIO',
// cognome: 'ROSSI',
// sesso: 'M',
// data_nascita: '1972-07-09',
// comune_nascita: 'Roma',
// provincia_nascita: 'RM',
// cap_nascita: '00118',
// cod_catastale_nascita: 'H501'
// }

// =========================================
let cf = cfts.stringify({
  nome: 'MARIO',
  cognome: 'ROSSI',
  sesso: 'M',
  data_nascita: '1972-07-09',
  comune_nascita: 'Roma',
  provincia_nascita: 'RM',
  cap_nascita: '00118',
  cod_catastale_nascita: 'H501'
});
console.log(cf);  // RSSMRA72L09H501S

let is_valid = cfts.check("RSSMRA72L09H501S");
console.log(is_valid);  // true
```

È possibile calcolare il Codice fiscale indicando anche solo alcune informazioni del luogo di nascita:
```javascript
let cf = cfts.stringify({
  nome: 'MARIO',
  cognome: 'ROSSI',
  sesso: 'M',
  data_nascita: '1972-07-09',
  cap_nascita: '00118', // solo CAP
});
console.log(cf);  // RSSMRA72L09H501S

// =========================================
let cf = cfts.stringify({
  nome: 'MARIO',
  cognome: 'ROSSI',
  sesso: 'M',
  data_nascita: '1972-07-09',
  cod_catastale_nascita: 'H501' // solo codice catastale
});
console.log(cf);  // RSSMRA72L09H501S
```

Funziona anche con i Codici fiscali generati su soggetti nati all'estero \
I codici catastali esteri e i relativi nomi di nazioni sono aggiornati dal [sito istat](https://www.istat.it/it/archivio/6747)
```javascript
let  infos  =  cfts.parse("RSSMRA72L09Z247X")
console.log(infos);
// {
//  nome: 'MRA',
//  cognome: 'RSS',
//  sesso: 'M',
//  data_nascita: '1972-07-09',
//  comune_nascita: 'Malaysia',  <- Stato estero nel campo del comune
//  provincia_nascita: 'EE',     <- EE come provincia di nascita
//  cap_nascita: '',             <- CAP di nascita sempre vuoto
//  cod_catastale_nascita: 'Z247'
// }

// =========================================
let cf = cfts.stringify({
  nome: 'MARIO',
  cognome: 'ROSSI',
  sesso: 'M',
  data_nascita: '1972-07-09',
  comune_nascita: 'Germania' // stato estero
})
console.log(cf);  // RSSMRA72L09Z112D
```

Implementa anche la generazione degli [omocodici](https://it.wikipedia.org/wiki/Omocodia):
```typescript
let omocodes = cfts.getOmocodes("RSSMRA72L09Z247X")
console.log(omocodes)
// [
//  'RSSMRA72L09Z2QTG',
//  'RSSMRA72L09ZNQTV',
//  'RSSMRA72L0VZNQTK',
//  'RSSMRA72LLVZNQTV',
//  'RSSMRA7NLLVZNQTG',
//  'RSSMRATNLLVZNQTD',
//  'RSSMRA72L09Z24TU',
//  'RSSMRA72L09Z24TU'
// ]
```