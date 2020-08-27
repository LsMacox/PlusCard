# Структура проекта
* styles - все стили проекта
   * vuetify-preset-plus - стили переопределяющие элементы vuetify
   * components - стили наших кастомных компонентов 
   * main - основный файл
   * variables - файл глобальныъх переменных


# Iconify
## Добавление иконок
 * Поиск https://iconify.design/icon-sets/?query=plus-circle
 * Открываем вкладку React копируем строку вида (import plusCircle from '@iconify/icons-uil/plus-circle';)
 * Открваем src\plugins\iconify.js добавляем строку в массив ICONIFY_ICONS:
    ```js
    { id: 'plus-circle', component: () => import('@iconify/icons-uil/plus-circle') },
    ``` 
## Использование
 *  Используюя @iconify/vue (https://www.npmjs.com/package/@iconify/vue)
    *  <iconify-icon icon="plus-circle" height="24" />  
 * Используюя vuetify
    *  <v-icon>$iconify_plus-circle</v-icon>
    *  <v-text-field  append-icon="$iconify_plus-circle"
    