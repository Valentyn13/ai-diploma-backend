const APIError = require("../utils/APIError");

const validateChatInput = (value) => {
    if (!value || !value.trim()) {
        throw new APIError({
            message: 'Input is required',
            status: 400,
          });
    }
};

module.exports = validateChatInput;
