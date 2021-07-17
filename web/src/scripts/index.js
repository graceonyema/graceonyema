const headerNav = document.getElementById("site-header");

function toggleHeaderBg() {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    headerNav.classList.remove("header-transparent");
    // headerNav.classList.add("header-transparent");
  } else {
    headerNav.classList.add("header-transparent");
    // headerNav.classList.remove("header-transparent");
  }
}

window.onscroll = function() {
  toggleHeaderBg()
};

/** Register Service Worker **/
// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('./sw.js')
//   .then(() => {
//       console.log('Service Worker registered')
//   })
//   .catch((error) => {
//       console.log('Registration Failed', error);
//   });
// }
