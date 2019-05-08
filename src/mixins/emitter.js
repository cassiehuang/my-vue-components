function broadcast(componentName, eventName, ...params) {
  this.$child.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.call(child, eventName, params);
    } else {
      broadcast.call(child, componentName, eventName, params)
    }
  })
}

export default {
  methods: {
    dispatch(componentName, eventName, ...params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }

      if (parent) {
        parent.$emit.call(parent, eventName, params);
      }
    },
    broadcast(componentName, eventName, ...params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
}
