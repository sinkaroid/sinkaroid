let config = {
  // docs: https://github.com/eleith/emailjs
  emailjs: {
    serviceID: process.env.serviceID || "service_xxx",
    templateID: process.env.templateID || "template_xxx",
    userID: process.env.userID || "user_xxx"
  }
};

export default config;
