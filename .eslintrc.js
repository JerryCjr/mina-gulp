module.exports = {
  extends: "standard",
  rules: {
    semi: ['error', 'always']
  },
  globals: {
    getApp: false,
    Page: false,
    wx: false,
    App: false,
    getCurrentPages: false,
    Component: false
  }
};
