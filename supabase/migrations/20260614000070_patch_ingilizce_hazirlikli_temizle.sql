-- Migration 070: İngilizce lise hazirlikli 9-12 kayıtları sil
-- 9-12 arası içerik hazirlikli/hazirliksiz programda birebir aynı.
-- Tek set (hazirliksiz) yeterli. Sinif=0 (hazırlık sınıfı) ayrıca kalıyor.

DELETE FROM kazanimlar
  WHERE brans = 'ingilizce'
    AND okul_tipi = 'lise'
    AND program = 'hazirlikli'
    AND sinif > 0;
