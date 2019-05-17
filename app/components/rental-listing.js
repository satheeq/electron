/*global isElectron */
import Component from '@ember/component';

export default Component.extend({
  isWide: false,
  testObj: null,

  init() {
    this._super();
    this.testObj = { a: 1, b: 2, c: 3 }
  },

  actions: {
    toggleImageSize() {
      this.toggleProperty('isWide');
    },

    testMe() {
      if (window.Bridge) {
        window.Bridge.test(this.testObj);
      }
    }
  }
});
