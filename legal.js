"use strict";

const LANGS = {
  fr: "Français", en: "English", es: "Español", it: "Italiano", de: "Deutsch",
  pt: "Português", zh: "中文", ja: "日本語", ko: "한국어",
};

const L10N = {
  fr: {
    title: "Mentions légales", sub: "Accordo — accordeur guitare & basse en ligne",
    back: "← Retour à l'accordeur",
    hPublisher: "Éditeur du site", pubType: "Micro-entreprise",
    lAddress: "Adresse", lPhone: "Téléphone", lVat: "N° TVA intracommunautaire", lWebsite: "Site web",
    hHosting: "Hébergement",
    pHosting: "Ce site est hébergé par GitHub Pages, un service de GitHub, Inc.",
    hPrivacy: "Données personnelles & cookies",
    privacy: [
      "Ce site n'utilise aucun cookie ni traceur.",
      "Aucune donnée personnelle n'est collectée, stockée sur un serveur ni transmise à des tiers.",
      "Le microphone est utilisé uniquement en local, dans votre navigateur, pour analyser la hauteur des notes. Aucun son n'est enregistré ni envoyé sur Internet.",
      "Vos préférences (accordage, langue…) sont enregistrées uniquement sur votre appareil (stockage local du navigateur).",
    ],
    hIp: "Propriété intellectuelle",
    pIp: "Le code source d'Accordo est publié sous licence MIT. Les marques et noms cités restent la propriété de leurs détenteurs respectifs.",
    hContact: "Contact",
  },
  en: {
    title: "Legal notice", sub: "Accordo — online guitar & bass tuner",
    back: "← Back to the tuner",
    hPublisher: "Publisher", pubType: "Sole proprietorship (micro-entreprise, France)",
    lAddress: "Address", lPhone: "Phone", lVat: "EU VAT ID", lWebsite: "Website",
    hHosting: "Hosting",
    pHosting: "This site is hosted by GitHub Pages, a service of GitHub, Inc.",
    hPrivacy: "Privacy & cookies",
    privacy: [
      "This site uses no cookies and no trackers.",
      "No personal data is collected, stored on any server, or shared with third parties.",
      "The microphone is used locally only, inside your browser, to analyze pitch. No audio is ever recorded or sent over the Internet.",
      "Your preferences (tuning, language…) are saved on your device only (browser local storage).",
    ],
    hIp: "Intellectual property",
    pIp: "Accordo's source code is released under the MIT License. All trademarks and names mentioned remain the property of their respective owners.",
    hContact: "Contact",
  },
  es: {
    title: "Aviso legal", sub: "Accordo — afinador online de guitarra y bajo",
    back: "← Volver al afinador",
    hPublisher: "Editor del sitio", pubType: "Empresario individual (micro-entreprise, Francia)",
    lAddress: "Dirección", lPhone: "Teléfono", lVat: "N.º de IVA intracomunitario", lWebsite: "Sitio web",
    hHosting: "Alojamiento",
    pHosting: "Este sitio está alojado en GitHub Pages, un servicio de GitHub, Inc.",
    hPrivacy: "Datos personales y cookies",
    privacy: [
      "Este sitio no utiliza cookies ni rastreadores.",
      "No se recopila ningún dato personal, ni se almacena en servidores ni se comparte con terceros.",
      "El micrófono se usa únicamente en local, dentro de tu navegador, para analizar la afinación. Ningún audio se graba ni se envía por Internet.",
      "Tus preferencias (afinación, idioma…) se guardan solo en tu dispositivo (almacenamiento local del navegador).",
    ],
    hIp: "Propiedad intelectual",
    pIp: "El código fuente de Accordo se publica bajo licencia MIT. Las marcas y nombres citados pertenecen a sus respectivos propietarios.",
    hContact: "Contacto",
  },
  it: {
    title: "Note legali", sub: "Accordo — accordatore online per chitarra e basso",
    back: "← Torna all'accordatore",
    hPublisher: "Editore del sito", pubType: "Ditta individuale (micro-entreprise, Francia)",
    lAddress: "Indirizzo", lPhone: "Telefono", lVat: "Partita IVA UE", lWebsite: "Sito web",
    hHosting: "Hosting",
    pHosting: "Questo sito è ospitato su GitHub Pages, un servizio di GitHub, Inc.",
    hPrivacy: "Dati personali e cookie",
    privacy: [
      "Questo sito non utilizza cookie né tracciatori.",
      "Nessun dato personale viene raccolto, salvato su server o condiviso con terzi.",
      "Il microfono è usato solo in locale, nel tuo browser, per analizzare l'intonazione. Nessun audio viene registrato o inviato su Internet.",
      "Le tue preferenze (accordatura, lingua…) sono salvate solo sul tuo dispositivo (archiviazione locale del browser).",
    ],
    hIp: "Proprietà intellettuale",
    pIp: "Il codice sorgente di Accordo è rilasciato con licenza MIT. Marchi e nomi citati restano di proprietà dei rispettivi titolari.",
    hContact: "Contatti",
  },
  de: {
    title: "Impressum", sub: "Accordo — Online-Stimmgerät für Gitarre & Bass",
    back: "← Zurück zum Stimmgerät",
    hPublisher: "Herausgeber", pubType: "Einzelunternehmen (micro-entreprise, Frankreich)",
    lAddress: "Adresse", lPhone: "Telefon", lVat: "USt-IdNr. (EU)", lWebsite: "Website",
    hHosting: "Hosting",
    pHosting: "Diese Website wird von GitHub Pages gehostet, einem Dienst der GitHub, Inc.",
    hPrivacy: "Datenschutz & Cookies",
    privacy: [
      "Diese Website verwendet weder Cookies noch Tracker.",
      "Es werden keine personenbezogenen Daten erhoben, auf Servern gespeichert oder an Dritte weitergegeben.",
      "Das Mikrofon wird ausschließlich lokal in deinem Browser genutzt, um die Tonhöhe zu analysieren. Es wird niemals Audio aufgezeichnet oder über das Internet gesendet.",
      "Deine Einstellungen (Stimmung, Sprache…) werden nur auf deinem Gerät gespeichert (lokaler Browser-Speicher).",
    ],
    hIp: "Geistiges Eigentum",
    pIp: "Der Quellcode von Accordo ist unter der MIT-Lizenz veröffentlicht. Genannte Marken und Namen bleiben Eigentum ihrer jeweiligen Inhaber.",
    hContact: "Kontakt",
  },
  pt: {
    title: "Aviso legal", sub: "Accordo — afinador online de guitarra e baixo",
    back: "← Voltar ao afinador",
    hPublisher: "Editor do site", pubType: "Empresário individual (micro-entreprise, França)",
    lAddress: "Endereço", lPhone: "Telefone", lVat: "N.º de IVA intracomunitário", lWebsite: "Site",
    hHosting: "Alojamento",
    pHosting: "Este site está alojado no GitHub Pages, um serviço da GitHub, Inc.",
    hPrivacy: "Dados pessoais e cookies",
    privacy: [
      "Este site não utiliza cookies nem rastreadores.",
      "Nenhum dado pessoal é recolhido, armazenado em servidores ou partilhado com terceiros.",
      "O microfone é usado apenas localmente, no seu navegador, para analisar a afinação. Nenhum áudio é gravado ou enviado pela Internet.",
      "As suas preferências (afinação, idioma…) são guardadas apenas no seu dispositivo (armazenamento local do navegador).",
    ],
    hIp: "Propriedade intelectual",
    pIp: "O código-fonte do Accordo é publicado sob a licença MIT. As marcas e nomes citados pertencem aos seus respetivos proprietários.",
    hContact: "Contacto",
  },
  zh: {
    title: "法律声明", sub: "Accordo — 在线吉他与贝斯调音器",
    back: "← 返回调音器",
    hPublisher: "网站发布者", pubType: "个体经营（micro-entreprise，法国）",
    lAddress: "地址", lPhone: "电话", lVat: "欧盟增值税号", lWebsite: "网站",
    hHosting: "托管",
    pHosting: "本网站托管于 GitHub Pages（GitHub, Inc. 提供的服务）。",
    hPrivacy: "个人数据与 Cookie",
    privacy: [
      "本网站不使用任何 Cookie 或跟踪器。",
      "不收集任何个人数据，不存储在服务器上，也不与第三方共享。",
      "麦克风仅在您的浏览器本地使用，用于分析音高。任何音频都不会被录制或通过互联网发送。",
      "您的偏好设置（调弦、语言等）仅保存在您的设备上（浏览器本地存储）。",
    ],
    hIp: "知识产权",
    pIp: "Accordo 的源代码以 MIT 许可证发布。文中提及的商标和名称归其各自所有者所有。",
    hContact: "联系方式",
  },
  ja: {
    title: "法的表示", sub: "Accordo — オンライン ギター＆ベースチューナー",
    back: "← チューナーに戻る",
    hPublisher: "サイト運営者", pubType: "個人事業主（micro-entreprise、フランス）",
    lAddress: "住所", lPhone: "電話", lVat: "EU VAT番号", lWebsite: "ウェブサイト",
    hHosting: "ホスティング",
    pHosting: "本サイトは GitHub, Inc. のサービスである GitHub Pages でホスティングされています。",
    hPrivacy: "個人データとCookie",
    privacy: [
      "本サイトはCookieやトラッカーを一切使用しません。",
      "個人データの収集、サーバーへの保存、第三者への提供は一切行いません。",
      "マイクは音程解析のためにブラウザ内でのみローカルに使用されます。音声が録音されたり、インターネットに送信されたりすることはありません。",
      "設定（チューニング、言語など）はお使いの端末にのみ保存されます（ブラウザのローカルストレージ）。",
    ],
    hIp: "知的財産権",
    pIp: "AccordoのソースコードはMITライセンスで公開されています。記載の商標・名称は各権利者に帰属します。",
    hContact: "お問い合わせ",
  },
  ko: {
    title: "법적 고지", sub: "Accordo — 온라인 기타·베이스 튜너",
    back: "← 튜너로 돌아가기",
    hPublisher: "사이트 운영자", pubType: "개인 사업자 (micro-entreprise, 프랑스)",
    lAddress: "주소", lPhone: "전화", lVat: "EU 부가세 번호", lWebsite: "웹사이트",
    hHosting: "호스팅",
    pHosting: "이 사이트는 GitHub, Inc.의 서비스인 GitHub Pages에서 호스팅됩니다.",
    hPrivacy: "개인정보 및 쿠키",
    privacy: [
      "이 사이트는 쿠키나 추적기를 전혀 사용하지 않습니다.",
      "어떠한 개인정보도 수집하거나 서버에 저장하거나 제3자와 공유하지 않습니다.",
      "마이크는 음높이 분석을 위해 브라우저 내에서만 로컬로 사용됩니다. 오디오가 녹음되거나 인터넷으로 전송되지 않습니다.",
      "설정(튜닝, 언어 등)은 사용자의 기기에만 저장됩니다(브라우저 로컬 저장소).",
    ],
    hIp: "지적 재산권",
    pIp: "Accordo의 소스 코드는 MIT 라이선스로 공개되어 있습니다. 언급된 상표와 명칭은 각 소유자의 자산입니다.",
    hContact: "문의",
  },
};

function detectLang() {
  try {
    const s = JSON.parse(localStorage.getItem("accordo") || "{}");
    if (L10N[s.lang]) return s.lang;
  } catch (_) { /* ignore */ }
  for (const c of (navigator.languages || [navigator.language || "en"])) {
    const p = String(c).slice(0, 2).toLowerCase();
    if (L10N[p]) return p;
  }
  return "en";
}

function apply(lang) {
  const d = L10N[lang];
  document.documentElement.lang = lang;
  document.title = `${d.title} — Accordo`;
  document.getElementById("backLink").textContent = d.back;
  for (const id of ["title", "sub", "pubType", "lAddress", "lPhone", "lVat",
                    "lWebsite", "hPublisher", "hHosting", "pHosting",
                    "hPrivacy", "hIp", "pIp", "hContact"]) {
    document.getElementById(id).textContent = d[id];
  }
  const list = document.getElementById("privacyList");
  list.innerHTML = "";
  for (const item of d.privacy) {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  }
}

const sel = document.getElementById("langSelect");
for (const [code, label] of Object.entries(LANGS)) {
  const opt = document.createElement("option");
  opt.value = code;
  opt.textContent = label;
  sel.appendChild(opt);
}
sel.value = detectLang();
sel.addEventListener("change", () => apply(sel.value));
apply(sel.value);
