import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({
  children,
  language = 'tsx',
}: {
  children: string
  language?: string
}) {
  return (
    <SyntaxHighlighter language={language} style={oneDark}>
      {children}
    </SyntaxHighlighter>
  )
}
