const WXAPI = {};
const o = [
  'login'
];
function promisify(api) {
  return (options = {}) => new Promise((resolve, reject) => {
    api({
      ...options,
      success(...fulfilled) {
        resolve(...fulfilled);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

o.forEach((key) => {
  WXAPI[key] = promisify(wx[key]);
});
export default WXAPI;
