// Import
const { ApiPromise, WsProvider } = require("@polkadot/api");
import client from "../database";
import dotenv from "dotenv";

dotenv.config();
export class Subscription {
  // Construct
  async main() {
    try {
      const wsProvider = new WsProvider("wss://testnet.polygonavail.net/ws");

      const api = await ApiPromise.create({ provider: wsProvider });
      // Wait until we are ready and connected
      await api.isReady;

      // Retrieve the chain name
      const chain = await api.rpc.system.chain();

      // Retrieve the latest header
      const lastHeader = await api.rpc.chain.getHeader();

      // // Log the information
      console.log(
        `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
      );

      const block = `${lastHeader.number}`;
      const hash = `${lastHeader.hash}`;
      await this.create({ block: block, hash: hash });

      // Subscribe to the new headers
      // await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      //   console.log(
      //     `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
      //   );
      //   await this.create({ block: block, hash: hash });
      // });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}.txt`;
    let timestamp = new Date().getTime();

    return String(`${timestamp}.txt`);
  }

  async create(data: { block: string; hash: string }) {
    try {
      console.log("\n");
      console.log("--------------------------------------------");
      console.log("Starting cron: run every minute");
      console.log("--------------------------------------------");
      console.log("\n");
      const { block, hash } = data;
      const conn = await client.connect();

      const lastRecord = await this.getLastRecord();

      let totalMissedBlock: number = 0;
      let tblock: number = 0;

      if (lastRecord) {
        tblock =
          parseInt(block) -
          (lastRecord != undefined ? parseInt(lastRecord.blocknumber) : 0);
        totalMissedBlock = Math.abs(
          parseInt(process.env.TOTAL_EXPECTED_BLOCK) - tblock
        );
      } else {
        totalMissedBlock = 0;
      }

      const sql =
        "INSERT INTO blocks (blocknumber, hash, missedblocks, block_produced_within_time) VALUES($1, $2, $3, $4) RETURNING *";
      const result = await conn.query(sql, [
        block,
        hash,
        totalMissedBlock,
        tblock,
      ]);

      const newBlock = result.rows[0];

      conn.release();
      // return block;

      console.log(newBlock);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getLastRecord() {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM blocks ORDER BY id DESC LIMIT 1";

      const result = await conn.query(sql);

      conn.release();

      return result.rows[0];
    } catch (error) {}
  }

  async getAll() {
    try {
      //opening a connection to the db
      const connection = await client.connect();

      //sql query
      const sql = "SELECT * FROM blocks";

      //run query
      const result = await connection.query(sql);

      //close conection
      connection.release();

      return result.rows;
    } catch (error) {}
  }

  async getBlockByBlocknumber(blockNumber: string) {
    try {
      const conn = await client.connect();

      //opening a connection to the db
      const connection = await client.connect();

      //sql query
      const sql = "SELECT * FROM blocks WHERE blockNumber=($1)";

      //run query

      const result = await connection.query(sql, [blockNumber]);

      //close conection
      connection.release();

      return result.rows[0];
    } catch (error) {}
  }
}
