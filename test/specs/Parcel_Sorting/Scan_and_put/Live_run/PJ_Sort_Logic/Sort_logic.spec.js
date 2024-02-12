const expect = require('chai').expect
const activeSation=require('.././../../../../../test/specs/Parcel_Sorting/Scan_and_put/Live_run/ActivatingStation.spec')
const apiUtil = require('../../../../../../utility/apiUtility')
const endPoints = require('../../../../../../end_Points/ecsAPIGatewayEndPoints')
const payloadData = require('../../../../../../payloadData/ecsRequestPayload.data')
const stringUtil = require('../../../../../../utility/stringUtility')
const genUtil=require('../../../../../../utility/genericConfig')
const genericConfig = require('../../../../../../utility/genericConfig')
const csvUtil =require('../../../../../../utility/csvUtility')
require('dotenv').config()
const { describe, it, before } = require('mocha');
const each = require('mocha-each');

// Function to fetch data synchronously
const fetchData = async (/** @type {number} */ rowNumber) => {
    const csvAWB = await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', [rowNumber], ['AWB']);
    const csvPTLID = await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', [rowNumber], ['PTL_ID']);
    const csvBINID = await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', [rowNumber], ['Bin_id']);
    const csvDESCNAME = await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', [rowNumber], ['DescName']);

    return {
        AWB: csvAWB[0]?.AWB,
        PTLID: csvPTLID[0]?.PTL_ID,
        BINID: csvBINID[0]?.Bin_id,
        DESCNAME: csvDESCNAME[0]?.DescName || 'No DescName',
    };
};
each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    .it('Test', async (i) => {
        const testData = await fetchData(i);

        describe(`Test - ${testData.DESCNAME}`,function () {
            /**
             * @type {{ replace_awb: any; replace_ptlid: any; replace_bin: any; }}
             */
            let replacements;
            // Fetch data before tests using the 'before' hook
            beforeEach(async function () {
                replacements = {
                    replace_awb: testData.AWB,
                    replace_ptlid: testData.PTLID,
                    replace_bin: testData.BINID,
                };
                it('Executing Reset Parcel cache API and Validating the response', async () => {
                    await genUtil.executeResetParcelCache()
                 });
            });
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
       
        it('Executing Update parcel Events API and Validating the response', async () => {
             const replacements = {
                "replace_String":testData.AWB,
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
           expect(response[1].data.sort_id).to.equal(testData.PTLID)
        });
        it('Fetching the UBR_ID from response body', async () => {
            console.log(response[1]);
            ubr_id = await response[1].data.ubr_id
            console.log(ubr_id);
        })
        it('Executing Robot Events API with BotLoad Event and Validating the response and fetching supplied Bin', async () => {
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
            expect(response[1].data.active_bins[0]).equal(testData.BINID)
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
        })
        });
           
    });