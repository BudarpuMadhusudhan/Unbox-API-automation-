const expect = require('chai').expect
const apiUtil = require('../../../../../../utility/apiUtility')
const endPoints = require('../../../../../../end_Points/ecsAPIGatewayEndPoints')
const genUtil=require('../../../../../../utility/genericConfig')
const csvUtil =require('../../../../../../utility/csvUtility')
const payloadData = require('../../../../../../payloadData/ecsRequestPayload.data')
const stringUtil = require('../../../../../../utility/stringUtility')
const activeSation=require('../ActivatingStation.spec')
require('dotenv').config()

describe('Verify manual putaway API ', async () => {
    /**
     * @type {any[]}
     */
    var response
    it('Execute manual Putaway API',async()=>{
        let csvDataAWB = await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_29'], ['AWB'], 'Test_Data');
        let csvDataBINID =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_29'], ['Bin_id'],'Test_Data')
        let csvDataPTLID =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_29'], ['PTL_ID'],'Test_Data')
        const replacements = {
            "replace_string":csvDataAWB[0].AWB,
        }
        var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.manual_putaway,replacements)
        var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
        console.log(modifiedUpdateParcelJSON);
        response =await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.manual_putaway}`,modifiedUpdateParcelJSON)
        console.log(response[1]);
        expect(response[1].status).to.be.true
        expect(response[1].status_code).to.eq(200)
        expect(response[1].message).to.contains('Manual Putaway Request Processed Successfully')
        expect(response[1].data.milestone).to.be.equal('bin_resolution_completed')
        expect(response[1].data.bin).to.be.equal(csvDataBINID[0].Bin_id)
        expect(response[1].data.sort_id).to.be.equal(csvDataPTLID[0].PTL_ID)
    }).async
})