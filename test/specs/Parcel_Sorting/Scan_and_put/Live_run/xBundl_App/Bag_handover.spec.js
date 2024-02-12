const expect = require('chai').expect
const apiUtil = require('../../../../../../utility/apiUtility')
const endPoints = require('../../../../../../end_Points/ecsAPIGatewayEndPoints')
const payloadData = require('../../../../../../payloadData/ecsRequestPayload.data')
const stringUtil = require('../../../../../../utility/stringUtility')
const genUtil=require('../../../../../../utility/genericConfig')
const genericConfig = require('../../../../../../utility/genericConfig')
const csvUtil =require('../../../../../../utility/csvUtility')
const activeSation=require('../ActivatingStation.spec')
require('dotenv').config()

describe('Verify user can able to perform Close bag, Bag seal Update and Bag handover operation', async () => {
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
    var csvDataBINID
    /**
     * @type {string}
     */
    var bag_seal_id
    /**
     * @type {string}
     */
    var new_bag_seal_id
    it('Executing Reset Parcel cache API and Validating the response', async () => {
       await genUtil.executeResetParcelCache()
    });
    it('Executing Update parcel Events API and Validating the response', async () => {
         const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_31'], ['AWB'],'Test_Data')
         const csvDataPTLID =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_31'], ['PTL_ID'],'Test_Data')
        const replacements = {
            "replace_String":csvDataAWB[0].AWB,
            "replace_station": `${process.env.PS_STATIONNAME}`
        }
        var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
        var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
        console.log(modifiedUpdateParcelJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
        console.log(response[1]);
       expect(response[1]).to.not.be.null
       expect(response[1].message).to.eq("Scan event processed successfully")
        expect(response[1].status).to.be.true
       expect(response[1].status_code).to.eq(200)
       expect(response[1].data.sort_id).to.equal(csvDataPTLID[0].PTL_ID)
    });
    it('Fetching the UBR_ID from response body', async () => {
        console.log(response[1]);
        ubr_id = await response[1].data.ubr_id
        console.log(ubr_id);
    })
    it('Executing Robot Events API with BotLoad Event and Validating the response and fetching supplied Bin', async () => {
       csvDataBINID =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_31'], ['Bin_id'],'Test_Data')
        const replacements = {
            "replace_Event_Trace_ID_UUID": `${await genericConfig.generateUUID()}`,
            "replace_feederID": "feeder_1",
            "replace_parcelID":ubr_id
        }
        const modifiedbotLoadString = await stringUtil.replaceMultiple(payloadData.robot_events_botLoaded_body, replacements)
        console.log(modifiedbotLoadString);
        const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(modifiedbotLoadString)
        console.log(modifiedbotLoadJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
        expect(response[1].status).to.be.true
        expect(response[1].message).to.contains('Load event processed successfully')
        expect(response[1].data.active_bins[0]).equal(csvDataBINID[0].Bin_id)
    });
    it(`Fetching Bin ID from response body`, async () => {
        console.log("Printing response", response[1]);
        bin_ID = await response[1].data.active_bins[0]
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
        await new Promise(resolve => setTimeout(resolve, 10000));
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
        expect(response[1].details).to.contains("Unload Completion Ack processed")
        await new Promise(resolve => setTimeout(resolve, 10000));
    });
    it('Executing Close bag API',async()=>{
        bag_seal_id=`testing_${Math.floor(Math.random() * 1000)}`
        const replacements = {
            "replace_bin_Barcode":bin_ID,
            "replace_bag_seal_id": bag_seal_id
        }
        var modifiedCloseBagString = await stringUtil.replaceMultiple(payloadData.close_bag,replacements)
        var modifiedCloseBagJSON = await stringUtil.stringToJsonObject(modifiedCloseBagString)
        console.log(modifiedCloseBagJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.close_bag}`, modifiedCloseBagJSON)
        console.log(response[1]);
        expect(response[1]).to.not.be.null
        expect(response[1].status).to.be.true
        expect(response[1].status_code).to.eq(200)
        expect(response[1].message).to.contain('Bag closed successfully')
        await new Promise(resolve => setTimeout(resolve, 10000));

    })
    it('Executing Bag_seal update Api',async()=>{
        new_bag_seal_id=`close_${Math.floor(Math.random() * 100)}`
        const replacements = {
            "replace_old_bag_seal":bag_seal_id,
            "replace_new_bag_seal":new_bag_seal_id
        }
        var modifiedBagSealUpdateString = await stringUtil.replaceMultiple(payloadData.bag_seal_update,replacements)
        var modifiedBagSealUpdateJSON = await stringUtil.stringToJsonObject(modifiedBagSealUpdateString)
        console.log(modifiedBagSealUpdateJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.bag_seal_update}`, modifiedBagSealUpdateJSON)
        console.log(response[1]);
       expect(response[1]).to.not.be.null
       expect(response[1].status).to.be.true
       expect(response[1].status_code).to.eq(200)
       expect(response[1].message).to.eq("Bag Seal Updated Successfully")
       await new Promise(resolve => setTimeout(resolve, 10000));
    })
    it('Executing bag_hand_over_request Api',async()=>{
        const replacements = {
            "replace_bag_seal_id":new_bag_seal_id
        }
        var modifiedHandoverString = await stringUtil.replaceMultiple(payloadData.bag_handover,replacements)
        var modifiedHandOverJSON = await stringUtil.stringToJsonObject(modifiedHandoverString)
        console.log(modifiedHandOverJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.bag_handover}`, modifiedHandOverJSON)
        console.log(response[1]);
        expect(response[1]).to.not.be.null
        expect(response[1].status).to.be.false
        expect(response[1].status_code).to.eq(400)
        expect(response[1].message).to.eq("Printing failed")
        expect(response[1].handover_message).to.equal('Hand over success')
    })
})


