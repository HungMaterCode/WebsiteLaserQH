const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Đang dọn dẹp dữ liệu Media ---');
  
  const settings = await prisma.mediaSetting.findUnique({
    where: { id: 'global' },
  });

  if (settings && settings.data) {
    const newData = { ...settings.data };
    delete newData.heroVideoUrl;
    delete newData.heroVideoEnabled;

    await prisma.mediaSetting.update({
      where: { id: 'global' },
      data: { data: newData },
    });
    
    console.log('✅ Đã xóa các trường video khỏi database.');
  } else {
    console.log('ℹ️ Không tìm thấy dữ liệu Media để dọn dẹp.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Lỗi dọn dẹp:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
