export default {
    data () {
        return {
            buttons: [
                { type: 'TEXT', icon: 'bx-bx-text', title: 'Текст', disable: false },
                { type: 'IMAGE', icon: 'bx-bxs-image', title: 'Изображение', disable: false },
                { type: 'IMAGES', icon: 'clarity-image-gallery-solid', title: 'Галерея изображений', disable: true },
                { type: 'VIDEO', icon: 'dashicons-video-alt3', title: 'Видео', disable: true },
                { type: 'VIDEOS', icon: 'clarity-video-gallery-solid', title: 'Видеогалерея', disable: true },
                { type: 'FRIEND', icon: 'fa-solid-user', title: 'Друг', disable: true },
                { type: 'FRIENDS', icon: 'fa-solid-user-friends', title: 'Друзья', disable: true },
                { type: 'BUTTON', icon: 'emojione-monotone-b-button', title: 'Кнопка', disable: false },
            ],
        }
    },
    methods: {
        initBlock (v) {
            this.localBlock = Object.copy(v)
        },
        updateBlock (v) {
            this.$emit('update:block', v)
        },
        objectComparison (o1, o2) {
            return JSON.stringify(o1) === JSON.stringify(o2)
        },
    },
}
