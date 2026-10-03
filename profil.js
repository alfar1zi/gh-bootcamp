/* CodeCraft Academy, bagian Profil.
   Satu interaksi: buka dan tutup panel detail tiap kartu anggota. */
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

  function detailFor(pemicu) {
    return document.getElementById(pemicu.getAttribute('aria-controls'));
  }

  function setState(pemicu, terbuka) {
    var detail = detailFor(pemicu);
    var kartu = pemicu.parentNode;

    pemicu.setAttribute('aria-expanded', terbuka ? 'true' : 'false');
    kartu.classList.toggle('is-terbuka', terbuka);

    if (terbuka) {
      detail.removeAttribute('hidden');
    } else {
      detail.setAttribute('hidden', '');
    }
  }

  function tutupSemua(kecuali) {
    pemicu.forEach(function (item) {
      if (item !== kecuali) {
        setState(item, false);
      }
    });
  }

  pemicu.forEach(function (item, posisi) {
    setState(item, false);

    item.addEventListener('click', function () {
      var terbuka = item.getAttribute('aria-expanded') === 'true';
      tutupSemua(item);
      setState(item, !terbuka);
    });

    item.addEventListener('keydown', function (event) {
      var berikutnya = 0;

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
          if (item.getAttribute('aria-expanded') === 'true') {
            setState(item, false);
          }
          return;
        default:
          return;
      }

      event.preventDefault();
      pemicu[berikutnya].focus();
    });
  });
})();