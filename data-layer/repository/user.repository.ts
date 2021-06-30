import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../config/database";
import { User } from "../models/user.model";

export class UserRepository{
    private table: string = "user";
    private static _connection: Connection;
    private static _instance: UserRepository;

    public static async getInstance(): Promise<UserRepository> {
        if(UserRepository._instance === undefined) {
            UserRepository._instance = new UserRepository();
        }
        return UserRepository._instance;
    }
    
    public async getAll(): Promise<User[] | null>{
        UserRepository._connection = await DatabaseUtils.getConnection();
        try {  
            const res = await UserRepository._connection.query(`SELECT * FROM ${this.table}`);
            const data = res[0];
                if(Array.isArray(data)) {
                    return (data as RowDataPacket[]).map(function(row) {
                        return new User({
                            id: "" + row["id"],
                            firstName: row["firstName"],
                            lastName: row["lastName"],
                            mail: row["mail"],
                            login: row["login"],
                            password: " ",
                            image: row["image"],
                            birthdate: row["birthdate"],
                            age: row["age"],
                            role: row["role"],
                            updateAt: row["updateAt"],
                            createdAt: row["createdAt"]
                        });
                    });
                }
            } catch(err) {
                console.error(err); 
            }
        return null;
    }

    public async getOne(login?: string, mail?: string, id?: string): Promise<User | null> {
        UserRepository._connection = await DatabaseUtils.getConnection();
        const res = await UserRepository._connection.query(`SELECT * FROM ${this.table} WHERE login = "${login}" OR mail = "${mail}" OR id = "${id}"`);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];
                return new User({
                    id: "" + row["id"],
                    firstName: row["firstName"],
                    lastName: row["lastName"],
                    mail: row["mail"],
                    login: row["login"],
                    password: " ",
                    image: row["image"],
                    birthdate: row["birthdate"],
                    age: row["age"],
                    role: row["role"],
                    updateAt: row["updateAt"],
                    createdAt: row["createdAt"]
                });
            }
        }
        return null;
    }

    public async insert(user: User): Promise<User | null> {
        UserRepository._connection = await DatabaseUtils.getConnection();
        try {
            await UserRepository._connection.execute(`INSERT INTO ${this.table} 
                (id, firstName, lastName, mail, login, password, image, birthdate, age, role, createdAt) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                user.id,
                user.firstName,
                user.lastName,
                user.mail,
                user.login,
                user.password,
                user.image,
                user.birthdate,
                user.age,
                user.role,
                user.createdAt
            ]);
            return new User({
                ...user
            });
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async update(id: string, user: User): Promise<User | null> {
        UserRepository._connection = await DatabaseUtils.getConnection();
        try {
            user.updateAt = new Date();
            await UserRepository._connection.execute(`UPDATE ${this.table} 
            SET firstName=?, lastName=?, mail=?, login=?, password=?, image=?, birthdate=?, age=?, role=?, updateAt=?   
            WHERE id = "${id}"`, [
                user.firstName,
                user.lastName,
                user.mail,
                user.login,
                user.password,
                user.image,
                user.birthdate,
                user.age,
                user.role,
                user.updateAt
            ]);
            return new User(user);
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async delete(id: string): Promise<string | null> {
        UserRepository._connection = await DatabaseUtils.getConnection();
        try {
             await UserRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
             return id;
        } catch(err) {
            console.error(err); 
            return null;
        }
    }
}
