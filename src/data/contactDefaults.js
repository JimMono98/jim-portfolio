export const contactDefaults = {
  heading: "Let's work together",
  description: "",
  firstNameField: {
    label: "First name",
    placeholder: "Firstname",
  },
  lastNameField: {
    label: "Last name",
    placeholder: "Lastname",
  },
  emailField: {
    label: "Email",
    placeholder: "Email",
  },
  phoneField: {
    label: "Phone number",
    placeholder: "Phone number",
  },
  messageField: {
    label: "Message",
    placeholder: "Type your message here.",
  },
  serviceSelect: {
    label: "Select a Service",
    placeholder: "Select a service",
    options: [
      {
        _key: "web-development",
        label: "Web Development",
        value: "Web Development",
      },
      {
        _key: "ui-ux-design",
        label: "UI/UX Design",
        value: "UI/UX Design",
      },
      {
        _key: "mobile-application",
        label: "Mobile Application",
        value: "Mobile Application",
      },
      {
        _key: "other",
        label: "Other",
        value: "Other",
      },
    ],
  },
  submitButtonText: "Send message",
  sendingMessage: "Sending...",
  successMessage: "Message sent successfully!",
  errorMessage: "Failed to send message",
  messageValidationMessage: "Your message must be at least 20 words long.",
  availability: {
    label: "Available",
    value: "Daily from 10 AM to 8 PM",
  },
  phone: {
    label: "Phone",
    value: "(+30) 698 6610 660",
  },
  email: {
    label: "Email",
    value: "dmonogenidis@gmail.com",
  },
  location: {
    label: "Address",
    value: "Thessaloniki, Greece",
  },
};

function normalizeRequiredString(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized || fallback;
}

function normalizeOptionalString(value, fallback) {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeField(value, fallback) {
  return {
    label: normalizeRequiredString(value?.label, fallback.label),
    placeholder: normalizeRequiredString(
      value?.placeholder,
      fallback.placeholder
    ),
  };
}

function normalizeInfo(value, fallback) {
  return {
    label: normalizeRequiredString(value?.label, fallback.label),
    value: normalizeRequiredString(value?.value, fallback.value),
  };
}

function createOptionKey(option, index) {
  const configuredKey = normalizeOptionalString(option?._key, "");

  if (configuredKey) {
    return configuredKey;
  }

  const normalizedValue = option.value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `service-${normalizedValue || index + 1}-${index + 1}`;
}

function normalizeServiceOptions(options) {
  if (!Array.isArray(options)) {
    return contactDefaults.serviceSelect.options.map((option) => ({
      ...option,
    }));
  }

  const seenValues = new Set();
  const normalizedOptions = [];

  options.forEach((option, index) => {
    const label = normalizeOptionalString(option?.label, "");
    const value = normalizeOptionalString(option?.value, "");

    if (!label || !value || seenValues.has(value)) {
      return;
    }

    seenValues.add(value);
    normalizedOptions.push({
      _key: createOptionKey({ ...option, value }, index),
      label,
      value,
    });
  });

  return normalizedOptions.length
    ? normalizedOptions
    : contactDefaults.serviceSelect.options.map((option) => ({ ...option }));
}

export function normalizeContactPage(value) {
  return {
    heading: normalizeRequiredString(value?.heading, contactDefaults.heading),
    description: normalizeOptionalString(
      value?.description,
      contactDefaults.description
    ),
    firstNameField: normalizeField(
      value?.firstNameField,
      contactDefaults.firstNameField
    ),
    lastNameField: normalizeField(
      value?.lastNameField,
      contactDefaults.lastNameField
    ),
    emailField: normalizeField(value?.emailField, contactDefaults.emailField),
    phoneField: normalizeField(value?.phoneField, contactDefaults.phoneField),
    messageField: normalizeField(
      value?.messageField,
      contactDefaults.messageField
    ),
    serviceSelect: {
      label: normalizeRequiredString(
        value?.serviceSelect?.label,
        contactDefaults.serviceSelect.label
      ),
      placeholder: normalizeRequiredString(
        value?.serviceSelect?.placeholder,
        contactDefaults.serviceSelect.placeholder
      ),
      options: normalizeServiceOptions(value?.serviceSelect?.options),
    },
    submitButtonText: normalizeRequiredString(
      value?.submitButtonText,
      contactDefaults.submitButtonText
    ),
    sendingMessage: normalizeRequiredString(
      value?.sendingMessage,
      contactDefaults.sendingMessage
    ),
    successMessage: normalizeRequiredString(
      value?.successMessage,
      contactDefaults.successMessage
    ),
    errorMessage: normalizeRequiredString(
      value?.errorMessage,
      contactDefaults.errorMessage
    ),
    messageValidationMessage: normalizeRequiredString(
      value?.messageValidationMessage,
      contactDefaults.messageValidationMessage
    ),
    availability: normalizeInfo(
      value?.availability,
      contactDefaults.availability
    ),
    phone: normalizeInfo(value?.phone, contactDefaults.phone),
    email: normalizeInfo(value?.email, contactDefaults.email),
    location: normalizeInfo(value?.location, contactDefaults.location),
  };
}

export default contactDefaults;
