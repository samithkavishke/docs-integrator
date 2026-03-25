import React from 'react';
import { Prism } from 'prism-react-renderer';

// Make Prism available globally so extensions can reach it
(typeof global !== 'undefined' ? global : window).Prism = Prism;

Prism.languages.ballerina = {
  comment: [
    { pattern: /\/\/.*$/m, greedy: true },
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
  ],

  string: [
    { pattern: /`(?:[^\\`]|\\.)*`/, greedy: true },        // template strings
    { pattern: /"(?:[^\\"\r\n]|\\.)*"/, greedy: true },    // regular strings
  ],

  annotation: {
    pattern: /@(?:[\w.]+)/,
    alias: 'builtin',
  },

  // Module-qualified types: devant:BinaryDataLoader, twilio:Client, http:Listener
  'class-name': /\b[a-z]\w*:[A-Z]\w*\b/,

  // Standalone PascalCase user-defined types and records
  'type-name': {
    pattern: /\b[A-Z]\w*\b/,
    alias: 'class-name',
  },

  keyword: /\b(?:import|as|public|private|external|final|service|resource|function|object|record|annotation|type|typedesc|new|map|future|error|stream|table|transaction|from|on|returns|return|match|foreach|in|while|do|if|else|fork|worker|wait|start|flush|send|receive|check|checkpanic|trap|panic|fail|is|typeof|var|const|configurable|isolated|transactional|rollback|commit|retry|lock|enum|class|distinct|readonly|any|anydata|never|byte|int|float|boolean|string|decimal|json|xml|handle|xmlns|listener|client|let|where|select|limit|join|outer|order|by|ascending|descending|equals|conflict|version)\b/,

  boolean: /\b(?:true|false)\b/,

  nil: {
    pattern: /\(\s*\)/,
    alias: 'constant',
  },

  number: /\b0[xX][\da-fA-F]+\b|\b0[oO][0-7]+\b|\b0[bB][01]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[eE][+-]?\d+)?(?:d|f)?\b/,

  operator: /->|=>|::|\.\.\.?|[+\-*/%^&|~!=<>?:]+/,

  punctuation: /[{}[\];(),.:]/,
};

export default function Root({ children }) {
  return <>{children}</>;
}
