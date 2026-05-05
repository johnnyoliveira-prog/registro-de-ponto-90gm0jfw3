migrate(
  (app) => {
    const adminCondition =
      "@request.auth.role = 'hr' || @request.auth.role = 'ceo' || @request.auth.role = 'admin' || @request.auth.role = 'coo'"

    // Update users collection
    const users = app.findCollectionByNameOrId('users')
    const roleField = users.fields.getByName('role')
    if (roleField && !roleField.values.includes('coo')) {
      roleField.values.push('coo')
    }
    users.listRule = 'id = @request.auth.id || ' + adminCondition
    users.viewRule = 'id = @request.auth.id || ' + adminCondition
    users.createRule = adminCondition
    users.updateRule = 'id = @request.auth.id || ' + adminCondition
    users.deleteRule = 'id = @request.auth.id || ' + adminCondition
    app.save(users)

    // Update time_entries
    const timeEntries = app.findCollectionByNameOrId('time_entries')
    timeEntries.listRule = `@request.auth.id != '' && (employee = @request.auth.id || ${adminCondition})`
    timeEntries.viewRule = `@request.auth.id != '' && (employee = @request.auth.id || ${adminCondition})`
    timeEntries.updateRule = `@request.auth.id != '' && (${adminCondition})`
    timeEntries.deleteRule = `@request.auth.id != '' && (${adminCondition})`
    app.save(timeEntries)

    // Update tracking_logs
    const trackingLogs = app.findCollectionByNameOrId('tracking_logs')
    trackingLogs.listRule = `@request.auth.id != '' && (employee = @request.auth.id || ${adminCondition})`
    trackingLogs.viewRule = `@request.auth.id != '' && (employee = @request.auth.id || ${adminCondition})`
    trackingLogs.updateRule = `@request.auth.id != '' && (${adminCondition})`
    trackingLogs.deleteRule = `@request.auth.id != '' && (${adminCondition})`
    app.save(trackingLogs)

    // Update settings
    const settings = app.findCollectionByNameOrId('settings')
    settings.createRule = adminCondition
    settings.updateRule = adminCondition
    settings.deleteRule = adminCondition
    app.save(settings)
  },
  (app) => {
    // down migration left empty as structural reversion logic isn't explicitly required
  },
)
