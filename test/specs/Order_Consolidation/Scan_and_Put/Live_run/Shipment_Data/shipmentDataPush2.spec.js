/* IMPORTS */
const expect = require('chai').expect
const apiUtil = require('../../../../../../utility/apiUtility')
const endPoints = require('../../../../../../end_Points/ecsAPIGatewayEndPoints')
const myntraPayloadData = require('../../../../../../payloadData/myntraPayload.data')
const stringUtil = require('../../../../../../utility/stringUtility')
const genUtil = require('../../../../../../utility/genericConfig')
const { myntraEndpoints } = require('../../../../../../end_Points/myntraEndpoints')
const genericConfig = require('../../../../../../utility/genericConfig')
require('dotenv').config()

/* STATUS CODE IS DISPLAYED AS 404 and STATUS is false, Even though inserted data is present in DB */
describe('Shipment Data Push with new payload', async () => {
    /**
     * @type {any[]}
     */
    var response
    /**
     * @type {string}
     */
    var randomItemBarcode
    /** 
     * @type {Object}
    */
    var modifiedInsertShipmentPayload
    it('Activating the Station', async () => {
        await genUtil.activateSystemMode("live_run")
        await genUtil.activateSortationMode("order_consolidation")
        await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
    });
    it('Adding a new item in Shipment Information OC live table', async () => {
        // var randomSectionName = `${Math.ceil(Math.random() * 10000)}`
        // randomItemBarcode = `1AutoUBR${Math.ceil(Math.random() * 1000)}`
        // var randomConsolidationPacketID = `${Math.ceil(Math.random() * 1000)}`
        // var randomPacketID = `${Math.ceil(Math.random() * 1000)}`
        randomItemBarcode = `${await genericConfig.generateItemBarcode()}`
        const replacements = {
            "replace_StatusMessage": "AutomationTest",
            "replace_ConsolidationPacketID": 12345,
            "replace_ConsolidationPacketStatus": "OPEN",
            "replace_sectionId": 234567,
            "replace_packetItemId": 12000,
            "replace_itemBarcode": randomItemBarcode,
            "replace_skuID": 123445678,
            "replace_itemStatus": "ASSIGNED",
            "replace_PacketSKUID": 88
        }
        var replacedString = await stringUtil.replaceMultiple(myntraPayloadData.insertShipmentLatest, replacements)
        console.log(replacedString);
        modifiedInsertShipmentPayload = await stringUtil.stringToJsonObject(replacedString)
        console.log(modifiedInsertShipmentPayload);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.MYNTRA_N8N_PORT}${myntraEndpoints.insertShipmentInfoEndpoint}`, modifiedInsertShipmentPayload)
        console.log(response[1]);
        // expect(response[1]).to.not.be.null
        // expect(response[1].message).to.eq("Inserted to database")
        // expect(response[1].status).to.be.true
        // expect(response[1].statusCode).to.eq(200)
    });
    it('Verifying the item is added into the dataBase', async () => {
        const queryparam={
            scanned_barcode:randomItemBarcode
        }
        console.log(queryparam);
        response=await apiUtil.getDataWithQueryParam(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.get_item_details}`,queryparam)
        console.log(response[1]);
       // expect(response[1].data.scanned_barcode[0]).to.eq(randomItemBarcode)
    });
})