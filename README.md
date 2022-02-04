# cfts

Typescript nodejs module that checks/creates/parses the Italian Tax Code, the list of Italian municipalities is updated [by the matteocontrini repo](https://github.com/matteocontrini/comuni-json); much of the logic comes [from the lucavandro repo](https://github.com/lucavandro/CodiceFiscaleJS) \
Simple and straightforward!

# Intallation

    npm i tax-code-ts --save

# Usage

```typescript
import * as cfts from "tax-code-ts"
let infos = cfts.parse("RSSMRA72L09H501S")
console.log(infos)
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
  nome: "MARIO",
  cognome: "ROSSI",
  sesso: "M",
  data_nascita: "1972-07-09",
  comune_nascita: "Roma",
  provincia_nascita: "RM",
  cap_nascita: "00118",
  cod_catastale_nascita: "H501",
})
console.log(cf) // RSSMRA72L09H501S

let is_valid = cfts.check("RSSMRA72L09H501S")
console.log(is_valid) // true
```

It is possible to calculate the Tax Code indicating also only some information of the place of birth:

```typescript
let cf = cfts.stringify({
  nome: "MARIO",
  cognome: "ROSSI",
  sesso: "M",
  data_nascita: "1972-07-09",
  cap_nascita: "00118", // only CAP
})
console.log(cf) // RSSMRA72L09H501S

// =========================================
let cf = cfts.stringify({
  nome: "MARIO",
  cognome: "ROSSI",
  sesso: "M",
  data_nascita: "1972-07-09",
  cod_catastale_nascita: "H501", // solo codice catastale
})
console.log(cf) // RSSMRA72L09H501S
```

It also works with the tax codes generated on subjects born abroad \
The foreign cadastral codes and the relative names of nations are updated from [istat website](https://www.istat.it/it/archivio/6747)

```typescript
let infos = cfts.parse("RSSMRA72L09Z247X")
console.log(infos)
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
  nome: "MARIO",
  cognome: "ROSSI",
  sesso: "M",
  data_nascita: "1972-07-09",
  comune_nascita: "Germania", // stato estero
})
console.log(cf) // RSSMRA72L09Z112D
```

It also implements the generation of [omocodes](https://it.wikipedia.org/wiki/Omocodia):

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
