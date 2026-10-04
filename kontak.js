/* ============================================================
   CODE CRAFT ACADEMY
   Bagian: Kontak (#kontak)
   Vanilla JavaScript, tanpa dependensi dan tanpa backend
   ============================================================ */
(function () {
  'use strict';

  var POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var BATAS_PESAN = 600;

  var section = document.getElementById('kontak');
  if (!section) {
    return;
  }

  var form = document.getElementById('form-kontak');
  var panelSukses = document.getElementById('kontak-sukses');
  var judulSukses = document.getElementById('kontak-sukses-judul');
  var namaSukses = document.getElementById('kontak-sukses-nama');
  var tombolUlang = document.getElementById('kontak-ulang');
  var hitung = document.getElementById('kontak-hitung-pesan');

  if (!form || !panelSukses) {
    return;
  }

  var inputNama = document.getElementById('kontak-nama');
  var inputEmail = document.getElementById('kontak-email');
  var inputPesan = document.getElementById('kontak-pesan');
  var tombolKirim = form.querySelector('.kontak__submit');
  var labelKirim = tombolKirim ? tombolKirim.textContent : '';

  var ATURAN = [
    {
      input: inputNama,
      error: document.getElementById('err-kontak-nama'),
      validasi: function (nilai) {
        if (!nilai) {
          return 'Nama wajib diisi.';
        }
        if (nilai.length < 2) {
          return 'Nama minimal 2 karakter.';
        }
        return '';
      }
    },
    {
      input: inputEmail,
      error: document.getElementById('err-kontak-email'),
      validasi: function (nilai) {
        if (!nilai) {
          return 'Email wajib diisi.';
        }
        if (!POLA_EMAIL.test(nilai)) {
          return 'Format email belum benar, contoh nama@email.com';
        }
        return '';
      }
    },
    {
      input: inputPesan,
      error: document.getElementById('err-kontak-pesan'),
      validasi: function (nilai) {
        if (!nilai) {
          return 'Pesan wajib diisi.';
        }
        if (nilai.length < 10) {
          return 'Pesan minimal 10 karakter.';
        }
        return '';
      }
    }
  ];

  /* Periksa satu field, set atau bersihkan error dan aria-invalid. */
  function periksa(aturan) {
    if (!aturan.input || !aturan.error) {
      return true;
    }

    var pesan = aturan.validasi(aturan.input.value.trim());

    if (pesan) {
      aturan.error.textContent = pesan;
      aturan.input.setAttribute('aria-invalid', 'true');
      return false;
    }

    aturan.error.textContent = '';
    aturan.input.removeAttribute('aria-invalid');
    return true;
  }

  /* Periksa seluruh field, kembalikan field pertama yang bermasalah. */
  function periksaSemua() {
    var pertama = null;

    for (var i = 0; i < ATURAN.length; i++) {
      if (!periksa(ATURAN[i]) && !pertama) {
        pertama = ATURAN[i];
      }
    }

    return pertama;
  }

  /* Penghitung karakter untuk field pesan. */
  function perbaruiHitung() {
    if (!hitung || !inputPesan) {
      return;
    }

    var jumlah = inputPesan.value.length;
    hitung.textContent = jumlah + ' / ' + BATAS_PESAN;
    hitung.classList.toggle('kontak__hitung--dekat', jumlah >= BATAS_PESAN * 0.9 && jumlah < BATAS_PESAN);
    hitung.classList.toggle('kontak__hitung--penuh', jumlah >= BATAS_PESAN);
  }

  /* Error dibersihkan saat pengguna memperbaiki isian. */
  for (var j = 0; j < ATURAN.length; j++) {
    (function (aturan) {
      if (!aturan.input) {
        return;
      }

      aturan.input.addEventListener('blur', function () {
        periksa(aturan);
      });

      aturan.input.addEventListener('input', function () {
        if (aturan.input.getAttribute('aria-invalid') === 'true') {
          periksa(aturan);
        }
      });
    })(ATURAN[j]);
  }

  if (inputPesan) {
    inputPesan.addEventListener('input', perbaruiHitung);
    perbaruiHitung();
  }

  /* Submit tetap di halaman ini, tidak ada permintaan jaringan. */
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var salah = periksaSemua();
    if (salah) {
      if (salah.input) {
        salah.input.focus();
      }
      return;
    }

    if (tombolKirim) {
      tombolKirim.disabled = true;
      tombolKirim.textContent = 'Mengirim...';
    }

    window.setTimeout(function () {
      if (namaSukses && inputNama) {
        namaSukses.textContent = inputNama.value.trim().split(/\s+/)[0];
      }

      form.hidden = true;
      panelSukses.hidden = false;

      if (judulSukses) {
        judulSukses.focus();
      }
    }, 450);
  });

  /* Kembali ke form dengan state kosong. */
  if (tombolUlang) {
    tombolUlang.addEventListener('click', function () {
      form.reset();

      for (var k = 0; k < ATURAN.length; k++) {
        if (ATURAN[k].error) {
          ATURAN[k].error.textContent = '';
        }
        if (ATURAN[k].input) {
          ATURAN[k].input.removeAttribute('aria-invalid');
        }
      }

      perbaruiHitung();
      panelSukses.hidden = true;
      form.hidden = false;

      if (tombolKirim) {
        tombolKirim.disabled = false;
        tombolKirim.textContent = labelKirim;
      }

      if (inputNama) {
        inputNama.focus();
      }
    });
  }
})();