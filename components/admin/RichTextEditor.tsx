'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value || '',
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sincronizar contenido externo
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return <div className="w-full px-3 py-2.5 bg-white border border-white/10 rounded-xl text-gray-400 text-sm">Cargando editor...</div>
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white">
      <div className="flex gap-1 flex-wrap bg-gray-50 border-b border-gray-200 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
            editor.isActive('bold')
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition italic ${
            editor.isActive('italic')
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition line-through ${
            editor.isActive('strike')
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          S
        </button>

        <div className="border-l border-gray-300" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded text-xs font-bold transition ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-xs font-bold transition ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-xs font-bold transition ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          H3
        </button>

        <div className="border-l border-gray-300" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
            editor.isActive('bulletList')
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
            editor.isActive('orderedList')
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          1. List
        </button>

        <div className="border-l border-gray-300" />

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
            editor.isActive('blockquote')
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          &ldquo;
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1.5 rounded text-xs font-mono transition ${
            editor.isActive('codeBlock')
              ? 'bg-brand-orange text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          &lt;/&gt;
        </button>

        <div className="border-l border-gray-300" />

        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-3 py-1.5 rounded text-xs font-semibold bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition"
        >
          Clear
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 focus:outline-none text-gray-900"
      />
    </div>
  )
}
