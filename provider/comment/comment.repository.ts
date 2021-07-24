import { Connection, RowDataPacket } from "mysql2/promise";

export class CommentRepository{
    private table: string = "comment";
    private static _connection: Connection;
    private static _instance: CommentRepository;

    public static async getInstance(): Promise<CommentRepository> {
        if(CommentRepository._instance === undefined) {
            CommentRepository._instance = new CommentRepository();
        }
        return CommentRepository._instance;
    }

    new Comment({
        id: "" + row["id"],
        userId: row["userId"],
        providerId: row["providerId"],
        title: row["title"],
        comment: row["comment"],
        updateAt: row["updateAt"],
        createdAt: row["createdAt"]
    });
    
    public async getOne(id: string): Promise<Comment[] | null>{
        CommentRepository._connection = await DatabaseUtils.getConnection();
        try {  
            const res = await CommentRepository._connection.query(`SELECT * FROM ${this.table} WHERE id = "${id}"`);
            const data = res[0];
                if(Array.isArray(data)) {
                    return (data as RowDataPacket[]).map(function(row) {
                        return new Comment({
                            id: "" + row["id"],
                            userId: row["userId"],
                            providerId: row["providerId"],
                            title: row["title"],
                            comment: row["comment"],
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
                            password: row["password"],
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

    public async insert(comment: Comment): Promise<Comment | null> {
        CommentRepository._connection = await DatabaseUtils.getConnection();
        try {
            await CommentRepository._connection.execute(`INSERT INTO ${this.table} 
                (id, usderId, providerId, date, createdAt) 
                VALUES (?, ?, ?, ?, ?)`, [
                comment.id,
                comment.userId,
                comment.providerId,
                comment.title,
                comment.comment,
                comment.createdAt
            ]);
            return new Comment({
                ...comment
            });
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async update(id: string, comment: Comment): Promise<Comment | null> {
        CommentRepository._connection = await DatabaseUtils.getConnection();
        try {
            comment.updateAt = new Date();
            await CommentRepository._connection.execute(`UPDATE ${this.table} 
            SET usderId=?, providerId=?, date=?, updateAt=? 
            WHERE id = "${id}"`, [
                comment.userId,
                comment.providerId,
                comment.title,
                comment.comment,
                comment.updateAt
            ]);
            return new Comment(comment);
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async delete(id: string): Promise<string | null> {
        CommentRepository._connection = await DatabaseUtils.getConnection();
        try {
             await CommentRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
             return id;
        } catch(err) {
            console.error(err); 
            return null;
        }()
    }
}
