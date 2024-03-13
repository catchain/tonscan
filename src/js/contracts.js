import Parser from "web-tree-sitter";
import { isWebAssemblySupported } from "~/utils";

let language;

export const initParser = async (treeSitterUri, langUri) => {
  if (language) {
    return;
  }
  const options = {
    locateFile() {
      return treeSitterUri;
    },
  };
  await Parser.init(options);
  language = await Parser.Language.load(langUri);
};


export const createParser = () => {
  const parser = new Parser();
  parser.setLanguage(language);
  parser.setTimeoutMicros(1000 * 1000);
  return parser;
};


export async function parseGetters(code) {
  if (!isWebAssemblySupported()) {
    return [];
  }
  await initParser("/tree-sitter.wasm", "/tree-sitter-func.wasm");

  const p = createParser();
  const parsed = p.parse(code);

  const getters = parsed.rootNode.children.filter(
    (c) =>
      c.type === "function_definition" &&
      c.children.find((n) => n.type === "specifiers_list")?.text.includes("method_id"),
  );

  const gettersParsed = getters.map((f) => {
    const returnTypes = f.children[0].children
      .filter((c) => !c.type.match(/[,()]/)) // TODO types are slice, primitive_type, ",", "(", ")"
      .map((c) => c.text);

    const name = f.children.find((n) => n.type === "function_name").text;

    const parameters = f.children
      .find((n) => n.type === "parameter_list")
  .children.filter((c) => c.type === "parameter_declaration")
      .map((c) => ({
        type: c.child(0).text,
      name: c.child(1).text,
  }));

    return {
      returnTypes,
      name,
      parameters,
    };
  });

  return gettersParsed;
}