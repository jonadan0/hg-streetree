const sql = require("mssql");
const dbconfig = require("../config/dbconfig.json");

const config = {
  user: dbconfig.user,
  password: dbconfig.password,
  server: dbconfig.server,
  database: dbconfig.database,
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