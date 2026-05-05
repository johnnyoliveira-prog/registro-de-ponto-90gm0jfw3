migrate(
  (app) => {
    const collection = new Collection({
      name: 'time_entries',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (employee = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (employee = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        {
          name: 'employee',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['clock_in', 'clock_out'],
          maxSelect: 1,
        },
        { name: 'latitude', type: 'number', required: true },
        { name: 'longitude', type: 'number', required: true },
        { name: 'address', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('time_entries')
    app.delete(collection)
  },
)
