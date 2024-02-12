const genUtil =require('../../../../../utility/genericConfig')
const apiUtil=require('../../../../../utility/apiUtility')
const endPoints = require('../../../../../end_Points/ecsAPIGatewayEndPoints')
const payloadData = require('../../../../../payloadData/ecsRequestPayload.data')


describe('Demo for New Bin aloocation Logic',async()=>{
     it('Checking availability and fetching least cost bin ID',async()=>{
        console.log(`${process.env.NODE_URL}${process.env.NODE_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`);
        var response = await apiUtil.postData(`${process.env.NODE_URL}${process.env.NODE_PORT}${endPoints.ecsAPIGateway.reset_parcel_Cache}`, payloadData.reset_body)
        
       console.log(response[1]);
  
    })

})