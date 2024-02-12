const rejection=require('../../../../../../Rejections/Rejections')
const activeSation=require('.././../../../../../test/specs/Parcel_Sorting/Scan_and_put/Live_run/ActivatingStation.spec')
async function totalrejections()
{
//await rejection.PS_SP_LIVERUN_RJT19()
await rejection.PS_SP_LIVERUN_RJT33_01()
await rejection.PS_SP_LIVERUN_RJT33_02()
await rejection.PS_SP_LIVERUN_RJT32_01()
await rejection.PS_SP_LIVERUN_RJT32_02()
await rejection.PS_SP_LIVERUN_RJT32_03()
await rejection.PS_SP_LIVERUN_RJT32_04()
await rejection.PS_SP_LIVERUN_RJT32_05()
await rejection.PS_SP_LIVERUN_RJT32_06()
await rejection.PS_SP_LIVERUN_RJT21()
}
    
it('', async function () {
      await totalrejections();
});
