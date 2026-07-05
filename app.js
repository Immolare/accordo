/* ============================================================
   Accordo — Accordeur guitare & basse
   Vanilla JS, Web Audio API, détection de hauteur YIN.
   ============================================================ */
"use strict";

/* ---------------- Données ---------------- */

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

/* ---------------- Langues ---------------- */

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

// Notes en numéros MIDI (A4 = 69). Ordre : corde la plus grave -> la plus aiguë.
// "group" : nombre de cordes (libellé localisé). "nameKey" : nom traduit via i18n.
const PRESETS = {
  guitar: [
    // --- 6 cordes : standards ---
    { group: 6, name: "Standard E",     notes: [40, 45, 50, 55, 59, 64] },
    { group: 6, name: "Standard Eb",    notes: [39, 44, 49, 54, 58, 63] },
    { group: 6, name: "Standard D",     notes: [38, 43, 48, 53, 57, 62] },
    { group: 6, name: "Standard C#",    notes: [37, 42, 47, 52, 56, 61] },
    { group: 6, name: "Standard C",     notes: [36, 41, 46, 51, 55, 60] },
    { group: 6, name: "Standard B",     notes: [35, 40, 45, 50, 54, 59] },
    // --- 6 cordes : drops ---
    { group: 6, name: "Drop D",         notes: [38, 45, 50, 55, 59, 64] },
    { group: 6, name: "Drop C#",        notes: [37, 44, 49, 54, 58, 63] },
    { group: 6, name: "Drop C",         notes: [36, 43, 48, 53, 57, 62] },
    { group: 6, name: "Drop B",         notes: [35, 42, 47, 52, 56, 61] },
    { group: 6, name: "Drop A#",        notes: [34, 41, 46, 51, 55, 60] },
    { group: 6, name: "Drop A",         notes: [33, 40, 45, 50, 54, 59] },
    // --- 6 cordes : open ---
    { group: 6, name: "Open G",         notes: [38, 43, 50, 55, 59, 62] },
    { group: 6, name: "Open A",         notes: [40, 45, 52, 57, 61, 64] },
    { group: 6, name: "Open C",         notes: [36, 43, 48, 55, 60, 64] },
    { group: 6, name: "Open D",         notes: [38, 45, 50, 54, 57, 62] },
    { group: 6, nameKey: "openDm",      notes: [38, 45, 50, 53, 57, 62] },
    { group: 6, name: "Open E",         notes: [40, 47, 52, 56, 59, 64] },
    // --- 6 cordes : autres ---
    { group: 6, name: "DADGAD",         notes: [38, 45, 50, 55, 57, 62] },
    { group: 6, name: "Double Drop D",  notes: [38, 45, 50, 55, 59, 62] },
    { group: 6, nameKey: "fourths",     notes: [40, 45, 50, 55, 60, 65] },
    // --- 7 cordes ---
    { group: 7, name: "Standard B",     notes: [35, 40, 45, 50, 55, 59, 64] },
    { group: 7, name: "Standard A#",    notes: [34, 39, 44, 49, 54, 58, 63] },
    { group: 7, name: "Standard A",     notes: [33, 38, 43, 48, 53, 57, 62] },
    { group: 7, name: "Standard G#",    notes: [32, 37, 42, 47, 52, 56, 61] },
    { group: 7, name: "Drop A",         notes: [33, 40, 45, 50, 55, 59, 64] },
    { group: 7, name: "Drop G#",        notes: [32, 39, 44, 49, 54, 58, 63] },
    { group: 7, name: "Drop G",         notes: [31, 38, 43, 48, 53, 57, 62] },
    { group: 7, name: "Drop F#",        notes: [30, 37, 42, 47, 52, 56, 61] },
    // --- 8 cordes ---
    { group: 8, name: "Standard F#",    notes: [30, 35, 40, 45, 50, 55, 59, 64] },
    { group: 8, name: "Standard F",     notes: [29, 34, 39, 44, 49, 54, 58, 63] },
    { group: 8, name: "Standard E",     notes: [28, 33, 38, 43, 48, 53, 57, 62] },
    { group: 8, name: "Drop E",         notes: [28, 35, 40, 45, 50, 55, 59, 64] },
    { group: 8, name: "Drop D#",        notes: [27, 34, 39, 44, 49, 54, 58, 63] },
    { group: 8, name: "Drop D",         notes: [26, 33, 38, 43, 48, 53, 57, 62] },
  ],
  bass: [
    // --- 4 cordes : standards ---
    { group: 4, name: "Standard E",     notes: [28, 33, 38, 43] },
    { group: 4, name: "Standard Eb",    notes: [27, 32, 37, 42] },
    { group: 4, name: "Standard D",     notes: [26, 31, 36, 41] },
    { group: 4, name: "Standard C#",    notes: [25, 30, 35, 40] },
    { group: 4, name: "Standard C",     notes: [24, 29, 34, 39] },
    // --- 4 cordes : drops ---
    { group: 4, name: "Drop D",         notes: [26, 33, 38, 43] },
    { group: 4, name: "Drop C#",        notes: [25, 32, 37, 42] },
    { group: 4, name: "Drop C",         notes: [24, 31, 36, 41] },
    { group: 4, name: "Drop B",         notes: [23, 30, 35, 40] },
    { group: 4, name: "Drop A#",        notes: [22, 29, 34, 39] },
    // --- 5 cordes ---
    { group: 5, name: "Standard B",     notes: [23, 28, 33, 38, 43] },
    { group: 5, name: "Standard A",     notes: [21, 26, 31, 36, 41] },
    { group: 5, nameKey: "highC",       notes: [28, 33, 38, 43, 48] },
    { group: 5, name: "Drop A",         notes: [21, 28, 33, 38, 43] },
    { group: 5, name: "Drop G",         notes: [19, 26, 31, 36, 41] },
    // --- 6 cordes ---
    { group: 6, name: "Standard B",     notes: [23, 28, 33, 38, 43, 48] },
    { group: 6, name: "Standard A",     notes: [21, 26, 31, 36, 41, 46] },
    { group: 6, name: "Drop A",         notes: [21, 28, 33, 38, 43, 48] },
  ],
};

const IN_TUNE_CENTS = 5;      // tolérance "juste"
const HOLD_MS = 1000;         // durée de maintien pour valider une corde
const CALIB_MIN = 415, CALIB_MAX = 465;

// Respecte la préférence "réduire les animations" (aiguille sans lissage)
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- État ---------------- */

const state = {
  instrument: "guitar",       // 'guitar' | 'bass'
  presetIndex: 0,
  lang: "en",                 // langue de l'interface
  flat: false,                // -1 demi-ton sur tout l'accordage
  calib: 440,                 // fréquence de référence A4
  soundOn: false,             // mode "Son" : toucher une corde joue la note
  auto: true,                 // détection auto de la corde
  selectedString: 0,
  tuned: [],                  // cordes validées (booléens)
  celebrated: false,
  // détection
  detectedFreq: -1,
  lastValidTime: 0,
  cents: 0,
  displayCents: 0,            // valeur lissée pour l'aiguille
  inTune: false,
  holdStart: 0,
  customTunings: [],
  customPreset: null,
};

/* ---------------- Persistance légère (réglages uniquement) ---------------- */

function loadSettings() {
  state.lang = detectLang();
  try {
    const s = JSON.parse(localStorage.getItem("accordo") || "{}");
    if (s.calib >= CALIB_MIN && s.calib <= CALIB_MAX) state.calib = s.calib;
    if (s.instrument === "guitar" || s.instrument === "bass") state.instrument = s.instrument;
    if (Number.isInteger(s.presetIndex) && PRESETS[state.instrument][s.presetIndex]) state.presetIndex = s.presetIndex;
    if (typeof s.flat === "boolean") state.flat = s.flat;
    if (LANGS[s.lang]) state.lang = s.lang;
    if (typeof s.customPresetId === "string") {
      const found = state.customTunings.find(t => t.id === s.customPresetId && t.instrument === state.instrument);
      if (found) {
        state.customPreset = { _id: found.id, name: found.name, group: found.notes.length, notes: found.notes };
        state.presetIndex = -1;
      }
    }
  } catch (_) { /* ignore */ }
}
function saveSettings() {
  try {
    localStorage.setItem("accordo", JSON.stringify({
      calib: state.calib, instrument: state.instrument,
      presetIndex: state.presetIndex, flat: state.flat, lang: state.lang,
      customPresetId: state.customPreset ? state.customPreset._id : null,
    }));
  } catch (_) {}
}

/* ---------------- i18n ---------------- */

/* ---------------- Persistance accordages personnalises ---------------- */

function loadCustomTunings() {
  try {
    const raw = localStorage.getItem("accordo-custom");
    if (raw) state.customTunings = JSON.parse(raw);
    if (!Array.isArray(state.customTunings)) state.customTunings = [];
  } catch (_) { state.customTunings = []; }
}
function saveCustomTunings() {
  try {
    localStorage.setItem("accordo-custom", JSON.stringify(state.customTunings));
  } catch (_) {}
}

function detectLang() {
  const cands = navigator.languages || [navigator.language || "en"];
  for (const c of cands) {
    const p = String(c).slice(0, 2).toLowerCase();
    if (I18N[p]) return p;
  }
  return "en";
}
function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
}
const CJK = ["zh", "ja", "ko"];
function groupLabel(n) {
  return CJK.includes(state.lang) ? `${n}${t("strings")}` : `${n} ${t("strings")}`;
}
function presetName(p) { return p.nameKey ? t(p.nameKey) : p.name; }

// Applique la langue à tous les textes statiques
function applyLang() {
  document.documentElement.lang = state.lang;
  document.title = t("docTitle");
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", t("metaDesc"));
  el.langBtn.textContent = state.lang.toUpperCase();
  el.tagline.textContent = t("tagline");
  if (!el.startBtn.disabled) el.startBtn.textContent = t("start");
  el.startHint.textContent = t("startHint");
  el.segGuitar.textContent = t("guitar");
  el.segBass.textContent = t("bass");
  el.sheetTitle.textContent = t("tunings");
  el.langTitle.textContent = t("language");
  el.presetSearch.placeholder = t("search");
  el.flatLabel.textContent = t("flat");
  el.autoLabel.textContent = t("auto");
  el.soundLabel.textContent = t("sound");
  el.micBannerText.textContent = t("micBanner");
  el.micRetry.textContent = t("micRetry");
  el.legalLink.textContent = t("legal");
  el.langBtn.setAttribute("aria-label", t("language"));
  el.sheetClose.setAttribute("aria-label", t("close"));
  el.langClose.setAttribute("aria-label", t("close"));
  el.calibDown.setAttribute("aria-label", t("calibDown"));
  el.calibUp.setAttribute("aria-label", t("calibUp"));
  if (el.customSheetTitle) el.customSheetTitle.textContent = t("customSheet");
  if (el.customNameInput) el.customNameInput.placeholder = t("customName");
  if (el.customSaveBtn) el.customSaveBtn.textContent = t("customSave");
  if (el.createCustomBtn) el.createCustomBtn.textContent = t("customCreate");
  if (el.customImportInput) el.customImportInput.placeholder = t("customImportPH");
  if (el.customImportBtn) el.customImportBtn.textContent = t("customImport");
  if (el.customAddLow) el.customAddLow.textContent = t("customAddLow");
  if (el.customAddHigh) el.customAddHigh.textContent = t("customAddHigh");
  if (el.customShareLabel) el.customShareLabel.textContent = t("customShare");
  if (el.customShareCopy) el.customShareCopy.textContent = t("customCopy");
  if (el.customSheetClose) el.customSheetClose.setAttribute("aria-label", t("close"));
  renderPresetLabel();
  renderStrings();
}

/* ---------------- Utilitaires musique ---------------- */

function currentPreset() {
  return state.customPreset || PRESETS[state.instrument][state.presetIndex];
}
function stringMidis() {
  const off = state.flat ? -1 : 0;
  return currentPreset().notes.map(n => n + off);
}
function midiToFreq(m) { return state.calib * Math.pow(2, (m - 69) / 12); }
function midiName(m) { return (state.flat ? NOTES_FLAT : NOTES)[((m % 12) + 12) % 12]; }
function midiOctave(m) { return Math.floor(m / 12) - 1; }
function midiDisplay(m) {
  return `${midiName(m)}<sub>${midiOctave(m)}</sub>`;
}
function midiLabel(m) {
  return `${midiName(m)} ${midiOctave(m)}`;
}
const NOTE_NAMES_SHARP = NOTES;
function noteOctaveToMIDI(noteIdx, oct) {
  return noteIdx + (oct + 1) * 12;
}
function midiToNoteOctave(m) {
  return { noteIdx: ((m % 12) + 12) % 12, oct: midiOctave(m) };
}
function centsOff(freq, target) { return 1200 * Math.log2(freq / target); }

/* ---------------- Accordages personnalises ---------------- */

function generateShareCode(instrument, notes, name) {
  const instChar = instrument === "guitar" ? "G" : "B";
  const noteStr = notes.map(m => {
    const { noteIdx, oct } = midiToNoteOctave(m);
    return NOTE_NAMES_SHARP[noteIdx] + oct;
  }).join("");
  const encodedName = encodeURIComponent(name);
  return instChar + notes.length + noteStr + ":" + encodedName;
}

function parseShareCode(code) {
  if (!code || typeof code !== "string") return null;
  let i = 0;
  const ch = code[i];
  if (ch !== "G" && ch !== "B") return null;
  const instrument = ch === "G" ? "guitar" : "bass";
  i++;
  let countStr = "";
  while (i < code.length && /[0-9]/.test(code[i])) { countStr += code[i]; i++; }
  const count = parseInt(countStr, 10);
  if (isNaN(count) || count < 1 || count > 20) return null;
  const notes = [];
  for (let j = 0; j < count; j++) {
    if (i >= code.length) return null;
    const letter = code[i].toUpperCase();
    if (!/[A-G]/.test(letter)) return null;
    i++;
    let sharp = false;
    if (i < code.length && code[i] === "#") { sharp = true; i++; }
    if (i >= code.length || !/[0-9]/.test(code[i])) return null;
    const oct = parseInt(code[i], 10);
    i++;
    const noteName = letter + (sharp ? "#" : "");
    const noteIdx = NOTE_NAMES_SHARP.indexOf(noteName);
    if (noteIdx === -1) return null;
    notes.push(noteOctaveToMIDI(noteIdx, oct));
  }
  let name = "";
  if (i < code.length && code[i] === ":") {
    i++;
    name = decodeURIComponent(code.slice(i));
  }
  return { instrument, notes, name };
}

function renderCustomSheet() {
  const inst = state.instrument;
  let src = state.customPreset;
  if (!src) {
    const presets = PRESETS[inst];
    const idx = (state.presetIndex >= 0 && state.presetIndex < presets.length) ? state.presetIndex : 0;
    src = presets[idx];
  }
  if (!src || !src.notes) return;
  const rows = src.notes.map(m => {
    const { noteIdx, oct } = midiToNoteOctave(m);
    return { noteIdx, oct, added: false };
  });
  renderCustomStringRows(rows);
  el.customNameInput.value = "";
  el.customShareDisplay.hidden = true;
  el.customShareCodeInput.value = "";
}

function getCustomRows() {
  const result = [];
  const rows = el.customStringsContainer.querySelectorAll(".custom-string-row");
  for (const row of rows) {
    const ns = row.querySelector(".custom-note-select");
    const os = row.querySelector(".custom-octave-select");
    const rm = row.querySelector(".custom-row-remove");
    const nv = parseInt(ns.value, 10);
    const ov = parseInt(os.value, 10);
    result.push({
      noteIdx: isNaN(nv) ? null : nv,
      oct: isNaN(ov) ? null : ov,
      added: !!rm,
    });
  }
  return result;
}

function renderCustomStringRows(rows) {
  const c = el.customStringsContainer;
  c.innerHTML = "";
  rows.forEach((row, idx) => {
    const div = document.createElement("div");
    div.className = "custom-string-row";
    const label = document.createElement("span");
    label.className = "custom-string-label";
    const pos = rows.length - idx;
    label.textContent = ordinal(pos);
    label.setAttribute("data-pos", pos);
    div.appendChild(label);

    const noteSel = document.createElement("select");
    noteSel.className = "custom-note-select";
    const notePlaceholder = document.createElement("option");
    notePlaceholder.value = "";
    notePlaceholder.disabled = true;
    notePlaceholder.selected = row.noteIdx === null;
    notePlaceholder.textContent = "Note";
    noteSel.appendChild(notePlaceholder);
    NOTE_NAMES_SHARP.forEach((nn, ni) => {
      const opt = document.createElement("option");
      opt.value = ni;
      opt.textContent = nn;
      if (row.noteIdx === ni) opt.selected = true;
      noteSel.appendChild(opt);
    });
    noteSel.addEventListener("change", () => updateCustomLabel(noteSel, octSel, label));
    div.appendChild(noteSel);

    const octSel = document.createElement("select");
    octSel.className = "custom-octave-select";
    const octPlaceholder = document.createElement("option");
    octPlaceholder.value = "";
    octPlaceholder.disabled = true;
    octPlaceholder.selected = row.oct === null;
    octPlaceholder.textContent = "Octave";
    octSel.appendChild(octPlaceholder);
    for (let o = 0; o <= 7; o++) {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o;
      if (row.oct === o) opt.selected = true;
      octSel.appendChild(opt);
    }
    octSel.addEventListener("change", () => updateCustomLabel(noteSel, octSel, label));
    div.appendChild(octSel);

    if (row.added) {
      const rmBtn = document.createElement("button");
      rmBtn.className = "custom-row-remove";
      rmBtn.textContent = "\u00d7";
      rmBtn.setAttribute("aria-label", "Remove");
      rmBtn.addEventListener("click", () => {
        rows.splice(idx, 1);
        renderCustomStringRows(rows);
      });
      div.appendChild(rmBtn);
    }

    c.appendChild(div);
  });
}

function ordinal(n) {
  n = Number(n);
  if (isNaN(n)) return "";
  if (n >= 11 && n <= 13) return n + "th";
  switch (n % 10) {
    case 1: return n + "st";
    case 2: return n + "nd";
    case 3: return n + "rd";
    default: return n + "th";
  }
}

function updateCustomLabel(noteSel, octSel, labelEl) {
  const nv = parseInt(noteSel.value, 10);
  const ov = parseInt(octSel.value, 10);
  const pos = labelEl.getAttribute("data-pos") || "";
  if (!isNaN(nv) && !isNaN(ov)) {
    const midi = noteOctaveToMIDI(nv, ov);
    const note = NOTE_NAMES_SHARP[nv];
    labelEl.innerHTML = ordinal(pos) + " " + note + "<sub>" + midiOctave(midi) + "</sub>";
    noteSel.title = midiName(midi) + " " + midiOctave(midi);
  } else {
    labelEl.innerHTML = ordinal(pos);
  }
}

function onCustomSave() {
  const rows = el.customStringsContainer.querySelectorAll(".custom-string-row");
  const notes = [];
  for (const row of rows) {
    const ns = row.querySelector(".custom-note-select");
    const os = row.querySelector(".custom-octave-select");
    const nv = parseInt(ns.value, 10);
    const ov = parseInt(os.value, 10);
    if (isNaN(nv) || isNaN(ov)) {
      showToast("Please select note and octave for all strings");
      return;
    }
    notes.push(noteOctaveToMIDI(nv, ov));
  }
  const name = el.customNameInput.value.trim() || "Custom " + groupLabel(notes.length);
  const instrument = state.instrument;
  const shareCode = generateShareCode(instrument, notes, name);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const tuning = { id, name, instrument, notes, shareCode };
  state.customTunings = state.customTunings.filter(t => t.id !== id);
  state.customTunings.push(tuning);
  saveCustomTunings();
  state.customPreset = { _id: id, name, group: notes.length, notes };
  state.presetIndex = -1;
  onTuningChanged();
  el.customShareCodeInput.value = shareCode;
  el.customShareDisplay.hidden = false;
  showToast(t("customSaved"));
}

function onCustomImport() {
  const code = el.customImportInput.value.trim();
  if (!code) return;
  const parsed = parseShareCode(code);
  if (!parsed) {
    showToast("Invalid share code");
    return;
  }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const name = parsed.name || "Imported " + groupLabel(parsed.notes.length);
  const tuning = { id, name, instrument: parsed.instrument, notes: parsed.notes, shareCode: code };
  state.customTunings = state.customTunings.filter(t => t.id !== id);
  state.customTunings.push(tuning);
  saveCustomTunings();
  if (parsed.instrument === state.instrument) {
    state.customPreset = { _id: id, name, group: parsed.notes.length, notes: parsed.notes };
    state.presetIndex = -1;
    onTuningChanged();
    closeSheet(el.presetSheet);
  } else {
    showToast("Imported for " + parsed.instrument + " — switch instrument to see it");
  }
  el.customImportInput.value = "";
}

/* ---------------- Audio ---------------- */

let actx = null;
let analyser = null;
let micOk = false;
let timeBuf = null;

async function initAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  actx = new AC();
  if (actx.state === "suspended") { try { await actx.resume(); } catch (_) {} }

  try {
    // Contraintes en "ideal" : mieux honorées par les navigateurs mobiles
    // (iOS Safari / Chrome Android) qui, sinon, laissent actifs l'AGC, la
    // suppression de bruit et l'annulation d'écho — tous nuisibles à la
    // détection de hauteur d'un instrument.
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: { ideal: false },
        noiseSuppression: { ideal: false },
        autoGainControl: { ideal: false },
        channelCount: { ideal: 1 },
        latency: { ideal: 0 },
      },
      video: false,
    });
    // Seconde tentative directement sur la piste : certains Android
    // n'appliquent ces réglages que via applyConstraints après coup.
    const track = stream.getAudioTracks()[0];
    if (track && track.applyConstraints) {
      try {
        await track.applyConstraints({
          echoCancellation: false, noiseSuppression: false, autoGainControl: false,
        });
      } catch (_) {}
    }
    const src = actx.createMediaStreamSource(stream);
    const hp = actx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 22; hp.Q.value = 0.7;
    const lp = actx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1600; lp.Q.value = 0.7;
    analyser = actx.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0;
    src.connect(hp); hp.connect(lp); lp.connect(analyser);
    timeBuf = new Float32Array(analyser.fftSize);
    micOk = true;
  } catch (_) {
    micOk = false;
    el.micBanner.hidden = false;
  }
}

// Récupère les échantillons (avec repli si getFloatTimeDomainData absent)
const byteBuf = { arr: null };
function readSamples() {
  if (analyser.getFloatTimeDomainData) {
    analyser.getFloatTimeDomainData(timeBuf);
  } else {
    if (!byteBuf.arr) byteBuf.arr = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(byteBuf.arr);
    for (let i = 0; i < byteBuf.arr.length; i++) timeBuf[i] = (byteBuf.arr[i] - 128) / 128;
  }
}

/* ---------------- Détection de hauteur (YIN) ---------------- */

const YIN_THRESHOLD = 0.15;
const YIN_WINDOW = 2048;
let yinD = null, yinCMND = null;
let noiseFloor = 0.003; // plancher de bruit suivi en continu

function yinDetect(buf, sr) {
  const W = YIN_WINDOW;
  const tauMax = Math.min(Math.floor(sr / 22), buf.length - W - 1);
  const tauMin = Math.max(2, Math.floor(sr / 1200));
  if (tauMax <= tauMin) return -1;

  // Porte de bruit adaptative : les micros de téléphone ont des gains très
  // variables (AGC, matériel). Le plancher descend immédiatement au niveau
  // ambiant et remonte lentement, la porte suit à 2,5× au-dessus.
  let rms = 0;
  for (let i = 0; i < W; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / W);
  noiseFloor = Math.min(noiseFloor * 1.008, Math.max(rms, 1e-4));
  if (rms < Math.max(0.0015, noiseFloor * 2.5)) return -1;

  if (!yinD || yinD.length < tauMax + 1) {
    yinD = new Float32Array(tauMax + 1);
    yinCMND = new Float32Array(tauMax + 1);
  }

  // Fonction de différence
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let i = 0; i < W; i++) {
      const d = buf[i] - buf[i + tau];
      sum += d * d;
    }
    yinD[tau] = sum;
  }

  // Différence normalisée cumulée
  yinCMND[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    running += yinD[tau];
    yinCMND[tau] = running > 0 ? (yinD[tau] * tau) / running : 1;
  }

  // Premier minimum sous le seuil
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++) {
    if (yinCMND[t] < YIN_THRESHOLD) {
      while (t + 1 <= tauMax && yinCMND[t + 1] < yinCMND[t]) t++;
      tau = t;
      break;
    }
  }
  // Repli signaux faibles (guitare électrique non branchée, micro lointain…) :
  // à défaut de minimum sous le seuil, on prend le minimum global si sa
  // qualité reste acceptable. Le lissage médian aval filtre les ratés.
  if (tau === -1) {
    let best = -1, bestVal = 0.35;
    for (let t = tauMin; t <= tauMax; t++) {
      if (yinCMND[t] < bestVal) { bestVal = yinCMND[t]; best = t; }
    }
    tau = best;
  }
  if (tau === -1) return -1;

  // Interpolation parabolique (précision sub-échantillon)
  let betterTau = tau;
  if (tau > 1 && tau < tauMax) {
    const s0 = yinCMND[tau - 1], s1 = yinCMND[tau], s2 = yinCMND[tau + 1];
    const denom = s0 - 2 * s1 + s2;
    if (Math.abs(denom) > 1e-9) betterTau = tau + 0.5 * (s0 - s2) / denom;
  }

  const freq = sr / betterTau;
  return (freq >= 22 && freq <= 1300) ? freq : -1;
}

// Lissage : médiane des dernières détections valides
const freqHistory = [];
function pushFreq(f) {
  const now = performance.now();
  if (f > 0) freqHistory.push({ f, t: now });
  while (freqHistory.length && now - freqHistory[0].t > 300) freqHistory.shift();
}
function stableFreq() {
  const vals = freqHistory.map(h => h.f);
  if (vals.length < 2) return -1;
  vals.sort((a, b) => a - b);
  return vals[Math.floor(vals.length / 2)];
}

/* ---------------- Sons de référence & bips ---------------- */

function playNote(freq, duration = 2.2) {
  if (!actx) return;
  if (actx.state === "suspended") try { actx.resume(); } catch (_) {}
  const t0 = actx.currentTime;

  const master = actx.createGain();
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(0.5, t0 + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  const lp = actx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(Math.min(freq * 9, 8000), t0);
  lp.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 300), t0 + duration);

  master.connect(lp);
  lp.connect(actx.destination);

  // Timbre "corde pincée" : harmoniques à décroissance exponentielle
  const harmonics = [1, 0.55, 0.32, 0.18, 0.09, 0.05];
  harmonics.forEach((amp, k) => {
    const f = freq * (k + 1);
    if (f > actx.sampleRate / 2) return;
    const osc = actx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, t0);
    const g = actx.createGain();
    g.gain.setValueAtTime(amp, t0);
    g.gain.exponentialRampToValueAtTime(amp * 0.01, t0 + duration * (1 - k * 0.11));
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  });
}

function playDing() {
  if (!actx) return;
  const t0 = actx.currentTime;
  [1318.5, 1975.5].forEach((f, i) => {
    const osc = actx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(i === 0 ? 0.18 : 0.08, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
    osc.connect(g); g.connect(actx.destination);
    osc.start(t0); osc.stop(t0 + 0.55);
  });
}

function vibrate(ms) { if (navigator.vibrate) navigator.vibrate(ms); }

/* ---------------- Éléments DOM ---------------- */

const $ = id => document.getElementById(id);
const el = {
  startOverlay: $("startOverlay"), startBtn: $("startBtn"), app: $("app"),
  tagline: $("tagline"), startHint: $("startHint"),
  langBtn: $("langBtn"), langSheet: $("langSheet"), langList: $("langList"),
  langClose: $("langClose"), langTitle: $("langTitle"),
  segGuitar: $("segGuitar"), segBass: $("segBass"),
  presetBtn: $("presetBtn"), presetLabel: $("presetLabel"),
  presetSheet: $("presetSheet"), presetList: $("presetList"), sheetClose: $("sheetClose"),
  sheetTitle: $("sheetTitle"), presetSearch: $("presetSearch"),
  gauge: $("gauge"), ticks: $("ticks"), zoneArc: $("zoneArc"), needle: $("needle"),
  noteName: $("noteName"), centsLabel: $("centsLabel"), freqLabel: $("freqLabel"), statusText: $("statusText"),
  stringsRow: $("stringsRow"),
  flatBtn: $("flatBtn"), autoBtn: $("autoBtn"), soundBtn: $("soundBtn"),
  flatLabel: $("flatLabel"), autoLabel: $("autoLabel"), soundLabel: $("soundLabel"),
  calibDown: $("calibDown"), calibUp: $("calibUp"), calibValue: $("calibValue"),
  micBanner: $("micBanner"), micBannerText: $("micBannerText"), micRetry: $("micRetry"),
  legalLink: $("legalLink"),
  createCustomBtn: $("createCustomBtn"),
  customImportInput: $("customImportInput"),
  customImportBtn: $("customImportBtn"),
  customSheet: $("customSheet"),
  customSheetTitle: $("customSheetTitle"),
  customSheetClose: $("customSheetClose"),
  customNameInput: $("customNameInput"),
  customStringsContainer: $("customStringsContainer"),
  customAddLow: $("customAddLow"),
  customAddHigh: $("customAddHigh"),
  customSaveBtn: $("customSaveBtn"),
  customShareDisplay: $("customShareDisplay"),
  customShareLabel: $("customShareLabel"),
  customShareCodeInput: $("customShareCodeInput"),
  customShareCopy: $("customShareCopy"),
  toast: $("toast"),
  updateBtn: $("updateBtn"),
  srAnnounce: $("srAnnounce"),
};

/* ---------------- Cadran (SVG) ---------------- */

const GAUGE_CX = 150, GAUGE_CY = 152, GAUGE_R = 118;
const MAX_ANGLE = 58; // degrés de chaque côté pour ±50 cents

function polar(angleDeg, r) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return [GAUGE_CX + r * Math.cos(a), GAUGE_CY + r * Math.sin(a)];
}

function buildGauge() {
  const frag = document.createDocumentFragment();
  for (let c = -50; c <= 50; c += 5) {
    const angle = (c / 50) * MAX_ANGLE;
    const major = c % 25 === 0;
    const [x1, y1] = polar(angle, GAUGE_R);
    const [x2, y2] = polar(angle, GAUGE_R - (major ? 16 : 9));
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("class", "tick" + (c === 0 ? " center" : major ? " major" : ""));
    frag.appendChild(line);
  }
  el.ticks.appendChild(frag);

  // Arc de la zone "juste" (±5 cents)
  const az = (IN_TUNE_CENTS / 50) * MAX_ANGLE;
  const rArc = GAUGE_R - 28;
  const [sx, sy] = polar(-az, rArc);
  const [ex, ey] = polar(az, rArc);
  el.zoneArc.setAttribute("d", `M ${sx} ${sy} A ${rArc} ${rArc} 0 0 1 ${ex} ${ey}`);
}

/* ---------------- Rendu UI ---------------- */

function renderStrings() {
  const midis = stringMidis();
  if (state.tuned.length !== midis.length) state.tuned = midis.map(() => false);
  if (state.selectedString >= midis.length) state.selectedString = 0;

  el.stringsRow.innerHTML = "";
  midis.forEach((m, i) => {
    const btn = document.createElement("button");
    btn.className = "string-btn"
      + (i === state.selectedString ? " selected" : "")
      + (state.tuned[i] ? " tuned" : "");
    btn.setAttribute("aria-label",
      `${t("stringN")} ${i + 1} — ${midiLabel(m)}${state.tuned[i] ? " — " + t("inTune") : ""}`);
    if (i === state.selectedString) btn.setAttribute("aria-current", "true");
    btn.innerHTML = `<span class="s-note" aria-hidden="true">${midiDisplay(m)}</span>`;
    btn.addEventListener("click", () => {
      state.selectedString = i;
      state.auto = false;
      state.holdStart = 0;
      if (state.soundOn) playNote(midiToFreq(m));
      renderStrings();
      renderControls();
    });
    el.stringsRow.appendChild(btn);
  });
}

function renderPresetLabel() {
  const p = currentPreset();
  el.presetLabel.textContent = `${presetName(p)}${state.flat ? " ♭" : ""} · ${groupLabel(p.group)}`;
}

function renderControls() {
  el.flatBtn.classList.toggle("active", state.flat);
  el.autoBtn.classList.toggle("active", state.auto);
  el.soundBtn.classList.toggle("active", state.soundOn);
  el.flatBtn.setAttribute("aria-pressed", String(state.flat));
  el.autoBtn.setAttribute("aria-pressed", String(state.auto));
  el.soundBtn.setAttribute("aria-pressed", String(state.soundOn));
  el.segGuitar.classList.toggle("active", state.instrument === "guitar");
  el.segBass.classList.toggle("active", state.instrument === "bass");
  el.segGuitar.setAttribute("aria-selected", String(state.instrument === "guitar"));
  el.segBass.setAttribute("aria-selected", String(state.instrument === "bass"));
  el.calibValue.textContent = `${state.calib} Hz`;
}

// Normalisation pour la recherche (minuscules, sans accents)
function norm(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function renderPresetSheet(filter = "") {
  const q = norm(filter.trim()).replace(/♯/g, "#").replace(/♭/g, "b");
  el.presetList.innerHTML = "";
  const presets = PRESETS[state.instrument];
  const customs = state.customTunings.filter(t => t.instrument === state.instrument);
  let count = 0;

  const off = state.flat ? -1 : 0;

  const isCustomSelected = (t) =>
    state.customPreset && state.customPreset._id === t.id;

  const addBuiltinItem = (p, idx, showGroup) => {
    const item = document.createElement("button");
    item.className = "sheet-item" + (idx === state.presetIndex ? " selected" : "");
    if (idx === state.presetIndex) item.setAttribute("aria-current", "true");
    item.innerHTML = `<span class="p-main"><span class="p-name">${presetName(p)}</span>${
      showGroup ? `<span class="p-tag">${groupLabel(p.group)}</span>` : ""}<br>
      <span class="p-notes">${p.notes.map(n => midiDisplay(n + off)).join(" · ")}</span></span>
      <span class="p-check" aria-hidden="true">✓</span>`;
    item.addEventListener("click", () => {
      state.customPreset = null;
      state.presetIndex = idx;
      onTuningChanged();
      closeSheet(el.presetSheet);
      saveSettings();
    });
    el.presetList.appendChild(item);
    count++;
  };

  const addCustomItem = (custom) => {
    const sel = isCustomSelected(custom);
    const item = document.createElement("button");
    item.className = "sheet-item" + (sel ? " selected" : "");
    if (sel) item.setAttribute("aria-current", "true");
    item.innerHTML = `<span class="p-main"><span class="p-name"></span>
      <span class="p-tag">${groupLabel(custom.notes.length)}</span><br>
      <span class="p-notes">${custom.notes.map(n => midiDisplay(n + off)).join(" · ")}</span></span>
      <span class="p-check" aria-hidden="true">✓</span>`;
    item.querySelector(".p-name").textContent = custom.name;
    item.addEventListener("click", () => {
      state.customPreset = { _id: custom.id, name: custom.name, group: custom.notes.length, notes: custom.notes };
      state.presetIndex = -1;
      onTuningChanged();
      closeSheet(el.presetSheet);
      saveSettings();
    });
    const copyBtn = document.createElement("button");
    copyBtn.className = "custom-preset-copy";
    copyBtn.textContent = "\uD83D\uDCCB";
    copyBtn.setAttribute("aria-label", t("customCopy"));
    copyBtn.addEventListener("click", e => {
      e.stopPropagation();
      const code = generateShareCode(custom.instrument, custom.notes, custom.name);
      copyToClipboard(code).catch(() => {});
      showToast(t("customCopied"));
    });
    item.appendChild(copyBtn);
    const delBtn = document.createElement("button");
    delBtn.className = "custom-preset-del";
    delBtn.textContent = "\u00d7";
    delBtn.setAttribute("aria-label", "Delete");
    delBtn.addEventListener("click", e => {
      e.stopPropagation();
      state.customTunings = state.customTunings.filter(x => x.id !== custom.id);
      if (state.customPreset && state.customPreset._id === custom.id) {
        state.customPreset = null;
        state.presetIndex = 0;
        onTuningChanged();
      }
      saveCustomTunings();
      renderPresetSheet(filter);
    });
    item.appendChild(delBtn);
    el.presetList.appendChild(item);
    count++;
  };

  if (!q) {
    // Custom tunings first
    if (customs.length) {
      const h = document.createElement("div");
      h.className = "sheet-group";
      h.textContent = "Custom";
      el.presetList.appendChild(h);
      customs.forEach(t => addCustomItem(t));
    }

    // Built-in presets grouped by string count
    let lastGroup = null;
    presets.forEach((p, idx) => {
      if (p.group !== lastGroup) {
        lastGroup = p.group;
        const h = document.createElement("div");
        h.className = "sheet-group";
        h.textContent = groupLabel(p.group);
        el.presetList.appendChild(h);
      }
      addBuiltinItem(p, idx);
    });
  } else {
    // Avec recherche : filtrage strict + tri par pertinence.
    // Les jetons "note" (e, eb, c#…) exigent une correspondance exacte
    // pour éviter que « standard e » ne renvoie aussi Standard Eb, etc.
    const tokens = q.split(/\s+/);
    const noteRe = /^[a-g][#b]?$/;
    const numRe = /^\d+$/;
    const allNotes = tokens.every(tok => noteRe.test(tok));

    // Score built-in presets
    const scored = [];
    presets.forEach((p, idx) => {
      const nameN = norm(presetName(p));
      const words = nameN.split(/[\s()]+/).filter(Boolean);
      const groupN = norm(groupLabel(p.group));
      const noteSet = new Set();
      for (const n of p.notes) {
        const pc = ((n % 12) + 12) % 12;
        noteSet.add(norm(NOTES[pc]));
        noteSet.add(norm(NOTES_FLAT[pc]));
      }
      let score = 0;
      let ok = true;
      for (const tok of tokens) {
        if (numRe.test(tok)) {
          if (String(p.group) === tok) score += 10;
          else { ok = false; break; }
        } else if (noteRe.test(tok)) {
          if (words.includes(tok)) score += 10;
          else if (allNotes && noteSet.has(tok)) score += 2;
          else { ok = false; break; }
        } else if (words.includes(tok)) {
          score += 10;
        } else if (words.some(w => w.startsWith(tok))) {
          score += 6;
        } else if (groupN.includes(tok)) {
          score += 3;
        } else { ok = false; break; }
      }
      if (!ok) return;
      if (nameN === q) score += 100;
      else if (nameN.startsWith(q)) score += 50;
      else if (nameN.includes(q)) score += 30;
      scored.push({ p, idx, score, type: "builtin" });
    });

    // Score custom tunings
    customs.forEach(t => {
      const nameN = norm(t.name);
      let score = 0;
      let ok = true;
      for (const tok of tokens) {
        if (numRe.test(tok)) {
          if (String(t.notes.length) === tok) score += 10;
          else { ok = false; break; }
        } else if (nameN.includes(tok)) {
          score += 10;
        } else {
          ok = false; break;
        }
      }
      if (!ok) return;
      if (nameN === q) score += 100;
      else if (nameN.startsWith(q)) score += 50;
      else if (nameN.includes(q)) score += 30;
      scored.push({ t, score, type: "custom" });
    });

    scored.sort((a, b) => b.score - a.score || (a.type === "custom" ? -1 : 1));
    scored.forEach(entry => {
      if (entry.type === "custom") addCustomItem(entry.t);
      else addBuiltinItem(entry.p, entry.idx, true);
    });
  }

  if (!count) {
    const empty = document.createElement("div");
    empty.className = "sheet-empty";
    empty.textContent = t("noResults");
    el.presetList.appendChild(empty);
  }
}

function renderLangSheet() {
  el.langList.innerHTML = "";
  Object.entries(LANGS).forEach(([code, label]) => {
    const item = document.createElement("button");
    item.className = "sheet-item" + (code === state.lang ? " selected" : "");
    item.setAttribute("lang", code);
    if (code === state.lang) item.setAttribute("aria-current", "true");
    item.innerHTML = `<span class="p-main"><span class="p-name"></span></span>
      <span class="p-check" aria-hidden="true">✓</span>`;
    item.querySelector(".p-name").textContent = label;
    item.addEventListener("click", () => {
      state.lang = code;
      applyLang();
      closeSheet(el.langSheet);
      saveSettings();
    });
    el.langList.appendChild(item);
  });
}

// Réinitialise la progression quand l'accordage cible change
function onTuningChanged() {
  state.tuned = stringMidis().map(() => false);
  state.celebrated = false;
  state.holdStart = 0;
  state.selectedString = 0;
  state.auto = true;
  renderStrings();
  renderPresetLabel();
  renderControls();
}

/* ---------------- Boucle principale ---------------- */

let lastDetect = 0;

function tick(ts) {
  requestAnimationFrame(tick);

  if (micOk && analyser && ts - lastDetect >= 40) {
    lastDetect = ts;
    readSamples();
    const f = yinDetect(timeBuf, actx.sampleRate);
    pushFreq(f);
    processDetection();
  }
  renderGauge();
}

function processDetection() {
  const now = performance.now();
  const f = stableFreq();
  if (f <= 0) {
    if (now - state.lastValidTime > 500) {
      state.detectedFreq = -1;
      state.inTune = false;
      state.holdStart = 0;
    }
    return;
  }
  state.detectedFreq = f;
  state.lastValidTime = now;

  const midis = stringMidis();
  let target = state.selectedString;

  if (state.auto) {
    // Corde la plus proche de la fréquence détectée
    let best = 0, bestAbs = Infinity;
    midis.forEach((m, i) => {
      const c = Math.abs(centsOff(f, midiToFreq(m)));
      if (c < bestAbs) { bestAbs = c; best = i; }
    });
    if (best !== target) {
      target = best;
      state.selectedString = best;
      state.holdStart = 0;
      renderStrings();
    }
  }

  state.cents = Math.max(-50, Math.min(50, centsOff(f, midiToFreq(midis[target]))));
  state.inTune = Math.abs(state.cents) <= IN_TUNE_CENTS;

  // Validation de la corde (maintien dans la zone juste)
  if (state.inTune) {
    if (!state.holdStart) state.holdStart = now;
    if (now - state.holdStart >= HOLD_MS && !state.tuned[target]) {
      state.tuned[target] = true;
      playDing();
      vibrate(70);
      el.srAnnounce.textContent = `${midiLabel(midis[target])} — ${t("inTune")}`;
      renderStrings();
      checkAllTuned();
    }
  } else {
    state.holdStart = 0;
  }
}

function checkAllTuned() {
  if (state.celebrated || !state.tuned.every(Boolean)) return;
  state.celebrated = true;
  showToast(t("done"));
  vibrate([60, 60, 60]);

  setTimeout(() => {
    state.tuned = state.tuned.map(() => false);
    state.celebrated = false;
    renderStrings();
  }, 2200);
}

/* ---------------- Rendu du cadran ---------------- */

function renderGauge() {
  const active = state.detectedFreq > 0;
  const targetCents = active ? state.cents : 0;
  state.displayCents += (targetCents - state.displayCents) * (REDUCED_MOTION ? 1 : 0.18);
  if (Math.abs(state.displayCents - targetCents) < 0.05) state.displayCents = targetCents;

  const angle = (state.displayCents / 50) * MAX_ANGLE;
  el.needle.setAttribute("transform", `rotate(${angle} ${GAUGE_CX} ${GAUGE_CY})`);

  const midis = stringMidis();
  const m = midis[state.selectedString];
  const html = midiDisplay(m);
  if (el.noteName.innerHTML !== html) el.noteName.innerHTML = html;

  el.gauge.classList.toggle("idle", !active);
  el.gauge.classList.toggle("in-tune", active && state.inTune);
  el.noteName.classList.toggle("in-tune", active && state.inTune);
  el.centsLabel.classList.toggle("in-tune", active && state.inTune);
  el.statusText.classList.toggle("in-tune", active && state.inTune);

  if (active) {
    const c = Math.round(state.cents);
    setText(el.centsLabel, `${c > 0 ? "+" : ""}${c} ${t("cents")}`);
    setText(el.freqLabel, `${state.detectedFreq.toFixed(1)} Hz`);
    setText(el.statusText, state.inTune ? t("inTune")
      : state.cents < 0 ? t("tooLow")
      : t("tooHigh"));
  } else {
    setText(el.centsLabel, "\u00A0");
    setText(el.freqLabel, micOk ? "\u00A0" : t("micOff"));
    setText(el.statusText, micOk ? t("play") : t("soundHint"));
  }
  // « micro désactivé » : masque la colonne cents pour centrer le message
  el.freqLabel.parentElement.classList.toggle("mic-off", !micOk);
}

// Ne met à jour le DOM que si le texte change (évite que les lecteurs
// d'écran ré-annoncent le même statut à chaque frame)
function setText(node, txt) {
  if (node.textContent !== txt) node.textContent = txt;
}

/* ---------------- Clipboard ---------------- */

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px;top:-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy") ? resolve() : reject(); }
    catch (_) { reject(_); }
    document.body.removeChild(ta);
  });
}

/* ---------------- Toast ---------------- */

let toastTimer = null;
function showToast(msg) {
  el.toast.textContent = msg;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.toast.hidden = true; }, 2000);
}

/* ---------------- Événements ---------------- */

// Ouverture/fermeture accessibles des feuilles modales :
// focus déplacé à l'ouverture, restitué à la fermeture, fond inert, Échap géré
let sheetReturnFocus = null;

function openSheet(overlay, trigger, focusTarget) {
  overlay.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  sheetReturnFocus = trigger;
  el.app.inert = true;
  (focusTarget || overlay.querySelector("button, input")).focus();
}

function closeSheet(overlay) {
  overlay.hidden = true;
  const anyOpen = !el.presetSheet.hidden || !el.langSheet.hidden || !el.customSheet.hidden;
  if (!anyOpen) el.app.inert = false;
  el.presetBtn.setAttribute("aria-expanded", String(!el.presetSheet.hidden));
  el.langBtn.setAttribute("aria-expanded", String(!el.langSheet.hidden));
  el.createCustomBtn.setAttribute("aria-expanded", String(!el.customSheet.hidden));
  if (sheetReturnFocus) { sheetReturnFocus.focus(); sheetReturnFocus = null; }
}

// Piège à focus : Tab reste dans la feuille ouverte
function trapFocus(overlay, e) {
  const focusables = overlay.querySelectorAll("button:not([disabled]), input");
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// Clavier virtuel mobile : expose sa hauteur en variable CSS --kb pour que
// les feuilles (recherche d'accordage…) restent visibles au-dessus du clavier
if (window.visualViewport) {
  const vv = window.visualViewport;
  const updateKb = () => {
    const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty("--kb", `${Math.round(kb)}px`);
  };
  vv.addEventListener("resize", updateKb);
  vv.addEventListener("scroll", updateKb);
}

function bindEvents() {
  el.startBtn.addEventListener("click", async () => {
    el.startBtn.disabled = true;
    el.startBtn.textContent = t("init");
    await initAudio();
    el.startOverlay.hidden = true;
    el.app.hidden = false;
    requestAnimationFrame(tick);
  });

  // Relance la demande d'autorisation micro (utile en PWA : pas de barre
  // d'adresse pour changer la permission). Le clic fournit le geste
  // utilisateur requis pour re-demander quand c'est encore possible.
  el.micRetry.addEventListener("click", async () => {
    el.micRetry.disabled = true;
    await initAudio();
    el.micRetry.disabled = false;
    if (micOk) el.micBanner.hidden = true;
  });

  el.langBtn.addEventListener("click", () => {
    renderLangSheet();
    openSheet(el.langSheet, el.langBtn, el.langList.querySelector(".selected"));
  });
  el.langClose.addEventListener("click", () => closeSheet(el.langSheet));
  el.langSheet.addEventListener("click", e => {
    if (e.target === el.langSheet) closeSheet(el.langSheet);
  });

  el.segGuitar.addEventListener("click", () => {
    if (state.instrument === "guitar") return;
    state.instrument = "guitar";
    state.customPreset = null;
    state.presetIndex = 0;
    onTuningChanged();
    saveSettings();
  });
  el.segBass.addEventListener("click", () => {
    if (state.instrument === "bass") return;
    state.instrument = "bass";
    state.customPreset = null;
    state.presetIndex = 0;
    onTuningChanged();
    saveSettings();
  });

  el.presetBtn.addEventListener("click", () => {
    el.presetSearch.value = "";
    renderPresetSheet();
    openSheet(el.presetSheet, el.presetBtn, el.presetSearch);
  });
  el.presetSearch.addEventListener("input", () => renderPresetSheet(el.presetSearch.value));
  el.sheetClose.addEventListener("click", () => closeSheet(el.presetSheet));
  el.presetSheet.addEventListener("click", e => {
    if (e.target === el.presetSheet) closeSheet(el.presetSheet);
  });

  // Custom tuning button + import
  el.createCustomBtn.addEventListener("click", () => {
    closeSheet(el.presetSheet);
    renderCustomSheet();
    openSheet(el.customSheet, el.createCustomBtn, el.customNameInput);
  });
  el.customImportBtn.addEventListener("click", onCustomImport);
  el.customImportInput.addEventListener("keydown", e => {
    if (e.key === "Enter") onCustomImport();
  });

  // Custom sheet
  el.customSheetClose.addEventListener("click", () => closeSheet(el.customSheet));
  el.customSheet.addEventListener("click", e => {
    if (e.target === el.customSheet) closeSheet(el.customSheet);
  });
  el.customSaveBtn.addEventListener("click", onCustomSave);
  el.customAddLow.addEventListener("click", () => {
    const rows = getCustomRows();
    rows.unshift({ noteIdx: null, oct: null, added: true });
    renderCustomStringRows(rows);
  });
  el.customAddHigh.addEventListener("click", () => {
    const rows = getCustomRows();
    rows.push({ noteIdx: null, oct: null, added: true });
    renderCustomStringRows(rows);
  });
  el.customShareCopy.addEventListener("click", () => {
    el.customShareCodeInput.select();
      copyToClipboard(el.customShareCodeInput.value).catch(() => {});
    showToast(t("customCopied"));
  });

  // Clavier : Échap ferme la feuille ouverte, Tab y reste confiné
  document.addEventListener("keydown", e => {
    const open = !el.presetSheet.hidden ? el.presetSheet
      : !el.langSheet.hidden ? el.langSheet
      : !el.customSheet.hidden ? el.customSheet
      : null;
    if (!open) return;
    if (e.key === "Escape") { e.preventDefault(); closeSheet(open); }
    else if (e.key === "Tab") trapFocus(open, e);
  });

  el.flatBtn.addEventListener("click", () => {
    state.flat = !state.flat;
    onTuningChanged();
    saveSettings();
  });

  el.autoBtn.addEventListener("click", () => {
    state.auto = !state.auto;
    state.holdStart = 0;
    renderControls();
  });

  el.soundBtn.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    renderControls();
    if (state.soundOn) {
      playNote(midiToFreq(stringMidis()[state.selectedString]));
      showToast(t("soundToast"));
    }
  });

  el.calibDown.addEventListener("click", () => {
    if (state.calib > CALIB_MIN) { state.calib--; renderControls(); saveSettings(); }
  });
  el.calibUp.addEventListener("click", () => {
    if (state.calib < CALIB_MAX) { state.calib++; renderControls(); saveSettings(); }
  });


  document.addEventListener("visibilitychange", () => {
    if (!actx) return;
    if (document.hidden) actx.suspend();
    else actx.resume();
  });
}

/* ---------------- Démarrage ---------------- */

loadCustomTunings();
loadSettings();
buildGauge();
bindEvents();
applyLang();
renderStrings();
renderPresetLabel();
renderControls();

// PWA : mise en cache hors-ligne (uniquement si servi via http/https)
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");

      // PWA installée : revérifie s'il existe une nouvelle version à chaque
      // retour au premier plan (sinon le SW n'est contrôlé qu'au lancement)
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reg.update().catch(() => {});
      });

      // Nouveau SW activé (skipWaiting + claim) : propose de recharger.
      // hadController évite le faux positif de la toute première installation.
      let hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (hadController) {
          el.updateBtn.textContent = t("updateReady");
          el.updateBtn.hidden = false;
        }
        hadController = true;
      });
      el.updateBtn.addEventListener("click", () => location.reload());
    } catch (_) {}
  });
}
