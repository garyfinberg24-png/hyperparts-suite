import * as React from "react";
import type { IRegistrationField } from "../models";
import { HyperModal } from "../../../common/components";
import styles from "./HyperEventsRegistrationForm.module.scss";

export interface IHyperEventsRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  fields: IRegistrationField[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventId: string, fieldValues: Record<string, unknown>) => Promise<void>;
  isRegistered: boolean;
}

/** Dynamic registration form: text/dropdown/checkbox/date fields, validation, submit */
const HyperEventsRegistrationForm: React.FC<IHyperEventsRegistrationFormProps> = function (props) {
  const [values, setValues] = React.useState<Record<string, unknown>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  // Reset form when opened
  React.useEffect(function () {
    if (props.isOpen) {
      setValues({});
      setErrors({});
      setSubmitted(false);
    }
  }, [props.isOpen]);

  const handleChange = React.useCallback(function (fieldId: string, value: unknown) {
    setValues(function (prev) {
      const updated: Record<string, unknown> = {};
      Object.keys(prev).forEach(function (k) { updated[k] = prev[k]; });
      updated[fieldId] = value;
      return updated;
    });
    // Clear error for this field
    setErrors(function (prev) {
      const updated: Record<string, string> = {};
      Object.keys(prev).forEach(function (k) { updated[k] = prev[k]; });
      delete updated[fieldId];
      return updated;
    });
  }, []);

  const validate = React.useCallback(function (): boolean {
    const newErrors: Record<string, string> = {};
    props.fields.forEach(function (field) {
      if (field.required) {
        const val = values[field.id];
        if (val === undefined || val === "" || val === false) {
          newErrors[field.id] = field.label + " is required";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [props.fields, values]);

  const handleSubmit = React.useCallback(function () {
    if (!validate()) return;
    setSubmitting(true);
    props.onSubmit(props.eventId, values)
      .then(function () {
        setSubmitted(true);
        setSubmitting(false);
      })
      .catch(function () {
        setSubmitting(false);
      });
  }, [validate, props, values]);

  // Already registered
  if (props.isRegistered) {
    return React.createElement(
      HyperModal,
      { isOpen: props.isOpen, onClose: props.onClose, title: "Registration" },
      React.createElement("div", { className: styles.registrationSuccess },
        "You are already registered for this event."
      )
    );
  }

  // Success
  if (submitted) {
    return React.createElement(
      HyperModal,
      { isOpen: props.isOpen, onClose: props.onClose, title: "Registration" },
      React.createElement("div", { className: styles.registrationSuccess },
        "Successfully registered for " + props.eventTitle + "!"
      )
    );
  }

  // Form fields
  const fieldElements: React.ReactNode[] = [];

  props.fields.forEach(function (field) {
    const fieldError = errors[field.id];
    const fieldChildren: React.ReactNode[] = [];

    // Label
    const labelChildren: React.ReactNode[] = [field.label];
    if (field.required) {
      labelChildren.push(
        React.createElement("span", { key: "req", className: styles.registrationFieldRequired }, "*")
      );
    }
    fieldChildren.push(
      React.createElement("label", {
        key: "label",
        className: styles.registrationFieldLabel,
        htmlFor: "reg-" + field.id,
      }, labelChildren)
    );

    // Input based on type
    switch (field.type) {
      case "text":
        fieldChildren.push(
          React.createElement("input", {
            key: "input",
            id: "reg-" + field.id,
            type: "text",
            className: styles.registrationFieldInput +
              (fieldError ? " " + styles.registrationFieldInputInvalid : ""),
            value: (values[field.id] as string) || "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              handleChange(field.id, e.target.value);
            },
            "aria-required": field.required,
            "aria-invalid": !!fieldError,
          })
        );
        break;

      case "dropdown": {
        const options: React.ReactNode[] = [];
        options.push(
          React.createElement("option", { key: "", value: "" }, "Select...")
        );
        if (field.options) {
          field.options.forEach(function (opt) {
            options.push(
              React.createElement("option", { key: opt, value: opt }, opt)
            );
          });
        }
        fieldChildren.push(
          React.createElement("select", {
            key: "select",
            id: "reg-" + field.id,
            className: styles.registrationFieldSelect,
            value: (values[field.id] as string) || "",
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
              handleChange(field.id, e.target.value);
            },
            "aria-required": field.required,
          }, options)
        );
        break;
      }

      case "checkbox":
        fieldChildren.push(
          React.createElement("label", {
            key: "check",
            className: styles.registrationFieldCheckbox,
          },
            React.createElement("input", {
              id: "reg-" + field.id,
              type: "checkbox",
              checked: !!values[field.id],
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                handleChange(field.id, e.target.checked);
              },
              "aria-required": field.required,
            }),
            field.label
          )
        );
        break;

      case "date":
        fieldChildren.push(
          React.createElement("input", {
            key: "date",
            id: "reg-" + field.id,
            type: "date",
            className: styles.registrationFieldInput +
              (fieldError ? " " + styles.registrationFieldInputInvalid : ""),
            value: (values[field.id] as string) || "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              handleChange(field.id, e.target.value);
            },
            "aria-required": field.required,
            "aria-invalid": !!fieldError,
          })
        );
        break;

      default:
        break;
    }

    // Error message
    if (fieldError) {
      fieldChildren.push(
        React.createElement("span", {
          key: "error",
          className: styles.registrationFieldError,
          role: "alert",
        }, fieldError)
      );
    }

    fieldElements.push(
      React.createElement("div", {
        key: field.id,
        className: styles.registrationField,
      }, fieldChildren)
    );
  });

  // Submit button
  fieldElements.push(
    React.createElement("button", {
      key: "submit",
      className: styles.registrationSubmit,
      onClick: handleSubmit,
      disabled: submitting,
      type: "button",
    }, submitting ? "Submitting..." : "Register")
  );

  return React.createElement(
    HyperModal,
    { isOpen: props.isOpen, onClose: props.onClose, title: "Register for " + props.eventTitle },
    React.createElement("div", { className: styles.registrationForm }, fieldElements)
  );
};

export default HyperEventsRegistrationForm;
