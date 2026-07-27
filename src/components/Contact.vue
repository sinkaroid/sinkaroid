<template>
  <section
    id="contact"
    class="section contact-section"
  >
    <div class="section-header">
      <h2
        class="section-title"
        :style="{ backgroundImage: titleGradient }"
      >
        Get in Touch
      </h2>
      <p class="section-subtitle">
        I am always open to discussing new projects, creative opportunities, or custom requests.
      </p>
    </div>

    <!-- Contact Form Container -->
    <div class="contact-grid">
      <div class="bento-card contact-form-card">
        <form
          class="contact-form"
          @submit.prevent="sendEmail"
        >
          <!-- Name Input -->
          <div class="form-group">
            <label
              for="name"
              class="form-label"
            >Name</label>
            <div class="input-wrapper">
              <i class="far fa-user input-icon" />
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="Your Name"
                class="form-input"
                required
              >
            </div>
          </div>

          <!-- Email Input -->
          <div class="form-group">
            <label
              for="email"
              class="form-label"
            >Email Address</label>
            <div class="input-wrapper">
              <i class="far fa-envelope input-icon" />
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="your.email@example.com"
                class="form-input"
                required
              >
            </div>
          </div>

          <!-- Message Textarea -->
          <div class="form-group">
            <label
              for="message"
              class="form-label"
            >Message</label>
            <div class="input-wrapper">
              <i class="far fa-comment-dots input-icon textarea-icon" />
              <textarea
                id="message"
                v-model="text"
                placeholder="How can I help you?"
                class="form-input form-textarea"
                rows="5"
                required
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary submit-btn clickable"
              :disabled="sending"
            >
              <span v-if="sending"><i class="fas fa-spinner fa-spin" /> Sending...</span>
              <span v-else><i class="far fa-paper-plane" /> Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notification Alert -->
    <Snackbar
      :show-snackbar="showSnackbar"
      :snackbar-message="snackbarMessage"
      :snackbar-color="snackbarColor"
      @close="closeSnackbar"
    />
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import emailjs from "@emailjs/browser";
import config from "../../config";
import Snackbar from "./helpers/Snackbar.vue";
import { randomGradient } from "../composables/useRandomGradient";

const titleGradient = ref(randomGradient());

const props = defineProps({
  nightMode: {
    type: Boolean,
    default: false
  }
});

watch(() => props.nightMode, () => {
  titleGradient.value = randomGradient();
});

const name = ref("");
const email = ref("");
const text = ref("");
const sending = ref(false);

const showSnackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("#3b82f6");

const closeSnackbar = (val) => {
  showSnackbar.value = val;
};

const sendEmail = () => {
  // Validate inputs
  if (!name.value.trim() || !email.value.trim() || !text.value.trim()) {
    triggerAlert("Please fill in all fields.", "#ef4444");
    return;
  }

  sending.value = true;
  
  const templateParams = {
    user_name: name.value,
    user_email: email.value,
    message: text.value
  };

  const emailConfig = config.emailjs || {};

  emailjs.send(
    emailConfig.serviceID,
    emailConfig.templateID,
    templateParams,
    emailConfig.userID
  )
    .then(() => {
      triggerAlert("Message sent successfully! Thank you.", "#10b981");
      // Clear inputs
      name.value = "";
      email.value = "";
      text.value = "";
    })
    .catch((err) => {
      triggerAlert(`Failed to send message: ${err.text || err.message}`, "#ef4444");
    })
    .finally(() => {
      sending.value = false;
    });
};

const triggerAlert = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  showSnackbar.value = true;
};
</script>

<style scoped>
.contact-grid {
  display: flex;
  justify-content: center;
}

.contact-form-card {
  width: 100%;
  max-width: 600px;
  padding: var(--space-8) !important;
  opacity: 0;
  transform: translateY(20px);
  animation: slide-up-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-up-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--foreground);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
  font-size: 0.95rem;
}

.textarea-icon {
  top: var(--space-4);
  transform: none;
}

.form-input {
  padding-left: 2.8rem !important;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  margin-top: var(--space-2);
}

.submit-btn {
  width: 100%;
  font-size: 1rem;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
