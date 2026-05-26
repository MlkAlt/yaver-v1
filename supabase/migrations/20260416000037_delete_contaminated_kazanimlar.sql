-- Migration 037: Metodoloji metni kirliliği olan kazanımları sil
-- PDF extraction hatası: kazanım metni yerine öğretim yöntemi açıklaması
-- veya truncated (cümle ortasında kesilen) metin girilmiş.
-- Toplam: 50 kayıt. Doğru metinler V1.5'te PDF'ten yeniden çekilecek.

DELETE FROM kazanimlar WHERE kod IN (
  -- Migration 030 — yeni_mufredat
  'İTA.8.1.1',  -- sosyal_bilgiler sinif 8 — "Öğrencilerin Osmanlı sınırlarını..."
  'KK.5.1.3',   -- din_kulturu sinif 5
  'KK.7.4.1',   -- din_kulturu sinif 7
  'T.K.5.2',    -- turkce sinif 5 — Konuşma metodoloji metni
  'T.K.6.2',    -- turkce sinif 6
  'T.K.7.2',    -- turkce sinif 7
  'T.K.8.2',    -- turkce sinif 8 (truncated)
  'T.Y.5.2',    -- turkce sinif 5 — Yazma metodoloji metni
  'T.Y.8.4',    -- turkce sinif 8
  'TT.7.5.1',   -- teknoloji_tasarim sinif 7
  'TT.8.3.2',   -- teknoloji_tasarim sinif 8
  'TT.8.3.3',   -- teknoloji_tasarim sinif 8

  -- Migration 032 — lise
  'TAR.9.1.2',  -- tarih sinif 9

  -- Migration 035 — IHL Arapça 9-10 (PDF'te ön-etkinlik ve kelime önizleme satırları)
  'ARP.9.1.2', 'ARP.9.1.4', 'ARP.9.1.7',
  'ARP.9.2.1', 'ARP.9.2.2', 'ARP.9.2.4',
  'ARP.9.3.2', 'ARP.9.3.4',
  'ARP.9.4.2', 'ARP.9.4.4',
  'ARP.10.1.2', 'ARP.10.1.4',
  'ARP.10.2.2', 'ARP.10.2.4',
  'ARP.10.3.2', 'ARP.10.3.4',
  'ARP.10.4.2', 'ARP.10.4.4',

  -- Migration 035 — IHL diğer dersler
  'AKD.11.1.1', 'AKD.11.3.1',
  'DT.12.1.1', 'DT.12.2.1', 'DT.12.2.3', 'DT.12.3.1', 'DT.12.3.2', 'DT.12.4.1', 'DT.12.4.2',
  'FKH.10.4.1',
  'HDS.10.2.4', 'HDS.10.4.3',
  'HMU.11.2.3',
  'KKIHL.9.4.3', 'KKIHL.11.4.1', 'KKIHL.12.4.1',
  'TDB.9.3.2',
  'TFS.11.1.2', 'TFS.11.1.3'
);
