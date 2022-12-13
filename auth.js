let config = {
  emailjs: {
    serviceID: process.env.serviceID || 'service_xxx',
    templateID: process.env.templateID || 'template_xxx',
    userID: process.env.userID || 'abc12345'
  }
};

export default config;
