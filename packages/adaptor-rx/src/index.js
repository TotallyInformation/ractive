const isObservable = o => o && typeof o.subscribe === 'function'
const isObserver = o => o && typeof o.next === 'function'

export default {
  filter (object) {
    return isObservable(object)
  },
  wrap (instance, observable, keypath) {
    let lock = 0
    let currentValue
    let isSetup = true

    const subscription = observable.subscribe(value => {
      currentValue = value
      if (isSetup) return
      lock++
      instance.set(keypath, currentValue)
      lock--
    })

    isSetup = false

    return {
      get () {
        return currentValue
      },
      set (keypath, value) {

      },
      reset (value) {
        if (lock !== 0) return
        if (isObservable(value)) return false
        if (isObserver(observable)) return observable.next(value)
      },
      teardown () {
        subscription.unsubscribe()
      }
    }
  }
}
