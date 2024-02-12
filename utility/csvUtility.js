const fs = require('fs');
const csv = require('csv-parser');



class CSVUtility  {

  /**
   * @description This method is used to read data of all the records of a particluar column from CSV file by providing Column Header Name
   * @param {string} csvFilePath
   * @param {string | number} targetColumnHeader
   * @author SWARAJ P T <Swaraj.t@unboxrobotics.com>
   */
  async getDataInCSVByColumnHeader(csvFilePath, targetColumnHeader) {
    return new Promise((resolve, reject) => {
      /**
         * @type {any[]}
         */
      const results = [];

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          if (row[targetColumnHeader]) {
            results.push(row[targetColumnHeader]);
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * @description This method will write data to CSV based on column Headers
   * @param {string} csvFilePath
   * @param {any[]} data
   * @author SWARAJ P T <swaraj.t@unboxrobotics.com>
   */
  async writeDataToCSV(csvFilePath, data) {
    // Extract column headers from the first row of data
    const columnHeaders = data.length > 0 ? Object.keys(data[0]) : [];

    // Create a CSV string with headers and data
    let csvContent = `${columnHeaders.join(',')}\n`;

    data.forEach((/** @type {{ [x: string]: any; }} */ row) => {
      const values = columnHeaders.map((header) => row[header]);
      csvContent += `${values.join(',')}\n`;
    });

    // Write the CSV content to the file
    fs.writeFileSync(csvFilePath, csvContent);
  }

  /**
   * @description This method is used to get the Data from CSV file based on rows and column Header Names
   * @param {string} csvFilePath
   * @param {number[]} targetRowNumbers
   * @param {string[]} targetColumnHeaders
   * @author SWARAJ <swaraj.t@unboxrobotics.com>
   */
  async getDataInCSVByRowNumberAndColumnHeaders(csvFilePath, targetRowNumbers, targetColumnHeaders) {
    return new Promise((resolve, reject) => {
      /**
       * @type {any[]}
       */
      const results = [];

      let currentRowNumber = 0;

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          currentRowNumber++;

          // Check if the current row number is in the targetRowNumbers array
          if (targetRowNumbers.includes(currentRowNumber)) {
            const rowData = {};
            for (const header of targetColumnHeaders) {
              if (row[header]) {
                // @ts-ignore
                rowData[header] = row[header];
              }
            }
            results.push(rowData);
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * @description This method is used to Read all the data from CSV file Based on Column Headers
   * @param {string} csvFilePath
   * @param {string[]} targetColumnHeaders
   * @author SWARAJ <swaraj.t@unboxrobotics.com>
   */
  async getAllTheDataFromCSVByColumnHeaders(csvFilePath, targetColumnHeaders){
    return new Promise((resolve, reject) => {
      /**
       * @type {any[]}
       */
      const results = [];
    
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          const rowData = {};
          for (const header of targetColumnHeaders) {
            if (row[header]) {
              // @ts-ignore
              rowData[header] = row[header];
            }
          }
          results.push(rowData);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    
  }

    /**
   * @description This method is used to get the Data from CSV file based on rows and column Header Names
   * @param {string} csvFilePath
   * @param {string[]} targetRowName // Change the parameter type to string[]
   * @param {string[]} targetColumnHeaders
   * @param {string} targetRowHeader
   * @author Madhu <madhusudhan.b@unboxrobotics.com>
   */
    async getDataInCSVByRowNameAndColumnHeaders(csvFilePath, targetRowName, targetColumnHeaders,targetRowHeader) {
      return new Promise((resolve, reject) => {
        /**
         * @type {any[]}
         */
        const results = [];
  
        //let currentRowNumber = 0;
  
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            // console.log('Processing row:', row);
            //currentRowNumber++;
  
            // Check if the current row identifier is in the targetRowIdentifiers array
            if (targetRowName.includes(row[targetRowHeader])) {
              const rowData = {};
              for (const header of targetColumnHeaders) {
                if (row[header]) {
                  // @ts-ignore
                  rowData[header] = row[header];
                }
              }
              //  console.log('Row data:', rowData);
              results.push(rowData);
            }
          })
          .on('end', () => {
            resolve(results);
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    }

}

module.exports = new CSVUtility();