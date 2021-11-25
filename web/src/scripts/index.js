// const headerNav = document.getElementById("site-header");
const pageTopBtn = document.getElementById("go-to-top");
// const msgForm = document.getElementById('contact-form');
const msgForms = document.querySelectorAll('.gform');
// const statusBox = document.getElementById('status');


/**
 * Toggle visibility of the 'go to top' button based on scroll position
 */

function toggleTopBtn() {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    pageTopBtn.classList.remove("d-none");
    // headerNav.classList.add("header-transparent");
  } else {
    pageTopBtn.classList.add("d-none");
    // headerNav.classList.remove("header-transparent");
  }
}


/**
 *  Shows notification message on target(form) 
 * @param {string} result - The status of a form's submission
 * @param {HTMLFormElement} formElem - The submitted form element
 */

const displayStatus = (result, formElem) => {
  const statusBox = formElem.lastChild;
  let txtSuccess = "Thank you. You'll get a response as soon as possible";
  let txtFailure = "Unable to send message. Please Check network connection and retry";
  let text = result === "success" ? txtSuccess : txtFailure;
  

  statusBox.textContent = text;
  statusBox.classList.toggle("fade-in");

  setTimeout(() => {
		statusBox.classList.toggle("fade-in");
		statusBox.textContent = "";
  }, 8000);
}


// msgForm.addEventListener('submit', sendMessage);

// msgForm.onsubmit = async (event) => {
//   event.preventDefault();
//   const url = 'https://script.google.com/macros/s/AKfycbyleOTpKJfCQa5tNLaGLQVz-xTLTc0fWIJOKeZ4/exec'
//   let formData = new FormData(event.target);
//   // console.log(formData.get('name'), formData.get('email'), formData.get('message'));
//   // console.log(new FormData(event.target));
//   let response = await fetch(url, {
//     method: 'POST',
//     body: formData
//   });

//   // let {result, data} = await response.json();
//   // console.log(data);
//   let { result } = await response.json();
  
//   displayStatus(result);
//   msgForm.reset();
// };

msgForms.forEach(form => {
  form.addEventListener('submit', async(event) => {
    event.preventDefault();

    const url = 'https://script.google.com/macros/s/AKfycbyleOTpKJfCQa5tNLaGLQVz-xTLTc0fWIJOKeZ4/exec';
    let formData = new FormData(event.target);
    // console.log(formData.get('name'), formData.get('email'), formData.get('message'));
    // console.log(new FormData(event.target));
    let response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    // let {result, data} = await response.json();
    // console.log(data);
    let { result } = await response.json();
    
    displayStatus(result, event.target);
    form.reset();
  })
});


window.onscroll = () => {
  toggleTopBtn()
};

/**
 * Register Service Worker
 */

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js')
  .then(() => {
      console.log('Service Worker registered')
  })
  .catch((error) => {
    // console.log('Registration Failed', error);
    console.log('Registration Failed');
  });
}