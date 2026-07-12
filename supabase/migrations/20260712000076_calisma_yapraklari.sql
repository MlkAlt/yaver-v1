-- Migration 076: Çalışma yaprağı havuzu — offline (calisma-yapragi skill'i ile
-- Sonnet 5 kullanılarak önceden üretilen) HTML çalışma yapraklarını tutar.
--
-- Mimari: kazanimlar tablosuna FK YOK (kazanimlar.kod tek başına unique değil,
-- bkz. kazanimlar_6key). Eşleştirme uygulama tarafında kazanim_kod metin
-- karşılaştırmasıyla yapılır — evrak ailesindeki diğer havuzlarla aynı desen.
-- html_icerik, evrak ailesinin `pdfOnizlemeAc()` fonksiyonuna aynen verilir;
-- yeni bir render motoru yok. JSON (skill'in kaynak çıktısı) meta'da opsiyonel
-- yedeklenebilir, uygulama sadece html_icerik'i kullanır.

CREATE TABLE calisma_yapraklari (
  id              BIGSERIAL PRIMARY KEY,
  kazanim_kod     TEXT NOT NULL,
  varyasyon_no    INTEGER NOT NULL DEFAULT 1,
  baslik          TEXT NOT NULL,
  tahmini_sure_dk INTEGER,
  toplam_puan     INTEGER,
  html_icerik     TEXT NOT NULL,
  meta            JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT calisma_yapraklari_kod_varyasyon UNIQUE (kazanim_kod, varyasyon_no)
);

CREATE INDEX idx_calisma_yapraklari_kazanim_kod ON calisma_yapraklari(kazanim_kod);

ALTER TABLE calisma_yapraklari ENABLE ROW LEVEL SECURITY;

-- kazanimlar_read ile aynı desen: içerik havuzu, herkes okuyabilir, yazma client'tan yok.
CREATE POLICY "calisma_yapraklari_read" ON calisma_yapraklari FOR SELECT USING (true);
