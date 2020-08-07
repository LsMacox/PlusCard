import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: process.env.APP_TITLE,
      metaTags: [
        {
          name: 'description',
          content: 'The home page of pluscards cabinet.'
        },
        {
          property: 'og:description',
          content: 'The home page of pluscards cabinet.'
        }
      ]
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));


  if(!nearestWithMeta) return next();

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });


    return tag;
  })
      // Add the meta tags to the document head.
      .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router
