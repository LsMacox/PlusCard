<template>
  <div>
    <div
      v-for="(attachment, i) in attachments"
      :key="i"
    >
      <app-attachment-text
        v-if="attachment.type === 'message/text'"
        :content="attachment.content"
      />

      <app-attachment-image
        v-if="attachment.type === 'media/image'"
        :content="attachment.content"
      />

      <app-attachment-audio
        v-if="attachment.type === 'media/audio'"
        :content="attachment.content"
        :sender="msgItem.sender_id"
      />

      <app-attachment-video
        v-if="attachment.type === 'media/video'"
        :content="attachment.content"
      />

      <app-attachment-file
        v-if="attachment.type === 'media/file'"
        :content="attachment.content"
      />

      <app-attachment-purchase
        v-if="attachment.type === 'plus/purchase'"
        :content="attachment.content"
      />

      <app-attachment-account
        v-if="attachment.type === 'plus/account'"
        :content="attachment.content"
        :conversation-id="conversationId"
      />

      <app-attachment-deleted
        v-if="attachment.type === 'deleted/message'"
      />
    </div>
  </div>
</template>

<script>
  import AppAttachmentText from './AttachmentText'
  import AppAttachmentAccount from './AttachmentAccount'
  import AppAttachmentDeleted from './AttachmentDeleted'
  import AppAttachmentFile from './AttachmentFile'
  import AppAttachmentImage from './AttachmentImage'
  import AppAttachmentAudio from './AttachmentAudio'
  import AppAttachmentVideo from './AttachmentVideo'
  import AppAttachmentPurchase from './AttachmentPurchase'

  export default {
    components: {
      AppAttachmentText,
      AppAttachmentAccount,
      AppAttachmentDeleted,
      AppAttachmentFile,
      AppAttachmentImage,
      AppAttachmentAudio,
      AppAttachmentVideo,
      AppAttachmentPurchase,
    },
    props: {
      msgItem: {
        type: Object,
        default: () => {
          return {}
        },
      },
      attachments: {
        type: Array,
        default: () => {
          return {}
        },
      },
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    mounted () {
      console.log('attachment type:', this.attachments)
    },
  }
</script>
