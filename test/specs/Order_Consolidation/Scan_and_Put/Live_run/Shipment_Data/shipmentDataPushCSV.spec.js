/* IMPORTS */
const stringUtil = require('../../../../../../utility/stringUtility')
const csvUtility = require('../../../../../../utility/csvUtility')
const myntraPayloadData = require('../../../../../../payloadData/myntraPayload.data')
const apiUtil = require('../../../../../../utility/apiUtility')
const { myntraEndpoints } = require('../../../../../../end_Points/myntraEndpoints')

require('dotenv').config()

describe('Reading Data from CSV File and appending it to insert shipment Payload', async () => {
    it('Reading multiple Data From CSV File', async () => {
        var arr = ["replace_StatusMessage","replace_ConsolidationPacketID","replace_ConsolidationPacketStatus","replace_sectionId","replace_packetItemId","replace_itemBarcode","replace_skuID","replace_itemStatus","replace_PacketSKUID"]
        var result=await csvUtility.getAllTheDataFromCSVByColumnHeaders("./test_Data/Shipment_info.csv",arr)
        result.forEach( async(/** @type {any[]} */ replacements)=> {
        var replacedString = await stringUtil.replaceMultiple(myntraPayloadData.insertShipmentLatest, replacements)
        var modifiedInsertShipmentPayload = await stringUtil.stringToJsonObject(replacedString)
        console.log(modifiedInsertShipmentPayload);
        var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.MYNTRA_N8N_PORT}${myntraEndpoints.insertShipmentInfoEndpoint}`, modifiedInsertShipmentPayload)
        console.log(response);
        
        });
    });
})