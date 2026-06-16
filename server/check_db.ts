import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const productsCount = await prisma.produto.count()
  const categoriesCount = await prisma.categoria.count()
  console.log(`Products: ${productsCount}`)
  console.log(`Categories: ${categoriesCount}`)
  
  if (productsCount > 0) {
    const firstProduct = await prisma.produto.findFirst()
    console.log('Sample Product:', firstProduct)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
