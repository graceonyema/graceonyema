// const headerNav = document.getElementById("site-header");
const pageTopBtn = document.getElementById("go-to-top");

function toggleTopBtn() {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    pageTopBtn.classList.remove("d-none");
    // headerNav.classList.add("header-transparent");
  } else {
    pageTopBtn.classList.add("d-none");
    // headerNav.classList.remove("header-transparent");
  }
}

window.onscroll = function() {
  toggleTopBtn()
};

/** Register Service Worker **/
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
  // .then(() => {
  //     console.log('Service Worker registered')
  // })
  .catch((error) => {
      console.log('Registration Failed', error);
  });
}
