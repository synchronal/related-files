const { related, _removeProjectRoot, _findAnnotatedLines, _findLinks } = require("./related");

describe("related", () => {
  test("returns [] when the input is not a string", () => {
    expect(related(undefined)).toStrictEqual([]);
    expect(related(4)).toStrictEqual([]);
  });

  test("returns [] when the input is blank", () => {
    expect(related("")).toStrictEqual([]);
  });

  test("returns [] when the input contains no annotations", () => {
    expect(related("ant\nbat\n")).toStrictEqual([]);
  });

  test("simple annotation", () => {
    expect(related("@related [test](/src/related.test.js)")).toStrictEqual([
      {
        name: "test",
        path: "/src/related.test.js",
      },
    ]);
  });

  test("annotation with extra text", () => {
    expect(
      related("ant @related bat [test](/src/related.test.js) cat")
    ).toStrictEqual([
      {
        name: "test",
        path: "/src/related.test.js",
      },
    ]);
  });

  test("annotation with spaces in link name", () => {
    expect(
      related("ant @related bat [unit test](/src/related.test.js) cat")
    ).toStrictEqual([
      {
        name: "unit test",
        path: "/src/related.test.js",
      },
    ]);
  });

  test("multiple links on the same line", () => {
    expect(
      related(
        "ant @related bat [test](/src/related.test.js) cat [css](/assets/related.css) dog"
      )
    ).toStrictEqual([
      {
        name: "test",
        path: "/src/related.test.js",
      },
      {
        name: "css",
        path: "/assets/related.css",
      },
    ]);
  });

  test("multiple links on the multiple lines", () => {
    expect(
      related(
        `
          ant
          bat @related cat [test](/src/related.test.js) dog [css](/assets/related.css) eel
          fox
          @related gnu [icon](/assets/related.png) hen
          imp
        `
      )
    ).toStrictEqual([
      {
        name: "test",
        path: "/src/related.test.js",
      },
      {
        name: "css",
        path: "/assets/related.css",
      },
      {
        name: "icon",
        path: "/assets/related.png",
      },
    ]);
  });
});

describe("findAnnotatedLines", () => {
  test("returns [] when the input is not a string", () => {
    expect(_findAnnotatedLines(undefined)).toStrictEqual([]);
    expect(_findAnnotatedLines(4)).toStrictEqual([]);
  });

  test("returns [] when the input is blank", () => {
    expect(_findAnnotatedLines("")).toStrictEqual([]);
    expect(_findAnnotatedLines("  ")).toStrictEqual([]);
  });

  test("returns [] when there are no annotated lines", () => {
    expect(_findAnnotatedLines("ant\nbat\ncat\n")).toStrictEqual([]);
  });

  test("returns annotated lines", () => {
    expect(
      _findAnnotatedLines("ant\n@related bat\ncat @related dog\neel\n")
    ).toStrictEqual(["@related bat", "cat @related dog"]);
  });
});

describe("findLinks", () => {
  test("returns [] when the input is blank", () => {
    expect(_findLinks(" ")).toStrictEqual([]);
  });

  test("returns the link when there is one", () => {
    expect(_findLinks("[ant](/ant.txt)")).toStrictEqual([
      { name: "ant", path: "/ant.txt" },
    ]);

    expect(_findLinks("ant [bat](/bat.txt) cat")).toStrictEqual([
      { name: "bat", path: "/bat.txt" },
    ]);
  });

  test("returns all the links", () => {
    expect(
      _findLinks("ant [bat](/bat.txt) cat [dog](/dog.txt) eel")
    ).toStrictEqual([
      { name: "bat", path: "/bat.txt" },
      { name: "dog", path: "/dog.txt" },
    ]);
  });

  test("removes the project root if it is specified in the config", () => {
    expect(
      _findLinks(
        "ant [bat](/proj/root/bat.txt) cat [dog](/dog.txt) eel [fox](/proj/root/fox/fox.txt) gnu",
        { projectRoot: "/proj/root" }
      )
    ).toStrictEqual([
      { name: "bat", path: "/bat.txt" },
      { name: "dog", path: "/dog.txt" },
      { name: "fox", path: "/fox/fox.txt" },
    ]);
  });
});

describe("removeProjectRoot", () => {
  test("returns the input when the config is undefined", () => {
    expect(_removeProjectRoot("/ant/bat", undefined)).toStrictEqual("/ant/bat")
  });

  test("returns the input when the config does not have a 'projectRoot' key", () => {
    expect(_removeProjectRoot("/ant/bat", {x: "y"})).toStrictEqual("/ant/bat")
  });

  test("removes the project root from the path, ignoring leading slashes and case", () => {
    expect(_removeProjectRoot("/ant/bat/cat/dog", {projectRoot: "/ant/bat"})).toStrictEqual("/cat/dog")
    expect(_removeProjectRoot("ant/bat/cat/dog", {projectRoot: "/ant/bat"})).toStrictEqual("/cat/dog")
    expect(_removeProjectRoot("/ant/bat/cat/dog", {projectRoot: "ant/bat"})).toStrictEqual("/cat/dog")
    expect(_removeProjectRoot("ant/bat/cat/dog", {projectRoot: "ant/bat"})).toStrictEqual("/cat/dog")
    expect(_removeProjectRoot("ANT/bat/cat/dog", {projectRoot: "ant/BAT"})).toStrictEqual("/cat/dog")
  });
});
