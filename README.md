Scaffold a TypeScript project, using Jest for testing.

NOTE: After running this script, you will have to manually add `"type": "module"` to `package.json`. In a future version I'll find a way to patch the manifest after generating it.

There are no Jest tests for now because using Jest with ES Modules is a pain and a half. I'll refactor the utility functions and write unit tests for them once I convert the whole project to TypeScript.