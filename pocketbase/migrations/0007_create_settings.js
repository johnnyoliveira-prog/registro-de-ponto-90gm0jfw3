migrate(
  (app) => {
    const collection = new Collection({
      name: 'settings',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule:
        "@request.auth.id != '' && (@request.auth.role = 'ceo' || @request.auth.role = 'hr')",
      updateRule:
        "@request.auth.id != '' && (@request.auth.role = 'ceo' || @request.auth.role = 'hr')",
      deleteRule:
        "@request.auth.id != '' && (@request.auth.role = 'ceo' || @request.auth.role = 'hr')",
      fields: [
        { name: 'base_latitude', type: 'number', required: true },
        { name: 'base_longitude', type: 'number', required: true },
        { name: 'radius_meters', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('settings')
      app.delete(collection)
    } catch (_) {}
  },
)
