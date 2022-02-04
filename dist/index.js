"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOmocodes = exports.check = exports.stringify = exports.parse = exports.statiEsteri = exports.comuni = void 0;
var checkCodeOdd = {
    0: 1,
    1: 0,
    2: 5,
    3: 7,
    4: 9,
    5: 13,
    6: 15,
    7: 17,
    8: 19,
    9: 21,
    A: 1,
    B: 0,
    C: 5,
    D: 7,
    E: 9,
    F: 13,
    G: 15,
    H: 17,
    I: 19,
    J: 21,
    K: 2,
    L: 4,
    M: 18,
    N: 20,
    O: 11,
    P: 3,
    Q: 6,
    R: 8,
    S: 12,
    T: 14,
    U: 16,
    V: 10,
    W: 22,
    X: 25,
    Y: 24,
    Z: 23,
};
var checkCodeEven = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
};
var omocodeTable = ["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"];
var checkCodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var monthCodes = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"];
exports.comuni = require("../comuni.json");
exports.statiEsteri = require("../stati_esteri.json");
var moment = require("moment");
function parse(cf) {
    cf = cf.toUpperCase();
    if (!check(cf)) {
        return false;
    }
    var yearCode = cf.substr(6, 2);
    var year19XX = parseInt("19" + yearCode, 10);
    var year20XX = parseInt("20" + yearCode, 10);
    var currentYear = new Date().getFullYear();
    var year = year20XX > currentYear ? year19XX : year20XX;
    var monthChar = cf.substr(8, 1);
    var month = monthCodes.indexOf(monthChar) + 1;
    var sesso = "M";
    var day = parseInt(cf.substr(9, 2), 10);
    if (day > 31) {
        sesso = "F";
        day = day - 40;
    }
    var dataNascita = year + "-" + month.toString().padStart(2, "0") + "-" + day.toString().padStart(2, "0");
    var codiceCatastale = cf.substr(11, 4);
    var luogoNascita = exports.comuni.find(function (i) { return i.codiceCatastale === codiceCatastale; });
    if (luogoNascita) {
        return {
            nome: cf.substr(3, 3),
            cognome: cf.substr(0, 3),
            sesso: sesso,
            data_nascita: dataNascita,
            comune_nascita: luogoNascita.nome,
            provincia_nascita: luogoNascita.sigla,
            cap_nascita: luogoNascita.cap[0],
            cod_catastale_nascita: luogoNascita.codiceCatastale,
        };
    }
    else {
        luogoNascita = exports.statiEsteri.find(function (i) { return i.codiceCatastale === codiceCatastale; });
        return {
            nome: cf.substr(3, 3),
            cognome: cf.substr(0, 3),
            sesso: sesso,
            data_nascita: dataNascita,
            comune_nascita: luogoNascita.nome,
            provincia_nascita: "EE",
            cap_nascita: "",
            cod_catastale_nascita: luogoNascita.codiceCatastale,
        };
    }
}
exports.parse = parse;
function stringify(data) {
    var code = "";
    code += (data.cognome.toUpperCase().replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, "") + data.cognome.toUpperCase().replace(/[^AEIOU]/gi, "") + "XXX").substr(0, 3);
    code += (data.nome.toUpperCase().replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, "") + data.nome.toUpperCase().replace(/[^AEIOU]/gi, "") + "XXX").substr(0, 3);
    var dataNascita = moment(data.data_nascita, "YYYY-MM-DD");
    code += dataNascita.format("YY");
    var dataNascitaM = dataNascita.format("M") - 1;
    code += monthCodes[parseInt(dataNascitaM, 10)];
    var day = parseInt(dataNascita.format("D"));
    if (data.sesso.toUpperCase() === "F") {
        day += 40;
    }
    code += day.toString().padStart(2, "0");
    var comuneNascita = null;
    if (data.comune_nascita) {
        comuneNascita = exports.comuni.find(function (i) { return i.nome.toLowerCase() === data.comune_nascita.toLowerCase(); });
    }
    if (data.cap_nascita) {
        comuneNascita = exports.comuni.find(function (i) { return i.cap.indexOf(data.cap_nascita) > -1; });
    }
    if (data.cod_catastale_nascita) {
        comuneNascita = exports.comuni.find(function (i) { return i.codiceCatastale.toLowerCase() === data.cod_catastale_nascita.toLowerCase(); });
    }
    if (!comuneNascita) {
        if (data.cod_catastale_nascita) {
            comuneNascita = exports.statiEsteri.find(function (i) { return i.codiceCatastale.toLowerCase() === data.cod_catastale_nascita.toLowerCase(); });
        }
        if (data.comune_nascita) {
            comuneNascita = exports.statiEsteri.find(function (i) { return i.nome.toLowerCase() === data.comune_nascita.toLowerCase(); });
        }
    }
    if (!comuneNascita) {
        return false;
    }
    code += comuneNascita.codiceCatastale;
    code += getCheckCode(code);
    return code.toUpperCase();
}
exports.stringify = stringify;
function check(cf) {
    if (typeof cf !== "string") {
        return false;
    }
    cf = cf.toUpperCase();
    if (cf.length !== 16) {
        return false;
    }
    return getCheckCode(cf.slice(0, 15)) === cf.charAt(15);
}
exports.check = check;
function getOmocodes(code) {
    var results = [];
    var lastOmocode = (code = code.slice(0, 15));
    for (var i = code.length - 1; i >= 0; i = i - 1) {
        var char = code[i];
        if (char.match(/\d/) !== null) {
            lastOmocode = lastOmocode.substr(0, i) + omocodeTable[char] + lastOmocode.substr(i + 1);
            results.push(lastOmocode + getCheckCode(lastOmocode));
        }
    }
    return results;
}
exports.getOmocodes = getOmocodes;
var getCheckCode = function (cf) {
    var val = 0;
    for (var i = 0; i < 15; i = i + 1) {
        var c = cf[i];
        val += i % 2 !== 0 ? checkCodeEven[c] : checkCodeOdd[c];
    }
    val = val % 26;
    return checkCodeChars.charAt(val);
};
