var { object, string, size, number } = require("superstruct");

var CreateDto = object({
    name: size(string(), 1, 30),
    description: string(),
    price: number(),
    tags : string()
});

module.exports = {
    CreateDto,
};