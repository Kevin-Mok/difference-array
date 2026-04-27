type SolutionLanguage = "python" | "java";

interface CodeBlockProps {
  code: string;
  language?: SolutionLanguage;
}

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const highlightCode = (code: string, language: SolutionLanguage = "python") => {
  const escaped = escapeHtml(code);
  const tokenMap: Record<string, string> = {};
  let tokenIndex = 0;
  const makeToken = (html: string) => {
    const key = String.fromCharCode(0xE001 + tokenIndex);
    tokenMap[key] = html;
    tokenIndex += 1;
    return key;
  };

  let highlighted = escaped
    .replace(
      /&quot;([^&]|&amp;|&quot;)*?&quot;|'([^'\\]|\\.)*?'/g,
      (match) => {
        return makeToken(`<span class="token token-string">${match}</span>`);
      }
    )
    .replace(
      language === "java" ? /(\/\/.*)$/gm : /(#.*)$/gm,
      (match) => {
        return makeToken(`<span class="token token-comment">${match}</span>`);
      },
    )
    .replace(/(\/\*[\s\S]*?\*\/)/gm, (match) => {
      return makeToken(`<span class="token token-comment">${match}</span>`);
    })
    .replace(
      /\b(as|assert|async|await|break|class|continue|def|elif|else|except|False|for|from|global|if|import|in|is|lambda|nonlocal|None|not|or|pass|raise|return|True|try|while|with|yield)\b/g,
      (match) => {
        return makeToken(`<span class="token token-keyword">${match}</span>`);
      }
    )
    .replace(
      /\b(abstract|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g,
      (match) => {
        return makeToken(`<span class="token token-keyword">${match}</span>`);
      }
    )
    .replace(
      /\b(abs|all|any|chr|dict|enumerate|float|int|len|list|map|max|min|open|print|range|sorted|str|sum|tuple|type|zip)\b/g,
      (match) => {
        return makeToken(`<span class="token token-builtin">${match}</span>`);
      }
    )
    .replace(
      /\b(Arrays|HashMap|HashSet|List|Map|Set|String|System|Math)\b/g,
      (match) => {
        return makeToken(`<span class="token token-builtin">${match}</span>`);
      }
    )
    .replace(
      /\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g,
      (match, identifier) => {
        return makeToken(`<span class="token token-function">${identifier}</span>`);
      }
    )
    .replace(
      /\b\d+(?:\.\d+)?\b/g,
      (match) => {
        return makeToken(`<span class="token token-number">${match}</span>`);
      }
    )
    .replace(/(\+|\-|\*|\/|%|==|!=|<=|>=|=|<|>)/g, (match) => {
      return makeToken(`<span class="token token-operator">${match}</span>`);
    });

  const tokenized = highlighted.replace(
    /[\uE001-\uF8FF]/g,
    (token) => tokenMap[token] || ""
  );

  return tokenized;
};

export function CodeBlock({ code, language = "python" }: CodeBlockProps) {
  return (
    <pre className="code-block-shell">
      <code
        className="code-block-shell__code"
        dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
      />
    </pre>
  );
}
