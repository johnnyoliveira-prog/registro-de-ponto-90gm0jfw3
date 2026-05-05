migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    const seedUser = (email, name, role) => {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', email)
      } catch (_) {
        const record = new Record(users)
        record.setEmail(email)
        record.setPassword('Skip@Pass')
        record.setVerified(true)
        record.set('name', name)
        record.set('role', role)
        app.save(record)
      }
    }

    seedUser('ceo@example.com', 'CEO', 'ceo')
    seedUser('hr@example.com', 'HR', 'hr')
    seedUser('employee@example.com', 'Employee', 'employee')

    const settings = app.findCollectionByNameOrId('settings')
    try {
      app.findFirstRecordByData('settings', 'radius_meters', 500)
    } catch (_) {
      const record = new Record(settings)
      record.set('base_latitude', -23.55052)
      record.set('base_longitude', -46.633308)
      record.set('radius_meters', 500)
      app.save(record)
    }
  },
  (app) => {
    // no-op
  },
)
