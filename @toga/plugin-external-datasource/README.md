# External Datasource Plugin for NocoBase

This plugin allows you to connect to external data sources like MySQL and PostgreSQL databases in NocoBase, enabling you to query and manage external data without migrating it to your NocoBase database.

## Features

- Connect to multiple external database servers (MySQL, PostgreSQL)
- Store and manage connection configurations securely
- Test database connections with a single click
- Browse tables and table structures
- Execute custom SQL queries with a built-in SQL editor
- View query results in a tabular format

## Installation

### Method 1: Install from Plugin Manager

1. In your NocoBase application, navigate to "Settings" > "Plugin Manager"
2. Click "Add Plugin" button
3. Enter the plugin package name: `@nocobase/plugin-external-datasource`
4. Click "Install" button
5. After installation, enable the plugin

### Method 2: Manual Installation

1. Download the plugin package and extract it to the correct location:

```bash
mkdir -p /path/to/nocobase/storage/plugins/@nocobase/plugin-external-datasource
tar -xvzf plugin-external-datasource.tgz -C /path/to/nocobase/storage/plugins/@nocobase/plugin-external-datasource --strip-components=1
```

2. Restart your NocoBase server:

```bash
yarn nocobase restart
```

3. Enable the plugin in the NocoBase admin interface's "Plugin Manager".

## Usage

### Managing External Datasources

1. After installing and enabling the plugin, a new menu item "External Datasources" will appear in the admin settings menu.
2. Navigate to "External Datasources" to manage your database connections.
3. Click "Add Datasource" to create a new connection.
4. Fill in the required connection details:
   - Name: A descriptive name for this datasource
   - Type: Select the database type (MySQL or PostgreSQL)
   - Host: The database server host address
   - Port: The database server port
   - Username: Database username
   - Password: Database password
   - Database: The database name
5. Click "Test Connection" to verify the connection works
6. Click "Create" to save the datasource

### Using the SQL Explorer

1. From the Datasources list, click the "SQL Explorer" icon for the datasource you want to query
2. The SQL Explorer provides:
   - A list of tables in the database
   - Table structure information
   - A SQL query editor
   - Results display area
3. You can:
   - Select a table to view its structure
   - Click "Query Data" to generate a SELECT statement
   - Write and execute custom SQL queries
   - View the query results in a tabular format

## Security Considerations

- Database credentials are stored in the NocoBase database
- Only users with admin access can manage datasources
- Always use database users with appropriate permissions (read-only if possible)
- Consider using SSL connections for production environments

## Limitations

- Currently supports MySQL and PostgreSQL databases
- Does not support automatic schema sync with NocoBase collections
- Complex queries might impact performance

## License

This plugin is licensed under the AGPL-3.0 license. 