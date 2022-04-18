# related-files

Parses a string (usually the contents of a file) to find related files based on annotations within the file.

It makes no attempt to programmatically determine related files; instead, file authors get to specify the full
and correct list of related files.

## Contents

- `src/related.js` is the main implementation
- `related-files.novaextension` is an extension for the [Nova](https://nova.app) editor

## Annotations

An annotation starts with `@related`, followed by one or more Markdown-style links consisting of an arbitrary
file type (e.g., "test", "css", "header") and a path to the file. The annotation ends with a newline character.

This is a simple annotation:

    @related [test](/src/related.test.js)

which would return:

    [{name: "test", path: "/src/related.test.js"}]

Annotations are usually in comments:

    // @related [test](/src/related.test.js)
    /* @related [test](/src/related.test.js) */
    # @related [test](/src/related.test.js)

A single line can have multiple annotations and unrelated text:

    // See @related [test](/src/related.test.js), [test](/src/other.test.js), and [css](/assets/style.css)

which would return:

    [
      {name: "test", path: "/src/related.test.js"},
      {name: "test", path: "/src/other.test.js"},
      {name: "css", path: "/assets/style.css"}
    ]

## Multi-line annotations

If the last non-space character in an annotation is a backslash (`\`), the next line of text is scanned
for annotations:

    # @related \
    #   [test](/test/core/foo_test.exs) \
    #   [test](/test/integration/bar_test.exs) \
    #   [sass](/assets/css/foo.sass)

## File paths

File paths are not validated by this library; they are just returned as-is. Paths starting with `/` are
expected to be project-relative while paths that don't start with `/` are expected to be relative to the
current file.

## TODO

- [x] one annotation per line
- [x] multiple annotations per line
- [ ] multi-line annotations

## License, Copyright, Attributions

Copyright 2022 Erik Hanson.
Apache 2.0 licensed (see [LICENSE](https://github.com/eahanson/related-files/blob/main/LICENSE)).
The Nova extension's icon is a modified version of an icon from [Font Awesome](https://fontawesome.com/)
which is licensed under [CC BY 4.0](https://fontawesome.com/license).
