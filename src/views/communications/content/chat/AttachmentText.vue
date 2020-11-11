<template>
  <div>
    <div
      v-html="formatMessage(content)"
    />
  </div>
</template>

<script>
  export default {

    props: {
      content: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        textLink: '',
        linkInclude: false,
      }
    },
    methods: {
      formatMessage (message) {
        if (message) {
          // let str = JSON.parse(message)
          let str = message
          let pos = 0
          while (true) {
            const foundPos = str.indexOf('\n', pos)
            if (foundPos !== -1) str = str.replace('\n', '<br>')
            if (foundPos === -1) break
            pos = foundPos
          }
          const regex = /^(http|https):\/\/([\S]+)/gm
          // console.log('find string', str);
          const matchString = str.match(regex)
          // console.log('link',matchString);
          if (matchString && matchString[0]) {
            const link = '<a target="_blank" href="' + matchString[0] + '">' + matchString[0] + '"</a> '
            str = str.replace(matchString[0], link)
            // console.log('string with Link', str);
          }

          return str
        }
        return ''
      },
    },
  }
</script>

<style>
.app--conversation--text--link{
  color: #fff;
}
</style>
