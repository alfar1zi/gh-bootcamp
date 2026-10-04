/* CodeCraft Academy, bagian Profil.
   Satu interaksi: buka panel detail satu anggota, tutup yang lain. */
(function () {
  'use strict';

  var section = document.getElementById('profil');
  if (!section) {
    return;
  }

  var pemicu = Array.prototype.slice.call(
    section.querySelectorAll('.profil-pemicu')
  );
  if (pemicu.length === 0) {
    return;
  }

  function detailFor(tombol) {
    return document.getElementById(tombol.getAttribute('aria-controls'));
  }

  function setState(tombol, terbuka) {
    var kartu = tombol.closest('.profil-kartu');

    if (!kartu) {
      return;
    }

    tombol.setAttribute('aria-expanded', terbuka ? 'true' : 'false');
    kartu.classList.toggle('is-terbuka', terbuka);
    detailFor(tombol).setAttribute('aria-hidden', terbuka ? 'false' : 'true');
  }

  function tutupLain(kecuali) {
    pemicu.forEach(function (tombol) {
      if (tombol !== kecuali) {
        setState(tombol, false);
      }
    });
  }

  pemicu.forEach(function (tombol, posisi) {
    setState(tombol, false);

    tombol.addEventListener('click', function () {
      var terbuka = tombol.getAttribute('aria-expanded') === 'true';

      tutupLain(tombol);
      setState(tombol, !terbuka);
    });

    tombol.addEventListener('keydown', function (event) {
      var berikutnya;

      switch (event.key) {
        case 'ArrowDown':
          berikutnya = (posisi + 1) % pemicu.length;
          break;
        case 'ArrowUp':
          berikutnya = (posisi - 1 + pemicu.length) % pemicu.length;
          break;
        case 'Home':
          berikutnya = 0;
          break;
        case 'End':
          berikutnya = pemicu.length - 1;
          break;
        case 'Escape':
          setState(tombol, false);
          return;
        default:
          return;
      }

      event.preventDefault();
      pemicu[berikutnya].focus();
    });
  });
})();