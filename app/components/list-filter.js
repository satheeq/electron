import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({
  classNames: ['list-filter'],
  value: '',
  testVal: '',
  testObj: null,

  init() {
    this._super(...arguments);
    this.filter('').then((allResults) => this.set('results', allResults.results));
    this.testObj = { a: 1, b: 2, c: 3, d: 4 }
  },

  actions: {
    handleFilterEntry() {
      this.filter(this.value).then((resultsObj) => {
        if (resultsObj.query === this.value) {
          this.set('results', resultsObj.results);
        }
      });
    },
    spawn() {
      if (window.Bridge) {
        window.Bridge.test(this.testObj);
      }
    },

    setData() {
      Ember['appGlobal'] = { a: 1, b: 2 };
    }
  }

});
