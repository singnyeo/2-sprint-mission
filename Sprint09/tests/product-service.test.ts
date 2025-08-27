import { ProductService } from "../src/service/product-service";
import prisma from "../src/lib/prisma";

jest.mock("../src/lib/prisma", () => ({
  product: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
}));

const service = new ProductService();

describe("Product유닛 테스트", () => {
  it("createProduct 호출 시 prisma.product.create 호출", async () => {
    (prisma.product.create as jest.Mock).mockResolvedValue({ id: 1, name: "상품" });
    const result = await service.createProduct(1, { name: "상품", description: "테스트", price: 1000 });
    expect(prisma.product.create).toHaveBeenCalled();
    expect(result).toHaveProperty("id", 1);
  });

  it("updateProduct 호출 시 prisma.product.update 호출", async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 1, name: "상품" });
    (prisma.product.update as jest.Mock).mockResolvedValue({ id: 1, name: "수정 상품" });

    const result = await service.updateProduct(1, 1, { name: "수정 상품" });
    expect(prisma.product.update).toHaveBeenCalled();
    expect(result).toHaveProperty("name", "수정 상품");
  });
});