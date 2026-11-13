#!/usr/bin/env python3
"""
build_library.py — добавляет PDF-книги в фонд института.

Что делает для каждой книги из tools/catalog.json:
  1. берёт PDF из books/pdf/<id>.pdf;
  2. рисует страницы для просмотра на сайте: books/pages/<id>/1.jpg, 2.jpg, …;
  3. делает обложку books/covers/<id>.jpg (страница coverPage);
  4. распознаёт текст страниц (OCR) для полнотекстового поиска;
  5. пересобирает data/local-books.js и data/search-index.js.

Как добавить книгу:
  1. положите файл в books/pdf/, например books/pdf/my-book.pdf (имя = id: латиница, цифры, дефис);
  2. добавьте описание книги в tools/catalog.json (скопируйте любую запись и поменяйте поля);
  3. запустите из папки проекта:  python tools/build_library.py
     Уже обработанные книги пропускаются; пересобрать всё:  python tools/build_library.py --force

Нужно установить: Python 3.9+, pip install pillow pytesseract,
  poppler (команда pdftoppm) и Tesseract OCR с языками rus, eng (+ deu при необходимости).
  Windows: https://github.com/oschwartz10612/poppler-windows и https://github.com/UB-Mannheim/tesseract/wiki
"""
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'tools' / 'catalog.json'
OCR_CACHE = ROOT / 'tools' / 'ocr-cache.json'
FORCE = '--force' in sys.argv


def need(cmd):
    if not shutil.which(cmd):
        sys.exit(f'Не найдена программа «{cmd}». Установите её (см. начало файла) и повторите.')


def render_book(book, ocr_cache):
    from PIL import Image
    import pytesseract

    slug = book['id']
    pdf = ROOT / 'books' / 'pdf' / f'{slug}.pdf'
    if not pdf.exists():
        sys.exit(f'Нет файла {pdf.relative_to(ROOT)} — положите PDF с таким именем.')
    pages_dir = ROOT / 'books' / 'pages' / slug
    cover = ROOT / 'books' / 'covers' / f'{slug}.jpg'
    if not FORCE and slug in ocr_cache and cover.exists() and pages_dir.exists():
        print(f'  {slug}: уже готово, пропускаю')
        return ocr_cache[slug]

    print(f'  {slug}: рисую страницы и распознаю текст…', flush=True)
    pages_dir.mkdir(parents=True, exist_ok=True)
    cover.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        subprocess.run(['pdftoppm', '-r', '150', '-png', str(pdf), str(tmp / 'p')], check=True)
        pngs = sorted(tmp.glob('p-*.png'), key=lambda p: int(re.search(r'(\d+)\.png$', p.name).group(1)))
        sizes, texts = [], []
        for i, png in enumerate(pngs, 1):
            im = Image.open(png).convert('RGB')
            sizes.append([im.width, im.height])
            page = im.copy()
            page.thumbnail((1100, 1600))
            page.save(pages_dir / f'{i}.jpg', quality=72, optimize=True, progressive=True)
            if i == book.get('coverPage', 1):
                c = im.copy()
                c.thumbnail((440, 660))
                c.save(cover, quality=80, optimize=True, progressive=True)
            hi = tmp / f'hi-{i}'
            subprocess.run(['pdftoppm', '-r', '300', '-gray', '-png', '-f', str(i), '-l', str(i), '-singlefile', str(pdf), str(hi)], check=True)
            texts.append(pytesseract.image_to_string(str(hi) + '.png', lang=book.get('ocrLang', 'rus')))
    return {'pages': len(sizes), 'sizes': sizes, 'text': texts}


def clean_page(text):
    """Убирает шум OCR: точки-заполнители оглавления и строки почти без букв."""
    out = []
    for line in text.splitlines():
        m = re.search(r'(\.{3,}|…{2,}|_{3,}|(?:\s?[.,·]\s?){4,})', line)
        if m:
            num = re.search(r'(\d{1,4})\s*$', line)
            line = line[:m.start()].rstrip(' .,') + (' — ' + num.group(1) if num else '')
        line = re.sub(r'\s+', ' ', line).strip()
        if len(line) < 4 or sum(c.isalpha() for c in line) / len(line) < 0.55:
            continue
        out.append(line)
    return '\n'.join(out)


def main():
    need('pdftoppm')
    need('tesseract')
    catalog = json.loads(CATALOG.read_text(encoding='utf-8'))
    ocr_cache = json.loads(OCR_CACHE.read_text(encoding='utf-8')) if OCR_CACHE.exists() else {}

    # Книги-тексты (format: "text") берём из текущего data/local-books.js как есть.
    raw = (ROOT / 'data' / 'local-books.js').read_text(encoding='utf-8')
    current = json.loads(raw[raw.rindex('window.LOCAL_BOOKS = ') + len('window.LOCAL_BOOKS = '):].rstrip().rstrip(';'))
    text_books = [b for b in current if b.get('format', 'text') == 'text']
    header = raw[:raw.rindex('window.LOCAL_BOOKS = ')]

    print(f'Книг в каталоге PDF: {len(catalog)}')
    pdf_books, index = [], {}
    for meta in catalog:
        data = render_book(meta, ocr_cache)
        ocr_cache[meta['id']] = data
        b = {k: v for k, v in meta.items() if k not in ('coverPage', 'ocrLang')}
        slug = meta['id']
        b.update({
            'format': 'pdf', 'pdf': f'books/pdf/{slug}.pdf', 'cover': f'books/covers/{slug}.jpg',
            'pagesDir': f'books/pages/{slug}', 'pageCount': data['pages'],
            'ratios': [round(h / w, 4) for w, h in data['sizes']],
            'fragment': meta.get('fragment', True), 'added': meta.get('added', '2026-11'),
        })
        pdf_books.append(b)
        index[slug] = [clean_page(t) for t in data['text']]

    OCR_CACHE.write_text(json.dumps(ocr_cache, ensure_ascii=False), encoding='utf-8')
    (ROOT / 'data' / 'local-books.js').write_text(
        header + 'window.LOCAL_BOOKS = ' + json.dumps(text_books + pdf_books, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')
    (ROOT / 'data' / 'search-index.js').write_text(
        '/* Текст страниц PDF-книг фонда (распознан OCR) — для полнотекстового поиска. Ключ — id книги, значение — массив страниц. */\n'
        'window.LOCAL_FULLTEXT = ' + json.dumps(index, ensure_ascii=False) + ';\n', encoding='utf-8')
    print(f'Готово: {len(text_books) + len(pdf_books)} книг в фонде. Обновите страницу сайта.')


if __name__ == '__main__':
    main()
