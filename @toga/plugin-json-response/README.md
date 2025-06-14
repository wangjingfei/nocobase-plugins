# JSON Response Parser Plugin for NocoBase

This plugin adds a workflow node to parse JSON data returned from HTTP requests in NocoBase workflows. It helps extract specific data from complex JSON responses to be used by downstream nodes.

## Features

- Parse JSON response data using JSONPath syntax
- Extract specific values from complex JSON structures
- Set default values when parsing fails
- Choose to continue workflow execution even when parsing fails
- Multiple parsing modes: JSONPath or direct access

## Usage

### Installation

1. Navigate to the plugin management page in your NocoBase application
2. Click "Add & Update" button
3. Install "@nocobase/plugin-json-response" plugin
4. Enable the plugin

### Workflow Node Configuration

After installation, a new node type "JSON Response Processing" will be available in the workflow editor under the "Data" group.

#### Configuration Options

- **Response Data**: Specify the variable name containing the HTTP response data (default: "data")
- **Parse Mode**: Choose between JSONPath or Direct parsing mode
- **Path Expression**: When using JSONPath mode, specify the JSONPath expression (e.g., "$.data.items[0].id")
- **Output Field**: Variable name to store the parsing result (default: "parsedResponse")
- **Default Value**: Value to use when parsing returns empty results
- **Ignore Errors**: Continue workflow execution even if parsing fails

### JSONPath Syntax

The plugin uses the [JSONPath](https://github.com/dchester/jsonpath) syntax to navigate JSON structures. Some examples:

- `$.store.book[0].title` - Get the title of the first book
- `$.store.book[*].author` - Get all authors of all books
- `$..price` - Get all prices in the JSON structure
- `$.store.book[?(@.price < 10)]` - Get all books cheaper than $10

## Example Usage

1. Create a workflow with an HTTP Request node
2. Add a JSON Response Processing node after the HTTP Request node
3. Configure the JSON Response node to extract specific data
4. Use the extracted data in downstream nodes

## Support

For issues, questions, or feedback, please submit an issue on the NocoBase GitHub repository or contact the NocoBase community.

## License

This plugin is licensed under the AGPL-3.0 license. 