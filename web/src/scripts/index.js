// const headerNav = document.getElementById("site-header");
const pageTopBtn = document.getElementById("go-to-top");
// const msgForm = document.getElementById('contact-form');
const msgForms = document.querySelectorAll('.gform');
// const statusBox = document.getElementById('status');
// const statusBox = document.getElementById('status');

function toggleTopBtn() {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    pageTopBtn.classList.remove("d-none");
    // headerNav.classList.add("header-transparent");
  } else {
    pageTopBtn.classList.add("d-none");
    // headerNav.classList.remove("header-transparent");
  }
}


/** Method for showing notification message**/

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