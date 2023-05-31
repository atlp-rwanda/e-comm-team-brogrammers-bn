/** @type {import('sequelize-cli').Migration} */

export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', [
      {
        title: 'Consumer products',
        description: "A consumer product is a finished product available for sale to a customer. There's a wide range of consumer products, and in marketing, they're typically divided into different types.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Industrial products',
        description: 'Businesses usually purchase an industrial product to make other products or to help them with running their business. An item that would be a consumer product if a customer bought it, such as cleaning supplies, may become an industrial product if a business buys it.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Service products',
        description: 'Service products are business offerings that are either a pure service or a core service. A pure service is a service without a tangible result, such as education, while a core service has a tangible result, like cleaning services. Some product categorizations place service products under industry products, but they can be their own type of product because many are available to consumers directly.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
