migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let record

    try {
      // Check if user already exists
      record = app.findAuthRecordByEmail('_pb_users_auth_', 'johnnyoliveira@gmail.com')
    } catch (_) {
      // If not, create a new record
      record = new Record(users)
      record.setEmail('johnnyoliveira@gmail.com')
    }

    // Update or set credentials and role
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('role', 'admin')

    if (!record.get('name')) {
      record.set('name', 'Johnny Oliveira')
    }

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'johnnyoliveira@gmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
