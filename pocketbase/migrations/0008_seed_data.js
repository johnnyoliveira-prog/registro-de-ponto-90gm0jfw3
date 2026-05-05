migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    // Fix existing admins
    app.db().newQuery("UPDATE users SET role = 'ceo' WHERE role = 'admin'").execute()

    const seedUser = (email, role, name) => {
      try {
        app.findAuthRecordByEmail('users', email)
      } catch (_) {
        const record = new Record(users)
        record.setEmail(email)
        record.setPassword('Skip@Pass')
        record.setVerified(true)
        record.set('role', role)
        record.set('name', name)
        app.save(record)
      }
    }

    seedUser('ceo@example.com', 'ceo', 'CEO User')
    seedUser('hr@example.com', 'hr', 'HR User')
    seedUser('employee@example.com', 'employee', 'Employee User')

    const settings = app.findCollectionByNameOrId('settings')
    if (app.countRecords('settings') === 0) {
      const record = new Record(settings)
      record.set('base_latitude', -23.55052)
      record.set('base_longitude', -46.633309)
      record.set('radius_meters', 500)
      app.save(record)
    }
  },
  (app) => {
    // Safe seed fallback
  },
)
