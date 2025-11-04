const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const helmet = require('helmet'); 
const cors = require('cors');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));



const corsOptions = {
    origin: 'https://fontous.vercel.app/' 
};
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'"],
            // Izinkan 'connect-src' (panggilan API) ke domain Vercel Anda
            "connect-src": ["'self'", "*.vercel.app", "fontous.vercel.app"]
        }
    }
}));

app.use(cors(corsOptions));




const fontsDirectory = path.join(__dirname, 'public', 'fonts');
let fontGroups = [];
let jumlahFont = 0;

try {
    // Baca item di dalam folder /fonts (sekarang ini adalah folder grup)
    const groupFolders = fs.readdirSync(fontsDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // Untuk setiap folder grup, baca file font di dalamnya
    fontGroups = groupFolders.map(groupName => {
        const groupPath = path.join(fontsDirectory, groupName);
        const fontFiles = fs.readdirSync(groupPath)
            .filter(file => ['.woff', '.woff2', '.ttf', '.otf'].includes(path.extname(file).toLowerCase()));

        const fonts = fontFiles.map(file => {
            const fontName = path.parse(file).name;
            const displayName = fontName.replace(/-/g, ' ');
            jumlahFont ++;

            return {
                // Path relatif untuk URL di CSS (contoh: 'Sans-Serif/Poppins-Regular.ttf')
                path: `${groupName}/${file}`, 
                fontFamily: fontName,
                displayName: displayName
            };
        });
        
        // Mengembalikan objek grup
        return {
            groupName: groupName.replace(/-/g, ' '), // Ganti '-' dengan spasi untuk judul grup
            fonts: fonts
        };
    });
    const urutanPrioritas = ['serif', 'sans serif','script','caligraphic','black letter','display'];
    fontGroups.sort((a, b) => {
        const posisiA = urutanPrioritas.indexOf(a.groupName);
        const posisiB = urutanPrioritas.indexOf(b.groupName);
        return posisiA - posisiB;
    });
} catch (err) {
    console.error("Gagal membaca folder fonts:", err);
}


app.get('/', (req, res) => {
    const kiriman = {
        fontGroups,
        jumlahFont,
        title: "fontous"
    }
    res.render('utama', kiriman)
})

app.get('/fonts', (req, res) => {
    res.render("cool")
})
app.get('/font/:id', async(req, res) => {
    let terpilih = "";
    
    try {
        // Baca item di dalam folder /fonts (sekarang ini adalah folder grup)
        const groupFolders = fs.readdirSync(fontsDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        // Untuk setiap folder grup, baca file font di dalamnya
        groupFolders.map(groupName => {
            const groupPath = path.join(fontsDirectory, groupName);
            const fontFiles = fs.readdirSync(groupPath)
                .filter(file => ['.woff', '.woff2', '.ttf', '.otf'].includes(path.extname(file).toLowerCase()));

            const fonts = fontFiles.map(file => {
                const fontName = path.parse(file).name;
                const displayName = fontName.replace(/-/g, ' ');

                if(displayName == req.params.id){
                    terpilih = {
                        nama: fontName,
                        path: `/fonts/${groupName}/${file}`,
                        group: groupName
                    }
                }
                return {
                    // Path relatif untuk URL di CSS (contoh: 'Sans-Serif/Poppins-Regular.ttf')
                    path: `${groupName}/${file}`, 
                    fontFamily: fontName,
                    displayName: displayName
                };
            });
            
            // Mengembalikan objek grup
            return {
                groupName: groupName.replace(/-/g, ' '), // Ganti '-' dengan spasi untuk judul grup
                fonts: fonts
            };
        });

    } catch (err) {
        console.error("Gagal membaca folder fonts:", err);
        // Tetap render halaman meskipun ada error, dengan array kosong
    }

    const kiriman = {
        fontGroups,
        terpilih,
        jumlahFont,
        title: terpilih.nama
    }

    res.render("fontPilih", kiriman)
})

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
app.get('/group/semua', async(req, res) => {
    await delay(100)
    const semuaFonts = fontGroups.flatMap(grup => grup.fonts);
    const terpilih = {
        groupName: "semua",
        fonts: semuaFonts
    }
    res.json(terpilih);
})
app.get('/group/:id', async(req, res) => {
    await delay(100)
    const terpilih = fontGroups.find(grup => grup.groupName === req.params.id);
    res.json(terpilih);
})




app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});