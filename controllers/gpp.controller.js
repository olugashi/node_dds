import connector from "../RTIConnector";
/*import { Pool } from 'pg'

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})*/

const createRoutes = (req, res) => {
  /*try {
    const res = await pool.query('SELECT * FROM users ORDER BY id ASC' )
    console.log('getUsers is successfully');
    response.status(200).json(results.rows)
} catch (error) {
    throw error
}*/
  console.log(req.body);
  const container = req.app.get("context");
  const rti_connector = container.get("rti_connector");
  rti_connector.writeData(req.body, "circle");
  res.json(req.body);
};

export default {
  createRoutes,
};
