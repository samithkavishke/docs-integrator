import React from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import {usePrismTheme} from '@docusaurus/theme-common';
import {Highlight} from 'prism-react-renderer';
import Line from '@theme/CodeBlock/Line';
import styles from './styles.module.css';

const foldStartPattern = /^\s*\/\/\s*docs-fold-start(?::\s*(.+))?\s*$/;
const foldEndPattern = /^\s*\/\/\s*docs-fold-end\s*$/;

const Pre = React.forwardRef((props, ref) => {
  return (
    <pre
      ref={ref}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      {...props}
      className={clsx(props.className, styles.codeBlock, 'thin-scrollbar')}
    />
  );
});

function Code(props) {
  const {metadata} = useCodeBlockContext();
  return (
    <code
      {...props}
      className={clsx(
        props.className,
        styles.codeBlockLines,
        metadata.lineNumbersStart !== undefined &&
          styles.codeBlockLinesWithNumbering,
      )}
      style={{
        ...props.style,
        counterReset:
          metadata.lineNumbersStart === undefined
            ? undefined
            : `line-count ${metadata.lineNumbersStart - 1}`,
      }}
    />
  );
}

function CodeFoldToggle({
  label,
  hiddenLineCount,
  showLineNumbers,
  expanded,
  onClick,
}) {
  return (
    <span className={clsx(styles.codeFoldLine, showLineNumbers && styles.codeFoldLineWithNumber)}>
      {showLineNumbers ? <span className={styles.codeFoldLineNumber} /> : null}
      <span className={styles.codeFoldLineContent}>
        <button type="button" className={styles.codeFoldButton} onClick={onClick}>
          {expanded ? '// - ' : '// + '}
          {label ?? 'collapsed code'}
          {!expanded && hiddenLineCount > 0 ? ` (${hiddenLineCount} lines)` : ''}
        </button>
      </span>
      <br />
    </span>
  );
}

function CodeLines({
  lines,
  sourceLines,
  lineClassNames,
  lineNumbersStart,
  getLineProps,
  getTokenProps,
}) {
  const [expandedFolds, setExpandedFolds] = React.useState({});
  const renderedLines = [];

  for (let i = 0; i < lines.length; i += 1) {
    const sourceLine = sourceLines[i] ?? '';
    const foldStart = sourceLine.match(foldStartPattern);

    if (foldStart) {
      let endIndex = i + 1;
      while (endIndex < sourceLines.length && !foldEndPattern.test(sourceLines[endIndex] ?? '')) {
        endIndex += 1;
      }

      const foldKey = `fold-${i}`;
      const expanded = Boolean(expandedFolds[foldKey]);

      renderedLines.push(
        <CodeFoldToggle
          key={foldKey}
          label={foldStart[1]}
          hiddenLineCount={Math.max(endIndex - i - 1, 0)}
          showLineNumbers={lineNumbersStart !== undefined}
          expanded={expanded}
          onClick={() =>
            setExpandedFolds((current) => ({
              ...current,
              [foldKey]: !current[foldKey],
            }))
          }
        />,
      );

      if (expanded) {
        for (let foldedLineIndex = i + 1; foldedLineIndex < endIndex; foldedLineIndex += 1) {
          renderedLines.push(
            <Line
              key={foldedLineIndex}
              line={lines[foldedLineIndex]}
              getLineProps={getLineProps}
              getTokenProps={getTokenProps}
              classNames={lineClassNames[foldedLineIndex]}
              showLineNumbers={lineNumbersStart !== undefined}
            />,
          );
        }
      }

      i = endIndex;
      continue;
    }

    if (foldEndPattern.test(sourceLine)) {
      continue;
    }

    renderedLines.push(
      <Line
        key={i}
        line={lines[i]}
        getLineProps={getLineProps}
        getTokenProps={getTokenProps}
        classNames={lineClassNames[i]}
        showLineNumbers={lineNumbersStart !== undefined}
      />,
    );
  }

  return <>{renderedLines}</>;
}

export default function CodeBlockContent({className: classNameProp}) {
  const {metadata, wordWrap} = useCodeBlockContext();
  const prismTheme = usePrismTheme();
  const {code, language, lineNumbersStart, lineClassNames} = metadata;
  const sourceLines = code.split('\n');

  return (
    <Highlight theme={prismTheme} code={code} language={language}>
      {({className, style, tokens: lines, getLineProps, getTokenProps}) => (
        <Pre
          ref={wordWrap.codeBlockRef}
          className={clsx(classNameProp, className)}
          style={style}>
          <Code>
            <CodeLines
              lines={lines}
              sourceLines={sourceLines}
              lineClassNames={lineClassNames}
              lineNumbersStart={lineNumbersStart}
              getLineProps={getLineProps}
              getTokenProps={getTokenProps}
            />
          </Code>
        </Pre>
      )}
    </Highlight>
  );
}
