export default {
  watch: {
    searchString (v) {
      v = String(v).replace(/\s+/g, ' ').replace(/^\s/g, '')
      if (!v.length) {
        this.searchCount = 0
      }
      this.searchByFilterString(v)
    },
    searchCount (v) {
      if (
        (v !== 0 && this.searchChoose === 0) ||
        (this.searchChoose > v)
      ) {
        this.searchChoose = 1
      }
      if (v === 0) this.searchChoose = 0
    },
    searchChoose (v) {
      if (
          v &&
          this.searchFound[v - 1] &&
          document.getElementById('message-' + this.searchFound[v - 1].id)
        ) {
          this.$refs.conversationField.scrollTop = document.getElementById('message-' + this.searchFound[v - 1].id).offsetTop
        }
    },
  },
  methods: {
    searchByFilterString (searchable) {
      searchable = searchable.toLowerCase()
      this.searchFound = this._searchMessagesByString(searchable)
      this.searchCount = this.searchFound.length

      if (this.searchFound.length > 0) {
        this._removeHighlightMessage()
        this._highlightMessageByIdAndText(this.searchFound)
      } else {
        this._removeHighlightMessage()
      }
    },
    _highlightMessageByIdAndText (arr) {
      arr.forEach((item) => {
        const msg = this._getMessageTextNodeById(item.id)
        if (msg) {
          const msgText = msg.innerText
          const searchIdx = msg.innerText.toLowerCase().indexOf(this.searchString.toLowerCase())
          msg.innerHTML = msgText.substr(0, searchIdx) + '<mark>' + msgText.substr(searchIdx, this.searchString.length) + '</mark>' + msgText.substr((searchIdx + this.searchString.length), msgText.length)
        }
      })
    },
    _removeHighlightMessage () {
      for (const propId in this.messages) {
        const msg = this._getMessageTextNodeById(propId)
        if (msg) {
          msg.innerHTML = msg.innerHTML.replace(/<(\/)?\s*mark\s*>/, '')
        }
      }
    },
    _getMessageTextNodeById (id) {
      const msg = document.getElementById('message-' + id)
      if (msg) {
        const messageBox = document.getElementById('message-' + id).querySelector('.message-box-message')

        return messageBox.querySelector('.message-box-text p') ||
          messageBox.querySelector('.attachment-text p')
      }
    },
    _searchMessagesByString (str) {
      if (!str.length) return []
      const found = []
      let id, text

      for (const item in this.messages) {
        if (
          this.messages[item].parent_message &&
          this.messages[item].parent_message.attachments &&
          this.messages[item].parent_message.attachments.length &&
          this.messages[item].parent_message.attachments[0].type === 'message/text' &&
          this.messages[item].parent_message.attachments[0].content.toLowerCase().indexOf(str) !== -1
        ) {
          id = this.messages[item].parent_message.id
          text = this.messages[item].parent_message.attachments[0].content
        } else if (
          this.messages[item].attachments &&
          this.messages[item].attachments.length &&
          this.messages[item].attachments[0].type === 'message/text' &&
          this.messages[item].attachments[0].content.toLowerCase().indexOf(str) !== -1
        ) {
          id = this.messages[item].id
          text = this.messages[item].attachments[0].content
        } else if (
          this.messages[item].message &&
          this.messages[item].message.toLowerCase().indexOf(str) !== -1
        ) {
          id = this.messages[item].id
          text = this.messages[item].message
        }

        if (id && text) {
          text = text.toLowerCase()
          const oldV = found.find(f => f.id === id)
          if (!oldV) {
            found.push({ id: id, text: text })
          }
        }
      }

      return found
    },
  },
}
