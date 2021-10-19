# npm-auto-upgrade

> 检测并自动更新你的NPM依赖包

## 使用

```js
const npmUpdate = new npmAutoUpgrade();
```

### 检测是否需要更新

```js
npmUpdate.checkUpdate(async (error, isUpdate, updateInfo) => {
  if (isUpdate) {
     // 启动更新
    npm.updatePackge();
  }
});
```

### options
> 当 new npmAutoUpgrade() 时，可以传入options、若不传入，默认直接读取当前项目中package.json的数据

* version: 需要检测的包的版本号，必传
* name: 需要检测的包名称，必传

### API

* checkUpdate: 检查是否需要更新
 * updateInfo: 返回更新的包信息，目前只返回包的最新版本
* updatePackge：更新NPM包
* getLatestVersion: 获取最新的NPM包版本