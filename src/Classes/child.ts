

export class Child {
    first: string = '';
    last: string = '';
    sex: number = 0;
    age: number ;
    height:number;
    weight:number;
    preexisting:number;
    preexisting_1:string;

    constructor(age?: number) {
        this.age = age;
        this.preexisting =0;
        this.preexisting_1='';
    }
}