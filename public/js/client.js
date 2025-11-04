// render
const namaGroups = document.querySelectorAll(".group")
const styleBtns = document.querySelectorAll('.style-btn');

let funtionBind = ""
let funtionBind2 = ""

namaGroups.forEach((ini) => {
    ini.addEventListener("click", function(){
        namaGroups.forEach(b => b.classList.remove('ini'));
        ini.classList.toggle("ini")
        const apa = ini.querySelector("h2").textContent

        renderIni(apa)

        styleBtns[0].removeEventListener('click', funtionBind);
        styleBtns[1].removeEventListener('click', funtionBind2);

    })
})

let sudahSemua = false;
const pTextarea = document.querySelector('textarea');
pTextarea.value = "Zoom it with two finger if you want to see bigger. Click to quick adjust."

function perintahBoldItalic(btn, fontPreviews) {
    const style = btn.dataset.style; // -> "bold" atau "italic"
    
    btn.classList.toggle('active');
    console.log("kenapa")
    
    fontPreviews.forEach(p => {
        p.classList.toggle(`text-${style}`);
    });
}

// let fontPreviews = ""



async function renderIni(params) {
    const genjreng = document.querySelector(".genjreng");
    const urlIni = window.location.host
    console.log(urlIni);


    genjreng.innerHTML =   `
                <a class="font-card hidden">
                    <h3 class="font-name"">loading</h3>
                    <p class="font-preview">
                        loading...
                    </p>
                </a>
                <a class="font-card hidden"">
                    <h3 class="font-name"">loading</h3>
                    <p class="font-preview"">
                        loading...
                    </p>
                </a>
                <a class="font-card hidden">
                    <h3 class="font-name"">loading</h3>
                    <p class="font-preview">
                        loading...
                    </p>
                </a>
                `

    try {
        const response = await fetch(`https://${urlIni}/group/${params}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        const allFontCardsHTML = data.fonts.map(font => {
            return `
                <a class="font-card hidden" href="/font/${font.displayName}">
                    <h3 class="font-name" style="font-family: '${(font.fontFamily).replace(" ", "-")}';">${font.displayName}</h3>
                    <p class="font-preview" style="font-family: '${(font.fontFamily).replace(" ", "-")}';">
                        ${pTextarea.value}
                    </p>
                </a>
            `;
        }).join('');


        // 3. Masukkan semua HTML ke dalam container HANYA SEKALI
        genjreng.innerHTML = allFontCardsHTML;

        console.log(params)
        if(params == "semua"){
            sudahSemua = true;
            const linkCSS = document.createElement('link');
            linkCSS.rel = 'stylesheet';
            linkCSS.href = `/css/import/semua.css`;
            document.head.appendChild(linkCSS);
        }
        if(!sudahSemua){
            const linkCSS = document.createElement('link');
            linkCSS.rel = 'stylesheet';
            linkCSS.href = `/css/import/${(params).replace(" ","-")}.css`;

            document.head.appendChild(linkCSS);
        }

        // 4. SEKARANG, setelah elemen ada di DOM, kita atur IntersectionObserver
        const cardsToObserve = document.querySelectorAll('.font-card');
        const fontPreviews = document.querySelectorAll('.font-preview');

        styleBtns.forEach(btn => {
            if(btn.classList.contains('active')){
                fontPreviews.forEach(p => {
                    const style = btn.dataset.style;
                    p.classList.toggle(`text-${style}`);
                });
            }
        })
        
        funtionBind = perintahBoldItalic.bind(null, styleBtns[0], fontPreviews);
        funtionBind2 = perintahBoldItalic.bind(null, styleBtns[1], fontPreviews);

        styleBtns[0].addEventListener('click', funtionBind);
        styleBtns[1].addEventListener('click', funtionBind2);


        pTextarea.addEventListener('input', (e) => {
            const newText = e.target.value;
            const defaultText = e.target.placeholder;
            
            fontPreviews.forEach(p => {
                p.textContent = newText.trim() !== '' ? newText : defaultText;
            });
        });

        
        // 4. SEKARANG, setelah elemen ada di DOM, kita atur IntersectionObserver
        

        if (cardsToObserve.length === 0) return;

        const observerOptions = {
            threshold: .89,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('showin');
                    // (Opsional) Hentikan pengamatan setelah animasi berjalan sekali
                    // observer.unobserve(entry.target); 
                } else {
                    // Hapus baris ini jika Anda hanya ingin animasi berjalan sekali
                    entry.target.classList.remove('showin');
                }
            });
        }, observerOptions);

        // Amati setiap kartu
        cardsToObserve.forEach(card => observer.observe(card));
    } catch (error) {
        console.error('Ada masalah dengan operasi fetch:', error);
        genjreng.innerHTML = `<h1 style="color: red;">Gagal memuat data.</h1>`;
    }
}

// Panggil fungsi untuk pertama kali
renderIni("semua");

const tombolUbah = document.querySelector(".style-btn2")
const katakanIni = document.querySelector(".katakanIni")

document.addEventListener("keypress", function(e){
    console.log(e.key)
    if(e.key == "Enter"){
        katakanIni.style.display = "none";
    } else if( e.key == "/"){
        katakanIni.style.display = "flex";
        katakanIni.querySelector("textarea").focus();
    }
})

tombolUbah.addEventListener("click", function(){
    katakanIni.style.display = "flex";
    katakanIni.querySelector("textarea").focus();
})
katakanIni.querySelector(".tutup").addEventListener("click", function(){
    katakanIni.style.display = "none";
})


const fontShow = document.querySelector(".h0")
const sliderLetter = document.querySelector("input#letter")
const sliderHeight = document.querySelector("input#line-tinggi")
const letterHasil = document.querySelectorAll(".hasil p")

const tulisanKecil = document.querySelectorAll(".show2 .kata p")

sliderLetter.addEventListener('input', (e) => {
    const newSize = e.target.value;

    letterHasil[0].textContent = `${newSize}px`;

    fontShow.style.letterSpacing = `${newSize}px`;
    tulisanKecil.forEach((p) => {
        p.style.letterSpacing = `${newSize}px`;
    })
});
sliderHeight.addEventListener('input', (e) => {
    const newSize = e.target.value / 10;

    letterHasil[1].textContent = `${newSize}`;

    document.documentElement.style.setProperty('--lineHeight', newSize);
});