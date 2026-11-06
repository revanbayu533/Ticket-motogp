import { PrismaClient, Role, EventStatus, OrderStatus, TicketStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🏁 Starting MotoTix database seeding...');

  // 1. Clean or upsert users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('MotoTix2026!', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mototix.com' },
    update: {},
    create: {
      email: 'admin@mototix.com',
      password: passwordHash,
      name: 'MotoTix Super Administrator',
      phone: '+6281199887700',
      role: Role.ADMIN,
    },
  });

  const customerBastian = await prisma.user.upsert({
    where: { email: 'bastian@mototix.com' },
    update: {},
    create: {
      email: 'bastian@mototix.com',
      password: passwordHash,
      name: 'Bastian Ramadhan',
      phone: '+6281234567890',
      role: Role.CUSTOMER,
    },
  });

  const customerFan = await prisma.user.upsert({
    where: { email: 'bagnaia.fan@mototix.com' },
    update: {},
    create: {
      email: 'bagnaia.fan@mototix.com',
      password: passwordHash,
      name: 'Ducati Lenovo Fan Indonesia',
      phone: '+6281356789012',
      role: Role.CUSTOMER,
    },
  });

  console.log(`✅ Users seeded: ${admin.email}, ${customerBastian.email}, ${customerFan.email}`);

  // 2. Seed MotoGP Mandalika Event
  let mandalikaEvent = await prisma.event.findFirst({
    where: { title: { contains: 'Pertamina Grand Prix of Indonesia' } },
  });

  if (!mandalikaEvent) {
    mandalikaEvent = await prisma.event.create({
      data: {
        title: 'Pertamina Grand Prix of Indonesia 2026',
        description: 'Seri resmi Kejuaraan Dunia Balap Motor MotoGP di Sirkuit Internasional Pertamina Mandalika, Lombok. Saksikan duel sengit para pembalap kelas dunia di sirkuit tepi pantai paling eksotis!',
        location: 'Kuta, Pujut, Kabupaten Lombok Tengah, Nusa Tenggara Barat',
        venue: 'Pertamina Mandalika International Street Circuit',
        eventDate: new Date('2026-10-18T07:00:00.000Z'),
        bannerUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80',
        status: EventStatus.PUBLISHED,
      },
    });
  }

  console.log(`✅ Event ready: ${mandalikaEvent.title} (ID: ${mandalikaEvent.id})`);

  // 3. Seed Zones with Official Mandalika Injourney Categories
  const zonesData = [
    {
      name: 'Premium Grandstand - Zona A',
      capacity: 2500,
      price: 2500000,
      description:
        'Berada di lintasan lurus utama, menghadap garis start/finish dan gedung pit. Cocok untuk melihat momen pelepasan dan aksi pengereman ke Tikungan 1.',
    },
    {
      name: 'Premium Grandstand - Zona B',
      capacity: 2200,
      price: 2300000,
      description:
        'Menghadap langsung ke Tikungan 1, titik favorit melihat pembalap melakukan pengereman keras.',
    },
    {
      name: 'Premium Grandstand - Zona C',
      capacity: 2000,
      price: 2000000,
      description: 'Terletak di area strategis tikungan awal.',
    },
    {
      name: 'Premium Grandstand - Zona J',
      capacity: 2500,
      price: 2000000,
      description:
        'Menghadap ke Tikungan 15 dan jalur menuju tikungan kedua dari terakhir.',
    },
    {
      name: 'Premium Grandstand - Zona K',
      capacity: 2500,
      price: 2000000,
      description:
        'Menghadap ke tikungan terakhir (Tikungan 16) menuju lintasan lurus garis akhir perlombaan.',
    },
    {
      name: 'Regular Grandstand - Zona D & E',
      capacity: 3500,
      price: 1500000,
      description:
        'Terletak di sekitar area tikungan tengah (antara Tikungan 6 dan 7).',
    },
    {
      name: 'Regular Grandstand - Zona G',
      capacity: 3000,
      price: 1250000,
      description:
        'Berada di ujung lintasan lurus antara Tikungan 12 dan 13.',
    },
    {
      name: 'Regular Grandstand - Zona H & I',
      capacity: 3000,
      price: 1250000,
      description:
        'Menghadap rangkaian tikungan teknikal sebelum sektor akhir sirkuit.',
    },
    {
      name: 'General Admission (GA)',
      capacity: 10000,
      price: 650000,
      description:
        'Area berdiri atau tanpa nomor kursi tetap yang memberikan keleluasaan bergerak bagi penonton di sekitar area sirkuit.',
    },
    {
      name: 'VIP Hospitality Village Deluxe Class',
      capacity: 350,
      price: 15000000,
      description:
        'Suite ber-AC mewah dengan pemandangan langsung pit lane, akses Pit Walk eksklusif, gourmet buffet 3-course & open bar premium.',
    },
  ];

  const createdZones = [];
  for (const z of zonesData) {
    let zone = await prisma.zone.findFirst({
      where: {
        eventId: mandalikaEvent.id,
        name: z.name,
      },
    });

    if (!zone) {
      zone = await prisma.zone.create({
        data: {
          eventId: mandalikaEvent.id,
          name: z.name,
          capacity: z.capacity,
          price: z.price,
          description: z.description,
        },
      });
    } else {
      zone = await prisma.zone.update({
        where: { id: zone.id },
        data: {
          capacity: z.capacity,
          price: z.price,
          description: z.description,
        },
      });
    }
    createdZones.push(zone);
  }

  console.log(`✅ ${createdZones.length} Circuit Zones ready for Mandalika Event.`);

  // 4. Seed Example Order, Ticket, and Payment
  const vipZone = createdZones[0];
  const grandstandZone = createdZones[1];

  // Order 1: Paid VIP
  const bookingCode1 = 'MTX-2026-MDK-001';
  let order1 = await prisma.order.findUnique({
    where: { bookingCode: bookingCode1 },
  });

  if (!order1) {
    order1 = await prisma.order.create({
      data: {
        bookingCode: bookingCode1,
        userId: customerBastian.id,
        totalAmount: vipZone.price,
        status: OrderStatus.PAID,
      },
    });

    // Create Ticket for Order 1
    await prisma.ticket.upsert({
      where: { ticketNumber: 'TKT-VIP-MDK-001' },
      update: {},
      create: {
        ticketNumber: 'TKT-VIP-MDK-001',
        orderId: order1.id,
        zoneId: vipZone.id,
        holderName: 'Bastian Ramadhan',
        holderEmail: customerBastian.email,
        status: TicketStatus.ACTIVE,
      },
    });

    // Create Payment for Order 1
    await prisma.payment.upsert({
      where: { orderId: order1.id },
      update: {},
      create: {
        orderId: order1.id,
        amount: vipZone.price,
        paymentMethod: 'BCA Virtual Account / QRIS',
        paymentStatus: PaymentStatus.SUCCESS,
        transactionId: 'TX-MDK-2026-99101',
        paidAt: new Date(),
      },
    });

    console.log(`✅ Sample Order 1 (PAID) created with booking code: ${bookingCode1}`);
  }

  // Order 2: Pending Grandstand
  const bookingCode2 = 'MTX-2026-MDK-002';
  let order2 = await prisma.order.findUnique({
    where: { bookingCode: bookingCode2 },
  });

  if (!order2) {
    order2 = await prisma.order.create({
      data: {
        bookingCode: bookingCode2,
        userId: customerFan.id,
        totalAmount: grandstandZone.price,
        status: OrderStatus.PENDING,
      },
    });

    // Create Ticket for Order 2
    await prisma.ticket.upsert({
      where: { ticketNumber: 'TKT-GS-MDK-002' },
      update: {},
      create: {
        ticketNumber: 'TKT-GS-MDK-002',
        orderId: order2.id,
        zoneId: grandstandZone.id,
        holderName: 'Ducati Lenovo Fan Indonesia',
        holderEmail: customerFan.email,
        status: TicketStatus.ACTIVE,
      },
    });

    // Create Payment for Order 2
    await prisma.payment.upsert({
      where: { orderId: order2.id },
      update: {},
      create: {
        orderId: order2.id,
        amount: grandstandZone.price,
        paymentMethod: 'Mandiri Virtual Account',
        paymentStatus: PaymentStatus.PENDING,
        transactionId: 'TX-MDK-2026-99102',
      },
    });

    console.log(`✅ Sample Order 2 (PENDING) created with booking code: ${bookingCode2}`);
  }

  console.log('🏆 MotoTix database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
