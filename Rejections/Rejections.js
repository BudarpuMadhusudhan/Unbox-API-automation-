const expect = require('chai').expect
const apiUtil = require('../utility/apiUtility')
const endPoints = require('../end_Points/ecsAPIGatewayEndPoints')
const payloadData = require('../payloadData/ecsRequestPayload.data')
const stringUtil = require('../utility/stringUtility')
const genUtil=require('../utility/genericConfig')
const genericConfig = require('../utility/genericConfig')
const dbUtility = require('../utility/dbUtility')
const ecsEndPoints = require('../end_Points/ecsAPIGatewayEndPoints')
const csvUtil=require('../utility/csvUtility')
const { describe, it } = require('mocha')
require('dotenv').config()

class Rejections
{
    async barcodeNotFound()
    {
describe('Verify Barcode_Not_Found Rejection when the scanned parcel with empty', async () => {
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
    
    it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
        await genUtil.activateSystemMode("dummy_run")
        await genUtil.activateSortationMode("parcel_sorting")
        await genUtil.activateStation(`${process.env.PS_STATIONNAME}`,`${process.env.PS_FEEDERNAME}`,`${process.env.PS_SCANNERNAME}`)
    });

    it('Executing Robot Events API with BotLoad Event ', async () => {
        const botLoadInString = payloadData.PS_robot_events_botLoaded_body 
        console.log(botLoadInString);
        const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(botLoadInString)
        console.log(modifiedbotLoadJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
        console.log(response[1]);
    });
    
    it('Fetching trace id from tns_Parcel_status_table in DataBase',async()=>{
        traceID=await dbUtility.executeQueryInDatabase(`select ubr_id
        from ecs.tns_parcel_status tps 
        order by tps.created_at desc 
        fetch first 1 rows only`)
        console.log(traceID);
    })
    
    it('Executing Update parcel Events API and Validating the response', async () => {
        const replacements = {
            "replace_String":"",
            "replace_station": `${process.env.PS_STATIONNAME}`,
            "replace_traceID":traceID[0].ubr_id
        }
        var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_update_parcel_body,replacements)
        var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
        console.log(modifiedUpdateParcelJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
        console.log(response[1]);
        expect(response[1]).to.not.be.null
        expect(response[1]).to.be.contains('BARCODE_NOT_FOUND')
        
    });
})
    }
    async RJT28_Rejection()
    {
        describe.skip('Verify RJT28 Rejection when the scanned parcel does not follow regex pattern', async () => {
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
            
            it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
                await genUtil.activateSystemMode("dummy_run")
                await genUtil.activateSortationMode("parcel_sorting")
                await genUtil.activateStation(`${process.env.PS_STATIONNAME}`,`${process.env.PS_FEEDERNAME}`,`${process.env.PS_SCANNERNAME}`)
            });
        
            it('Executing Robot Events API with BotLoad Event ', async () => {
                const botLoadInString = payloadData.PS_robot_events_botLoaded_body 
                console.log(botLoadInString);
                const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(botLoadInString)
                console.log(modifiedbotLoadJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
                console.log(response[1]);
            });
            
            it('Fetching trace id from tns_Parcel_status_table in DataBase',async()=>{
                traceID=await dbUtility.executeQueryInDatabase(`select ubr_id
                from ecs.tns_parcel_status tps 
                order by tps.created_at desc 
                fetch first 1 rows only`)
                console.log(traceID);
            })
            
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String":"1234UBR1234512345678",
                    "replace_station": `${process.env.PS_STATIONNAME}`,
                    "replace_traceID":traceID[0].ubr_id
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_update_parcel_body,replacements)
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contains(" Rejection type-RJT28")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
        })
    }
    async RJT2_Rejection()
    {
        describe('Verify RJT2 Rejection when the parcel is load without scan',async()=>{
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
        
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it('Executing Robot Events API with BotLoad Event without scanning the parcel', async () => {
                const replacements = {
                    "replace_Event_Trace_ID_UUID": `${await genericConfig.generateUUID()}`,
                    "replace_feederID": "feeder_1",
                    "replace_parcelID":""
                }
                const modifiedbotLoadString = await stringUtil.replaceMultiple(payloadData.robot_events_botLoaded_body, replacements)
                console.log(modifiedbotLoadString);
                const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(modifiedbotLoadString)
                console.log(modifiedbotLoadJSON);
                var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
                console.log(response[1].detail);
                expect(response[1].detail).to.contains("RJT02")
            });
            
        
        })
    }
    async RJT3_Rejection()
    {
        describe('Verfiy RJT3 Rejection when we scan the parcel without reset',async()=>{
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "199999999981",
                    "replace_station": `${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
               var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
               console.log(response[1].data);
               expect(response[1].data).to.contains("RJT03")
            });
           
           
        })
    }
    async RJT4_Rejection()
    {
        describe('Verify RJT4 Rejection when the Rejected parcel is loaded on the robot',async()=>{
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
        
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "19999999998",
                    "replace_station": `${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
               var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
          });
            it('Executing Robot Events API with BotLoad Event validating the response', async () => {
                const replacements = {
                    "replace_Event_Trace_ID_UUID": `${await genericConfig.generateUUID()}`,
                    "replace_feederID": "feeder_1",
                    "replace_parcelID":""
                }
                const modifiedbotLoadString = await stringUtil.replaceMultiple(payloadData.robot_events_botLoaded_body, replacements)
                console.log(modifiedbotLoadString);
                const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(modifiedbotLoadString)
                console.log(modifiedbotLoadJSON);
                var response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
                console.log(response[1].detail);
                expect(response[1].detail).to.contains("RJT04")
            });
        })
        
    }
    async RJT14_Rejection()
    {
        describe('Verify RJT14 Rejection when the scanned parcel is Non Conveyable', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "141414141411",
                    "replace_station":`${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contain("Rejection type-RJT14")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
        })
    }
    async RJT16_Rejection()
    {
        describe('Verify RJT16 Rejection when the scanned parcel is Manual Section', async () => {
            /**
             * @type {any[]}
             */
            var response
            /**
             * @type {string}
             */
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "10ManualSect",
                    "replace_station": `${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contain("Rejection type-RJT16")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
        })
    }
    async RJT17_Rejection()
    {
        describe.skip('Verify RJT17 Rejection when all the bins are full', async () => {
    /**
     * @type {any[]}
     */
    var response
    /** 
     * @type {Object}
    */
    it('Activating the Station', async () => {
        await genUtil.activateSystemMode("live_run")
        await genUtil.activateSortationMode("order_consolidation")
        await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
    });
    it('Updating all the bin status to "binFull"', async () => {
        // await genUtil.updateAllBinStatus("binActive")
        await genUtil.changeAllBinStatus("binFull")
        // await genUtil.changeSingleBinStatus("A022","binActive")
    });
    it('Executing Reset Parcel cache API and Validating the response', async () => {
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
        console.log(response[1]);
        expect(response[0]).to.eq(200)
        expect(response[1]).to.not.be.null
        expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
        expect(response[1].status).to.be.true
    });
    it('Executing Update parcel Events API and Validating the response to contain RJT17 rejection', async () => {
        var updateParceldataToReplace = "replace_String"
        var modifiedUpdateParcelString = await stringUtil.replaceData(payloadData.update_parcel_body, updateParceldataToReplace, "199999999998")
        // console.log(modifiedUpdateParcelString);
        var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
        console.log(modifiedUpdateParcelJSON);
        response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${ecsEndPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
        // console.log(response[1]);
        expect(response[1]).to.not.be.null
        expect(response[1].details).to.contain("Error Id -6113")
        expect(response[1].status).to.be.false
        expect(response[1].StatusCode).to.eq(500)
    });
    it('Changing All the bin status to binActive again', async () => {
        await genUtil.updateAllBinStatus("binActive")
    });
    
})
    }
    async RJT18_Rejection()
    {
        describe('Verify RJT18 Rejection when the scanned parcel is Single Item', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "10000isi0001",
                    "replace_station": `${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contain("Rejection type-RJT18")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
        })
    }
    async RJT19_Rejection()
    {
        describe('Verify RJT19 Rejection when the scanned parcel is Data is not found in DB', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                var randomBarcode=await genericConfig.generateItemBarcode()
                const replacements = {
                    "replace_String":`${randomBarcode}`,
                    "replace_station": `${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contain("Rejection type-RJT19")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
           
        })
    }
    async RJT20_Rejection()
    {
        describe.skip(`Verify Rejection RJT20 when trying to scan a parcel who's item Status is CANCELLED`, async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)//station-p6-1      PS_Station   cognex_right
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it.skip('Executing Update parcel Events API and Validating the response RJT20', async () => {
                var updateParceldataToReplace = "replace_String"
                var modifiedUpdateParcelString = await stringUtil.replaceData(payloadData.update_parcel_body, updateParceldataToReplace, "10itemCancel")
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contain("Rejection type-RJT20")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
        })
    }
    async RJT21_Rejection()
    {
        describe('Verify Duplicate Rejection RJT21 when trying to scan a parcel who state is added_to_bag/ Parcel is putawayed', async () => {
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
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "10000val0001",
                    "replace_station":`${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].detail).to.eq("Scan data parcel event processed successfully")
                expect(response[1].status).to.be.true
                expect(response[1].StatusCode).to.eq(200)
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
            });
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
                expect(response[1].details).to.eq("Unload Completion Ack processed")
                expect(response[1].status).to.be.true
                expect(response[1].StatusCode).to.eq(200)
                expect(response[1].data).to.contain(bin_ID)
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "10000val0001",
                    "replace_station": "PS_Station"
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contains("Rejection type-RJT21")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
           
        })
    }
    async RJT28_OC_Rejection()
    {
        describe('Verify RJT28 Rejection when the scanned parcel does not follow regex pattern', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Activating the Station', async () => {
                await genUtil.activateSystemMode("live_run")
                await genUtil.activateSortationMode("order_consolidation")
                await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
                console.log(response[1]);
                expect(response[0]).to.eq(200)
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.eq("Parcel cache reset is successfully processed")
                expect(response[1].status).to.be.true
            });
            it('Executing Update parcel Events API and Validating the response', async () => {
                const replacements = {
                    "replace_String": "UBR7100",
                    "replace_station":`${process.env.OC_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.update_parcel_body,replacements)
                // console.log(modifiedUpdateParcelString);
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].details).to.contain("Rejection type-RJT28")
                expect(response[1].status).to.be.false
                expect(response[1].StatusCode).to.eq(500)
            });
           
        })
    }
    async RJT21_PS_rejection()
    {
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
            
            it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
                await genUtil.activateSystemMode("dummy_run")
                await genUtil.activateSortationMode("parcel_sorting")
                await genUtil.activateStation(`${process.env.PS_STATIONNAME}`,`${process.env.PS_FEEDERNAME}`,`${process.env.PS_SCANNERNAME}`)
            });
        
            it('Executing Robot Events API with BotLoad Event ', async () => {
                const botLoadInString = await payloadData.PS_robot_events_botLoaded_body 
                console.log(botLoadInString);
                 const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(botLoadInString)
                 console.log(modifiedbotLoadJSON)
                 response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
                console.log(response[1]);  
            });
            
            it('Fetching trace id from tns_Parcel_status_table in DataBase',async()=>{
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

            it('Executing Robot Events API with BotLoad Event ', async () => {
                const botLoadInString = await payloadData.PS_robot_events_botLoaded_body 
                console.log(botLoadInString);
                 const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(botLoadInString)
                 console.log(modifiedbotLoadJSON)
                 response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
                console.log(response[1]);  
            });
            
            it('Fetching trace id from tns_Parcel_status_table in DataBase',async()=>{
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
               expect(response[1].detail).to.contains("Rejection type-RJT21")
                expect(response[1].status).to.be.true
               expect(response[1].StatusCode).to.eq(200)
            });
        })
    }
//Rejection for Parcel sorting,Liverun,scan and put
    async PS_SP_LIVERUN_RJT19()
    {
        describe('Verify RJT19 Rejection when the scanned parcel is Data is not found in DB', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_27'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT19')
            });
        })
    }
    async PS_SP_LIVERUN_RJT33_01()
    {
        describe('Verify RJT33(Out of Specification)Rejection when scanned parcel has DWSCapturedLength/breadth/height" exceeds the servicable Limits', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_01'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT33')
            });
        })
    }
    async PS_SP_LIVERUN_RJT33_02()
    {
        describe('Verify RJT33 Rejection when scanned parcel whose max of (DWSVolumetricWeight DWSCapturedWeight) >  8kg', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_07'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT33')
            });
        })
    }
    async PS_SP_LIVERUN_RJT32_01()
    {
        describe('Verify RJT32 Rejection when we scan the parcel whose centername is DEACTIVE', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_06'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT32')
            });
        })
    }
    async PS_SP_LIVERUN_RJT32_02()
    {
        describe('Verify RJT32 Rejection when scanned parcel does not have desc_code in DB,shipement identifier is FWD', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_05'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT32')
            });
        })
    }
    async PS_SP_LIVERUN_RJT32_03()
    {
        describe('Verify RJT32 Rejection when we scan the parcel which does not have PTLID', async () => {
            /**
             * @type {any[]}
             */
            var response
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_09'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT32')
            });
        })
    }
    async PS_SP_LIVERUN_RJT32_04()
    {
        describe('Verify RJT32 Rejection when we scan the parcel destcode is not available,shipment identifier=ROT', async () => {
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
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_16'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT32')
            });
        })
    }
    async PS_SP_LIVERUN_RJT32_05()
    {
        describe('Verify RJT32 Rejection when we scan the parcel SDP.dest_code =sortConfig.ndc_code. FOUND result SDP.dest_code = inactive', async () => {
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
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_26'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT32')
            });
        })
    }
    async PS_SP_LIVERUN_RJT32_06()
    {
        describe('Verify RJT32 Rejection when we scanned parcel as No matching sort rule found in sort plan', async () => {
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
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_28'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT32')
            });
        })  
    }
    async PS_SP_LIVERUN_RJT21()
    {
        describe('Verify Duplicate Rejection RJT21 when trying to scan a parcel who state is added_to_bag', async () => {
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
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });

            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvDataAWB =await csvUtil.getDataInCSVByRowNameAndColumnHeaders('./test_Data/XB_Shipment_DataPush1.csv', ['DT_02'], ['AWB'],'Test_Data')
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
               expect(response[1].data.rejection_type).to.contains('RJT21')
            });

        })
    }
// Rejection for Parcel sorting, dummy run,Scan_and_Put
    async PS_SP_DUMMYRUN_RJT03()
{
    describe('Verify RJT03 Rejection when scanned parcel without reset', async () => {
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
        
        it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
            await genUtil.configureParcelSortationEnvironmentDummyrun()
        })
    
        // it('Executing Reset Parcel cache API and Validating the response', async () => {
        //     await genUtil.executeResetParcelCache()
        //  });
         
        it('Executing Update parcel Events API and Validating the response', async () => {
            const csvData =await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/PS_SP_dummy1.csv', [4], ['wbn'])
            const replacements = {
                "replace_String":csvData[0].wbn,
                "replace_station": `${process.env.PS_STATIONNAME}`
            }
            var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
            var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
            console.log(modifiedUpdateParcelJSON);
            response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
            console.log(response[1]);
            expect(response[1].message).to.contains("Scan event processed successfully")
            expect(response[1].status).to.be.true
            expect(response[1].status_code).to.eq(200)
        });
        it('Again Executing Update parcel Events API and Validating the response', async () => {
            const csvData =await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/PS_SP_dummy1.csv', [4], ['wbn'])
            const replacements = {
                "replace_String":csvData[0].wbn,
                "replace_station": `${process.env.PS_STATIONNAME}`
            }
            var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
            var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
            console.log(modifiedUpdateParcelJSON);
            response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
            console.log(response[1]);
            expect(response[1].data.message).to.contains('Scanning same barcode')//Scanning same barcode Scan data - already exists for station
            expect(response[1].status).to.be.false
            expect(response[1].status_code).to.eq('6124')
        });
    }) 
    }
    async PS_SP_DUMMYRUN_RJT02()
    {
        describe('Verify RJT02 Rejection when we load the parcel without scan', async () => {
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
            
            it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
                await genUtil.configureParcelSortationEnvironmentDummyrun()
            });
            
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
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
                console.log(response[1]);
                expect(response[1].status).to.be.false
                expect(response[1].status_code).equal('6126')
                expect(response[1].message).to.contains('LOAD_BEFORE_SCAN')
            });
        })  
    }
    async PS_SP_DUMMYRUN_RJT04()
    {
        describe('Verify RJT04 Rejection when rejected parcel kept on the robot', async () => {
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
            
            it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
                await genUtil.configureParcelSortationEnvironmentDummyrun()
            });
            
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
             
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvData =await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/PS_SP_dummy1.csv', [5], ['wbn'])
                const replacements = {
                "replace_String":csvData[0].wbn,
               "replace_station": `${process.env.PS_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].message).to.contains("Scan event processed successfully")
                expect(response[1].status).to.be.true
                expect(response[1].status_code).to.eq(200)
                expect(response[1].data.status).to.be.equal('rejected')
            //    const inputString = response[1].details
            //    const startIndex = inputString.indexOf("UBR ID -");
            //    const ubrId = startIndex !== -1 ? inputString.substring(startIndex + 8, inputString.indexOf(",", startIndex)) : null;
            //    console.log(ubrId);
            //    ubr_id=ubrId
            });
            it('Fetching the UBR_ID from response body', async () => {
                console.log(response[1]);
                ubr_id = await response[1].data.ubr_id
                console.log(ubr_id);
            })
        

            it('Executing Robot Events API with BotLoad Event and Validating the response and fetching supplied Bin', async () => {
                const replacements = {
                    "replace_event_trace_id":ubr_id
                }
                const modifiedbotLoadString = await stringUtil.replaceMultiple(payloadData.PS_SP_dummy_robotevent, replacements)
                console.log(modifiedbotLoadString);
                const modifiedbotLoadJSON = await stringUtil.stringToJsonObject(modifiedbotLoadString)
                console.log(modifiedbotLoadJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.robot_events}`, modifiedbotLoadJSON)
                console.log(response[1]);
                expect(response[1].status).to.be.false
                expect(response[1].status_code).to.be.equal('6123')
                 expect(response[1].message).to.contains('LOADING_REJECTED_PARCEL')
            });
        }) 
    }
    async PS_SP_DUMMYRUN_RJT19()
    {
        describe('Verify RJT19 Rejection when scanned parcel not avaiable in DataBase', async () => {
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
            it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
                await genUtil.configureParcelSortationEnvironmentDummyrun()
            });
            
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
             
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvData =await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/PS_SP_dummy1.csv', [6], ['wbn'])
                const replacements = {
                    "replace_String":csvData[0].wbn,
                    "replace_station": `${process.env.PS_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
               expect(response[1]).to.not.be.null
               expect(response[1].status).to.be.true
               expect(response[1].status_code).to.eq(200)
               expect(response[1].message).to.contains('Scan event processed successfully')
               expect(response[1].data.rejection_type).equal('RJT19')
          
            });
        }) 
    }
    async PS_SP_DUMMYRUN_RJT21()
    {
        describe('Verify RJT21 when we scan the parcel which is added to bag', async () => {
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
            
            it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
                await genUtil.configureParcelSortationEnvironmentDummyrun()
            });
            
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
        
            it('Executing Update parcel Events API and Validating the response', async () => {
                const csvData =await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/PS_SP_dummy1.csv', [7], ['wbn'])
                const replacements = {
                    "replace_String":csvData[0].wbn,
                    "replace_station": `${process.env.PS_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].message).to.contains("Scan event processed successfully")
                expect(response[1].status).to.be.true
                expect(response[1].status_code).to.eq(200)
          
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
                expect(response[1].status).to.be.true
                expect(response[1].StatusCode).to.equal(200)
                expect(response[1].details).contains("Unload Completion Ack processed")
            });
            it('Executing Reset Parcel cache API and Validating the response', async () => {
                await genUtil.executeResetParcelCache()
             });
         
             it('Executing Update parcel Events API and Validating the response', async () => {
                const csvData =await csvUtil.getDataInCSVByRowNumberAndColumnHeaders('./test_Data/PS_SP_dummy1.csv', [7], ['wbn'])
                const replacements = {
                    "replace_String":csvData[0].wbn,
                    "replace_station": `${process.env.PS_STATIONNAME}`
                }
                 var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
                 var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                 console.log(modifiedUpdateParcelJSON);
                 response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                 console.log(response[1]);
                expect(response[1]).to.not.be.null
                expect(response[1].status).to.be.true
                expect(response[1].message).to.contains('Scan event processed successfully')
                expect(response[1].status_code).to.eq(200)
                expect(response[1].data.rejection_type).to.be.equal('RJT21')
           
             });
        })
    }
    async PS_SP_DUMMYRUN_RJT25()
    {
        describe('Verify RJT25 Rejection sort resolution failed ', async () => {
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
            
            it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
                await genUtil.configureParcelSortationEnvironmentDummyrun()
            });
            
            it('Executing Reset Parcel cache API and Validating the response', async () => {
               await genUtil.executeResetParcelCache()
            });
             
            it('Executing Update parcel Events API and Validating the response', async () => {
                var emptyString=""
                const replacements = {
                    "replace_String":emptyString,
                    "replace_station": `${process.env.PS_STATIONNAME}`
                }
                var modifiedUpdateParcelString = await stringUtil.replaceMultiple(payloadData.PS_SP_Liverun_update_parcel_body,replacements)
                var modifiedUpdateParcelJSON = await stringUtil.stringToJsonObject(modifiedUpdateParcelString)
                console.log(modifiedUpdateParcelJSON);
                response = await apiUtil.postData(`${process.env.STAGING_URL}${process.env.ECS_API_GATEWAY_PORT}${endPoints.ecsAPIGateway.update_parcel_status}`, modifiedUpdateParcelJSON)
                console.log(response[1]);
               expect(response[1]).to.not.be.null
               expect(response[1].status).to.be.false
               expect(response[1].status_code).to.eq('6104')
               expect(response[1].message).to.contains('sort resolution failed')
          
            });
        }) 
    }
}
module.exports=new Rejections()