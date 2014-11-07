var Vue = require('vue');
var loadStyles = require('load-styles');

var messages = {
  cz: require('./languages/cz.json'),
  de: require('./languages/de.json'),
  en: require('./languages/en.json'),
  es: require('./languages/es.json'),
  fr: require('./languages/fr.json'),
  it: require('./languages/it.json'),
  pl: require('./languages/pl.json'),
  'pt-br': require('./languages/pt-br.json'),
  ru: require('./languages/ru.json'),
  sk: require('./languages/sk.json'),
  tr: require('./languages/tr.json')
};

loadStyles(require('./style.css'));

var FEEDBACK_STATE = 'feedback';
var THANKS_STATE = 'thanks';
var FILLED_STATE = 'filled';

var View = Vue.extend({
  template: require('./survey.html'),
  partials: {
    scale: require('./scale.html'),
    feedback: require('./feedback.html'),
    thanks: require('./thanks.html'),
    filled: require('./filled.html')
  },
  replace: true,
  data: function() {
    return {
      // model
      rating: null,
      feedback: '',

      // state
      visible: false,
      state: FEEDBACK_STATE,
      translation: null,

      // settings
      language: 'en',
      us: null,
      poweredBy: true,
      skin: 'dialog',
      theme: 'pink',
      position: 'tr', // tl (top-right), tr, bl, br
      distance: 50, // distance from top/bottom border
      test: true // test mode - short animations
    }
  },
  attached: function() {
    if (this.rating !== null) {
      this.focusFeedback();
    }
  },
  computed: {
    topPosition: function() {
      if (/t./.test(this.position)) {
        // top position
        return this.distance + 'px';
      }
      return '';
    },
    bottomPosition: function() {
      if (/b./.test(this.position)) {
        // bottom position
        return this.distance + 'px';
      }
      return '';
    },
    showCloseIcon: function() {
      return this.state === FEEDBACK_STATE && this.skin==='dialog';
    },
    showSubmitButton: function() {
      return this.state === FEEDBACK_STATE && this.rating !== null;
    },
    showFeedbackText: function() {
      return this.rating !== null;
    },
    ratings: function() {
      var selectedRating = this.rating;
      return [0,1,2,3,4,5,6,7,8,9,10].map(function(rating) {
        return {
          selected: selectedRating !== null && rating <= selectedRating
        };
      });
    }
  },
  methods: {
    t: function(key, param) {
      var message = (this.translation && this.translation[key]) || messages[this.language][key];
      return message.replace('%s', param);
    },
    selectRating: function (rating) {
      this.rating = rating;
      this.focusFeedback();
    },
    focusFeedback: function() {
      var vm = this;
      Vue.nextTick(function () {
        var $feedback = vm.$$.feedback;
        if ($feedback) {
          $feedback.focus();
        }
      });
    },
    show: function() {
      this.visible = true;
    },
    close: function() {
      this.hide();
      if (this.state === FEEDBACK_STATE) {
        this.$emit('dismiss');
      }
    },
    hide: function() {
      this.visible = false;
    },
    ratingSubmit: function() {
      this.$emit('submit');
      this.state = THANKS_STATE;
      if (this.skin !== 'page') {
        var that = this;
        setTimeout(function() { that.hide() }, 800);
      }
    }
  }
});

module.exports = View;
