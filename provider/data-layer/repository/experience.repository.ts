import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../../../config/database";
import { Experience } from "../model/experience.model";

export class ExperienceRepository{
    private table: string = "experience";
    private static _connection: Connection | null;
    private static _instance: ExperienceRepository;

    public static async getInstance(): Promise<ExperienceRepository> {
        if(ExperienceRepository._instance === undefined) {
            ExperienceRepository._instance = new ExperienceRepository();
        }
        return ExperienceRepository._instance;
    }
    
    public async get(providerId: string | undefined): Promise<Experience[] | null>{
        ExperienceRepository._connection = await DatabaseUtils.getConnection();
        try {  
            if(ExperienceRepository._connection && providerId !== undefined){
                const res = await ExperienceRepository._connection.query(`SELECT * FROM ${this.table} WHERE providerId = "${providerId}"`);
                const data = res[0];
                    if(Array.isArray(data)) {
                        return (data as RowDataPacket[]).map(function(row) {
                            return new Experience({
                                id: "" + row["id"],
                                providerId: row["providerId"],
                                startYear: row["startYear"],
                                endYear: row["endYear"],
                                title: row["title"],
                                description: row["description"],
                                updateAt: row["updateAt"],
                                createdAt: row["createdAt"]
                            });
                        });
                    }
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async insert(experience: Experience): Promise<Experience | null> {
        ExperienceRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(ExperienceRepository._connection){
                await ExperienceRepository._connection.execute(`INSERT INTO ${this.table} 
                    (id, providerId, startYear, endYear, title, description, createdAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                    experience.id,
                    experience.providerId,
                    experience.startYear,
                    experience.endYear,
                    experience.title,
                    experience.description,
                    experience.createdAt
                ]);
                return new Experience({
                    ...experience
                });
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async update(id: string | undefined, experience: Experience): Promise<Experience | null> {
        ExperienceRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(ExperienceRepository._connection && id !== undefined){
                experience.updateAt = new Date();
                await ExperienceRepository._connection.execute(`UPDATE ${this.table} 
                SET providerId=?, startYear=?, endYear=?, title=?, description=?, updateAt=? 
                WHERE id = "${id}"`, [
                    experience.providerId,
                    experience.startYear,
                    experience.endYear,
                    experience.title,
                    experience.description,
                    experience.updateAt
                ]);
                return new Experience(experience);
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async delete(id: string): Promise<string | null> {
        ExperienceRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(ExperienceRepository._connection){
                await ExperienceRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
                return id;
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }
}
