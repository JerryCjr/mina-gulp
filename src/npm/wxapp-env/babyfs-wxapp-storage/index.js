
function getData(key) {
  try {
    var value = wx.getStorageSync(key);
    if (value) {
      return value;
    }
    else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

function setData(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
  }
}

export default {
  getData,
  setData,
  remove
};