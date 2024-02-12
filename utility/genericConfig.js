/* IMPORTS */
const expect = require('chai').expect
const apiUtil = require('./apiUtility')
const cmsEndPoints = require('../end_Points/cmsEndpoints')
const scEndPoints = require('../end_Points/sortengineEndpoints')
const ecsEndPoints = require('../end_Points/ecsAPIGatewayEndPoints')
const cmsPayloadData = require('../payloadData/cmsRequestPayload.data')
const ecsPayloadData = require('../payloadData/ecsRequestPayload.data')
const stringUtil = require('./stringUtility')
const endPoints = require('../end_Points/ecsAPIGatewayEndPoints')
const payloadData = require('../payloadData/ecsRequestPayload.data')

require('dotenv').config()
var configureParcelSortationEnvironment
var executeResetParcelCache
var executeNodeResetParcelCache

class GenericConfig {

    /**
     * @description  "This method is developed for activating the system mode"
     * @param {string} systemMode
     */
    async activateSystemMode(systemMode) {
        console.log(`${process.env.STAGING_URL}${process.env.CMS_PORT}${cmsEndPoints.cmsEndpoints.getSystemConfig}`);
        var response
        response = await apiUtil.getData(`${process.env.STAGING_URL}${process.env.CMS_PORT}${cmsEndPoints.cmsEndpoints.getSystemConfig}`)
        if (response[1].system_mode != systemMode) {
            const replacements = {
                "replace_systemMode": systemMode,
            }
            const requestPayload = await stringUtil.replaceMultiple(`${cmsPayloadData.activateSystemModePayload}`, replacements)
            const modifiedRequestPayload = await stringUtil.stringToJsonObject(requestPayload)
            response = await apiUtil.putData(`${process.env.STAGING_URL}${process.env.CMS_PORT}${cmsEndPoints.cmsEndpoints.activateSystemMode}`, modifiedRequestPayload)
            expect(response[0]).to.eq(200)
        }
        else {
            console.log(`Current System mode is in ${systemMode}`);
        }
    }

    /**
     * @description "This method is developed for activating sortation mode"
     * @param {string} sortationMode
     */
    async activateSortationMode(sortationMode) {
        var response
        response = await apiUtil.getData(`${process.env.STAGING_URL}${process.env.CMS_PORT}${cmsEndPoints.cmsEndpoints.getSystemConfig}`)
        if (response[1].sortation_mode != sortationMode) {
            const replacements = {
                "replace_sortationMode": sortationMode,
            }
            const requestPayload = await stringUtil.replaceMultiple(`${cmsPayloadData.activateSortationPayload}`, replacements)
            const modifiedRequestPayload = await stringUtil.stringToJsonObject(requestPayload)
            response = await apiUtil.putData(`${process.env.STAGING_URL}${process.env.CMS_PORT}${cmsEndPoints.cmsEndpoints.activateSortationMode}`, modifiedRequestPayload)
            expect(response[0]).to.eq(200)
        }
        else {
            console.log(`Current Sortation mode is in ${sortationMode}`);
        }
    }

    /**
     * @description "This method is developed for activating station"
     * @param {string} stationName
     * @param {string} feederName
     * @param {string} attachedScanner
     */
    async activateStation(stationName, feederName, attachedScanner) {
        var requestPayload
        var response
        var modifiedRequestPayload
        response = await apiUtil.getData(`${process.env.STAGING_URL}${process.env.CMS_PORT}${cmsEndPoints.cmsEndpoints.getSystemConfig}`)
        console.log(response);
        if (response[1].system_mode == "dummy_run" || response[1].system_mode == "live_run") {
            const scanner_replacements = {
                "replace_station": stationName,
                "replace_feeder": feederName,
                "replace_entity_id": attachedScanner,
                "replace_entity": "scanner"
            }
            requestPayload = await stringUtil.replaceMultiple(`${ecsPayloadData.update_feeder_status_body}`, scanner_replacements)
            modifiedRequestPayload = await stringUtil.stringToJsonObject(requestPayload)
            response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_feeder_status}`, modifiedRequestPayload)
            // console.log(response[1]);
            expect(response[0]).to.eq(200)
            expect(response[1].data).to.eq(" Update feeder request processed successfully")
            const stationDashboard_replacements = {
                "replace_station": stationName,
                "replace_feeder": feederName,
                "replace_entity_id": stationName,
                "replace_entity": "station_dashboard"
            }
            requestPayload = await stringUtil.replaceMultiple(`${ecsPayloadData.update_feeder_status_body}`, stationDashboard_replacements)
            modifiedRequestPayload = await stringUtil.stringToJsonObject(requestPayload)
            response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_feeder_status}`, modifiedRequestPayload)
            // console.log(response[1]);
            expect(response[0]).to.eq(200)
            expect(response[1].data).to.eq(" Update feeder request processed successfully")
            const stationUser_replacements = {
                "replace_station": stationName,
                "replace_feeder": feederName,
                "replace_entity_id": stationName,
                "replace_entity": "station_user"
            }
            requestPayload = await stringUtil.replaceMultiple(`${ecsPayloadData.update_feeder_status_body}`, stationUser_replacements)
            modifiedRequestPayload = await stringUtil.stringToJsonObject(requestPayload)
            response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_feeder_status}`, modifiedRequestPayload)
            // console.log(response[1]);
            expect(response[0]).to.eq(200)
            expect(response[1].data).to.eq(" Update feeder request processed successfully")
            const stationFloor_replacements = {
                "replace_station": stationName,
                "replace_feeder": feederName,
                "replace_entity_id": stationName,
                "replace_entity": "station_floor"
            }
            requestPayload = await stringUtil.replaceMultiple(`${ecsPayloadData.update_feeder_status_body}`, stationFloor_replacements)
            modifiedRequestPayload = await stringUtil.stringToJsonObject(requestPayload)
            response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_feeder_status}`, modifiedRequestPayload)
            // console.log(response[1]);
            expect(response[0]).to.eq(200)
            expect(response[1].data).to.eq(" Update feeder request processed successfully")
        }
        else {
            console.log("System mode is not in Dummy Run or Live Run");
        }
    }

    /**
     * @param {string} filePath
     * @param {string} fileName
     * @param {string} uploadKey
     */
    async uploadSKUDetails(filePath, fileName, uploadKey) {
        var response = await apiUtil.postDataFile(`${process.env.STAGING_URL}${process.env.SORT_ENGINE_PORT}${scEndPoints.sortEngine.upload_sku_dummy}`, filePath, fileName, uploadKey)
        console.log(response[1]);
        expect(response[0]).to.eq(201)
        expect(response[1].message).to.eq("Insert successfull...")
        expect(response[1].status).to.be.true
    }

    /**
     * @param {string} filePath
     * @param {string} fileName
     * @param {string} uploadKey
     */
    async uploadShipmentDetails(filePath, fileName, uploadKey) {
        var response = await apiUtil.postDataFile(`${process.env.STAGING_URL}${process.env.SORT_ENGINE_PORT}${scEndPoints.sortEngine.upload_shipment_dummy}`, filePath, fileName, uploadKey)
        console.log(response[1]);
        expect(response[0]).to.eq(201)
        expect(response[1].message).to.eq("Insert successfull...")
        expect(response[1].status).to.be.true
    }

    /**
     * @param {string} binstate
     * @description This method is used to either change the binStatus to "binActive", "binDeactivated" Here All the bins names are sent as an Array to the request payload
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async updateAllBinStatus(binstate) {
        var response
        response = await apiUtil.getData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.all_bin_status}`)
        // console.log(response[1].data);
        const len = response[1].data.length
        console.log(len);
        var binName = []
        for (let i = 0; i < len; i++) {
            var binNamestr = `${response[1].data[i].bin_id}`
            binName.push(binNamestr)
        }
        // console.log(binName);
        var dataToReplace = "replace_binState"
        const modifiedBody = await stringUtil.replaceData(ecsPayloadData.update_bins_body, dataToReplace, binstate)
        const modifiedRequestPayload = await stringUtil.stringToJsonObject(modifiedBody)
        // console.log(obj);
        modifiedRequestPayload.bin_ids = binName
        // console.log(modifiedRequestPayload);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_bins}`, modifiedRequestPayload)
        console.log(response[1]);
    }

    /**
     * @description This method is used to Generate 12 Digit random Item Barcode
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
    */
    async generateItemBarcode() {
        return '1' + Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');
    }

    /**
     * @description This method is used to generate random UUID
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
    }

    /**
     * @description This method is used to Update all the bin status to either of the following binState "binFull", "binStopped_ps", "binDeactivated_ed", "binStopped_bpa", "binStopped_ba", "binStopped_ms", "binActive", "binDeactivated", "binDeactivated_ds"
     * @param {String} binState
     * @author SWARAJ <swaraj.t@unboxrobotics.com>
     */
    async changeAllBinStatus(binState){
        var response
        response = await apiUtil.getData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.all_bin_status}`)
        // console.log(response[1].data);
        const len = response[1].data.length
        console.log(len);
        var binName = []
        for (let i = 0; i < len; i++) {
            var binNamestr = `${response[1].data[i].bin_id}`
            binName.push(binNamestr)
        }
        for (let j = 0; j < binName.length; j++) {
            const replacements = {
                "replace_binID": binName[j],
                "replace_binState": binState
            }
            const modifiedupdateBinString = await stringUtil.replaceMultiple(ecsPayloadData.update_single_binStatus_body, replacements)
            console.log(modifiedupdateBinString);
            const modifiedupdateBinJSON = await stringUtil.stringToJsonObject(modifiedupdateBinString)
            console.log(modifiedupdateBinJSON);
            response = await apiUtil.putData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_bin_status}`, modifiedupdateBinJSON)
            // console.log(response[1]);
        }
        
    }

     /**
     * @description This method is used to Update all the bin status to either of the following binState "binFull", "binStopped_ps", "binDeactivated_ed", "binStopped_bpa", "binStopped_ba", "binStopped_ms", "binActive", "binDeactivated", "binDeactivated_ds"
     * @param {String} binState
     * @param {String} binID
     */
     async changeSingleBinStatus(binID,binState){
        var response
            const replacements = {
                "replace_binID": binID,
                "replace_binState": binState
            }
            const modifiedupdateBinString = await stringUtil.replaceMultiple(ecsPayloadData.update_single_binStatus_body, replacements)
            console.log(modifiedupdateBinString);
            const modifiedupdateBinJSON = await stringUtil.stringToJsonObject(modifiedupdateBinString)
            console.log(modifiedupdateBinJSON);
            response = await apiUtil.putData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_bin_status}`, modifiedupdateBinJSON)
            console.log(response[1]);
            
    }

        /**
         * This method is developed to active the station in Parcel sorting Live run
         */
    configureParcelSortationEnvironment = async () => {
            await this.activateSystemMode("live_run");
            await this.activateSortationMode("parcel_sorting");
            await this.activateStation(`${process.env.PS_STATIONNAME}`, `${process.env.PS_FEEDERNAME}`,`${process.env.PS_SCANNERNAME}`
            );
        };

        /**
         * This method is developed to active the station in Parcel sorting Dummy run
         */
    configureParcelSortationEnvironmentDummyrun = async () => {
            await this.activateSystemMode("dummy_run");
            await this.activateSortationMode("parcel_sorting");
            await this.activateStation(`${process.env.PS_STATIONNAME}`, `${process.env.PS_FEEDERNAME}`,`${process.env.PS_SCANNERNAME}`
            );
        };

        /**
         * This method is developed to reset the Parcel Cache 
         */
    executeResetParcelCache = async () => {
        var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
        console.log(response[1]);
        expect(response[0]).to.eq(200)
        expect(response[1]).to.not.be.null
        expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
        expect(response[1].status).to.be.true
        };
        
        /**
         * This method is developed to reset the Parcel Cache in Node VNC
         */
    executeNodeResetParcelCache = async () => {
            var response = await apiUtil.postData(`${process.env.NODE_URL}${process.env.NODE_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
            console.log(response[1]);
            expect(response[0]).to.eq(200)
            expect(response[1]).to.not.be.null
            expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
            expect(response[1].status).to.be.true
        };
      
    

        
}

module.exports = new GenericConfig();