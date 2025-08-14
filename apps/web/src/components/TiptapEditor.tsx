'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import CodeBlock from '@tiptap/extension-code-block'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { KanunAlintisi, IctihatAlintisi } from './extensions'
import KanunAlintisiModal from './modals/KanunAlintisiModal'
import IctihatAlintisiModal from './modals/IctihatAlintisiModal'
import { useState } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Highlighter,
  Code2,
  Undo,
  Redo,
  BookOpen,
  Gavel,
  ChevronDown,
  Type
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  onAddCitation?: () => void
  showCitationButton?: boolean
}

const MenuBar = ({ editor, onAddCitation, showCitationButton }: { editor: any; onAddCitation?: () => void; showCitationButton?: boolean }) => {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const [showKanunModal, setShowKanunModal] = useState(false)
  const [showIctihatModal, setShowIctihatModal] = useState(false)

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Görsel URL\'i:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const url = window.prompt('Link URL\'i:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const setHeading = (level: number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level }).run()
    }
    setShowHeadingMenu(false)
  }

  const addKanunAlintisi = (kanunAdi: string, maddeNumarasi: string) => {
    editor.chain().focus().setKanunAlintisi({ kanunAdi, maddeNumarasi }).run()
  }

  const addIctihatAlintisi = (mahkemeAdi: string, esasNo: string, kararNo: string) => {
    editor.chain().focus().setIctihatAlintisi({ mahkemeAdi, esasNo, kararNo }).run()
  }

  const getCurrentHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) {
        return i
      }
    }
    return 0 // Paragraph
  }

  const headingLabels = {
    0: 'Paragraf',
    1: 'Başlık 1',
    2: 'Başlık 2', 
    3: 'Başlık 3',
    4: 'Başlık 4',
    5: 'Başlık 5',
    6: 'Başlık 6'
  }

  return (
    <>
      <div className="border-b border-gray-200 bg-white p-4 rounded-t-lg">
        <div className="flex flex-wrap gap-2">
          {/* Heading Selector */}
          <div className="relative">
            <button
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Başlık Seç"
            >
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">{headingLabels[getCurrentHeading()]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {Object.entries(headingLabels).map(([level, label]) => (
                  <button
                    key={level}
                    onClick={() => setHeading(parseInt(level))}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                      getCurrentHeading() === parseInt(level) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Kalın"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="İtalik"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Altı Çizili"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Üstü Çizili"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Kod"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Lists and Blockquotes */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Madde İşaretli Liste"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Numaralı Liste"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={!editor.can().chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Alıntı"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              disabled={!editor.can().chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Sola Hizala"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              disabled={!editor.can().chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Ortala"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              disabled={!editor.can().chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Sağa Hizala"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              disabled={!editor.can().chain().focus().setTextAlign('justify').run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="İki Yana Hizala"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Advanced Features */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <button
              onClick={() => setShowKanunModal(true)}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              title="Kanun Alıntısı Ekle"
            >
              <Gavel className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowIctihatModal(true)}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              title="İçtihat Alıntısı Ekle"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={setLink}
              disabled={!editor.can().chain().focus().setLink({ href: '' }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Link Ekle"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              title="Görsel Ekle"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={addTable}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              title="Tablo Ekle"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              disabled={!editor.can().chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('highlight') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Vurgula"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Kod Bloğu"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>

          {/* Citation Button */}
          {showCitationButton && onAddCitation && (
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
              <button
                onClick={onAddCitation}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Atıf Ekle"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* History */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50"
              title="Geri Al"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50"
              title="Yinele"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <KanunAlintisiModal
        isOpen={showKanunModal}
        onClose={() => setShowKanunModal(false)}
        onSubmit={addKanunAlintisi}
      />
      
      <IctihatAlintisiModal
        isOpen={showIctihatModal}
        onClose={() => setShowIctihatModal(false)}
        onSubmit={addIctihatAlintisi}
      />
    </>
  )
}

export default function TiptapEditor({ content, onChange, placeholder = 'İçeriğinizi buraya yazın...', className = '', onAddCitation, showCitationButton }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      }),
      Placeholder.configure({
        placeholder
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200'
        }
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 p-4 rounded-lg font-mono text-sm'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full'
        }
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-semibold border border-gray-300 px-4 py-2'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2'
        }
      }),
      KanunAlintisi.configure({
        HTMLAttributes: {
          class: 'kanun-alintisi'
        }
      }),
      IctihatAlintisi.configure({
        HTMLAttributes: {
          class: 'ictihat-alintisi'
        }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <MenuBar 
        editor={editor} 
        onAddCitation={onAddCitation}
        showCitationButton={showCitationButton}
      />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  )
}
