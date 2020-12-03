export default {
    data () {
        return {
            buttons: [
                { type: 'text', icon: 'bx-bx-text', title: 'Текст' },
                { type: 'image', icon: 'bx-bxs-image', title: 'Изображение' },
                { type: 'images', icon: 'clarity-image-gallery-solid', title: 'Галерея изображений' },
                { type: 'video', icon: 'dashicons-video-alt3', title: 'Видео' },
                { type: 'videos', icon: 'clarity-video-gallery-solid', title: 'Видеогалерея' },
                { type: 'friend', icon: 'fa-solid-user', title: 'Друг' },
                { type: 'friends', icon: 'fa-solid-user-friends', title: 'Друзья' },
            ],
        }
    },
    methods: {
        initBlock () {
            this.localBlock = Object.copy(this.block)
        },
        updateBlock (v) {
            this.$emit('update:block', Object.copy(v))
        },
    },
}
