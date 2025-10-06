// IMPORTANT: Replace these with your actual EmailJS configuration
const SERVICE_ID = 'service_2pd5enl';
const WELCOME_TEMPLATE_ID = 'template_t8n1jz7';
const ACTIVITY_TEMPLATE_ID = 'template_w93qynp';

export const sendWelcomeEmail = (userName, userClass) => {
  // Access emailjs from the window object
  if (window.emailjs && window.emailjs.init) {
    window.emailjs.send(SERVICE_ID, WELCOME_TEMPLATE_ID, {
      user_name: userName,
      user_class: userClass,
      login_time: new Date().toLocaleString(),
    }).then(
      res => console.log('Welcome email success!', res.status),
      err => console.log('Welcome email failed...', err)
    );
  }
};

export const sendActivityEmail = (user, activity, details) => {
  // Access emailjs from the window object
  if (window.emailjs && window.emailjs.init) {
    const templateParams = {
      user_name: user.name,
      user_class: user.class,
      activity_type: activity,
      activity_details: details,
      timestamp: new Date().toLocaleString(),
    };

    window.emailjs.send(SERVICE_ID, ACTIVITY_TEMPLATE_ID, templateParams)
      .then(res => console.log('Activity email success!', res.status))
      .catch(err => console.log('Activity email failed...', err));
  }
};