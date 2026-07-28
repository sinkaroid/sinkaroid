<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="modal-mask"
        @click.self="close"
      >
        <div class="modal-wrapper">
          <div class="modal-container bento-card">
            <!-- Modal Header -->
            <div class="modal-header">
              <h3 class="modal-title">
                Get in Touch
              </h3>
              <button
                class="close-btn clickable"
                aria-label="Close modal"
                @click="close"
              >
                <i class="fas fa-times" />
              </button>
            </div>

            <hr class="modal-divider">

            <!-- Contact Form -->
            <div class="modal-body">
              <form
                class="contact-form"
                @submit.prevent="sendEmail"
              >
                <!-- Name Input -->
                <div class="form-group">
                  <label
                    for="modal-name"
                    class="form-label"
                  >Name</label>
                  <div class="input-wrapper">
                    <i class="far fa-user input-icon" />
                    <input
                      id="modal-name"
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
                    for="modal-email"
                    class="form-label"
                  >Email Address</label>
                  <div class="input-wrapper">
                    <i class="far fa-envelope input-icon" />
                    <input
                      id="modal-email"
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
                    for="modal-message"
                    class="form-label"
                  >Message</label>
                  <div class="input-wrapper">
                    <i class="far fa-comment-dots input-icon textarea-icon" />
                    <textarea
                      id="modal-message"
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

            <hr class="modal-divider">
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Notification Alert -->
  <Snackbar
    :show-snackbar="showSnackbar"
    :snackbar-message="snackbarMessage"
    :snackbar-color="snackbarColor"
    @close="closeSnackbar"
  />
</template>

<script setup>
import { ref } from "vue";
import emailjs from "@emailjs/browser";
import Snackbar from "./Snackbar.vue";

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close"]);

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

const close = () => {
  emit("close");
};

const sendEmail = () => {
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

  emailjs.send(
    import.meta.env.VITE_SERVICE_ID,
    import.meta.env.VITE_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_USER_ID
  )
    .then(() => {
      triggerAlert("Message sent successfully! Thank you.", "#10b981");
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
.modal-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(9, 9, 11, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-wrapper {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  width: 100%;
  max-height: 85vh;
  background: var(--modal-bg) !important;
  border: 1px solid var(--card-border) !important;
  box-shadow: var(--card-shadow) !important;
  display: flex;
  flex-direction: column;
  padding: var(--space-6) !important;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-size: 1.3rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, transform 0.2s;
}

.close-btn:hover {
  color: var(--foreground);
  transform: scale(1.1);
}

.modal-divider {
  border: 0;
  height: 1px;
  background: var(--card-border);
  margin: var(--space-4) 0;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
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

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modal-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .modal-container {
  animation: modal-pop-out 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-pop-in {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes modal-pop-out {
  from {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  to {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
}
</style>
