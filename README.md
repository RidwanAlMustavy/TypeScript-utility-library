TS-Validator Utility Library
A lightweight, production-ready, and highly type-safe validation utility library built with modern TypeScript. This library showcases advanced TypeScript concepts such as Custom Type Guards, Generics with Constraints, and Mapped Types to enforce strict schema-based validation.

Features
Full Type Safety: Powered by TypeScript's advanced type systems.
Schema-based Validation: Validate complex objects against custom schemas dynamically.
Zero Dependencies: Pure TypeScript/JavaScript with no external third-party bloat.
Custom Type Guards: Built-in runtime type checkers that inform the TS compiler.
Re-usable Generics: Flexible length validator that works with strings, arrays, or any object containing a .length property.
🛠️ Deep Dive: TypeScript Concepts Used
This library wasn't just built to validate data; it was designed using advanced TypeScript design patterns:

Mapped Types ([K in keyof T]): Used in validateSchema to enforce that the structure of your validation rules exactly matches your data model interface/type.
Custom Type Guards (value is string): Methods like isString and isObject validate types at runtime while dynamically narrow down types for safer subsequent code execution.
Generics with Constraints (<T extends { length: number }>): The checkLength utility limits its input strictly to types that possess a valid length property (e.g., Strings or Arrays), preventing runtime errors.
Implementation & Code Structure
// types.ts
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const Validator = {
  /**
   * Custom Type Guard to check if a value is a plain object.
   */
  isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  },

  /**
   * Custom Type Guard to check if a value is a string.
   */
  isString(value: unknown): value is string {
    return typeof value === "string";
  },

  /**
   * Validates standard email formats via Regex.
   */
  isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Generic length validator checking values within specified boundaries.
   */
  checkLength<T extends length: number { }>(value: T, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  },

  /**
   * Validates a whole data block against a pre-defined validation schema.
   */
  validateSchema<T Record<string, any extends>>(
    data: unknown,
    schema: { [K in keyof T]: (val: any) => boolean },
  ): ValidationResult {
    const errors: string[] = [];

    if (!this.isObject(data)) {
      return {
        isValid: false,
        errors: ["Provided data is not a valid object"],
      };
    }

    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const validatorFn = schema[key];
        const valueToValidate = data[key];

        if (!validatorFn(valueToValidate)) {
          errors.push(`Validation failed for field: "${key}"`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
