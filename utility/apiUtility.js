const axios = require('axios').default
var FormData=require('form-data')
var fs=require('fs')
class APIUtility {

    /**
     * @description This method is used to make a GET request
     * @param {string} endPointWithURL 
     * @returns any[]
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async getData(endPointWithURL) {
        /**
         * @param {string} endPointWithURL
         */
        async function fetchData(endPointWithURL) {
            try {
                const response = await axios.get(endPointWithURL);
                return [response.status, response.data]
            } catch (error) {
                // console.log(error);
                // @ts-ignore
                return [error.response.status, error.response.data]
            }
        }
        const response = fetchData(endPointWithURL)
        return response
    }
    
    /**
     * @description This method is used to make a GET request by providing query Parameter
     * @param {string} endPointWithURL
     * @returns any[]
     * @param {object} queryParam
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async getDataWithQueryParam(endPointWithURL,queryParam) {
        /**
         * @param {string} endPointWithURL
         * @param {object} [queryParam]
         */
        async function fetchData(endPointWithURL,queryParam) {
            try {
                const response = await axios.get(endPointWithURL, {
                    params: queryParam,
                  });
                return [response.status, response.data]
            } catch (error) {
                console.log(error);
                // @ts-ignore
                return [error.response.status, error.response.data]
            }
        }
        const response = fetchData(endPointWithURL,queryParam)
        return response
    }

    /**
     * @description This method is used to perform POST request by passing request payload
     * @param {string} endPointWithURL 
     * @param {object} reqBody 
     * @returns any[]
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async postData(endPointWithURL, reqBody) {
        /**
         * @param {string} endPointWithURL
         * @param {object} requestData
         */
        async function sendHttpPostRequest(endPointWithURL, requestData) {
            try {
                const response = await axios.post(endPointWithURL, requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return [response.status, response.data]
            } catch (error) {
                console.log(error);
                // @ts-ignore
                return [error.response.status, error.response.data]

            }
        }
        var response = sendHttpPostRequest(endPointWithURL, reqBody)
        return response
    }

    /**
     * @description This method is used to perform PUT request by providing endpoint and request payload
     * @param {string} endPointWithURL
     * @param {object} reqBody
     * @returns any[]
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async putData(endPointWithURL, reqBody) {
        /**
         * @param {string} endPointWithURL
         * @param {any} requestData
         * @author SWARAJ <swaraj.t@unboxrobotics.com>
         */
        async function sendHttpPutRequest(endPointWithURL, requestData) {
            try {
                const response = await axios.put(endPointWithURL, requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return [response.status, response.data]
            } catch (error) {
                // console.log(error);
                // @ts-ignore
                return [error.response.status, error.response.data]

            }
        }
        var response = sendHttpPutRequest(endPointWithURL, reqBody)
        return response
    }

    /**
     * @description This method is used to perform PATCH request by providing endpoint and request payload
     * @param {string} endPointWithURL
     * @param {object} reqBody
     * @returns any[]
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async patchData(endPointWithURL, reqBody) {
        /**
         * @description This method is used to perform patch API call by providing the following parametrs
         * @param {string} endPointWithURL
         * @param {any} requestData
         * @author SWARAJ <swaraj.t@unboxrobotics.com>
         */
        async function sendHttpPatchRequest(endPointWithURL, requestData) {
            try {
                const response = await axios.patch(endPointWithURL, requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return [response.status, response.data]
            } catch (error) {
                // console.log(error);
                // @ts-ignore
                return [error.response.status, error.response.data]
            }
        }
        var response = sendHttpPatchRequest(endPointWithURL, reqBody)
        return response
    }

    /**
     * @description This method is used to perform POST request by uploading CSV file
     * @param {string} endPointWithURL
     * @param {string} filePath
     * @param {string} [fileName]
     * @param {string} [uploadKey]
     */
    async postDataFile(endPointWithURL, filePath,fileName,uploadKey) {
        /**
         * @param {string} endPointWithURL
         * @param {string} filePath
         * @param {undefined} [fileName]
         * @param {undefined} [uploadKey]
         */
        async function sendPostRequestWithFile(endPointWithURL, filePath,fileName,uploadKey) {
            try {
                const formData = new FormData();
                formData.append(`${uploadKey}`, fs.createReadStream(filePath), {
                    filename: `${fileName}` // Replace with the desired filename in the request
                  });
                const response = await axios.post(endPointWithURL, formData, {
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    }
                });
                return [response.status, response.data]
            } catch (error) {
                console.log(error);
                // @ts-ignore
                return [error.response.status, error.response.data]
            }
        }
        // @ts-ignore
        var response = sendPostRequestWithFile(endPointWithURL, filePath,fileName,uploadKey)
        return response
    }

    /**
     * @description This is used to perform the delete API request by providing the endpoint
     * @param {string} endPointWithURL
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async deleteData(endPointWithURL) {

        /**
         * @param {string} endPointWithURL
         */
        async function deleteData(endPointWithURL) {
            try {
                const response = await axios.delete(endPointWithURL)
                return [response.status, response.data]
            }
            catch (error) {
                // @ts-ignore
                return [error.response.status, error.response.data]
            }
        }
        var response = deleteData(endPointWithURL)
        return response
    }

}
module.exports = new APIUtility();