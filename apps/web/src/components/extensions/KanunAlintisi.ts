import { Node, mergeAttributes } from '@tiptap/core'

export interface KanunAlintisiOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    kanunAlintisi: {
      setKanunAlintisi: (attributes: { kanunAdi: string; maddeNumarasi: string }) => ReturnType
      toggleKanunAlintisi: (attributes: { kanunAdi: string; maddeNumarasi: string }) => ReturnType
      unsetKanunAlintisi: () => ReturnType
    }
  }
}

export const KanunAlintisi = Node.create<KanunAlintisiOptions>({
  name: 'kanunAlintisi',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      kanunAdi: {
        default: null,
        parseHTML: element => element.getAttribute('data-kanun-adi'),
        renderHTML: attributes => {
          if (!attributes.kanunAdi) {
            return {}
          }
          return {
            'data-kanun-adi': attributes.kanunAdi,
          }
        },
      },
      maddeNumarasi: {
        default: null,
        parseHTML: element => element.getAttribute('data-madde-numarasi'),
        renderHTML: attributes => {
          if (!attributes.maddeNumarasi) {
            return {}
          }
          return {
            'data-madde-numarasi': attributes.maddeNumarasi,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'blockquote.kanun-alintisi',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const kanunAdi = HTMLAttributes.kanunAdi
    const maddeNumarasi = HTMLAttributes.maddeNumarasi
    
    return [
      'blockquote',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'kanun-alintisi',
      }),
      [
        'div',
        { class: 'kanun-header' },
        [
          'span',
          { class: 'kanun-adi' },
          `${kanunAdi} m.${maddeNumarasi}`,
        ],
      ],
      ['div', { class: 'kanun-content' }, 0],
    ]
  },

  addCommands() {
    return {
      setKanunAlintisi:
        attributes =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      toggleKanunAlintisi:
        attributes =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
      unsetKanunAlintisi:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },
})
