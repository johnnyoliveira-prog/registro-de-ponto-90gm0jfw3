migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    const roleField = users.fields.getByName('role')
    if (roleField) {
      roleField.values = ['ceo', 'hr', 'employee']
      users.fields.add(roleField)
      app.save(users)
    }

    const timeEntries = app.findCollectionByNameOrId('time_entries')
    timeEntries.listRule =
      "@request.auth.id != '' && (employee = @request.auth.id || @request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    timeEntries.viewRule =
      "@request.auth.id != '' && (employee = @request.auth.id || @request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    timeEntries.updateRule =
      "@request.auth.id != '' && (@request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    timeEntries.deleteRule =
      "@request.auth.id != '' && (@request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    app.save(timeEntries)

    const trackingLogs = app.findCollectionByNameOrId('tracking_logs')
    trackingLogs.listRule =
      "@request.auth.id != '' && (employee = @request.auth.id || @request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    trackingLogs.viewRule =
      "@request.auth.id != '' && (employee = @request.auth.id || @request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    trackingLogs.updateRule =
      "@request.auth.id != '' && (@request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    trackingLogs.deleteRule =
      "@request.auth.id != '' && (@request.auth.role = 'ceo' || @request.auth.role = 'hr')"
    app.save(trackingLogs)
  },
  (app) => {
    // Revert is ignored for safety in forward-only migrations
  },
)
