migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    col.fields.add(
      new SelectField({
        name: 'role',
        values: ['employee', 'admin'],
        maxSelect: 1,
        required: true,
      }),
    )
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    col.fields.removeByName('role')
    app.save(col)
  },
)
