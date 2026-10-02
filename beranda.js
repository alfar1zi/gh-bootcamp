/* CodeCraft Academy — interaksi mockup IDE di section Beranda.
   Vanilla JS tanpa dependensi. Tiga interaksi: ganti tab editor,
   jalankan/previu berkas, dan pilih item sidebar. */
(function () {
  "use strict";

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

  var files = {
    "modul-04": {
      name: "modul-04.html",
      lines: 12,
      run: "$ npm run dev\n> codecraft@0.4.0 dev\n> vite\n\n  VITE v5.0.0  ready in 214 ms\n\n  ➜  Local:   http://localhost:5173/\n  ➜  press h + enter to show help\n\n✓ 0 error  ·  2 warning  ·  selesai dalam 1.2s",
      preview:
        "Preview: Validasi Formulir\n\n  ┌───────────────────────────┐\n  │ Validasi Formulir        │\n  │                           │\n  │ Email                     │\n  │ [ alumni@contoh.id      ] │\n  │                           │\n  │ [ Daftar ]                │\n  └───────────────────────────┘\n\n  Layout valid, 1 field required."
    },
    "latihan-02": {
      name: "latihan-02.js",
      lines: 14,
      run: "$ node latihan-02.js\n\n  listener 'submit' terpasang\n  uji: 'budi@mail.com'  → valid\n  uji: 'budi'           → ditolak\n  uji: '  rina@mail.id ' → valid (trim)\n\n✓ 3 assertion lulus  ·  selesai dalam 0.08s",
      preview:
        "Preview: modul-04.html\n\n  index.html      →  memuat latihan-02.js\n  #daftar         →  1 handler submit\n  validasi        →  aktif\n\n  Tidak ada error konsol."
    },
    "soal": {
      name: "soal.md",
      lines: 11,
      run: "$ npm run check:soal\n\n  memindai 3 kriteria\n  [x] Email wajib diisi\n  [x] Pesan error tampil jelas\n  [ ] Kirim ke API  → belum dikerjakan\n\n! 1 kriteria belum,\n✓ 2 dari 3 kriteria terpenuhi",
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
  var previewMode = false;
  var timer = null;

  function stopTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function selectTab(key, focusPanel) {
    var file = files[key];
    if (!file) return;

    activeFile = key;
    previewMode = false;
    previewBtn.setAttribute("aria-pressed", "false");
    stopTimer();

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

    status.textContent = "Siap";
    outputBody.textContent = 'Klik "Run" untuk menjalankan ' + file.name + ".";
    var lines = ide.querySelector(".cc-statusbar-right");
    if (lines) lines.textContent = "UTF-8 · LF · " + file.lines + " baris";
  }

  function renderRun() {
    var file = files[activeFile];
    outputBody.textContent = file.run;
    status.textContent = "Selesai";
  }

  function renderPreview() {
    outputBody.textContent = files[activeFile].preview;
    status.textContent = "Pratinjau";
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      selectTab(tab.dataset.tab, false);
    });
  });

  // Panah kiri/kanan untuk pindah tab, sesuai pola tablist.
  ide.querySelector(".cc-tabs").addEventListener("keydown", function (event) {
    var step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;

    event.preventDefault();
    var index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    var next = tabs[(index + step + tabs.length) % tabs.length];
    next.focus();
    selectTab(next.dataset.tab, false);
  });

  // Klik berkas di project tree membuka berkas yang sama.
  Array.prototype.forEach.call(ide.querySelectorAll(".cc-tree-file"), function (file) {
    file.addEventListener("click", function () {
      selectTab(file.dataset.open, true);
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

  runBtn.addEventListener("click", function () {
    stopTimer();
    previewMode = false;
    previewBtn.setAttribute("aria-pressed", "false");

    status.textContent = "Menjalankan…";
    outputBody.textContent = "$ menjalankan " + files[activeFile].name + "\n  compiling…";
    runBtn.disabled = true;

    timer = setTimeout(function () {
      runBtn.disabled = false;
      renderRun();
    }, 450);
  });

  previewBtn.addEventListener("click", function () {
    previewMode = !previewMode;
    previewBtn.setAttribute("aria-pressed", String(previewMode));

    if (previewMode) {
      stopTimer();
      runBtn.disabled = false;
      renderPreview();
    } else {
      status.textContent = "Siap";
      outputBody.textContent = 'Klik "Run" untuk menjalankan ' + files[activeFile].name + ".";
    }
  });
})();
