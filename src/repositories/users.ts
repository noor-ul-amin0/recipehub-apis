import { QueryResult } from "pg";
import { client } from "../config/db";
import { createUserQuery, findUserByEmailQuery } from "../constants/queries";
import { CreateUser, User } from "../types/user";

class UserRepository {
  async create(user: CreateUser): Promise<void> {
    const { full_name, email, password } = user;
    await client.query(createUserQuery, [full_name, email, password]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await client.query<User>(findUserByEmailQuery, [email]);
    return result.rows[0] || null;
  }

  async findOne(filter: Partial<User>): Promise<User | null> {
    let query = `SELECT * FROM users`;
    let queryParams: any[] = [];
    if (Object.keys(filter).length === 0) return null;
    query += " WHERE ";
    Object.keys(filter).forEach((key, index) => {
      if (index !== 0) query += " AND ";
      query += `${key} = $${index + 1}`;
      queryParams.push(filter[key as keyof User]); // Use 'keyof User' to enforce correct types.
    });
    query += "LIMIT 1";
    const result = await client.query<User>(query, queryParams);
    return result.rows[0] || null;
  }

  async updateOne(
    filter: Partial<User>,
    update: Partial<User>
  ): Promise<QueryResult> {
    let i = 1;
    let query = `UPDATE users SET `;
    let queryParams: any[] = []; // Use 'any[]' as a fallback since the exact type of queryParams is complex.
    Object.keys(update).forEach((key, index) => {
      if (index !== 0) query += ", ";
      query += `${key} = $${index + 1}`;
      queryParams.push(update[key as keyof User]); // Use 'keyof User' to enforce correct types.
      i++;
    });
    query += " WHERE ";
    Object.keys(filter).forEach((key, index) => {
      if (index !== 0) query += " AND ";
      query += `${key} = $${i}`;
      queryParams.push(filter[key as keyof User]); // Use 'keyof User' to enforce correct types.
      i++;
    });
    i = 1;
    return client.query(query, queryParams);
  }
}

export default new UserRepository();
