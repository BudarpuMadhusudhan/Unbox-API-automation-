/* IMPORTS */
const expect = require('chai').expect
const apiUtil = require('../../../../../../utility/apiUtility')
const xbsortservicePayloadData = require('../../../../../../payloadData/XBsortservicesPayload.data')
const stringUtil = require('../../../../../../utility/stringUtility')
const genUtil = require('../../../../../../utility/genericConfig')
const csvUtil = require('../../../../../../utility/csvUtility')
const endPoints=require('../../../../../../end_Points/sortengineEndpoints')
require('dotenv').config()
const activeSation=require('.././../../../../../test/specs/Parcel_Sorting/Scan_and_put/Live_run/ActivatingStation.spec')

describe('Reading Data from CSV File and appending it to XB insert shipment Payload', async () => {
    /**
     * @type {any[]}
     */
    var response 
    it('Adding a new item in Shipment Information Into the DataBase', async () => {
        var arr = ["AWB","ORDERID","DEST_CODE","SHIPMENTIDENTIFIER", "MOTs","WLIMIT","NDC_CODE","weight","length","height","breadth","VOLWEIGHT"]
        var result=await csvUtil.getAllTheDataFromCSVByColumnHeaders("./test_Data/XB_Shipment_DataPush1.csv",arr)
        result.forEach( async(/** @type {any[]} */ replacements)=> {
            var replacedString = await stringUtil.replaceMultiple(xbsortservicePayloadData.xbinsertShipment, replacements)
            var insertJSONData=await stringUtil.stringToJsonObject(replacedString)
            console.log(insertJSONData);
            response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.XB_SORT_SERVICE_PORT}${endPoints.sortEngine.upload_xb_shipment}`, insertJSONData)
            console.log(response[1]);
            expect(response[1]).to.not.be.null
            expect(response[1].status).to.be.true
            expect(response[1].status_code).to.eq(200)
            expect(response[1].message).to.be.contains("1 number of shipment information upserted into database successfully")
            });
     });
  
})
