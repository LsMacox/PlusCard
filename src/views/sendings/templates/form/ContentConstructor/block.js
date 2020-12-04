export default {
    data () {
        return {
            buttons: [
                { type: 'text', icon: 'bx-bx-text', title: 'Текст', disable: false },
                { type: 'image', icon: 'bx-bxs-image', title: 'Изображение', disable: false },
                { type: 'images', icon: 'clarity-image-gallery-solid', title: 'Галерея изображений', disable: true },
                { type: 'video', icon: 'dashicons-video-alt3', title: 'Видео', disable: true },
                { type: 'videos', icon: 'clarity-video-gallery-solid', title: 'Видеогалерея', disable: true },
                { type: 'friend', icon: 'fa-solid-user', title: 'Друг', disable: true },
                { type: 'friends', icon: 'fa-solid-user-friends', title: 'Друзья', disable: true },
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
