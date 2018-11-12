import store from '../babyfs-wxapp-storage/index.js';

let currentHost = 'https://m.babyfs.cn';
const hosts = [
  'https://m.babyfs.cn',
  'http://m.dev.babyfs.cn',
  'http://m.bvt.babyfs.cn',
  'http://emily.test.babyfs.cn'
];
let triggerShake = false;
const hostKey = 'babyfs_host_key';

function init(homePath = '/pages/index/index') {
  // 获取缓存的上一次的环境域名
  let lastHost = store.getData(hostKey);
  console.log(`last host: ${lastHost}`);
  if (lastHost) {
    currentHost = lastHost;
  }
  // 摇一摇模拟
  wx.onAccelerometerChange(function (res) {
    if (res.x > 0.7 && res.y > 0.7) {
      if (triggerShake) {
        return;
      }
      triggerShake = true;
      console.log(`current host: ${currentHost}`);
      wx.showActionSheet({
        itemList: hosts.map(elem => {
          if (elem === currentHost) {
            return `${elem} (current)`;
          }
          else {
            return elem;
          }
        }),
        success(res) {
          console.log(`select index: ${res.tapIndex}`);
          currentHost = hosts[res.tapIndex];
          console.log(`select host: ${currentHost}`);
          // 缓存这次选择的环境域名
          store.setData(hostKey, currentHost);
          wx.reLaunch({
            url: homePath,
          });
        },
        fail(res) {
          console.log(res.errMsg);
        },
        complete() {
          triggerShake = false;
        }
      });
    }
  });
}

export default {
  get host() {
    return currentHost;
  },
  init
}