/* IMPORTS */
const expect = require('chai').expect
const apiUtil = require('../../../../../../utility/apiUtility')
const endPoints = require('../../../../../../end_Points/ecsAPIGatewayEndPoints')
const payloadData = require('../../../../../../payloadData/ecsRequestPayload.data')
const stringUtil = require('../../../../../../utility/stringUtility')
const genUtil=require('../../../../../../utility/genericConfig')
const genericConfig = require('../../../../../../utility/genericConfig')
const dbUtility = require('../../../../../../utility/dbUtility')
require('dotenv').config()

describe('Parcel Journey in Parsal Sorting', async () => {
    /**
     * @type {any}
     */
    var bin_ID
    /**
     * @type {any[]}
     */
    var response
    /**
     * @type {string}
     */
    var ubr_id
   /**
    * @type {any}
    */
    var traceID
    
    it.only('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
        await genUtil.activateSystemMode("dummy_run")
        await genUtil.activateSortationMode("parcel_sorting")
        await genUtil.activateStation(`${process.env.PS_STATIONNAME}`,`${process.env.PS_FEEDERNAME}`,`${process.env.PS_SCANNERNAME}`)
    });

    it.only('Executing Robot Events API with BotLoad Event ', async () => {
        const botLoadInString = await payloadData.PS_robot_events_botLoaded_body 
        console.log(botLoadInString);
         const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(botLoadInString)
         console.log(modifiedbotLoadJSON)
         response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
        console.log(response[1]);  
    });
    
    it.only('Fetching trace id from tns_Parcel_status_table in DataBase',async()=>{
        traceID=await dbUtility.executeQueryInDatabase(`select ubr_id
        from ecs.tns_parcel_status tps 
        order by tps.created_at desc 
        fetch first 1 rows only`)
        console.log(traceID);
    })
    
    it('Executing Update parcel Events API and Validating the response', async () => {
        const replacements = {
            "replace_String":"UBR0253S",//"UBR1144S",//"UBR0654S1",//"123UBR0654S112345678",//"123UBR3053S123456789",
            "replace_station": `${process.env.PS_STATIONNAME}`,
            "replace_traceID":traceID[0].ubr_id
        }
        var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_update_parcel_body,replacements)
        var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
        console.log(modifiedUpdateParcelJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
        console.log(response[1]);
       expect(response[1]).to.not.be.null
       expect(response[1].detail).to.eq("Bin Destination successfully sent to RCS")
        expect(response[1].status).to.be.true
       expect(response[1].StatusCode).to.eq(200)
    });

    it('Fetching the UBR_ID from response body', async () => {
        console.log(response[1]);
        ubr_id = await response[1].data.payload.parcel_id
        console.log(ubr_id);
    })
   
    it(`Fetching Bin ID from response body`, async () => {
        console.log("Printing response", response[1]);
        bin_ID = await response[1].data.payload.active_bins[0]
        console.log(response[1]);
        console.log(bin_ID);
    });
    it('Executing Robot Unload Request API and Validating the response', async () => {
        const replacements = {
            "replace_parcel": ubr_id,
            "replace_binName": bin_ID
        }
        const modified_robotUnload = await stringUtil.replaceMultiple(payloadData.robot_unload_request_body, replacements)
        const modified_robotUnload_JSON = await stringUtil.stringToJsonObject(modified_robotUnload)
        console.log(modified_robotUnload_JSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_unload_request}`, modified_robotUnload_JSON)
        console.log(response[1]);
        expect(response[1]).to.not.be.null
        expect(response[1].details).to.eq("Robot Unload Request Successfull")
        expect(response[1].status).to.be.true
        expect(response[1].StatusCode).to.eq(200)
    });
    it('Executing Robot Unload Completion Ack API and Validating the response', async () => {
        const replacements = {
            "replace_parcel": ubr_id,
            "replace_binName": bin_ID
        }
        var modified_robotUnload_comp = await stringUtil.replaceMultiple(payloadData.robot_unload_completion_ack_body, replacements)
        var modified_robotUnload_comp_JSON = await stringUtil.stringToJsonObject(modified_robotUnload_comp)
        console.log(modified_robotUnload_comp_JSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_unload_completion_ack}`, modified_robotUnload_comp_JSON)
        console.log(response[1]);
        expect(response[1]).to.not.be.null
        expect(response[1]).to.contains("Robot Unload Ack request processed successfully")
    });
})