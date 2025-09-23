import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
// add other extensions you need for rendering:
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

export function TiptapViewer({ content = '', extensions = [] }) {
  const editor = useEditor({
    editable: false,               // make it read-only
    content: content || '',        // HTML string
    extensions: [StarterKit, Link, Image, ...extensions],
  })

  // editor created/destroyed by useEditor automatically
  return <EditorContent editor={editor} />
}
