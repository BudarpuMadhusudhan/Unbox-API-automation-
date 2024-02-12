const Client=require('pg').Client
require('dotenv').config()

class DatabaseUtility {
    /**
     * @description This method is used to Configure the Client for the DataBase by providing the mentioned parameters.
     * The returned client has to be passed as a parameter to the "connectToDatabase" method look at the example
     * @example const configuredClient=await configureClientDetails(userName, hostURL, databaseName, dbPassword, portNumber)
     * @description Pass the configuredClient as a parameter to connectToDatabase
     * @example await connectToDatabase(configuredClient)
     * @description Pass the configuredClient as a parameter to disconnectDataBaseConnection
     * @example await disconnectDataBaseConnection(configuredClient)
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async #configureClientDetails() {
        const configuredClient =  new Client({
            user: `${process.env.DBUSERNAME}`,//postgres
            host: `${process.env.HOST}`,//192.168.11.246
            database: `${process.env.DATABASENAME}`,//unbox_v3
            password: `${process.env.PASSWORD}`,//august123
            port: Number(process.env.PORT)//5432
        });
        return configuredClient
    }
    /**
     * 
     * @param {String} queryToExecute
     * @description This method is used to execute the query in the DataBase by providing the mentioned parameter
     * @example const result=await executeQueryInDatabase(queryToExecute)
     * @returns {Promise<any[] | undefined>}
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async executeQueryInDatabase(queryToExecute) {
        var configuredClient = await this.#configureClientDetails()
        
        async function getData() {
            try {
              await configuredClient.connect();
              console.log("Connected to Database successfully");
              const query = queryToExecute
              const res = await configuredClient.query(query);
              const rows = await res.rows;
              return rows
            } catch (err) {
              console.error(err);
            }
          }
          var result=await getData() /////////
          this.disconnectDataBaseConnection()
          return result    
    }
    /**
     * @example await disconnectDataBaseConnection()
     * @description This method is used to disconnect the connection made to the DataBase
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async disconnectDataBaseConnection() {
        const configuredClient = await this.#configureClientDetails()
        await configuredClient.end()
        console.log("Closed DataBase Successfully");
    }
}
module.exports = new DatabaseUtility();


