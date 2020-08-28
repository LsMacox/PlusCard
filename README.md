- [Структура проекта](#структура-проекта)
- [Модули/плагины](#модулиплагины)
  - [vue-constants](#vue-constants)
  - [Iconify](#iconify)
    - [Добавление иконок](#добавление-иконок)
    - [Использование](#использование)
- [Bugs](#bugs)


# Структура проекта
* **src** 
  * **styles** - все стили проекта
    * **vuetify-preset-plus** - стили переопределяющие элементы vuetify
    * **components** - стили наших кастомных компонентов 
    * **main** - основный файл
    * **variables** - файл глобальныъх переменных

# Модули/плагины

 ## vue-constants
Обяъвление и использование констант уровня vue-компонента. 
* Объявление :
```js
export default {
  constants: {
    field1: value1, 
    constObj: {
       ....
    }
    ...
  }
}

```
* Использование this.field1 - в любом месте компонента



## Iconify

### Добавление иконок
 * Поиск https://iconify.design/icon-sets/?query=plus-circle
 * Открываем вкладку React копируем строку вида (`import plusCircle from '@iconify/icons-uil/plus-circle'`)
 * Открваем src\plugins\iconify.js добавляем строку в массив ICONIFY_ICONS:
    ```js
    { id: 'plus-circle', component: () => import('@iconify/icons-uil/plus-circle') },
    ``` 

### Использование
 *  Используя @iconify/vue (https://www.npmjs.com/package/@iconify/vue)
    *  <iconify-icon icon="plus-circle" height="24" />  
 * Используя vuetify
    *  <v-icon>$iconify_plus-circle</v-icon>
    *  <v-text-field  append-icon="$iconify_plus-circle"


# Bugs

- [ ] криво работает селект при выпадении выбора наверх
    