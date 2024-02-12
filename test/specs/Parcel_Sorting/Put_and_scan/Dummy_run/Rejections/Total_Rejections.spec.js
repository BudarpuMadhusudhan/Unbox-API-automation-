const rejection=require('../../../../../../Rejections/Rejections')
const gu= require('../../../../../../utility/genericConfig')
async function totalrejections()
{
 await rejection.barcodeNotFound() 
 //await rejection.RJT28_Rejection()
 //await rejection.RJT21_PS_rejection()
}
totalrejections()