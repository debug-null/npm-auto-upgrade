const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const os = require("os");

class npmAutoUpgrade {
  constructor(options) {
    let packPath = path.resolve(__dirname, "package.json");
    Object.assign(
        this,
      {
        packagePath: packPath,
        packageJson: JSON.parse(fs.readFileSync(packPath)),
        isGlobal: options.isGlobal, //是否为全局包
      }
    );
   
    
    if(options.name){
        this.packageJson.name = options.name;
    }

    if(options.version){
        this.packageJson.version = options.version;
    }
    this.init();
  }

  init() {
    this.log = console;

    // 若是MAC并且是全局，增加权限前缀
    this.sudo = "";
    if (os.type() === "Darwin") {
      this.sudo = "sudo";
    }
  }

  // 获取最新版本
  getLatestVersion(callback) {
    const cmd = `npm view ${this.packageJson.name} version`;
    cp.exec(cmd, (error, stdout) => {
      if (error) {
        this.log.error(`${error}`);
        callback(error);
        return;
      }
      let version = stdout;
      if (!version) version = "0";
      callback(error, version);
    });
  }

  // 检查是否有需要更新的版本
  checkUpdate(callback) {
    this.getLatestVersion((error, version) => {
        if(error){
            return callback(error, false);
        }

      version = version.replace("\n", "");

      this.latestVersion = version;

      if (version > this.packageJson.version) {
        // 需要更新
        callback(null, true, {
          latestVersion: this.latestVersion,
        });
      }

      // 当前没有需要更新的版本
      if (version <= this.packageJson.version) {
        callback(null, false);
      }
    });
  }

  // 更新包
  updatePackge() {
    this.log.info(`正在更新 ${this.packageJson.name} ...`);

    let args = ["i", `${this.packageJson.name}@${this.latestVersion}`];

    // 若是全局包
    if (this.isGlobal) {
      args.push("-g");
    }

    const updateCmd = cp.spawn("npm", args, {
      cwd: this.isGlobal ? __dirname : path.resolve(__dirname, "./../../"),
    });

    updateCmd.stdout.on("data", (data) => {
      this.log.info(data.toString());
    });
    updateCmd.stderr.on("data", (err) => {
      this.log.error(err.toString());
    });

    updateCmd.on("close", () => {
      this.log.info(`${this.packageJson.name} 更新完成`);
    });
  }

  _spawnHelper(cp, command, args, options, callback) {
    const win32 = process.platform === "win32";
    const cmd = win32 ? "cmd" : command;
    const cmdArgs = win32 ? ["/c"].concat(command, args) : args;
    return cp.spawn(cmd, cmdArgs, options || {}, callback);
  }
}
module.exports = npmAutoUpgrade