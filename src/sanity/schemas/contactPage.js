import { defineField, defineType } from "sanity";
import { contactDefaults } from "../../data/contactDefaults";

function presentationField(name, title) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "label",
        title: "Label",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "placeholder",
        title: "Placeholder",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
    ],
  });
}

function informationField(name, title, valueValidation) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "label",
        title: "Label",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "value",
        title: "Value",
        type: "string",
        validation: valueValidation || ((Rule) => Rule.required()),
      }),
    ],
  });
}

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  initialValue: contactDefaults,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    presentationField("firstNameField", "First Name Field"),
    presentationField("lastNameField", "Last Name Field"),
    presentationField("emailField", "Email Field"),
    presentationField("phoneField", "Phone Field"),
    presentationField("messageField", "Message Field"),
    defineField({
      name: "serviceSelect",
      title: "Service Select",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "placeholder",
          title: "Placeholder",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "options",
          title: "Options",
          type: "array",
          validation: (Rule) =>
            Rule.required()
              .min(1)
              .custom((options) => {
                if (!Array.isArray(options)) {
                  return true;
                }

                const values = options
                  .map((option) => option?.value?.trim())
                  .filter(Boolean);

                return new Set(values).size === values.length
                  ? true
                  : "Each service option value must be unique.";
              }),
          of: [
            {
              type: "object",
              name: "serviceOption",
              title: "Service Option",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "value",
                  title: "Submission Value",
                  type: "string",
                  description:
                    "Stable value included in contact form submissions.",
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: "label",
                  subtitle: "value",
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "submitButtonText",
      title: "Submit Button Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sendingMessage",
      title: "Sending Message",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "errorMessage",
      title: "Fallback Error Message",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "messageValidationMessage",
      title: "Message Validation Message",
      type: "string",
      description: "Displayed when the message contains fewer than 20 words.",
      validation: (Rule) => Rule.required(),
    }),
    informationField("availability", "Availability"),
    informationField("phone", "Phone"),
    informationField("email", "Email", (Rule) =>
      Rule.required().email()
    ),
    informationField("location", "Location"),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Page",
        subtitle: "Singleton",
      };
    },
  },
});
