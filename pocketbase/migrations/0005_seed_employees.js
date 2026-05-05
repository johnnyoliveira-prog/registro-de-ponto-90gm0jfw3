migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const employees = [
      { email: 'ana@example.com', name: 'Ana Silva' },
      { email: 'joao@example.com', name: 'João Santos' },
    ]

    for (const emp of employees) {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', emp.email)
      } catch (_) {
        const record = new Record(users)
        record.setEmail(emp.email)
        record.setPassword('Skip@Pass')
        record.setVerified(true)
        record.set('name', emp.name)
        record.set('role', 'employee')
        app.save(record)
      }
    }
  },
  (app) => {},
)
