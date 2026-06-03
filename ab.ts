// types.ts
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const Validator = {
  isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  },

  isString(value: unknown): value is string {
    return typeof value === "string";
  },

  isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  checkLength<T extends { length: number }>(
    value: T,
    min: number,
    max: number,
  ): boolean {
    return value.length >= min && value.length <= max;
  },

  validateSchema<T extends Record<string, any>>(
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

interface NewUser {
  username: string;
  email: string;
  age: number;
}

const registrationInput = {
  username: "ridwan",
  email: "ridwan@invalid-email",
  age: 25,
};

const userSchema: { [K in keyof NewUser]: (val: any) => boolean } = {
  username: (val) =>
    Validator.isString(val) && Validator.checkLength(val, 3, 15),
  email: (val) => typeof val === "string" && Validator.isEmail(val),
  age: (val) => typeof val === "number" && val >= 18,
};

const result = Validator.validateSchema<NewUser>(registrationInput, userSchema);

console.log(result);
/* Output:
{
  isValid: false,
  errors: [ 'Validation failed for field: "email"' ]
}
*/
