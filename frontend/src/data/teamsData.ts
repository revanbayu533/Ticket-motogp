/**
 * Official Team Details & Dossier Data
 * Provides comprehensive technical, operational, and historical information for all teams.
 */

export interface TeamDetail {
  name: string;
  category: 'MotoGP' | 'Moto2' | 'Moto3';
  type: string;
  bike: string;
  engine: string;
  base: string;
  principal: string;
  color: string;
  description: string;
  mandalikaSpot: string;
}

export const TEAMS_DATA: Record<string, Omit<TeamDetail, 'name'>> = {
  "Ducati Lenovo Team": {
    "category": "MotoGP",
    "type": "Tim Pabrikan Resmi (Factory)",
    "bike": "Ducati Desmosedici GP26",
    "engine": "1.000cc 90° V4 Desmodromic (300+ HP)",
    "base": "Borgo Panigale, Bologna, Italia",
    "principal": "Davide Tardozzi / Luigi Dall’Igna",
    "color": "#CC0000",
    "description": "Tim pabrikan paling dominan dalam era modern MotoGP. Dipimpin maestro aerodinamika Gigi Dall’Igna, Ducati Lenovo Team menurunkan duet impian Juara Dunia: Francesco Bagnaia (#63) dan Marc Marquez (#93) dengan senjata Desmosedici GP26.",
    "mandalikaSpot": "Grandstand A (Main Straight) — Tepat di depan garasi pitbox merah Ducati untuk melihat start roket dan selebrasi podium."
  },
  "Aprilia Racing": {
    "category": "MotoGP",
    "type": "Tim Pabrikan Resmi (Factory)",
    "bike": "Aprilia RS-GP26",
    "engine": "1.000cc 90° V4 (300+ HP)",
    "base": "Noale, Venezia, Italia",
    "principal": "Massimo Rivola / Romano Albesiano",
    "color": "#1a1a1a",
    "description": "Pabrikan Noale yang terkenal dengan terobosan inovasi sayap aerodinamika dan sasis lincah. Diperkuat Juara Dunia MotoGP 2024 Jorge Martin (#89) bersama rider agresif Marco Bezzecchi (#72).",
    "mandalikaSpot": "Grandstand B (Turn 1) & Grandstand C — Menyaksikan pengereman ekstrem dari kecepatan 330 km/jam menuju tikungan tajam pertama Mandalika."
  },
  "Pertamina Enduro VR46 Racing Team": {
    "category": "MotoGP",
    "type": "Tim Independen (Ducati Factory Supported)",
    "bike": "Ducati Desmosedici GP26 / GP25",
    "engine": "1.000cc 90° V4 Desmodromic (300+ HP)",
    "base": "Tavullia, Pesaro e Urbino, Italia",
    "principal": "Pablo Nieto (Binaan Valentino Rossi)",
    "color": "#e6ff00",
    "description": "Tim balap binaan legenda MotoGP Valentino Rossi yang berkolaborasi dengan sponsor utama kebanggaan tanah air, Pertamina Lubricants. Diperkuat Franco Morbidelli (#21) dan Fabio Di Giannantonio (#49), tim ini memiliki basis penggemar terbesar dan paling meriah di Mandalika.",
    "mandalikaSpot": "Grandstand J (VR46 Yellow Fan Zone) — Pusat lautan suporter kuning neon VR46 dan Pertamina Enduro tepat di Tikungan 15 & 16."
  },
  "Red Bull KTM Factory Racing": {
    "category": "MotoGP",
    "type": "Tim Pabrikan Resmi (Factory)",
    "bike": "KTM RC16 Factory",
    "engine": "1.000cc 90° V4 (300+ HP)",
    "base": "Mattighofen, Austria",
    "principal": "Francesco Guidotti / Pit Beirer",
    "color": "#ff6600",
    "description": "Pabrikan raksasa asal Austria dengan DNA balap 'Ready to Race'. Menggunakan sasis baja tubular unik dan suspensi WP, dikendarai oleh petarung tanpa kompromi Brad Binder (#33) dan sensasi muda Spanyol Pedro Acosta (#37).",
    "mandalikaSpot": "Grandstand C & D (Chicane Tikungan 3-4) — Titik manuver overtaking agresif khas pembalap KTM saat keluar masuk tikungan zig-zag."
  },
  "BK8 Gresini Racing MotoGP": {
    "category": "MotoGP",
    "type": "Tim Independen (Ducati Partner)",
    "bike": "Ducati Desmosedici",
    "engine": "1.000cc 90° V4 Desmodromic (300+ HP)",
    "base": "Faenza, Ravenna, Italia",
    "principal": "Nadia Padovani / Michele Masini",
    "color": "#90a4ae",
    "description": "Tim independen legendaris peninggalan mendiang Fausto Gresini yang kini dipimpin sang istri Nadia Padovani. Dikenal dengan atmosfer kekeluargaan dan performa juara, menurunkan duet Alex Marquez (#73) dan bintang muda Fermin Aldeguer (#54).",
    "mandalikaSpot": "Grandstand I (Gresini Sky Blue Fan Zone) — Tribun dengan latar belakang pemandangan bukit dan laut Mandalika yang memesona."
  },
  "Monster Energy Yamaha MotoGP": {
    "category": "MotoGP",
    "type": "Tim Pabrikan Resmi (Factory)",
    "bike": "Yamaha YZR-M1 Factory",
    "engine": "1.000cc 4-Silinder Segaris Crossplane (290+ HP)",
    "base": "Lesmo, Monza Brianza, Italia",
    "principal": "Lin Jarvis / Massimo Meregalli",
    "color": "#001489",
    "description": "Skuad pabrikan resmi Yamaha dengan sejarah panjang juara dunia. Mengandalkan Juara Dunia 2021 Fabio Quartararo (#20) dan Alex Rins (#42) yang piawai memanfaatkan kelincahan sasis di tikungan teknikal.",
    "mandalikaSpot": "Grandstand B & Grandstand K — Sudut pandang sempurna mengamati akselerasi dan pengereman halus khas motor YZR-M1."
  },
  "Prima Pramac Yamaha MotoGP": {
    "category": "MotoGP",
    "type": "Tim Satelit Didukung Penuh Pabrikan",
    "bike": "Yamaha YZR-M1 Factory Spec 2026",
    "engine": "1.000cc 4-Silinder Segaris Crossplane (290+ HP)",
    "base": "Campi Bisenzio, Florence, Italia",
    "principal": "Gino Borsoi / Paolo Campinoti",
    "color": "#5b2b82",
    "description": "Kemitraan baru bersejarah antara Pramac Racing dan pabrikan Yamaha. Menghadirkan rookie fenomenal Juara Dunia WorldSBK Toprak Razgatlioglu (#7) berduet dengan pembalap senior Australia Jack Miller (#43).",
    "mandalikaSpot": "Grandstand D & E — Area tikungan beruntun mengalir tempat motor Yamaha YZR-M1 memaksimalkan kecepatan rebah (cornering speed)."
  },
  "Red Bull KTM Tech3": {
    "category": "Moto3",
    "type": "Tim Junior KTM Factory",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Bormes-les-Mimosas, Prancis",
    "principal": "Hervé Poncharal",
    "color": "#ff6600",
    "description": "Divisi Moto3 dari skuad Tech3 yang dipimpin Hervé Poncharal. Diperkuat pembalap muda potensial Rico Salmela (#27) dan Valentin Perrone (#73).",
    "mandalikaSpot": "Grandstand B & C — Akselerasi dan manuver cepat tikungan awal."
  },
  "SuperFile Trackhouse MotoGP Team": {
    "category": "MotoGP",
    "type": "Tim Independen (Aprilia Official Partner)",
    "bike": "Aprilia RS-GP",
    "engine": "1.000cc 90° V4 (300+ HP)",
    "base": "Concord, North Carolina, Amerika Serikat",
    "principal": "Davide Brivio / Justin Marks",
    "color": "#1a237e",
    "description": "Ekspansi balap asal Amerika Serikat yang membawa warna baru ke MotoGP. Dipimpin oleh manajer kawakan juara dunia Davide Brivio, tim ini mengandalkan Raul Fernandez (#25) dan bintang muda Jepang Ai Ogura (#79).",
    "mandalikaSpot": "Grandstand G & H — Area tribun terbuka strategis memantau tikungan cepat sektor tengah Sirkuit Mandalika."
  },
  "Honda HRC Castrol": {
    "category": "MotoGP",
    "type": "Tim Pabrikan Resmi (Factory)",
    "bike": "Honda RC213V Factory 2026",
    "engine": "1.000cc 90° V4 (295+ HP)",
    "base": "Asaka, Saitama, Jepang",
    "principal": "Alberto Puig",
    "color": "#ff1744",
    "description": "Tim pabrikan raksasa tersukses sepanjang sejarah Grand Prix roda dua. Mengusung motor Honda RC213V dengan pembaruan sasis total, diawaki oleh Juara Dunia 2020 Joan Mir (#36) dan pembalap analitis Luca Marini (#10).",
    "mandalikaSpot": "Grandstand A (Main Straight) & Paddock VIP Deluxe — Akses pandang lurus menuju paddock Honda HRC."
  },
  "LCR Honda MotoGP": {
    "category": "MotoGP",
    "type": "Tim Independen Resmi Honda",
    "bike": "Honda RC213V Spec 2026",
    "engine": "1.000cc 90° V4 (295+ HP)",
    "base": "Monte Carlo, Monako",
    "principal": "Lucio Cecchinello",
    "color": "#00843D",
    "description": "Tim independen legendaris binaan Lucio Cecchinello yang telah berkompetisi di kelas premier selama puluhan tahun. Memiliki dua divisi livery: CASTROL Honda LCR untuk pembalap senior Johann Zarco (#5) dan Pro Honda LCR untuk rookie Diogo Moreira (#11).",
    "mandalikaSpot": "Grandstand B & C — Pengereman agresif dan tikungan tajam sektor pertama Sirkuit Mandalika."
  },
  "CASTROL Honda LCR": {
    "category": "MotoGP",
    "type": "Tim Independen (Honda Factory Partner)",
    "bike": "Honda RC213V Spec",
    "engine": "1.000cc 90° V4 (295+ HP)",
    "base": "Monte Carlo, Monako",
    "principal": "Lucio Cecchinello",
    "color": "#00843D",
    "description": "Divisi livery hijau-merah Castrol dari tim LCR Honda yang dikendarai oleh pembalap berpengalaman asal Prancis Johann Zarco (#5).",
    "mandalikaSpot": "Grandstand B — Tikungan pengereman berat tempat Johann Zarco kerap melakukan manuver late-braking tajam."
  },
  "Pro Honda LCR": {
    "category": "MotoGP",
    "type": "Tim Independen (Honda Development)",
    "bike": "Honda RC213V Spec",
    "engine": "1.000cc 90° V4 (295+ HP)",
    "base": "Monte Carlo, Monako",
    "principal": "Lucio Cecchinello",
    "color": "#1976d2",
    "description": "Divisi livery biru Pro Honda dari tim LCR yang menjadi tempat bagi bintang muda debutan asal Brasil Diogo Moreira (#11) membuktikan bakatnya di MotoGP.",
    "mandalikaSpot": "Grandstand C — Melihat langsung aksi kontrol traksi dan akselerasi pembalap debutan di tikungan teknis."
  },
  "CFMOTO Power Electronics Aspar Team": {
    "category": "Moto2",
    "type": "Tim Juara Dunia Aspar",
    "bike": "Kalex Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Valencia, Spanyol",
    "principal": "Jorge Martinez 'Aspar'",
    "color": "#00838f",
    "description": "Tim binaan legenda balap Jorge Martinez Aspar yang mengorbitkan Juara Dunia Moto3 David Alonso (#80) berduet bersama penantang gelar Daniel Holgado (#96).",
    "mandalikaSpot": "Grandstand A & B — Menyaksikan kecepatan tinggi David Alonso naik ke kelas Moto2."
  },
  "Red Bull KTM Ajo": {
    "category": "Moto3",
    "type": "Akademi Juara Dunia KTM",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Lempäälä, Finlandia / Spanyol",
    "principal": "Aki Ajo",
    "color": "#ff6600",
    "description": "Standar emas tim pembinaan pembalap muda di dunia. Menurunkan dua jawara Red Bull Rookies Cup: Brian Uriarte (#51) dan Alvaro Carpe (#83).",
    "mandalikaSpot": "Grandstand C & D — Menyaksikan duel gesit tikungan zig-zag Mandalika."
  },
  "Idemitsu Honda Team Asia": {
    "category": "Moto2",
    "type": "Tim Pengembangan Talenta Asia",
    "bike": "Kalex Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Jepang & Spanyol",
    "principal": "Hiroshi Aoyama",
    "color": "#b71c1c",
    "description": "Kawah candradimuka terbaik bagi pembalap roda dua asal Asia. Menjadi tim kebanggaan masyarakat Indonesia karena menaungi pembalap tanah air Mario Suryo Aji (#64) bersama rekan setimnya asal Jepang Taiyo Furusato (#72).",
    "mandalikaSpot": "Grandstand A & J — Tempat berkumpulnya para pendukung Merah Putih untuk menyemangati aksi Mario Aji."
  },
  "ITALJET Gresini Moto2": {
    "category": "Moto2",
    "type": "Tim Balap Moto2 Papan Atas",
    "bike": "Kalex Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Faenza, Italia",
    "principal": "Luca Gresini",
    "color": "#90a4ae",
    "description": "Skuad penantang gelar juara dunia Moto2 dengan kombinasi talenta Spanyol yang sangat konsisten di barisan depan: Sergio Garcia (#3) dan Alonso Lopez (#21).",
    "mandalikaSpot": "Grandstand B & C — Sudut pandang terbaik menyaksikan aksi pengereman agresif Sergio Garcia."
  },
  "ELF Marc VDS Racing Team": {
    "category": "Moto2",
    "type": "Tim Juara Dunia Moto2 Multi-Title",
    "bike": "Boscoscuro Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Gosselies, Belgia",
    "principal": "Marc van der Straten / Marina Rossi",
    "color": "#0d47a1",
    "description": "Salah satu tim paling berprestasi dalam sejarah Moto2 dengan beberapa titel juara dunia. Diperkuat rider berpengalaman Aron Canet (#44) dan pembalap agresif Deniz Öncü (#53).",
    "mandalikaSpot": "Grandstand B & D — Pengereman keras dan manuver late apex di sektor pembuka Mandalika."
  },
  "QJMOTOR - JP Financial - MSI": {
    "category": "Moto2",
    "type": "Tim Balap Moto2 Boscoscuro",
    "bike": "Boscoscuro Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Madrid, Spanyol",
    "principal": "Jordi Gatell",
    "color": "#0d47a1",
    "description": "Tim papan atas dengan torehan kemenangan Grand Prix terbanyak di kelas intermediate, mengandalkan bintang Ivan Ortola (#4) dan Angel Piqueras (#36).",
    "mandalikaSpot": "Grandstand B & K — Menyaksikan aksi duel lap terakhir Ivan Ortola."
  },
  "Liqui Moly Dynavolt Intact GP": {
    "category": "Moto3",
    "type": "Tim Jerman Moto3",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Memmingen, Jerman",
    "principal": "Peter Öttl",
    "color": "#00529b",
    "description": "Skuad asal Jerman binaan mantan pembalap Peter Öttl. Mengandalkan duet pembalap Spanyol bertalenta agresif David Almansa (#22) dan David Muñoz (#64).",
    "mandalikaSpot": "Grandstand D & E — Sektor teknis menguji presisi pengendalian motor."
  },
  "REDS Fantic Racing": {
    "category": "Moto2",
    "type": "Tim Balap Sasis Boscoscuro",
    "bike": "Boscoscuro Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Dossobuono, Verona, Italia",
    "principal": "Roberto Locatelli",
    "color": "#212121",
    "description": "Tim pabrikan Fantic dengan paket sasis Boscoscuro yang sangat tajam di tikungan lambat, diperkuat duet Barry Baltus (#7) dan Jorge Navarro (#9).",
    "mandalikaSpot": "Grandstand D — Menikmati kelincahan sasis Boscoscuro di sektor teknis Mandalika."
  },
  "BLU CRU Pramac Yamaha Moto2": {
    "category": "Moto2",
    "type": "Tim Pembibitan Resmi Yamaha",
    "bike": "Boscoscuro Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Campi Bisenzio, Italia",
    "principal": "Paolo Campinoti / Gino Borsoi",
    "color": "#002080",
    "description": "Program pembibitan masa depan pabrikan Yamaha di Moto2. Menurunkan Juara Dunia Moto3 2022 Izan Guevara (#28) dan talenta Spanyol Alberto Ferrandez (#54).",
    "mandalikaSpot": "Grandstand C & E — Memantau kecepatan rolling sasis di tikungan beruntun."
  },
  "OnlyFans American Racing Team": {
    "category": "Moto2",
    "type": "Tim Moto2 Asal California",
    "bike": "Kalex Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Los Angeles, California, AS",
    "principal": "Eitan Butbul / John Hopkins",
    "color": "#00a0dc",
    "description": "Tim balap dengan karakter atraktif asal Amerika Serikat yang dibimbing mantan rider MotoGP John Hopkins. Menampilkan pembalap top AS Joe Roberts (#16) dan Filip Salac (#12).",
    "mandalikaSpot": "Grandstand G & H — Spot tribun favorit penggemar gaya balap agresif Amerika."
  },
  "SpeedRS Team": {
    "category": "Moto2",
    "type": "Tim Pabrikan Sasis Boscoscuro",
    "bike": "Boscoscuro B-26",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Lugo di Vicenza, Italia",
    "principal": "Luca Boscoscuro",
    "color": "#f58220",
    "description": "Tim utama dari pencipta sasis Boscoscuro yang merevolusi persaingan Moto2. Menggabungkan livery BETA Tools untuk Celestino Vietti (#13) dan livery HDR untuk Dennis Foggia (#8).",
    "mandalikaSpot": "Grandstand B — Tikungan 1 dan 2 tempat sasis Boscoscuro memperlihatkan keunggulan pengereman."
  },
  "BETA Tools SpeedRS Team": {
    "category": "Moto2",
    "type": "Tim Pabrikan Sasis Boscoscuro",
    "bike": "Boscoscuro B-26",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Lugo di Vicenza, Italia",
    "principal": "Luca Boscoscuro",
    "color": "#f58220",
    "description": "Divisi livery Beta Tools dari tim SpeedRS dengan pembalap bertalenta Italia Celestino Vietti (#13).",
    "mandalikaSpot": "Grandstand B — Tikungan 1 Mandalika."
  },
  "HDR SpeedRS Team": {
    "category": "Moto2",
    "type": "Tim Pabrikan Sasis Boscoscuro",
    "bike": "Boscoscuro B-26",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Lugo di Vicenza, Italia",
    "principal": "Luca Boscoscuro",
    "color": "#e65100",
    "description": "Divisi livery HDR dari tim SpeedRS yang dikendarai oleh pemenang balapan Dennis Foggia (#8).",
    "mandalikaSpot": "Grandstand B — Tikungan 1 Mandalika."
  },
  "KLINT Racing Team": {
    "category": "Moto2",
    "type": "Tim Moto2 Forward Forward Sasis",
    "bike": "Forward / Kalex Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Agno, Ticino, Swiss",
    "principal": "Giovanni Cuzari",
    "color": "#263238",
    "description": "Tim independen Swiss yang memiliki sejarah panjang di ajang Grand Prix. Mengandalkan duet pembalap Spanyol Alex Escrig (#11) dan Marcos Ramirez (#24).",
    "mandalikaSpot": "Grandstand D & E — Sektor teknis dengan pemandangan perbukitan Mandalika."
  },
  "Italtrans Racing Team": {
    "category": "Moto2",
    "type": "Tim Juara Dunia Moto2 Asal Italia",
    "bike": "Kalex Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Bergamo, Italia",
    "principal": "Laura Bertulessi / Roberto Brivio",
    "color": "#004d40",
    "description": "Tim yang melahirkan Juara Dunia Enea Bastianini. Musim ini menurunkan pembalap muda Spanyol Daniel Muñoz (#17) dan Juara Dunia WorldSSP Adrian Huertas (#99).",
    "mandalikaSpot": "Grandstand C — Melihat langsung transisi adaptasi Adrian Huertas di atas motor Moto2."
  },
  "Momoven Idrofoglia RW Racing Team": {
    "category": "Moto2",
    "type": "Tim Moto2 Asal Belanda",
    "bike": "Kalex Moto2",
    "engine": "Triumph 765cc 3-Silinder Identik (~140+ HP)",
    "base": "Dwingeloo, Belanda",
    "principal": "Jarno Janssen",
    "color": "#00acc1",
    "description": "Satu-satunya tim Grand Prix asal Belanda dengan kemitraan teknis solid. Diperkuat runner-up Moto3 Ayumu Sasaki (#71) dan rider jangkung Belanda Zonta Van Den Goorbergh (#84).",
    "mandalikaSpot": "Grandstand K — Titik akselerasi keluar tikungan terakhir menuju trek lurus."
  },
  "Honda Team Asia": {
    "category": "Moto3",
    "type": "Tim Pembinaan Talenta Muda Asia",
    "bike": "Honda NSF250RW",
    "engine": "250cc 1-Silinder 4-Tak DOHC (~60+ HP)",
    "base": "Jepang & Spanyol",
    "principal": "Hiroshi Aoyama",
    "color": "#c62828",
    "description": "Pusat perhatian publik Tanah Air di kelas ringan. Tim resmi yang mengantarkan bintang muda asal Indonesia Veda Ega Pratama (#9) melakoni debut pertamanya di Kejuaraan Dunia Grand Prix bersama rekan setimnya Zen Mitani (#32).",
    "mandalikaSpot": "Grandstand A & J (Tribun Indonesia) — Titik kumpul wajib para penggemar untuk memberikan gemuruh sorak dukungan langsung kepada Veda Ega Pratama."
  },
  "Leopard Racing": {
    "category": "Moto3",
    "type": "Tim Juara Dunia Moto3 Honda",
    "bike": "Honda NSF250RW",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Luksemburg & Italia",
    "principal": "Miodrag Kotur / Christian Lundberg",
    "color": "#00e5ff",
    "description": "Tim bercorak toska ikonik yang telah mengoleksi banyak mahkota juara dunia Moto3. Mengandalkan Adrian Fernandez (#31) dan Guido Pini (#94).",
    "mandalikaSpot": "Grandstand K — Titik duel slipstream menegangkan lap pemungkas kelas Moto3."
  },
  "CFMOTO Gaviota Aspar Team": {
    "category": "Moto3",
    "type": "Tim Juara Dunia Moto3 2026",
    "bike": "KTM / CFMOTO 250 GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Valencia, Spanyol",
    "principal": "Jorge Martinez \"Aspar\"",
    "color": "#00838f",
    "description": "Tim peraih gelar Juara Dunia Moto3 2026 bersama bintang muda sensasional Máximo Quiles (#28) yang berhasil mengunci gelar juara dunia di Sirkuit Mandalika, berpasangan dengan Marco Morelli (#97).",
    "mandalikaSpot": "Grandstand A & B — Panggung selebrasi podium juara dunia Máximo Quiles di depan ribuan penonton Sirkuit Mandalika."
  },
  "AEON Credit - MT Helmets - MSI": {
    "category": "Moto3",
    "type": "Tim Papan Atas Moto3",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Madrid, Spanyol",
    "principal": "Teo Martin",
    "color": "#d50000",
    "description": "Tim penantang gelar juara dunia dengan duet pembalap Asia berbakat tinggi: Ryusei Yamanaka (#6) dari Jepang dan bintang muda Malaysia Hakim Danish (#13).",
    "mandalikaSpot": "Grandstand A & B — Menyaksikan aksi bintang Asia bersaing di barisan depan."
  },
  "SIC58 Squadra Corse": {
    "category": "Moto3",
    "type": "Tim Penghormatan Marco Simoncelli",
    "bike": "Honda NSF250RW",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Coriano, Rimini, Italia",
    "principal": "Paolo Simoncelli",
    "color": "#e53935",
    "description": "Tim yang didirikan oleh Paolo Simoncelli untuk meneruskan semangat juang almarhum Marco Simoncelli #58. Menurunkan Leo Rammerstorfer (#5) dan Casey O'Gorman (#67).",
    "mandalikaSpot": "Grandstand K — Melihat duel seru lap terakhir menuju finis garis Simoncelli."
  },
  "LEVELUP - MTA": {
    "category": "Moto3",
    "type": "Tim Moto3 Asal Italia",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Italia",
    "principal": "Alessandro Tonucci",
    "color": "#303f9f",
    "description": "Tim balap Italia binaan Alessandro Tonucci yang konsisten mencetak podium, diperkuat Matteo Bertelle (#18) dan talenta Spanyol Joel Esteban (#78).",
    "mandalikaSpot": "Grandstand C — Tikungan hairpin tempat manuver late-braking sering terjadi."
  },
  "Rivacold Snipers Team": {
    "category": "Moto3",
    "type": "Tim Bersejarah Moto3 Italia",
    "bike": "Honda NSF250RW",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Pesaro, Italia",
    "principal": "Mirko Cecchini",
    "color": "#fbc02d",
    "description": "Salah satu tim independen paling bersejarah di kelas 125cc/Moto3. Menurunkan duet pembalap Nicola Carraro (#10) dan Jesus Rios (#54).",
    "mandalikaSpot": "Grandstand B — Tikungan 1 dengan persaingan ketat rombongan besar Moto3."
  },
  "CIP Green Power": {
    "category": "Moto3",
    "type": "Tim Moto3 Asal Prancis",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Alès, Gard, Prancis",
    "principal": "Alain Bronec",
    "color": "#2e7d32",
    "description": "Tim binaan Alain Bronec yang selalu konsisten mengorbitkan pembalap muda. Diperkuat rider Spanyol Adrian Cruces (#11) dan Scott Ogden (#19) dari Inggris.",
    "mandalikaSpot": "Grandstand D — Menyaksikan manuver cepat di tikungan beruntun."
  },
  "GRYD Racing": {
    "category": "Moto3",
    "type": "Tim Independen Moto3",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Spanyol / Australia",
    "principal": "Manajemen Tim GRYD",
    "color": "#37474f",
    "description": "Tim independen yang diperkuat pembalap bertalenta Inggris Eddie O'Shea (#8) dan petarung tangguh asal Australia Joel Kelso (#66).",
    "mandalikaSpot": "Grandstand C & E — Spot terbaik mengamati gaya balap cepat Joel Kelso."
  },
  "CODE Motorsports": {
    "category": "Moto3",
    "type": "Tim Moto3 Internasional",
    "bike": "KTM RC250GP",
    "engine": "250cc 1-Silinder 4-Tak (~60+ HP)",
    "base": "Eropa & Oseania",
    "principal": "Manajemen Tim CODE",
    "color": "#455a64",
    "description": "Tim penantang baru yang membawa talenta dari belahan bumi selatan: Cormac Buchanan (#14) dari Selandia Baru dan Ruche Moodley (#21) dari Afrika Selatan.",
    "mandalikaSpot": "Grandstand H & I — Area bukit Mandalika dengan panorama balap spektakuler."
  }
};

export function getTeamDetail(
  teamName: string,
  category: 'MotoGP' | 'Moto2' | 'Moto3',
  constructorName?: string,
  season: '2026' | '2027' = '2026'
): TeamDetail {
  const trimmed = teamName.trim();
  const baseTeam = TEAMS_DATA[trimmed] || (() => {
    const keys = Object.keys(TEAMS_DATA);
    const matchedKey = keys.find(k => k.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(trimmed.toLowerCase()));
    return matchedKey ? TEAMS_DATA[matchedKey] : null;
  })();

  if (season === '2027' && category === 'MotoGP') {
    // 2027 850cc Era Specifications
    const desc2027Map: Record<string, { bike: string; engine: string; desc: string }> = {
      'Ducati Lenovo Team': {
        bike: 'Ducati Desmosedici GP27 (850cc)',
        engine: '850cc 90° V4 Desmodromic (275+ HP)',
        desc: 'Era baru 850cc tanpa ride-height device. Ducati Lenovo menurunkan duet impian Spanyol terkuat: Juara Dunia Marc Marquez (#93) dan bintang muda sensasional Pedro Acosta (#37).',
      },
      'Aprilia Racing': {
        bike: 'Aprilia RS-GP27 (850cc)',
        engine: '850cc 90° V4 (275+ HP)',
        desc: 'Mega transfer bersejarah musim 2027! Juara Dunia 2x Francesco "Pecco" Bagnaia (#63) bergabung dengan pabrikan Noale Aprilia, berduet dengan kompatriot Italia Marco Bezzecchi (#72).',
      },
      'Monster Energy Yamaha MotoGP': {
        bike: 'Yamaha YZR-M1 850cc 2027',
        engine: '850cc 4-Silinder Segaris Crossplane (270+ HP)',
        desc: 'Babak baru kebangkitan Yamaha dengan regulasi 850cc. Menggaet Juara Dunia MotoGP Jorge Martin (#89) berduet dengan bintang muda Jepang Ai Ogura (#79).',
      },
      'Honda HRC Castrol': {
        bike: 'Honda RC213V 850cc Factory',
        engine: '850cc 90° V4 (275+ HP)',
        desc: 'Transformasi total Honda di era 850cc dipimpin Juara Dunia Fabio Quartararo (#20) berduet bersama talenta muda Diogo Moreira (#11).',
      },
      'Red Bull KTM Factory Racing': {
        bike: 'KTM RC16 850cc Factory',
        engine: '850cc 90° V4 (275+ HP)',
        desc: 'Kombinasi agresif pabrikan Austria di era 850cc dengan menduetkan dua pemenang Grand Prix: Alex Marquez (#73) dan Fabio Di Giannantonio (#49).',
      },
      'Pertamina Enduro VR46 Racing Team': {
        bike: 'Ducati Desmosedici 850cc',
        engine: '850cc 90° V4 Desmodromic (275+ HP)',
        desc: 'Tim kebanggaan suporter Indonesia dan Valentino Rossi menurunkan Fermin Aldeguer (#54) bersama bintang spektakuler WorldSBK Nicolò Bulega (#11).',
      },
      'BK8 Gresini Racing MotoGP': {
        bike: 'Ducati Desmosedici 850cc',
        engine: '850cc 90° V4 Desmodromic (275+ HP)',
        desc: 'Gresini Racing menyambut Juara Dunia Joan Mir (#36) berdampingan dengan rookie debutan Moto2 Daniel Holgado (#96).',
      },
      'SuperFile Trackhouse MotoGP Team': {
        bike: 'Aprilia RS-GP 850cc',
        engine: '850cc 90° V4 (275+ HP)',
        desc: 'Tim asal Amerika Serikat ini diperkuat duet mentereng Enea Bastianini (#23) dan rider berbakat Spanyol Raul Fernandez (#25).',
      },
      'Red Bull KTM Tech3 (MotoGP)': {
        bike: 'KTM RC16 850cc Factory Spec',
        engine: '850cc 90° V4 (275+ HP)',
        desc: 'Tech3 menurunkan pembalap berpengalaman analitis Luca Marini (#10) bersama talenta muda Australia Senna Agius (#81).',
      },
      'CASTROL Honda LCR': {
        bike: 'Honda RC213V 850cc Spec',
        engine: '850cc 90° V4 (275+ HP)',
        desc: 'Lucio Cecchinello menduetkan pembalap kawakan Johann Zarco (#5) dengan bintang fenomenal Juara Dunia Moto3/Moto2 David Alonso (#80).',
      },
      'Prima Pramac Yamaha MotoGP': {
        bike: 'Yamaha YZR-M1 850cc Spec',
        engine: '850cc 4-Silinder Segaris Crossplane (270+ HP)',
        desc: 'Pramac Yamaha mengandalkan Juara Dunia WorldSBK Toprak Razgatlioglu (#7) berpasangan dengan Juara Dunia Moto3 Izan Guevara (#28).',
      },
      'CFMOTO Aspar Team': {
        bike: 'Kalex Moto2 / TBA',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Skuad Aspar menurunkan duet anyar Celestino Vietti (#13) yang pindah dari SpeedRS bersama Juara Dunia Moto3 2026 Máximo Quiles (#28).',
      },
      'REDS Fantic Racing': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Fantic Racing memperkuat barisan dengan kembalinya pembalap top Spanyol Arón Canet (#44) berduet bersama Barry Baltus (#7).',
      },
      'Liqui Moly Dynavolt Intact GP': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Intact GP mengandalkan Manuel González (#18) dipasangkan dengan rookie berbakat Runner-up Moto3 2026 David Almansa (#22).',
      },
      'Italtrans Racing Team': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Skuad asal Italia Italtrans Racing mengamankan kombinasi pembalap Spanyol Alex Escrig (#11) dan Daniel Muñoz (#17).',
      },
      'Klint Racing Team': {
        bike: 'Forward Moto2 / TBA',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Klint Racing membentuk formasi baru bertenaga dengan merekrut Tony Arbolino (#14) berduet bersama Adrián Huertas (#99).',
      },
      'Idemitsu Honda Team Asia': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Tim kebanggaan Indonesia di kelas Moto2. Mario Suryo Aji (#64) memiliki posisi kuat untuk bertahan, berduet dengan Taiyo Furusato (#72).',
      },
      'Momoven Idrofoglia RW Racing Team': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'RW Racing merekrut pembalap petarung Turki Deniz Öncü (#53) setelah Marc VDS bubar, didampingi kursi kedua yang menanti konfirmasi resmi (TBA).',
      },
      'QJMOTOR - MSI': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'MSI Racing menurunkan duet pembalap bertalenta tinggi Ángel Piqueras (#36) dan Ivan Ortola (#4) dengan sasis Kalex.',
      },
      'ITALJET Gresini Moto2': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Gresini Moto2 dalam proses finalisasi diskusi kontrak bersama Alonso López (#21) dan rumor kuat promosi David Muñoz (#64) dari Moto3.',
      },
      'Red Bull KTM Ajo': {
        bike: 'Kalex Moto2 2027',
        engine: 'Triumph 765cc 3-Silinder (140+ HP)',
        desc: 'Aki Ajo memimpin skuad dengan pembalap utama Filip Salač (#12), sementara kursi tandem kedua berstatus TBA menanti pengumuman resmi FIM.',
      },
      'CFMOTO Aspar Moto3': {
        bike: 'KTM RC250GP Spec 2027',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'Aspar Moto3 mempertahankan Marco Morelli (#97) dan mempromosikan Carlos Cano (#71) sang juara bertahan Moto3 Junior 2026.',
      },
      'Honda HRC Asia': {
        bike: 'Honda NSF250RW Factory',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'Dulu dikenal sebagai Honda Team Asia. Skuad penjenjangan resmi HRC di Moto3 yang diproyeksikan kuat bagi penjenjangan lanjutan bintang Indonesia Veda Ega Pratama (#9).',
      },
      'Leopard Racing': {
        bike: 'Honda NSF250RW Spec 2027',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'Tim bercorak toska ikonik Leopard Racing merombak formasi untuk musim 2027 dengan menduetkan dua talenta muda potensial: Leonardo Zanni (#32) dan David Gonzalez (#11).',
      },
      'AEON Credit - MT Helmets - MSI': {
        bike: 'KTM RC250GP Spec 2027',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'MT Helmets MSI menurunkan susunan baru di kelas Moto3 2027 dengan menghadirkan bintang muda kebanggaan Malaysia Hakim Danish (#13) bersama Valentin Perrone (#73).',
      },
      'Red Bull KTM Tech3': {
        bike: 'KTM RC250GP Factory Spec',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'Tech3 Moto3 merekrut Adrian Fernandez (#31) dari Leopard Racing serta mempromosikan Kristian Daniel Jr (#88) asal Amerika Serikat alumni peringkat 4 Red Bull Rookies Cup 2026.',
      },
      'LEVELUP - MTA': {
        bike: 'KTM RC250GP Spec 2027',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'LEVELUP MTA mendatangkan Juara Dunia Red Bull Rookies Cup 2026 Beñat Fernández (#43) berpasangan dengan pembalap Austria Leo Rammerstorfer (#5).',
      },
      'Rivacold Snipers Team': {
        bike: 'Honda NSF250RW Spec 2027',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'Snipers mengamankan tanda tangan pembalap muda David Da Costa (#19), sedangkan kursi kedua masih menanti pengumuman resmi FIM (TBA).',
      },
      'CODE Motorsports': {
        bike: 'KTM RC250GP Spec 2027',
        engine: '250cc 1-Silinder DOHC (60+ HP)',
        desc: 'CODE Motorsports merekrut rookie berbakat Italia Giulio Pugliese (#38) dengan satu kursi tandem kedua yang masih terbuka (TBA).',
      },
    };

    const target2027 =
      category === 'MotoGP' && trimmed.toLowerCase().includes('tech3')
        ? desc2027Map['Red Bull KTM Tech3 (MotoGP)']
        : desc2027Map[trimmed] ||
          Object.entries(desc2027Map).find(
            ([k]) =>
              trimmed.toLowerCase().includes(k.toLowerCase()) ||
              k.toLowerCase().includes(trimmed.toLowerCase()),
          )?.[1];

    if (baseTeam && target2027) {
      return {
        name: trimmed,
        ...baseTeam,
        bike: target2027.bike,
        engine: target2027.engine,
        description: target2027.desc,
      };
    }
  }

  if (baseTeam) {
    return { name: trimmed, ...baseTeam };
  }

  // Generic fallback if new/satellite team
  const engineFallback = category === 'MotoGP' 
    ? (season === '2027' ? '850cc 4-Tak Prototipe (275+ HP)' : '1.000cc 4-Silinder (300+ HP)')
    : category === 'Moto2' 
      ? 'Triumph 765cc 3-Silinder Identik (~140+ HP)' 
      : '250cc 1-Silinder 4-Tak (~60+ HP)';
      
  return {
    name: trimmed,
    category: category,
    type: 'Tim Peserta Resmi FIM World Championship',
    bike: `${constructorName || 'Sasis Resmi'} ${category}`,
    engine: engineFallback,
    base: 'Eropa & Asia Pasifik',
    principal: 'Manajemen Balap Tim',
    color: '#E10600',
    description: `Tim balap resmi yang berkompetisi di kelas ${category} Kejuaraan Dunia Grand Prix ${season} di Sirkuit Mandalika.`,
    mandalikaSpot: 'Grandstand A & B — Spot terbaik mengamati persaingan ketat di garis start dan tikungan pertama.'
  };
}
