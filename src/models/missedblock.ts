import client from "../database";
import bcrypt from "bcrypt";

import dotenv from "dotenv";

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};
export class MissedBlockModel {
  async index() {
    try {
      //open a connection a connection
      const connection = await client.connect();

      //write a sql statement
      const statement = "SELECT * FROM blocks";

      //execute the sql statement
      const result = await connection.query(statement);

      //close connectio
      connection.release();

      return result.rows;
    } catch (error) {}
  }

  async getAggregatedWithinSpecifiedTime(timeframe: number) {
    try {
      //open a connection a connection
      const connection = await client.connect();

      const hoursNeeded = 10;
      const duration = `${timeframe} hours`;
      const statement = `select * from blocks where createdat > now() - interval '${duration}'`;

      //execute the sql statement
      const result = await connection.query(statement);

      //close connectio
      connection.release();

      return result.rows;
    } catch (error) {}
  }
}
