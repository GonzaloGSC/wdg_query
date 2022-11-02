/////////////////////// INFO

// Nombre: Gonzalo Gabriel Salinas Campos.
//
// Fecha: 02-11-2022.
//
// Descripción: Respuesta completa para el desafío/pregunta planteada en el mail de asunto “Pregunta Entrevista”. 
//              Aquí se pueden observar la generación rápida de modelos, relaciones y query final a la base de datos.
//
// Observación: Analizando las relaciones entre tablas y sus llaves foráneas creadas de forma automática por sequelizer, 
//              llegué a la conclusión que se utilizan relaciones de “belongsTo” (uno a uno) en todos los casos (o al menos, es un 
//              posible escenario) y debido a que no se especifican las relaciones entre tablas, las inferí de esta manera.

/////////////////////// QUERY

/*
    SELECT 
    `people`.`id`
    ,`people`.`firstName`
    ,`people`.`lastName`
    ,`addresses`.`id`
    ,`addresses`.`street`
    ,`addresses`.`number`
    ,`cities`.`id`
    ,`cities`.`name`
    ,`states`.`id`
    ,`states`.`name`
    ,`cars`.`id`
    ,`cars`.`model`
    ,`cars`.`year`
    ,`brands`.`id`
    ,`brands`.`name`
    FROM `people`
    INNER JOIN `addresses` ON `people`.`addressId` = `addresses`.`id` AND `addresses`.`main` = 1
    LEFT OUTER JOIN `cities` ON `addresses`.`cityId` = `cities`.`id`
    LEFT OUTER JOIN `states` ON `cities`.`stateId` = `states`.`id`
    INNER JOIN `cars` ON `people`.`carId` = `cars`.`id`
    LEFT OUTER JOIN `brands` ON `cars`.`brandId` = `brands`.`id`
    WHERE `people`.`firstName` = `Juan`;
*/

/////////////////////// IMPORTS

import { Sequelize, DataTypes } from 'sequelize';

/////////////////////// INSTANTIATE SEQUELIZE

const sequelize = new Sequelize('sqlite::memory:');

/////////////////////// MODELS

const people = sequelize.define('people', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
}, { timestamps: false });
const addresses = sequelize.define('addresses', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    street: DataTypes.STRING,
    number: DataTypes.INTEGER,
    main: DataTypes.INTEGER
}, { timestamps: false });
const cities = sequelize.define('cities', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: DataTypes.STRING
}, { timestamps: false });
const states = sequelize.define('states', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: DataTypes.STRING
}, { timestamps: false });
const cars = sequelize.define('cars', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    model: DataTypes.STRING,
    year: DataTypes.INTEGER
}, { timestamps: false });
const brands = sequelize.define('brands', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: DataTypes.STRING,
}, { timestamps: false });

/////////////////////// MODELS RELATIONS

people.belongsTo(addresses, { foreignKey: { allowNull: true } });
people.belongsTo(cars, { foreignKey: { allowNull: true } });
addresses.belongsTo(cities, { foreignKey: { allowNull: true } });
cities.belongsTo(states, { foreignKey: { allowNull: true } });
cars.belongsTo(brands, { foreignKey: { allowNull: true } });

/////////////////////// MODELS SYNCS

await people.sync();
await addresses.sync();
await cities.sync();
await states.sync();
await cars.sync();
await brands.sync();

/////////////////////// SEQUELIZE QUERY

let sequelize_query = await sequelize.model("people").findAll({
    attributes: [
        "id",
        "firstName",
        "lastName"
    ],
    where: {
        firstName: 'Juan'
    },
    include: [
        {
            model: addresses,
            required: true,
            where: {
                main: 1
            },
            attributes: [
                "id",
                "street",
                "number"
            ],
            include: {
                model: cities,
                required: false,
                attributes: [
                    "id",
                    "name"
                ],
                include: {
                    model: states,
                    required: false,
                    attributes: [
                        "id",
                        "name"
                    ],
                }
            }
        },
        {
            model: cars,
            required: true,
            attributes: [
                "id",
                "model",
                "year"
            ],
            include: {
                model: brands,
                required: false,
            }
        }
    ]
});

/////////////////////// RESULTS

console.log("query: ", JSON.stringify(sequelize_query));

