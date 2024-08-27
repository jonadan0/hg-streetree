const sql = require("mssql");
const dbconfig = require("../config/dbconfig.json");

const config = {
  user: process.env.AZDB_USERNAME,
  password: dprocess.env.AZDB_PASSWORD,
  server: process.env.AZDB_SERVER,
  database: process.env.AZDB_DATABASE,
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};

const executeQuery = async (query, params) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    for (const param in params) {
      if (params[param].type && params[param].value !== undefined) {
        request.input(param, sql[params[param].type], params[param].value);
      }
    }

    const result = await request.query(query);
    return result;
  } catch (err) {
    console.error("Database query failed:", err);
    throw new Error("Database query failed");
  }
};

module.exports = { executeQuery };