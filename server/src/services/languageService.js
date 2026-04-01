exports.detectLanguage = (text) => {
  if (!text) return 'en';
  let arabic=0, hindi=0, chinese=0, japanese=0, korean=0, russian=0, latin=0;
  for (const ch of text) {
    const c = ch.codePointAt(0);
    if (c >= 0x0600 && c <= 0x06FF) arabic++;
    else if (c >= 0x0900 && c <= 0x097F) hindi++;
    else if ((c >= 0x4E00 && c <= 0x9FFF)||(c >= 0x3400 && c <= 0x4DBF)) chinese++;
    else if ((c >= 0x3040 && c <= 0x30FF)||(c >= 0xFF66 && c <= 0xFF9F)) japanese++;
    else if (c >= 0xAC00 && c <= 0xD7AF) korean++;
    else if (c >= 0x0400 && c <= 0x04FF) russian++;
    else if ((c >= 0x0041 && c <= 0x007A)||(c >= 0x00C0 && c <= 0x024F)) latin++;
  }
  const total = arabic+hindi+chinese+japanese+korean+russian+latin || 1;
  const entries = { arabic, hindi, chinese, japanese, korean, russian, latin };
  const dominant = Object.entries(entries).reduce((a,b) => a[1]>b[1]?a:b);
  const map = { arabic:'ar', hindi:'hi', chinese:'zh', japanese:'ja', korean:'ko', russian:'ru', latin:'en' };
  if (dominant[0] !== 'latin' && dominant[1]/total > 0.3) return map[dominant[0]];
  // Latin-based language detection
  const lo = text.toLowerCase();
  if (/\b(hola|gracias|como|pedido|ayuda)\b/.test(lo)) return 'es';
  if (/\b(bonjour|merci|commande|aide|livraison)\b/.test(lo)) return 'fr';
  if (/\b(hallo|danke|bestellung|hilfe|lieferung)\b/.test(lo)) return 'de';
  if (/\b(olá|obrigado|pedido|ajuda)\b/.test(lo)) return 'pt';
  return 'en';
};
