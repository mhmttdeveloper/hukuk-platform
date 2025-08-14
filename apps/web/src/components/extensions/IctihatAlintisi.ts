import { Node, mergeAttributes } from '@tiptap/core'

export interface IctihatAlintisiOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ictihatAlintisi: {
      setIctihatAlintisi: (attributes: { mahkemeAdi: string; esasNo: string; kararNo: string }) => ReturnType
      toggleIctihatAlintisi: (attributes: { mahkemeAdi: string; esasNo: string; kararNo: string }) => ReturnType
      unsetIctihatAlintisi: () => ReturnType
    }
  }
}

export const IctihatAlintisi = Node.create<IctihatAlintisiOptions>({
  name: 'ictihatAlintisi',

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
      mahkemeAdi: {
        default: null,
        parseHTML: element => element.getAttribute('data-mahkeme-adi'),
        renderHTML: attributes => {
          if (!attributes.mahkemeAdi) {
            return {}
          }
          return {
            'data-mahkeme-adi': attributes.mahkemeAdi,
          }
        },
      },
      esasNo: {
        default: null,
        parseHTML: element => element.getAttribute('data-esas-no'),
        renderHTML: attributes => {
          if (!attributes.esasNo) {
            return {}
          }
          return {
            'data-esas-no': attributes.esasNo,
          }
        },
      },
      kararNo: {
        default: null,
        parseHTML: element => element.getAttribute('data-karar-no'),
        renderHTML: attributes => {
          if (!attributes.kararNo) {
            return {}
          }
          return {
            'data-karar-no': attributes.kararNo,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'blockquote.ictihat-alintisi',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const mahkemeAdi = HTMLAttributes.mahkemeAdi
    const esasNo = HTMLAttributes.esasNo
    const kararNo = HTMLAttributes.kararNo
    
    return [
      'blockquote',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'ictihat-alintisi',
      }),
      [
        'div',
        { class: 'ictihat-header' },
        [
          'span',
          { class: 'ictihat-kaynak' },
          `${mahkemeAdi}, ${esasNo}/${kararNo}`,
        ],
      ],
      ['div', { class: 'ictihat-content' }, 0],
    ]
  },

  addCommands() {
    return {
      setIctihatAlintisi:
        attributes =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      toggleIctihatAlintisi:
        attributes =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
      unsetIctihatAlintisi:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },
})
