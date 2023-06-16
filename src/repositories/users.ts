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
}

export default new UserRepository();
