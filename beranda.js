/* CodeCraft Academy — interaksi mockup IDE di section Beranda.
   Vanilla JS tanpa dependensi. Semua listener dipasang satu kali
   di dalam satu IIFE; tidak ada variabel global. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* Scroll reveal. Kalau JS mati, konten tetap terlihat karena
     atribut no-js di <html>. Pakai sapuan posisi, bukan
     IntersectionObserver: lompat scroll (anchor atau scrollbar
     yang ditarik cepat) bisa melewati satu blok tanpa pernah
     memicu callback, sehingga blok itu tertahan di opacity 0. */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  function sweepReveal() {
    var limit = window.innerHeight * 0.88;

    revealTargets.forEach(function (el) {
      if (el.classList.contains("is-in")) return;
      if (el.getBoundingClientRect().top < limit) el.classList.add("is-in");
    });
  }

  var sweeping = false;

  window.addEventListener(
    "scroll",
    function () {
      if (sweeping) return;
      sweeping = true;
      window.requestAnimationFrame(function () {
        sweeping = false;
        sweepReveal();
      });
    },
    { passive: true }
  );

  sweepReveal();

  var ide = document.getElementById("cc-ide");
  if (!ide) return;

  var tabs = Array.prototype.slice.call(ide.querySelectorAll(".cc-tab"));
  var blocks = Array.prototype.slice.call(ide.querySelectorAll(".cc-code-block"));
  var panel = document.getElementById("cc-panel");
  var runBtn = document.getElementById("cc-run");
  var previewBtn = document.getElementById("cc-preview-toggle");
  var outputBody = document.getElementById("cc-output-body");
  var status = document.getElementById("cc-status");
  var context = document.getElementById("cc-context");
  var linesEl = ide.querySelector(".cc-statusbar-meta");
  var prevBtn = document.getElementById("cc-prev");
  var nextBtn = document.getElementById("cc-next");
  var treeFiles = Array.prototype.slice.call(ide.querySelectorAll(".cc-tree-file"));

  var files = {
    "modul-04": {
      name: "modul-04.html",
      lines: 12,
      run:
        "$ npm run dev\n> codecraft@0.4.0 dev\n> vite\n\n  VITE v5.0.0  ready in 214 ms\n\n  ➜  Local:   http://localhost:5173/\n  ➜  press h + enter to show help\n\n✓ 0 error  ·  2 warning  ·  selesai dalam 1.2s",
      preview:
        "Preview: Validasi Formulir\n\n  ┌───────────────────────────┐\n  │ Validasi Formulir        │\n  │                           │\n  │ Email                     │\n  │ [ alumni@contoh.id      ] │\n  │                           │\n  │ [ Daftar ]                │\n  └───────────────────────────┘\n\n  Layout valid, 1 field required."
    },
    "latihan-02": {
      name: "latihan-02.js",
      lines: 14,
      run:
        "$ node latihan-02.js\n\n  listener 'submit' terpasang\n  uji: 'budi@mail.com'  → valid\n  uji: 'budi'           → ditolak\n  uji: '  rina@mail.id ' → valid (trim)\n\n✓ 3 assertion lulus  ·  selesai dalam 0.08s",
      preview:
        "Preview: modul-04.html\n\n  index.html      →  memuat latihan-02.js\n  #daftar         →  1 handler submit\n  validasi        →  aktif\n\n  Tidak ada error konsol."
    },
    "soal": {
      name: "soal.md",
      lines: 11,
      run:
        "$ npm run check:soal\n\n  memindai 3 kriteria\n  [x] Email wajib diisi\n  [x] Pesan error tampil jelas\n  [ ] Kirim ke API  → belum dikerjakan\n\n! 1 kriteria belum,\n✓ 2 dari 3 kriteria terpenuhi",
      preview:
        "Preview: soal.md\n\n  Modul 04 — Validasi Formulir\n\n  Deadline   : Jumat, 18:00\n  Kriteria   : 3\n  Terpenuhi  : 2\n\n  Catatan mentor:\n  Gunakan trim() sebelum validasi."
    }
  };

  var views = {
    modul: { context: "Modul · minggu 4 dari 16" },
    proyek: { context: "Proyek · 3 kiriman terbuka" },
    mentor: { context: "Mentor · sesi berikutnya 19:00" },
    nilai: { context: "Nilai · rata-rata 82" }
  };

  var activeFile = "modul-04";
  var timer = null;

  function stopTimer() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
  }

  /* Sorot berkas yang sedang terbuka di project tree. */
  function markTree() {
    treeFiles.forEach(function (file) {
      file.classList.toggle("is-open", file.dataset.open === activeFile);
    });
  }

  function syncStepButtons() {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = tabs.length < 2;
    nextBtn.disabled = tabs.length < 2;
  }

  function selectTab(key, focusPanel) {
    var file = files[key];
    if (!file) return;

    activeFile = key;
    stopTimer();
    runBtn.disabled = false;

    tabs.forEach(function (tab) {
      var on = tab.dataset.tab === key;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });

    blocks.forEach(function (block) {
      block.hidden = block.dataset.code !== key;
    });

    panel.setAttribute("aria-labelledby", "tab-" + key);
    if (focusPanel) panel.focus();

    previewBtn.setAttribute("aria-pressed", "false");
    status.textContent = "Siap";
    outputBody.textContent = 'Klik "Run" untuk menjalankan ' + file.name + ".";
    if (linesEl) linesEl.textContent = "UTF-8 · LF · " + file.lines + " baris";

    markTree();
    syncStepButtons();
  }

  /* Pindah satu berkas ke depan / belakang sesuai urutan tab. */
  function stepBy(delta) {
    var index = tabs.findIndex(function (tab) {
      return tab.dataset.tab === activeFile;
    });
    if (index < 0) return;

    var next = tabs[(index + delta + tabs.length) % tabs.length];
    selectTab(next.dataset.tab, false);
    next.focus();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      selectTab(tab.dataset.tab, false);
    });
  });

  /* Panah kiri/kanan untuk pindah tab, sesuai pola tablist. */
  ide.querySelector(".cc-tabs").addEventListener("keydown", function (event) {
    var delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;

    event.preventDefault();
    stepBy(delta);
  });

  /* Klik berkas di project tree membuka berkas yang sama. */
  treeFiles.forEach(function (file) {
    file.addEventListener("click", function () {
      selectTab(file.dataset.open, true);
    });
  });

  /* Folder tree: buka/tutup isi folder. Native <button> sudah
     memberi dukungan Enter dan Space. */
  Array.prototype.forEach.call(ide.querySelectorAll(".cc-tree-folder"), function (folder) {
    folder.addEventListener("click", function () {
      var open = folder.getAttribute("aria-expanded") === "true";
      folder.setAttribute("aria-expanded", String(!open));
    });
  });

  Array.prototype.forEach.call(ide.querySelectorAll(".cc-side-item"), function (item) {
    item.addEventListener("click", function () {
      Array.prototype.forEach.call(ide.querySelectorAll(".cc-side-item"), function (other) {
        other.classList.remove("is-active");
        other.removeAttribute("aria-current");
      });

      item.classList.add("is-active");
      item.setAttribute("aria-current", "true");

      var view = views[item.dataset.view];
      if (view) context.textContent = view.context;
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", function () { stepBy(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { stepBy(1); });

  runBtn.addEventListener("click", function () {
    stopTimer();
    previewBtn.setAttribute("aria-pressed", "false");

    status.textContent = "Menjalankan…";
    outputBody.textContent = "$ menjalankan " + files[activeFile].name + "\n  compiling…";
    runBtn.disabled = true;

    timer = setTimeout(function () {
      runBtn.disabled = false;
      timer = null;
      status.textContent = "Selesai";
      outputBody.textContent = files[activeFile].run;
    }, 450);
  });

  previewBtn.addEventListener("click", function () {
    var on = previewBtn.getAttribute("aria-pressed") === "true";

    if (on) {
      status.textContent = "Siap";
      outputBody.textContent = 'Klik "Run" untuk menjalankan ' + files[activeFile].name + ".";
      previewBtn.setAttribute("aria-pressed", "false");
      return;
    }

    stopTimer();
    runBtn.disabled = false;
    status.textContent = "Pratinjau";
    outputBody.textContent = files[activeFile].preview;
    previewBtn.setAttribute("aria-pressed", "true");
  });

  markTree();
  syncStepButtons();
})();