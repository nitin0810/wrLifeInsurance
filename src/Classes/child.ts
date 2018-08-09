

export class Child {
    first: string = '';
    last: string = '';
    sex: number = 0;
    age:number;
    dob:string;
    height:number;
    weight:number;
    preexisting:number;
    preexisting_1:string;
    memberType:number; // 2: for Child 1 (Member 3rd), 3: for all other children 

    constructor(memberType:number,dob?: string) {
        this.dob = dob;
        this.preexisting =0;
        this.preexisting_1='';
        this.memberType = memberType;
    }
}