import placeholdersMixin from '../../../js/backend/mixins/placeholdersMixin'

export default {
  mixins: [placeholdersMixin],

  data () {
    return {
      textMode: false,
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'direction': 'rtl'}],
            [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'font': []}],
            [{'color': []}, {'background': []}],
            [{'align': []}],
            ['clean'],
            ['link', 'image']
          ]
        }
      },
      pageUrl: ''
    }
  },

  methods: {
    parseQuillEditorContent (object) {
      if (typeof object === 'undefined') {
        return
      }

      let elements = object.quill.root.getElementsByTagName('p')

      for (let i = 0; i < elements.length; i++) {
        for (let key in this.linksForParsing) {
          let links = elements[i].getElementsByTagName('a')

          for (let j = 0; j < links.length; j++) {
            if (links[j].href === this.pageUrl + key) {
              links[j].href = key
            }
          }

          if (elements[i].textContent.indexOf(this.linksForParsing[key]) !== -1) {
            elements[i].innerHTML = elements[i].innerHTML.replace(this.plainTextLinksForParsing[key], this.linksForParsing[key])
          }
        }
      }
    },

    process (str) {
      let div = document.createElement('div')

      div.innerHTML = str.trim()

      return this.format(div, 0).innerHTML
    },

    format (node, level) {
      let indentBefore = new Array(level++ + 1).join('  ')

      let indentAfter = new Array(level - 1).join('  ')

      let textNode = null

      for (let i = 0; i < node.children.length; i++) {
        textNode = document.createTextNode('\n' + indentBefore)

        node.insertBefore(textNode, node.children[i])

        this.format(node.children[i], level)

        if (node.lastElementChild === node.children[i]) {
          textNode = document.createTextNode('\n' + indentAfter)

          node.appendChild(textNode)
        }
      }

      return node
    },

    changedContentText (quillProperty, inputProperty, language) {
      if (!language) {
        this[quillProperty] = this[inputProperty]
      } else {
        this[quillProperty][language] = this[inputProperty][language]
      }
    },

    textModeChanged (quillProperty, inputProperty, language) {
      this.textMode = !this.textMode

      if (this.textMode) {
        if (!language) {
          this[inputProperty] = this.process(
            this[quillProperty].replace('<!-- Content -->', '').replace(/(\r\n|\n|\r)/gm, '')
          )
        } else {
          this[inputProperty][language] = this.process(
            this[quillProperty][language].replace('<!-- Content -->', '').replace(/(\r\n|\n|\r)/gm, '')
          )
        }
      } else {
        if (!language) {
          this[inputProperty] = '<!-- Content -->' + this[inputProperty]
        } else {
          this[inputProperty][language] = '<!-- Content -->' + this[inputProperty][language]
        }
      }

      if (!language) {
        this[quillProperty] = this[inputProperty]
      } else {
        this[quillProperty][language] = this[inputProperty][language]
      }
    }
  }
}
