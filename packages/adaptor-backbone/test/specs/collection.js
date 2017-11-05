import { module, test } from 'qunit'
import Ractive from '@ractivejs/core'
import Backbone from 'backbone'
import { modelAdaptor, collectionAdaptor } from '@ractivejs/adaptor-backbone'

module('ractive-adaptor-backbone collections')

test('Adaptor can detect collections', t => {
  t.ok(collectionAdaptor.filter(new Backbone.Collection()))
})

test('Initialize with pre-filled collection', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Initialize with empty collection', t => {
  const collection = new Backbone.Collection([])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.add([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Initialize with set collection', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  instance.set('collection', collection)

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Adding to collection updates instance', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.add({ name: 'qux' })

  t.strictEqual(collection.at(3).get('name'), 'qux')
  t.strictEqual(instance.get('collection.3.name'), 'qux')
  t.strictEqual(instance.toHTML(), 'foobarbazqux')
})

test('Updating collection updates instance', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.at(1).set('name', 'rar')

  t.strictEqual(collection.at(1).get('name'), 'rar')
  t.strictEqual(instance.get('collection.1.name'), 'rar')
  t.strictEqual(instance.toHTML(), 'foorarbaz')
})

test('Deleting from collection updates instance', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.remove(collection.at(1))

  t.strictEqual(collection.at(1).get('name'), 'baz')
  t.strictEqual(instance.get('collection.1.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobaz')
})

test('Reset collection with an array via instance', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  instance.set('collection', [{ name: 'oof' }, { name: 'rab' }, { name: 'zab' }])

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'oof')
  t.strictEqual(instance.get('collection.1.name'), 'rab')
  t.strictEqual(instance.get('collection.2.name'), 'zab')
  t.strictEqual(instance.toHTML(), 'oofrabzab')
})

test('Reset collection with a new collection via instance', t => {
  const oldCollection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const newCollection = new Backbone.Collection([{ name: 'oof' }, { name: 'rab' }, { name: 'zab' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection: oldCollection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  instance.set('collection', newCollection)

  // Holds new collection
  t.strictEqual(instance.get('collection'), newCollection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'oof')
  t.strictEqual(instance.get('collection.1.name'), 'rab')
  t.strictEqual(instance.get('collection.2.name'), 'zab')
  t.strictEqual(instance.toHTML(), 'oofrabzab')

  // Stops listening to old model
  oldCollection.add({ name: 'qux' })
  newCollection.add({ name: 'rar' })
  t.strictEqual(instance.get('collection.3.name'), 'rar')
})

test('Reset collection with an array via collection', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{ name }}{{/each}}`
  })

  collection.reset([{ name: 'oof' }, { name: 'rab' }, { name: 'zab' }])

  t.strictEqual(instance.get('collection'), collection)
  t.ok(Array.isArray(instance.get('collection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.name'), 'oof')
  t.strictEqual(instance.get('collection.1.name'), 'rab')
  t.strictEqual(instance.get('collection.2.name'), 'zab')
  t.strictEqual(instance.toHTML(), 'oofrabzab')
})

test('Reset collection with a non-adapted value', t => {
  const collection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{ collection }}`
  })

  instance.set('collection', 1)

  t.strictEqual(instance.get('collection'), 1)
  t.strictEqual(instance.toHTML(), '1')
})

test('Initialize with pre-filled sub-collection', t => {
  const subCollection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const collection = new Backbone.Collection([{ subCollection }])

  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{#each subCollection }}{{name}}{{/each}}{{/each}}`
  })

  t.strictEqual(instance.get('collection.0.subCollection'), subCollection)
  t.ok(Array.isArray(instance.get('collection.0.subCollection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.subCollection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.0.subCollection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.0.subCollection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Initialize with empty sub-collection', t => {
  const subCollection = new Backbone.Collection([])
  const collection = new Backbone.Collection([{ subCollection }])

  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{#each subCollection }}{{name}}{{/each}}{{/each}}`
  })

  subCollection.add([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])

  t.strictEqual(instance.get('collection.0.subCollection'), subCollection)
  t.ok(Array.isArray(instance.get('collection.0.subCollection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.subCollection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.0.subCollection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.0.subCollection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Initialize with set sub-collection', t => {
  const subCollection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const collection = new Backbone.Collection([{ subCollection }])

  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    template: `{{#each collection }}{{#each subCollection }}{{name}}{{/each}}{{/each}}`
  })

  instance.set('collection', collection)

  t.strictEqual(instance.get('collection.0.subCollection'), subCollection)
  t.ok(Array.isArray(instance.get('collection.0.subCollection', { unwrap: false })))
  t.strictEqual(instance.get('collection.0.subCollection.0.name'), 'foo')
  t.strictEqual(instance.get('collection.0.subCollection.1.name'), 'bar')
  t.strictEqual(instance.get('collection.0.subCollection.2.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobarbaz')
})

test('Adding to sub-collection updates instance', t => {
  const subCollection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const collection = new Backbone.Collection([{ subCollection }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{#each subCollection }}{{name}}{{/each}}{{/each}}`
  })

  subCollection.add({ name: 'qux' })

  t.strictEqual(instance.get('collection.0.subCollection.3.name'), 'qux')
  t.strictEqual(instance.toHTML(), 'foobarbazqux')
})

test('Updating sub-collection updates instance', t => {
  const subCollection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const collection = new Backbone.Collection([{ subCollection }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{#each subCollection }}{{name}}{{/each}}{{/each}}`
  })

  subCollection.at(1).set('name', 'rar')

  t.strictEqual(instance.get('collection.0.subCollection.1.name'), 'rar')
  t.strictEqual(instance.toHTML(), 'foorarbaz')
})

test('Deleting sub-from collection updates instance', t => {
  const subCollection = new Backbone.Collection([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
  const collection = new Backbone.Collection([{ subCollection }])
  const instance = Ractive({
    adapt: [ collectionAdaptor, modelAdaptor ],
    data: { collection },
    template: `{{#each collection }}{{#each subCollection }}{{name}}{{/each}}{{/each}}`
  })

  subCollection.remove(subCollection.at(1))

  t.strictEqual(instance.get('collection.0.subCollection.1.name'), 'baz')
  t.strictEqual(instance.toHTML(), 'foobaz')
})