import { useEffect, useState } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { cn } from '@/lib/utils'
//TODO:fix this text editor in future
// Simple toolbar component
function SimpleToolbar() {
  const [editor] = useLexicalComposerContext()

  return (
    <div className='flex gap-2 border-b bg-gray-50 p-2'>
      <button
        onClick={() => {
          editor.dispatchCommand('FORMAT_TEXT_COMMAND', 'bold')
        }}
        className='rounded bg-gray-200 px-2 py-1 hover:bg-gray-300'
      >
        Bold
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand('FORMAT_TEXT_COMMAND', 'italic')
        }}
        className='rounded bg-gray-200 px-2 py-1 hover:bg-gray-300'
      >
        Italic
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand('FORMAT_TEXT_COMMAND', 'underline')
        }}
        className='rounded bg-gray-200 px-2 py-1 hover:bg-gray-300'
      >
        Underline
      </button>
    </div>
  )
}

// Content update plugin - renamed to avoid conflict with imported OnChangePlugin
function ContentChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      // Convert the editor content to HTML string
      editorState.read(() => {
        // Get the editor content as plain text as a fallback method
        const plainText = editorState.read(() => {
          return (
            editor.getEditorState()._selection?.getTextContent() ||
            editor.getRootElement()?.textContent ||
            ''
          )
        })
        onChange(plainText || '')
      })
    })
  }, [editor, onChange])

  return null
}

// Simple editor configuration
const editorConfig = {
  namespace: 'simple-editor',
  theme: {
    paragraph: 'my-1',
  },
  onError: (error) => console.error(error),
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
}

export default function LexicalEditor({ value, onChange, placeholder, error }) {
  const [editorState, setEditorState] = useState(null)

  const handleContentChange = (content) => {
    onChange(content)
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border',
        error && 'border-red-500'
      )}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <SimpleToolbar />
        <div className='relative min-h-[200px]'>
          <RichTextPlugin
            contentEditable={
              <ContentEditable className='min-h-[200px] p-4 outline-none' />
            }
            placeholder={
              <div className='pointer-events-none absolute left-4 top-4 text-gray-400'>
                {placeholder || 'Enter some text...'}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ContentChangePlugin onChange={handleContentChange} />
        </div>
      </LexicalComposer>
    </div>
  )
}
