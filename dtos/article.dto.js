var { object, string, size } = require("superstruct");

var CreateDto = object({
    title: size(string(), 1, 30),
    content: string()
});

module.exports = {
    CreateDto,
};