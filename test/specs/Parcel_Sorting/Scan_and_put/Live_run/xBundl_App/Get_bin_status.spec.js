const expect = require('chai').expect
const apiUtil = require('../../../../../../utility/apiUtility')
const endPoints = require('../../../../../../end_Points/ecsAPIGatewayEndPoints')
const genUtil=require('../../../../../../utility/genericConfig')
const csvUtil =require('../../../../../../utility/csvUtility')
const activeSation=require('../ActivatingStation.spec')
require('dotenv').config()

describe('Verify Bundl App bagging services bin status API and validate the response', async () => {
    /**
     * @type {any[]}
     */
    var response
    it('Execute All bin status API and Validate the response',async()=>{
       response= await apiUtil.getData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.all_bin_status}`)
       console.log(response[1]);
       expect(response[1].status).to.be.true
       expect(response[1].status_code).equal(200)
       expect(response[1].message).contains('Bin Details fetched successfully')
    })
    it('Execute bin status API and Validate the response',async()=>{
        const csvDataBINID =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_02'], ['Bin_id'],'Test_Data')
        const queryparam={
            bin_id:csvDataBINID[0].Bin_id
        }
        console.log(queryparam);
        response= await apiUtil.getDataWithQueryParam(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.bin_detail_byID}`,queryparam)
        console.log(response[1]);
        expect(response[1].status).to.be.true
        expect(response[1].status_code).equal(200)
        expect(response[1].data[0].bin_id).to.equal(csvDataBINID[0].Bin_id)
        expect(response[1].details).contains('Bin data fetched successfully')
     })
    it('Execute bin count API and Validate the response',async()=>{
        response= await apiUtil.getData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.get_bin_count}`)
        console.log(response[1]);
        expect(response[1].status).to.be.true
     })
})