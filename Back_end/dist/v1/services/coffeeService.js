"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coffeeDTO_1 = __importDefault(require("../DTOs/coffeeDTO"));
const database_1 = require("../config/database");
const coffeeService = {
    createCoffee: async (coffeeData) => {
        const coffee = await database_1.prisma.coffee.create({ data: coffeeData });
        return coffeeDTO_1.default.getCoffeeDTO(coffee);
    },
    getCoffees: async () => {
        const coffees = await database_1.prisma.coffee.findMany();
        return coffees.map(coffeeDTO_1.default.getCoffeeDTO);
    },
    getCoffeeById: async (id) => {
        const coffee = await database_1.prisma.coffee.findUnique({
            where: { id }
        });
        return coffee ? coffeeDTO_1.default.getCoffeeDTO(coffee) : null;
    },
    deleteCoffee: async (id) => {
        await database_1.prisma.coffee.delete({ where: { id } });
    },
    updateCoffee: async (id, coffeeData) => {
        const updatedCoffee = await database_1.prisma.coffee.update({
            where: { id },
            data: coffeeData
        });
        return coffeeDTO_1.default.getCoffeeDTO(updatedCoffee);
    }
};
exports.default = coffeeService;
//# sourceMappingURL=coffeeService.js.map