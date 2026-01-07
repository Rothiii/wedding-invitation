# Themes

Folder ini berisi tema-tema untuk undangan pernikahan.

## Struktur Folder

Setiap tema memiliki folder sendiri dengan struktur:

```
themes/
├── default/
│   ├── preview.jpg      # Gambar preview tema (400x300px)
│   ├── config.json      # Konfigurasi tema (warna, font, dll)
│   └── assets/          # Gambar, ikon khusus tema
├── elegant/
├── rustic/
└── modern/
```

## Menambah Tema Baru

1. Buat folder baru dengan nama tema (huruf kecil, tanpa spasi)
2. Tambahkan `preview.jpg` untuk preview di admin panel
3. Buat `config.json` dengan konfigurasi tema
4. Daftarkan tema di API `/api/admin/themes`

## Config.json Format

```json
{
  "name": "Nama Tema",
  "colors": {
    "primary": "#FDA4AF",
    "secondary": "#FEF3F2",
    "accent": "#9F1239",
    "text": "#1F2937",
    "background": "#FFFFFF"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter"
  }
}
```
