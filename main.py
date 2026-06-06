from llama_parse import LlamaParse
from llama_index.core import SimpleDirectoryReader
import os

# API anahtarınızı buraya girin
os.environ["LLAMA_CLOUD_API_KEY"] = "llx-KhFRtLLHpneeOUWmdSIXqgDv5BVdGssI6zHf3fhJaBLpxkB0"

# Parser'ı yapılandırın
parser = LlamaParse(
    result_type="markdown",  # Çıktı formatı
    verbose=True,
    language="tr",           # Türkçe olduğu için önemli
    # Tablo yapılarını korumak için kritik ayar:
    parsing_instruction="Bu belge bir müfredat programıdır. Tabloları bozmadan Markdown formatında ayrıştır. Sayfa numaralarını ve üst bilgileri metinden ayıkla."
)

# PDF dosyasını yükle ve işle
file_extractor = {".pdf": parser}
documents = SimpleDirectoryReader("refs\mufredat-2025", file_extractor=file_extractor).load_data()

# Sonucu bir dosyaya kaydet
with open("temiz_mufredat.md", "w", encoding="utf-8") as f:
    f.write(documents[0].text)