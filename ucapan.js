function initUcapan() {
  const form = document.getElementById('formUcapanPrivat') || document.querySelector('form');
  if (!form) return;

  // Auto isi nama jika dari link ?to=
  const urlParams = new URLSearchParams(window.location.search);
  const namaUrl = urlParams.get('to') || urlParams.get('kpd') || urlParams.get('n');
  const inputNama = document.getElementById('inputNama');
  if (inputNama && namaUrl && (!inputNama.value || inputNama.value === '[Nama]')) {
    inputNama.value = namaUrl.replace(/\+/g, ' ');
  }

  // Buat kotak daftar komentar di bawah formulir
  let feed = document.getElementById('kotakUcapanPublik');
  if (!feed) {
    feed = document.createElement('div');
    feed.id = 'kotakUcapanPublik';
    feed.style.cssText = 'margin-top: 25px; text-align: left; max-height: 380px; overflow-y: auto; padding: 4px;';
    form.parentNode.insertBefore(feed, form.nextSibling);
  }

  renderDaftarUcapan();

  // Tangani klik tombol kirim
  form.onsubmit = function(e) {
    if (e) e.preventDefault();
    prosesKirim();
  };
  const btn = document.getElementById('btnKirim');
  if (btn) {
    btn.onclick = function(e) {
      if (e) e.preventDefault();
      prosesKirim();
    };
  }
}

function getUcapanData() {
  try {
    const d = localStorage.getItem('data_ucapan_puji_sukma');
    if (d) return JSON.parse(d);
  } catch (e) {}
  return [
    {
      nama: "Keluarga Besar Bpk. Lasmin",
      kehadiran: "Hadir",
      pesan: "Selamat menempuh hidup baru Mas Puji & Mbak Sukma. Semoga sakinah mawaddah warahmah, lancar sampai hari H!",
      waktu: "Baru saja"
    },
    {
      nama: "Keluarga Bpk. Sukiman",
      kehadiran: "Hadir",
      pesan: "Barakallahu lakuma wa baraka alaika. Selamat berbahagia untuk kedua mempelai!",
      waktu: "1 jam lalu"
    }
  ];
}

function renderDaftarUcapan() {
  const feed = document.getElementById('kotakUcapanPublik');
  if (!feed) return;
  const data = getUcapanData();
  feed.innerHTML = `
    <h4 style="font-size: 14px; font-weight: 700; color: #303333; margin-bottom: 12px; border-bottom: 1px solid #ddd; padding-bottom: 6px;">
      <i class="fa-solid fa-comments me-1"></i> Doa &amp; Ucapan (${data.length})
    </h4>
  ` + data.map(item => `
    <div style="background: #fff; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; border-left: 4px solid #928573; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <b style="font-size: 13px; color: #222;">${item.nama}</b>
        <span style="font-size: 10px; background: ${item.kehadiran === 'Hadir' ? '#e8f5e9; color: #2e7d32;' : '#f5f5f5; color: #757575;'} padding: 2px 8px; border-radius: 10px; font-weight: 600;">
          ${item.kehadiran}
        </span>
      </div>
      <p style="font-size: 12px; color: #555; margin: 0; line-height: 1.4;">${item.pesan}</p>
      <span style="font-size: 9px; color: #999; display: block; margin-top: 6px;">${item.waktu}</span>
    </div>
  `).join('');
}

function prosesKirim() {
  const inputNama = document.getElementById('inputNama');
  const inputKehadiran = document.getElementById('inputKehadiran');
  const inputPesan = document.getElementById('inputPesan');

  const nama = inputNama ? inputNama.value.trim() : '';
  const kehadiran = inputKehadiran ? inputKehadiran.value : 'Hadir';
  const pesan = inputPesan ? inputPesan.value.trim() : '';

  if (!nama || nama === '[Nama]') {
    alert('Silakan isi Nama Lengkap Anda terlebih dahulu!');
    if (inputNama) inputNama.focus();
    return;
  }
  if (!pesan) {
    alert('Silakan tuliskan Doa & Ucapan Anda terlebih dahulu!');
    if (inputPesan) inputPesan.focus();
    return;
  }

  const data = getUcapanData();
  const now = new Date();
  const waktu = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  data.unshift({ nama, kehadiran, pesan, waktu });
  try {
    localStorage.setItem('data_ucapan_puji_sukma', JSON.stringify(data));
  } catch(e) {}

  renderDaftarUcapan();
  if (inputPesan) inputPesan.value = '';

  alert('Terima kasih ' + nama + '! Doa dan ucapan Anda berhasil dikirim.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUcapan);
} else {
  initUcapan();
}
