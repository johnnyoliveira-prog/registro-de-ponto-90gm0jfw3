migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.createRule =
      "@request.auth.role = 'hr' || @request.auth.role = 'ceo' || @request.auth.role = 'admin'"
    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.createRule = ''
    app.save(users)
  },
)
