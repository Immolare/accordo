/* ============================================================
   Accordo — Internationalisation
   Dictionnaires LANGS / I18N / CJK + classe I18n (traduction,
   libellés dépendant de la langue, détection navigateur).
   Chargé en premier (globals : LANGS, I18N, CJK, I18n).
   ============================================================ */
"use strict";

const LANGS = {
  fr: "Français", en: "English", es: "Español", it: "Italiano", de: "Deutsch",
  pt: "Português", zh: "中文", ja: "日本語", ko: "한국어",
};

const I18N = {
  fr: {
    tagline: "Accordeur guitare & basse, simple et précis.", start: "Commencer",
    startHint: "L'accès au micro sera demandé pour écouter votre instrument.", init: "Initialisation…",
    guitar: "Guitare", bass: "Basse", strings: "cordes", tunings: "Accordages",
    search: "Rechercher : Drop C, Open G, 7 cordes…", noResults: "Aucun accordage trouvé",
    flat: "Flat", auto: "Auto", sound: "Son", play: "Jouez une corde…",
    tooLow: "Trop bas — tendez la corde ↑", tooHigh: "Trop haut — détendez la corde ↓", inTune: "Juste ✓",
    micOff: "micro désactivé", soundHint: "Touchez une corde en mode Son 🔊",
    micBanner: "Micro non autorisé — utilisez le mode Son et accordez à l'oreille.",
    micRetry: "Réessayer",
    updateReady: "Nouvelle version disponible — toucher pour mettre à jour",
    done: "Accordage terminé ✓", soundToast: "Touchez une corde pour l'écouter",
    cents: "cents", language: "Langue",
    legal: "Mentions légales", close: "Fermer", stringN: "Corde",
    calibDown: "Diminuer la fréquence de référence", calibUp: "Augmenter la fréquence de référence",
    docTitle: "Accordo — Accordeur guitare & basse en ligne, gratuit et précis",
    metaDesc: "Accordeur chromatique gratuit pour guitare 6/7/8 cordes et basse 4/5/6 cordes. Plus de 50 accordages : Drop C, Open G, DADGAD… Sans pub, fonctionne hors-ligne.",
    openDm: "Open D mineur", fourths: "Quartes (EADGCF)", highC: "Standard E (aiguë C)",
    customSheet: "Accordage personnalis\u00e9", customName: "Nom de l'accordage\u2026",
    customSave: "Enregistrer", customSaved: "Accordage enregistr\u00e9",
    customCreate: "+ Personnalis\u00e9", customImportPH: "Coller un code de partage\u2026",
    customImport: "Importer", customAddLow: "+ Ajouter corde grave",
    customAddHigh: "+ Ajouter corde aigu\u00eb", customShare: "Code\u00a0:",
    customCopy: "Copier", customCopied: "Copi\u00e9\u00a0!",
  },
  en: {
    tagline: "Guitar & bass tuner — simple and accurate.", start: "Start",
    startHint: "Microphone access will be requested to hear your instrument.", init: "Starting…",
    guitar: "Guitar", bass: "Bass", strings: "strings", tunings: "Tunings",
    search: "Search: Drop C, Open G, 7 strings…", noResults: "No tuning found",
    flat: "Flat", auto: "Auto", sound: "Sound", play: "Play a string…",
    tooLow: "Too low — tighten the string ↑", tooHigh: "Too high — loosen the string ↓", inTune: "In tune ✓",
    micOff: "mic disabled", soundHint: "Tap a string in Sound mode 🔊",
    micBanner: "Microphone not allowed — use Sound mode and tune by ear.",
    micRetry: "Try again",
    updateReady: "New version available — tap to update",
    done: "Tuning complete ✓", soundToast: "Tap a string to hear it",
    cents: "cents", language: "Language",
    legal: "Legal notice", close: "Close", stringN: "String",
    calibDown: "Lower reference pitch", calibUp: "Raise reference pitch",
    docTitle: "Accordo — Free Online Guitar & Bass Tuner",
    metaDesc: "Free, accurate chromatic tuner for 6/7/8-string guitar and 4/5/6-string bass. 50+ tunings: Drop C, Open G, DADGAD… No ads, works offline.",
    openDm: "Open D Minor", fourths: "All Fourths (EADGCF)", highC: "Standard E (high C)",
    customSheet: "Custom Tuning", customName: "Tuning name\u2026",
    customSave: "Save", customSaved: "Tuning saved",
    customCreate: "+ Custom", customImportPH: "Paste a share code\u2026",
    customImport: "Import", customAddLow: "+ Add low string",
    customAddHigh: "+ Add high string", customShare: "Code:",
    customCopy: "Copy", customCopied: "Copied!",
  },
  es: {
    tagline: "Afinador de guitarra y bajo — simple y preciso.", start: "Comenzar",
    startHint: "Se pedirá acceso al micrófono para escuchar tu instrumento.", init: "Iniciando…",
    guitar: "Guitarra", bass: "Bajo", strings: "cuerdas", tunings: "Afinaciones",
    search: "Buscar: Drop C, Open G, 7 cuerdas…", noResults: "No se encontró ninguna afinación",
    flat: "Bemol", auto: "Auto", sound: "Sonido", play: "Toca una cuerda…",
    tooLow: "Muy grave — tensa la cuerda ↑", tooHigh: "Muy agudo — afloja la cuerda ↓", inTune: "Afinada ✓",
    micOff: "micrófono desactivado", soundHint: "Toca una cuerda en modo Sonido 🔊",
    micBanner: "Micrófono no autorizado — usa el modo Sonido y afina de oído.",
    micRetry: "Reintentar",
    updateReady: "Nueva versión disponible — toca para actualizar",
    done: "¡Afinación completada! ✓", soundToast: "Toca una cuerda para escucharla",
    cents: "cents", language: "Idioma",
    legal: "Aviso legal", close: "Cerrar", stringN: "Cuerda",
    calibDown: "Bajar la frecuencia de referencia", calibUp: "Subir la frecuencia de referencia",
    docTitle: "Accordo — Afinador online gratis de guitarra y bajo",
    metaDesc: "Afinador cromático gratuito para guitarra de 6/7/8 cuerdas y bajo de 4/5/6 cuerdas. Más de 50 afinaciones: Drop C, Open G, DADGAD… Sin anuncios.",
    openDm: "Open D menor", fourths: "Cuartas (EADGCF)", highC: "Standard E (C agudo)",
    customSheet: "Afinaci\u00f3n personalizada", customName: "Nombre de la afinaci\u00f3n\u2026",
    customSave: "Guardar", customSaved: "Afinaci\u00f3n guardada",
    customCreate: "+ Personalizada", customImportPH: "Pega un c\u00f3digo\u2026",
    customImport: "Importar", customAddLow: "+ A\u00f1adir cuerda grave",
    customAddHigh: "+ A\u00f1adir cuerda aguda", customShare: "C\u00f3digo:",
    customCopy: "Copiar", customCopied: "\u00a1Copiado!",
  },
  it: {
    tagline: "Accordatore per chitarra e basso — semplice e preciso.", start: "Inizia",
    startHint: "Verrà richiesto l'accesso al microfono per ascoltare il tuo strumento.", init: "Avvio…",
    guitar: "Chitarra", bass: "Basso", strings: "corde", tunings: "Accordature",
    search: "Cerca: Drop C, Open G, 7 corde…", noResults: "Nessuna accordatura trovata",
    flat: "Bemolle", auto: "Auto", sound: "Suono", play: "Suona una corda…",
    tooLow: "Troppo bassa — tendi la corda ↑", tooHigh: "Troppo alta — allenta la corda ↓", inTune: "Accordata ✓",
    micOff: "microfono disattivato", soundHint: "Tocca una corda in modalità Suono 🔊",
    micBanner: "Microfono non autorizzato — usa la modalità Suono e accorda a orecchio.",
    micRetry: "Riprova",
    updateReady: "Nuova versione disponibile — tocca per aggiornare",
    done: "Accordatura completata ✓", soundToast: "Tocca una corda per ascoltarla",
    cents: "cents", language: "Lingua",
    legal: "Note legali", close: "Chiudi", stringN: "Corda",
    calibDown: "Abbassa la frequenza di riferimento", calibUp: "Alza la frequenza di riferimento",
    docTitle: "Accordo — Accordatore online gratuito per chitarra e basso",
    metaDesc: "Accordatore cromatico gratuito per chitarra a 6/7/8 corde e basso a 4/5/6 corde. Oltre 50 accordature: Drop C, Open G, DADGAD… Senza pubblicità.",
    openDm: "Open D minore", fourths: "Quarte (EADGCF)", highC: "Standard E (C acuto)",
    customSheet: "Accordatura personalizzata", customName: "Nome dell'accordatura\u2026",
    customSave: "Salva", customSaved: "Accordatura salvata",
    customCreate: "+ Personalizzata", customImportPH: "Incolla un codice di condivisione\u2026",
    customImport: "Importa", customAddLow: "+ Aggiungi corda grave",
    customAddHigh: "+ Aggiungi corda acuta", customShare: "Codice:",
    customCopy: "Copia", customCopied: "Copiato!",
  },
  de: {
    tagline: "Gitarren- & Bass-Stimmgerät — einfach und präzise.", start: "Starten",
    startHint: "Für das Hören deines Instruments wird Mikrofonzugriff angefragt.", init: "Starte…",
    guitar: "Gitarre", bass: "Bass", strings: "Saiten", tunings: "Stimmungen",
    search: "Suchen: Drop C, Open G, 7 Saiten…", noResults: "Keine Stimmung gefunden",
    flat: "Flat", auto: "Auto", sound: "Ton", play: "Spiele eine Saite…",
    tooLow: "Zu tief — Saite spannen ↑", tooHigh: "Zu hoch — Saite lockern ↓", inTune: "Gestimmt ✓",
    micOff: "Mikrofon deaktiviert", soundHint: "Tippe eine Saite im Ton-Modus an 🔊",
    micBanner: "Mikrofon nicht erlaubt — nutze den Ton-Modus und stimme nach Gehör.",
    micRetry: "Erneut versuchen",
    updateReady: "Neue Version verfügbar — zum Aktualisieren tippen",
    done: "Stimmen abgeschlossen ✓", soundToast: "Tippe eine Saite an, um sie zu hören",
    cents: "Cent", language: "Sprache",
    legal: "Impressum", close: "Schließen", stringN: "Saite",
    calibDown: "Referenzfrequenz verringern", calibUp: "Referenzfrequenz erhöhen",
    docTitle: "Accordo — Kostenloses Online-Stimmgerät für Gitarre & Bass",
    metaDesc: "Kostenloses, präzises Stimmgerät für 6/7/8-saitige Gitarren und 4/5/6-saitige Bässe. Über 50 Stimmungen: Drop C, Open G, DADGAD… Werbefrei.",
    openDm: "Open D-Moll", fourths: "Quarten (EADGCF)", highC: "Standard E (hohes C)",
    customSheet: "Benutzerdefinierte Stimmung", customName: "Stimmungsname\u2026",
    customSave: "Speichern", customSaved: "Stimmung gespeichert",
    customCreate: "+ Benutzerdefiniert", customImportPH: "Code einf\u00fcgen\u2026",
    customImport: "Importieren", customAddLow: "+ Tiefe Saite hinzuf\u00fcgen",
    customAddHigh: "+ Hohe Saite hinzuf\u00fcgen", customShare: "Code:",
    customCopy: "Kopieren", customCopied: "Kopiert!",
  },
  pt: {
    tagline: "Afinador de guitarra e baixo — simples e preciso.", start: "Começar",
    startHint: "O acesso ao microfone será solicitado para ouvir o seu instrumento.", init: "Iniciando…",
    guitar: "Guitarra", bass: "Baixo", strings: "cordas", tunings: "Afinações",
    search: "Pesquisar: Drop C, Open G, 7 cordas…", noResults: "Nenhuma afinação encontrada",
    flat: "Bemol", auto: "Auto", sound: "Som", play: "Toque uma corda…",
    tooLow: "Muito grave — aperte a corda ↑", tooHigh: "Muito agudo — solte a corda ↓", inTune: "Afinada ✓",
    micOff: "microfone desativado", soundHint: "Toque numa corda no modo Som 🔊",
    micBanner: "Microfone não autorizado — use o modo Som e afine de ouvido.",
    micRetry: "Tentar novamente",
    updateReady: "Nova versão disponível — toque para atualizar",
    done: "Afinação concluída ✓", soundToast: "Toque numa corda para ouvi-la",
    cents: "cents", language: "Idioma",
    legal: "Aviso legal", close: "Fechar", stringN: "Corda",
    calibDown: "Diminuir a frequência de referência", calibUp: "Aumentar a frequência de referência",
    docTitle: "Accordo — Afinador online grátis de guitarra e baixo",
    metaDesc: "Afinador cromático gratuito para guitarra de 6/7/8 cordas e baixo de 4/5/6 cordas. Mais de 50 afinações: Drop C, Open G, DADGAD… Sem anúncios.",
    openDm: "Open D menor", fourths: "Quartas (EADGCF)", highC: "Standard E (C agudo)",
    customSheet: "Afinac\u00e3o personalizada", customName: "Nome da afina\u00e7\u00e3o\u2026",
    customSave: "Salvar", customSaved: "Afina\u00e7\u00e3o salva",
    customCreate: "+ Personalizada", customImportPH: "Cole um c\u00f3digo\u2026",
    customImport: "Importar", customAddLow: "+ Adicionar corda grave",
    customAddHigh: "+ Adicionar corda aguda", customShare: "C\u00f3digo:",
    customCopy: "Copiar", customCopied: "Copiado!",
  },
  zh: {
    tagline: "简单精准的吉他与贝斯调音器。", start: "开始",
    startHint: "将请求麦克风权限以聆听您的乐器。", init: "正在启动…",
    guitar: "吉他", bass: "贝斯", strings: "弦", tunings: "调弦方式",
    search: "搜索：Drop C、Open G、7弦…", noResults: "未找到调弦方式",
    flat: "降半音", auto: "自动", sound: "声音", play: "请拨动琴弦…",
    tooLow: "偏低 — 调紧琴弦 ↑", tooHigh: "偏高 — 调松琴弦 ↓", inTune: "已调准 ✓",
    micOff: "麦克风已禁用", soundHint: "在声音模式下点击琴弦 🔊",
    micBanner: "麦克风未授权 — 请使用声音模式，凭听觉调音。",
    micRetry: "重试",
    updateReady: "新版本可用 — 点击更新",
    done: "调音完成 ✓", soundToast: "点击琴弦即可试听",
    cents: "音分", language: "语言",
    legal: "法律声明", close: "关闭", stringN: "弦",
    calibDown: "降低参考频率", calibUp: "提高参考频率",
    docTitle: "Accordo — 免费在线吉他与贝斯调音器",
    metaDesc: "免费精准的在线调音器，支持 6/7/8 弦吉他和 4/5/6 弦贝斯，50 多种调弦方式：Drop C、Open G、DADGAD…… 无广告，可离线使用。",
    openDm: "开放D小调", fourths: "纯四度 (EADGCF)", highC: "标准E（高音C）",
    customSheet: "自定义调弦", customName: "调弦名称…",
    customSave: "保存", customSaved: "调弦已保存",
    customCreate: "+自定义", customImportPH: "粘贴分享代码…",
    customImport: "导入", customAddLow: "+添加低弦",
    customAddHigh: "+添加高弦", customShare: "代码：",
    customCopy: "复制", customCopied: "已复制！",
  },
  ja: {
    tagline: "シンプルで正確なギター＆ベースチューナー。", start: "スタート",
    startHint: "楽器の音を聴くため、マイクへのアクセスを求めます。", init: "起動中…",
    guitar: "ギター", bass: "ベース", strings: "弦", tunings: "チューニング",
    search: "検索：Drop C、Open G、7弦…", noResults: "チューニングが見つかりません",
    flat: "半音下げ", auto: "自動", sound: "サウンド", play: "弦を弾いてください…",
    tooLow: "低すぎ — 弦を締めて ↑", tooHigh: "高すぎ — 弦を緩めて ↓", inTune: "ジャスト ✓",
    micOff: "マイク無効", soundHint: "サウンドモードで弦をタップ 🔊",
    micBanner: "マイクが許可されていません — サウンドモードで耳でチューニングしてください。",
    micRetry: "再試行",
    updateReady: "新しいバージョンがあります — タップして更新",
    done: "チューニング完了 ✓", soundToast: "弦をタップすると音が鳴ります",
    cents: "セント", language: "言語",
    legal: "法的表示", close: "閉じる", stringN: "弦",
    calibDown: "基準ピッチを下げる", calibUp: "基準ピッチを上げる",
    docTitle: "Accordo — 無料オンラインギター＆ベースチューナー",
    metaDesc: "6/7/8弦ギターと4/5/6弦ベース対応の無料高精度チューナー。Drop C、Open G、DADGADなど50種類以上のチューニング。広告なし・オフライン対応。",
    openDm: "オープンDマイナー", fourths: "完全4度 (EADGCF)", highC: "スタンダードE（ハイC）",
    customSheet: "カスタムチューニング", customName: "チューニング名…",
    customSave: "保存", customSaved: "チューニングを保存しました",
    customCreate: "+カスタム", customImportPH: "共有コードを貼り付け…",
    customImport: "インポート", customAddLow: "+低弦を追加",
    customAddHigh: "+高弦を追加", customShare: "コード：",
    customCopy: "コピー", customCopied: "コピー完了！",
  },
  ko: {
    tagline: "간단하고 정확한 기타·베이스 튜너.", start: "시작",
    startHint: "악기 소리를 듣기 위해 마이크 접근 권한을 요청합니다.", init: "시작 중…",
    guitar: "기타", bass: "베이스", strings: "현", tunings: "튜닝",
    search: "검색: Drop C, Open G, 7현…", noResults: "튜닝을 찾을 수 없습니다",
    flat: "플랫", auto: "자동", sound: "소리", play: "줄을 튕겨 주세요…",
    tooLow: "너무 낮음 — 줄을 조이세요 ↑", tooHigh: "너무 높음 — 줄을 푸세요 ↓", inTune: "정확함 ✓",
    micOff: "마이크 꺼짐", soundHint: "소리 모드에서 줄을 탭하세요 🔊",
    micBanner: "마이크가 허용되지 않음 — 소리 모드로 귀로 튜닝하세요.",
    micRetry: "다시 시도",
    updateReady: "새 버전이 있습니다 — 탭하여 업데이트",
    done: "튜닝 완료 ✓", soundToast: "줄을 탭하면 소리가 납니다",
    cents: "센트", language: "언어",
    legal: "법적 고지", close: "닫기", stringN: "현",
    calibDown: "기준 주파수 낮추기", calibUp: "기준 주파수 높이기",
    docTitle: "Accordo — 무료 온라인 기타·베이스 튜너",
    metaDesc: "6/7/8현 기타와 4/5/6현 베이스를 위한 무료 고정밀 튜너. Drop C, Open G, DADGAD 등 50가지 이상의 튜닝. 광고 없음, 오프라인 지원.",
    openDm: "오픈 D 마이너", fourths: "4도 (EADGCF)", highC: "스탠다드 E (하이 C)",
    customSheet: "사용자 설정 튜닝", customName: "튜닝 이름…",
    customSave: "저장", customSaved: "튜닝이 저장되었습니다",
    customCreate: "+사용자 설정", customImportPH: "공유 코드 붙여넣기…",
    customImport: "가져오기", customAddLow: "+저음현 추가",
    customAddHigh: "+고음현 추가", customShare: "코드:",
    customCopy: "복사", customCopied: "복사됨!",
  },
};

// Langues sans espace entre le nombre et le mot "cordes" (ex. 6弦)
const CJK = ["zh", "ja", "ko"];

// Service de traduction : lit la langue courante dans l'état de l'app
class I18n {
  constructor(app) {
    this.app = app;
  }

  // Clé -> texte dans la langue courante (repli anglais puis clé brute)
  t(key) {
    const lang = this.app.state.lang;
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  }

  // « 6 cordes » / « 6弦 » selon la langue
  groupLabel(n) {
    return CJK.includes(this.app.state.lang) ? `${n}${this.t("strings")}` : `${n} ${this.t("strings")}`;
  }

  // Nom d'un preset (traduit si nameKey, sinon nom brut)
  presetName(p) {
    return p.nameKey ? this.t(p.nameKey) : p.name;
  }

  // Détecte la langue préférée du navigateur parmi celles disponibles
  static detect() {
    const cands = navigator.languages || [navigator.language || "en"];
    for (const c of cands) {
      const p = String(c).slice(0, 2).toLowerCase();
      if (I18N[p]) return p;
    }
    return "en";
  }
}
