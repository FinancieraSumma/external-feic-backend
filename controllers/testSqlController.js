const { poolPromise } = require("../database/connection");
const sql = require("mssql");

exports.testSql = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute("spFeicExternoTest");
    res.json(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.sqlMessage });
  }
}
