Component({
  properties: {
    value: {
      type: String,
      value: ''
    },
    checked: {
      type: Boolean,
      value: false
    },
    name: {
      type: String,
      value: ''
    }
  },
  methods: {
    handleRadioChange() {
      this.triggerEvent('change', { value: this.data.value });
    }
  }
});
