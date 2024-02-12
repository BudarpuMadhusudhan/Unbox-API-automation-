const genUtil=require('../../../../../utility/genericConfig')
before(async () => {
    it('Activating the Station', async () => {
        await genUtil.activateSystemMode("live_run")
        await genUtil.activateSortationMode("order_consolidation")
        await genUtil.activateStation(`${process.env.OC_STATIONNAME}`,`${process.env.OC_FEEDERNAME}`,`${process.env.OC_SCANNERNAME}`)
    });
});
