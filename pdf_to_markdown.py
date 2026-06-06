import os
from markitdown import MarkItDown

# 1. PDF'lerinizin durduğu klasör yolu
PDF_KLASORU = "refs\mufredat-2025"

# 2. Markdown dosyalarının kaydedileceği yeni bir klasör oluşturalım
MD_KLASORU = "mufredat_markdown_dosyalari"
os.makedirs(MD_KLASORU, exist_ok=True)

# MarkItDown motorunu başlatıyoruz
md_motoru = MarkItDown()

# Klasördeki tüm PDF'leri listele
pdf_dosyalari = [f for f in os.listdir(PDF_KLASORU) if f.endswith('.pdf')]

print(f"🔄 Toplam {len(pdf_dosyalari)} adet PDF dönüştürülüyor...\n")

for pdf_adi in pdf_dosyalari:
    pdf_yolu = os.path.join(PDF_KLASORU, pdf_adi)
    
    # Yeni .md dosyasının adını belirliyoruz
    md_adi = pdf_adi.replace(".pdf", ".md")
    md_yolu = os.path.join(MD_KLASORU, md_adi)
    
    print(f"⚡ Dönüştürülüyor: {pdf_adi} -> {md_adi}")
    
    try:
        # PDF'i lokal olarak Markdown'a çevir (İnternet ve kota harcamaz)
        sonuc = md_motoru.convert(pdf_yolu)
        
        # Sonucu dosyaya kaydet
        with open(md_yolu, "w", encoding="utf-8") as f:
            f.write(sonuc.text_content)
            
        print(f" ✓ Başarıyla tamamlandı.")
    except Exception as e:
        print(f"❌ HATA: {pdf_adi} dönüştürülemedi. Sebep: {str(e)}")

print("\n🎉 Tüm PDF'ler başarıyla Markdown metnine dönüştürüldü!")
print(f"Dosyalarınızı '{MD_KLASORU}' klasöründe bulabilirsiniz.")
