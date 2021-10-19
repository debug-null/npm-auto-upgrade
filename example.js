const npmAutoUpgrade = require('./index')


const npmUpdate = new npmAutoUpgrade({
    name: 'lerna',
    version: '1.0.0',
    isGlobal: true
});

npmUpdate.checkUpdate(async (error, isUpdate, updateInfo) => {
  console.log("🚀 ~ file: example.js ~ line 11 ~ npmUpdate.checkUpdate ~ updateInfo", updateInfo)
  if (isUpdate) {
    npmUpdate.updatePackge();
  }
});

