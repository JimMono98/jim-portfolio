import { getSanityClient } from "./client";

export async function getContactPage() {
  return getSanityClient().fetch(
    `*[_type == "contactPage" && _id == "contactPage"][0] {
      heading,
      description,
      firstNameField { label, placeholder },
      lastNameField { label, placeholder },
      emailField { label, placeholder },
      phoneField { label, placeholder },
      messageField { label, placeholder },
      serviceSelect {
        label,
        placeholder,
        options[] { _key, label, value }
      },
      submitButtonText,
      sendingMessage,
      successMessage,
      errorMessage,
      messageValidationMessage,
      availability { label, value },
      phone { label, value },
      email { label, value },
      location { label, value }
    }`
  );
}
