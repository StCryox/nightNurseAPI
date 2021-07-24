export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    mail: string;
    login: string;
    password: string;
    image: string;
    birthdate: Date;
    age?: number;
    role: string;
    address: string;
    zipcode: number;
    city: string;
    province: string;
    phoneNumber: number;
    updateAt?: Date;
    createdAt?: Date;
}

export class User implements IUser {
    id?: string;
    firstName: string;
    lastName: string;
    mail: string;
    login: string;
    password: string;
    image: string;
    birthdate: Date;
    age?: number;
    role: string;
    address: string;
    zipcode: number;
    city: string;
    province: string;
    phoneNumber: number;
    updateAt?: Date;
    createdAt?: Date;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.mail = user.mail;
        this.login = user.login;
        this.password = user.password;
        this.image = user.image;
        this.birthdate = user.birthdate;
        this.age = User.getAge(this.birthdate);
        this.role = user.role;
        this.address = user.address;
        this.zipcode = user.zipcode;
        this.city = user.city;
        this.province = user.province;
        this.phoneNumber = user.phoneNumber;
        this.updateAt = user.updateAt;
        this.createdAt = new Date();
    }
    
    private static getAge(date: Date): number{
        let today = new Date();
        let birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if(m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}