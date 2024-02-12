const genUtil=require('../../../../../utility/genericConfig')
before(async () => {
    it('Configuring the Environment for Parcel Sortation and Activating the Station', async () => {
        await genUtil.configureParcelSortationEnvironment();
    }); 
});
