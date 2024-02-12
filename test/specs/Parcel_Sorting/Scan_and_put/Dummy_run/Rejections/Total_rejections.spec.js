const rejection=require('../../../../../../Rejections/Rejections')
const gu=require('../../../../../../utility/genericConfig')
//await gu.changeAllBinStatus('binActive')//binActive binFull
async function totalrejections()
{
await rejection.PS_SP_DUMMYRUN_RJT03()
await rejection.PS_SP_DUMMYRUN_RJT25()
await rejection.PS_SP_DUMMYRUN_RJT21()
await rejection.PS_SP_DUMMYRUN_RJT19()
await rejection.PS_SP_DUMMYRUN_RJT04()
}
totalrejections()