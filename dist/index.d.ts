export declare function parse(cf: any): false | {
    nome: any;
    cognome: any;
    sesso: string;
    data_nascita: string;
    comune_nascita: any;
    provincia_nascita: any;
    cap_nascita: any;
    cod_catastale_nascita: any;
};
export declare function stringify(data: any): any;
export declare function check(cf: any): boolean;
export declare function getOmocodes(code: any): any[];
